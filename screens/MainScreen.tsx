//MainScreen.tsx
import React, { useRef, useState, useEffect } from 'react';
import { generateGeminiResponse } from '../backend/ai-service/geminiService';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import SlidingPanel from './SlidingPanel';

const screenWidth = Dimensions.get('window').width;

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MainScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const slideAnim = useRef(new Animated.Value(-320)).current;
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('General Support');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm here for you ❤️\nTell me what's on your mind.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus the text input when component mounts
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for navigation params to update category
useFocusEffect(
  React.useCallback(() => {
    const params = (route as any)?.params;
    if (params?.selectedCategory) {
      setCurrentCategory(params.selectedCategory);
      // Clear the params after using them
      navigation.setParams({ selectedCategory: undefined });
    }
  }, [navigation])
);

  const openPanel = () => {
    // Dismiss keyboard when opening panel
    Keyboard.dismiss();
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: -320,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const handleNavigation = (screenName: string) => {
    closePanel();
    setTimeout(() => {
      if (screenName === 'SwitchCategory') {
        navigation.navigate(screenName as never, { 
          currentCategory,
          onCategorySelect: (category: string) => {
            setCurrentCategory(category);
          }
        } as never);
      } else {
        navigation.navigate(screenName as never);
      }
    }, 300);
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    closePanel();
  };

  const sendMessage = async () => {
  // Check if there's text and if the AI is not already responding
  if (inputText.trim() && !isLoading) {
    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Add the user's message to the chat immediately
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // PRIVACY PIPELINE: Process message anonymously
      try {
        const privacyResponse = await fetch('http://192.168.1.64:5001/process-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: 'demo_user_123',
            message: messageText
          }),
          // Add timeout to prevent hanging
        });

        if (privacyResponse.ok) {
          const privacyResult = await privacyResponse.json();
          
          // Crisis detection alert
          if (privacyResult.crisis_alert) {
            Alert.alert(
              '🆘 Support Available',
              'We noticed you might be going through a difficult time. Would you like immediate support resources?',
              [
                { text: 'Not now', style: 'cancel' },
                { 
                  text: 'Get Help', 
                  onPress: () => {
                    closePanel();
                    setTimeout(() => {
                      navigation.navigate('ProfessionalCare' as never);
                    }, 300);
                  }
                }
              ]
            );
          }

          console.log('✅ Privacy processed - Anonymous ID:', privacyResult.anonymous_id);
        }
      } catch (privacyError) {
        // Privacy service down - continue with chatbot
        console.log('⚠️ Privacy service unavailable, continuing with chat');
      }

      // CHATBOT: Get AI response using original message
      const responseText = await generateGeminiResponse(messageText);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Failed to get Gemini response:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please check your connection.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);

    } finally {
      setIsLoading(false);
    }
  }
};

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={openPanel}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category</Text>
            <Text style={styles.categoryText} numberOfLines={1}>
              {currentCategory}
            </Text>
          </View>
          
          <View style={styles.statusIndicator}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Typing Indicator*/}
        {isLoading && (
          <View style={styles.aiMessage}>
          <Text style={styles.aiMessageText}>Typing...</Text>
          </View>
        )}

        {/* AI Branding */}
        <View style={styles.aiBrandContainer}>
          <Text style={styles.aiBrandText}>✨ MindCare AI Assistant</Text>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Type your message here..."
            placeholderTextColor="#8E8E93"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Sliding panel */}
        {isOpen && (
          <SlidingPanel 
            slideAnim={slideAnim} 
            onNavigate={handleNavigation}
          >
            <TouchableOpacity
              onPress={closePanel}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </SlidingPanel>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  menuButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#30D158',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#30D158',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  chatContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    borderBottomRightRadius: 5,
    padding: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  aiBrandContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  aiBrandText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#38383A',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sendButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2000,
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default MainScreen;