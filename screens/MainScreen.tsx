// MainScreen.tsx
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
  Modal,
  Linking,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import SlidingPanel from './SlidingPanel';
import { postWithFallback } from '../utils/apiClient';

const { width: screenWidth } = Dimensions.get('window');

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  greeting: string;
}

const LANGUAGES: LanguageOption[] = [
  { id: 'en', name: 'English', nativeName: 'English', code: 'EN', greeting: "Hello! I am Elevana AI, your confidential trauma recovery & crisis support companion ❤️\nHow are you feeling today? I am here to help you through difficult moments, emotional healing, and practical safety guidance." },
  { id: 'hi', name: 'Hindi', nativeName: 'हिंदी', code: 'HI', greeting: "नमस्ते! मैं एलेवाना एआई (Elevana AI) हूँ ❤️\nमैं आपके मानसिक स्वास्थ्य, कठिन परिस्थितियों से उबरने और सुरक्षा सहायता के लिए यहाँ हूँ। बताइए मैं आपकी क्या सहायता करूँ?" },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', code: 'MR', greeting: "नमस्कार! मी एलेव्हाना एआय (Elevana AI) आहे ❤️\nमानसिक आधार, कठीण प्रसंगांवर मात करण्यासाठी आणि सुरक्षिततेच्या मदतीसाठी मी तुमच्या पाठीशी आहे. तुम्ही आज कसे आहात?" },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', code: 'KN', greeting: "ನಮಸ್ಕಾರ! ನಾನು ಎಲೆವಾನಾ AI (Elevana AI) ❤️\nನಿಮ್ಮ ಮಾನಸಿಕ ಚೇತರಿಕೆ, ರಕ್ಷಣೆ ಮತ್ತು ಆಪ್ತಸಮಾಲೋಚನೆ ಬೆಂಬಲಕ್ಕಾಗಿ ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்', code: 'TA', greeting: "வணக்கம்! நான் எலெவானா AI (Elevana AI) ❤️\nஉங்கள் மனநலம், அதிர்ச்சியிலிருந்து மீளுதல் மற்றும் பாதுகாப்பு ஆதரவிற்காக நான் இங்கு இருக்கிறேன். உங்களுக்கு எவ்வாறு உதவலாம்?" },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు', code: 'TE', greeting: "నమస్కారం! నేను ఎలెవానా AI (Elevana AI) ❤️\nమీ మానసిక ఆరోగ్యం, కష్టాల నుండి కోలుకోవడం మరియు రక్షణ మద్దతు కోసం నేను ఇక్కడ ఉన్నాను. నేను మీకు ఎలా సహాయపడగలను?" },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা', code: 'BN', greeting: "নমস্কার! আমি এলেভানা এআই (Elevana AI) ❤️\nআপনার মানসিক স্বাস্থ্য, ট্রমা থেকে নিরাময় এবং সুরক্ষা নির্দেশিকার জন্য আমি এখানে আছি। আপনি কেমন অনুভব করছেন?" },
];

const MainScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const slideAnim = useRef(new Animated.Value(-320)).current;
  const [isOpen, setIsOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('Default - General Trauma & Crisis Support');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // Voice AI Simulation State
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceAIResponse, setVoiceAIResponse] = useState('');
  const [voiceStressScore, setVoiceStressScore] = useState('18% (Stable / Normal)');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: LANGUAGES[0].greeting,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const chatScrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Dynamic keyboard detection and auto-scroll
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          chatScrollRef.current?.scrollToEnd({ animated: true });
        }, 60);
      }
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Pulse animation for voice AI demo
  useEffect(() => {
    if (isVoiceRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isVoiceRecording]);

  // Listen for navigation params to update category
  useFocusEffect(
    React.useCallback(() => {
      const params = (route as any)?.params;
      if (params?.selectedCategory) {
        setCurrentCategory(params.selectedCategory);
        (navigation as any).setParams({ selectedCategory: undefined });
      }
    }, [navigation])
  );

  const openPanel = () => {
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
        (navigation as any).navigate(screenName, { 
          currentCategory,
          onCategorySelect: (category: string) => {
            setCurrentCategory(category);
          }
        });
      } else {
        (navigation as any).navigate(screenName);
      }
    }, 300);
  };

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    setShowLangModal(false);
    
    // Add welcome in the new language
    const langSwitchMessage: Message = {
      id: Date.now(),
      text: lang.greeting,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, langSwitchMessage]);
  };

  const dialHelpline = (number: string = '14566') => {
    setShowCrisisModal(false);
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Helpline Dialer', `Connecting to helpline ${number}...`);
    });
  };

  const handleSOSPress = () => {
    setShowCrisisModal(true);
  };

  // Start Voice Chat Demo Simulation
  const startVoiceDemo = () => {
    setShowVoiceModal(true);
    setIsVoiceRecording(true);
    setVoiceTranscript('Listening to your voice...');
    setVoiceAIResponse('');
    setVoiceStressScore('Analyzing speech frequency & tremor...');

    setTimeout(() => {
      setVoiceTranscript('"I have been having terrible panic attacks and feeling unsafe..."');
      setVoiceStressScore('22% - Mild Tension (De-escalating)');
      setIsVoiceRecording(false);

      setTimeout(() => {
        setVoiceAIResponse(
          selectedLanguage.code === 'HI'
            ? "मैं आपकी भावना समझ सकता हूँ। आप यहाँ बिल्कुल सुरक्षित हैं। मेरे साथ 4-7-8 गहरी सांस लें: 4 सेकंड सांस अंदर लें, 7 सेकंड रोकें, और 8 सेकंड में धीरे-धीरे छोड़ें।"
            : selectedLanguage.code === 'MR'
            ? "मी तुमची चिंता समजू शकतो. तुम्ही इथे पूर्णपणे सुरक्षित आहात. माझ्यासोबत संथ आणि दीर्घ श्वास घ्या. आम्ही तुमच्या सोबत आहोत."
            : "I hear you, and you are in a safe space right now. Let's take a slow grounding breath together: in for 4 seconds, hold for 7 seconds, and release for 8 seconds. You are not alone."
        );
      }, 1000);
    }, 2600);
  };

  const sendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      const messageText = inputText.trim();
      setInputText('');
      setIsLoading(true);

      const lower = messageText.toLowerCase();

      // Check for high crisis / suicide / threat triggers
      const isCrisisText = lower.includes('suicide') || lower.includes('kill myself') || 
                           lower.includes('end it all') || lower.includes('want to die') || 
                           lower.includes('self harm') || lower.includes('cannot live');

      if (isCrisisText) {
        setTimeout(() => {
          setShowCrisisModal(true);
        }, 1200);
      }

      try {
        // Privacy pipeline call with automatic multi-host fallback
        try {
          const privacyResult = await postWithFallback(5001, '/process-message', {
            user_id: 'victim_case_2026',
            message: messageText
          });

          if (privacyResult && privacyResult.sos_popup_trigger) {
            setShowCrisisModal(true);
          }
        } catch {
          // Offline fallback
        }

        // Gemini AI response with category and language context
        const responseText = await generateGeminiResponse(
          messageText,
          currentCategory,
          selectedLanguage.name
        );

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
          text: "I am here with you. Please check your connection, or reach out anytime for immediate support.",
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
      {!message.isUser && (
        <View style={styles.aiTagRow}>
          <Text style={styles.aiBadge}>🛡️ Elevana AI</Text>
        </View>
      )}
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
      <View 
        style={[styles.keyboardAvoid, { paddingBottom: keyboardHeight }]}
      >
        {/* Top Header Row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton} onPress={openPanel}>
              <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleBox}>
              <Text style={styles.headerMainTitle}>Elevana AI</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Protected</Text>
              </View>
            </View>
          </View>
          
          {/* Top Right Action Buttons: Language, Voice Chat, SOS */}
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.langBtn} 
              onPress={() => setShowLangModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.langBtnText}>🌐 {selectedLanguage.code}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.voiceHeaderBtn} 
              onPress={startVoiceDemo}
              activeOpacity={0.8}
            >
              <Text style={styles.voiceHeaderBtnIcon}>🎙️</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sosBtn} 
              onPress={handleSOSPress}
              activeOpacity={0.8}
            >
              <Text style={styles.sosBtnText}>🆘 SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dedicated Full-Width Category Bar (Never blocked by buttons) */}
        <TouchableOpacity
          style={styles.categoryBar}
          onPress={() => handleNavigation('SwitchCategory')}
          activeOpacity={0.8}
        >
          <View style={styles.categoryBarLeft}>
            <Text style={styles.categoryLabel}>Active Focus:</Text>
            <Text style={styles.categoryText} numberOfLines={1}>
              {currentCategory}
            </Text>
          </View>
          <Text style={styles.categorySwitchArrow}>Change ▾</Text>
        </TouchableOpacity>

        {/* Chat Area */}
        <ScrollView 
          ref={chatScrollRef}
          style={styles.chatContainer}
          contentContainerStyle={[styles.chatContent, { paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Typing Indicator */}
        {isLoading && (
          <View style={[styles.aiMessage, { marginLeft: 16, marginBottom: 8 }]}>
            <Text style={styles.aiMessageText}>Elevana AI is formulating response...</Text>
          </View>
        )}

        {/* AI Branding */}
        <View style={styles.aiBrandContainer}>
          <Text style={styles.aiBrandText}>🔒 Confidential & Encrypted Session · Elevana AI</Text>
        </View>

        {/* Input Area */}
        <View style={[styles.inputContainer, keyboardHeight > 0 && { paddingBottom: 10 }]}>
          <TouchableOpacity style={styles.micInputBtn} onPress={startVoiceDemo}>
            <Text style={styles.micInputIcon}>🎙️</Text>
          </TouchableOpacity>

          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder={`Message Elevana AI (${selectedLanguage.name})...`}
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
      </View>

      {/* LANGUAGE CHOOSING MODAL (Elevated so Bengali is completely visible above bottom nav bar) */}
      <Modal
        visible={showLangModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLangModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.langModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌐 Choose Language / भाषा चुनें</Text>
              <TouchableOpacity onPress={() => setShowLangModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              Select your preferred regional language for conversation and voice guidance:
            </Text>

            <ScrollView 
              style={styles.langScrollList}
              contentContainerStyle={styles.langScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.langItem,
                    selectedLanguage.id === lang.id && styles.activeLangItem,
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                >
                  <View style={styles.langItemLeft}>
                    <Text style={styles.langItemNative}>{lang.nativeName}</Text>
                    <Text style={styles.langItemName}>{lang.name}</Text>
                  </View>
                  {selectedLanguage.id === lang.id && (
                    <Text style={styles.checkIcon}>✓ Active</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* VOICE CHAT / VOICE STRESS ANALYTICS MODAL (DEMO) */}
      <Modal
        visible={showVoiceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.voiceModalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.voiceHeaderRow}>
                <Text style={styles.modalTitle}>🎙️ Voice AI & Stress Analytics</Text>
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>LIVE DEMO</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowVoiceModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.voiceSub}>
              Real-time Emotion AI & Voice Stress detection for continuous well-being monitoring.
            </Text>

            {/* Pulsing Voice Orb Visualizer */}
            <View style={styles.visualizerBox}>
              <Animated.View
                style={[
                  styles.pulseCircle,
                  {
                    transform: [{ scale: pulseAnim }],
                    backgroundColor: isVoiceRecording ? 'rgba(255, 59, 48, 0.25)' : 'rgba(0, 122, 255, 0.25)',
                  },
                ]}
              >
                <View style={[
                  styles.innerCircle,
                  { backgroundColor: isVoiceRecording ? '#FF3B30' : '#007AFF' }
                ]}>
                  <Text style={styles.orbMicIcon}>{isVoiceRecording ? '🎙️' : '🔊'}</Text>
                </View>
              </Animated.View>
              <Text style={styles.recordingStatus}>
                {isVoiceRecording ? '🔴 Listening & Analyzing Tone...' : '✅ Audio Response Generated'}
              </Text>
            </View>

            {/* Voice Stress Readout */}
            <View style={styles.stressAnalyticsCard}>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Voice Stress Index:</Text>
                <Text style={styles.analyticsValue}>{voiceStressScore}</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Active Language:</Text>
                <Text style={styles.analyticsValue}>{selectedLanguage.name} ({selectedLanguage.nativeName})</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Emotion Classification:</Text>
                <Text style={styles.analyticsValue}>Seeking Grounding & Reassurance</Text>
              </View>
            </View>

            {/* Transcript & AI Response */}
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptLabel}>Live Speech-to-Text:</Text>
              <Text style={styles.transcriptText}>{voiceTranscript}</Text>

              {voiceAIResponse ? (
                <View style={styles.voiceAIRow}>
                  <Text style={styles.voiceAILabel}>🔊 Elevana Voice Response:</Text>
                  <Text style={styles.voiceAIText}>{voiceAIResponse}</Text>
                </View>
              ) : null}
            </View>

            {/* Controls */}
            <View style={styles.voiceActionRow}>
              <TouchableOpacity
                style={styles.reSpeakBtn}
                onPress={startVoiceDemo}
              >
                <Text style={styles.reSpeakText}>🎙️ Speak Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeVoiceBtn}
                onPress={() => setShowVoiceModal(false)}
              >
                <Text style={styles.closeVoiceText}>Switch to Text</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AUTOMATIC SOS & CRISIS INTERVENTION MODAL */}
      <Modal
        visible={showCrisisModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCrisisModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.crisisModalContent}>
            <View style={styles.crisisHeader}>
              <Text style={styles.crisisIcon}>🆘</Text>
              <Text style={styles.crisisTitle}>Immediate Support & Safety</Text>
              <Text style={styles.crisisSub}>
                We noticed you might be going through extreme distress or feel unsafe. You are not alone—confidential help is available immediately.
              </Text>
            </View>

            <View style={styles.crisisOptions}>
              <TouchableOpacity
                style={styles.crisisBtnEmergency}
                onPress={() => dialHelpline('14566')}
                activeOpacity={0.8}
              >
                <Text style={styles.crisisBtnEmergencyText}>📞 Call 24/7 Helpline (14566)</Text>
              </TouchableOpacity>

              <View style={styles.quickDialRow}>
                <TouchableOpacity
                  style={styles.quickDialBtn}
                  onPress={() => dialHelpline('112')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickDialText}>🚔 Police (112)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickDialBtn}
                  onPress={() => dialHelpline('14416')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickDialText}>🧠 Tele-MANAS (14416)</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.crisisBtnCounselor}
                onPress={() => {
                  setShowCrisisModal(false);
                  (navigation as any).navigate('ProfessionalCare');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.crisisBtnCounselorText}>🏥 Book Psychiatrist / Counselor Session</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.crisisBtnDismiss}
                onPress={() => setShowCrisisModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.crisisBtnDismissText}>I'm Safe · Return to Conversation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitleBox: {
    flexDirection: 'column',
  },
  headerMainTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#30D158',
  },
  onlineText: {
    fontSize: 10,
    color: '#30D158',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBtn: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  langBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  voiceHeaderBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceHeaderBtnIcon: {
    fontSize: 14,
  },
  sosBtn: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161922',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  categoryBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#58A6FF',
    fontWeight: 'bold',
    flex: 1,
  },
  categorySwitchArrow: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  chatContent: {
    padding: 14,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  aiTagRow: {
    marginBottom: 3,
  },
  aiBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#58A6FF',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#EDEDED',
  },
  timestamp: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  aiBrandContainer: {
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: '#000000',
  },
  aiBrandText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 18 : 26,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  micInputBtn: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  micInputIcon: {
    fontSize: 15,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  langModalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 36,
    maxHeight: '80%',
  },
  voiceModalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 16,
  },
  langScrollList: {
    maxHeight: 320,
  },
  langScrollContent: {
    gap: 8,
    paddingBottom: 20,
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  activeLangItem: {
    borderColor: '#007AFF',
    backgroundColor: '#1A2838',
  },
  langItemLeft: {
    flexDirection: 'column',
  },
  langItemNative: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  langItemName: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  checkIcon: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  voiceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  voiceSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 12,
  },
  visualizerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pulseCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbMicIcon: {
    fontSize: 22,
  },
  recordingStatus: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  stressAnalyticsCard: {
    backgroundColor: '#242426',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 4,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticsLabel: {
    fontSize: 10,
    color: '#8E8E93',
  },
  analyticsValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#30D158',
  },
  transcriptBox: {
    backgroundColor: '#242426',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  transcriptLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  transcriptText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 17,
    marginBottom: 6,
  },
  voiceAIRow: {
    borderTopWidth: 0.5,
    borderTopColor: '#38383A',
    paddingTop: 6,
  },
  voiceAILabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#58A6FF',
    marginBottom: 2,
  },
  voiceAIText: {
    fontSize: 12,
    color: '#D0E8FF',
    lineHeight: 17,
  },
  voiceActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reSpeakBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  reSpeakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeVoiceBtn: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeVoiceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  crisisModalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 22,
    margin: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  crisisHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  crisisIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  crisisSub: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 17,
  },
  crisisOptions: {
    gap: 10,
  },
  crisisBtnEmergency: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  crisisBtnEmergencyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  quickDialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDialBtn: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#38383A',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  quickDialText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  crisisBtnCounselor: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  crisisBtnCounselorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  crisisBtnDismiss: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  crisisBtnDismissText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MainScreen;