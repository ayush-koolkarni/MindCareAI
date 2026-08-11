//PeerSupportGuidance.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  supportType: string;
}

interface Podcast {
  id: number;
  title: string;
  author: string;
  duration: string;
  category: string;
  description: string;
  plays: number;
  rating: number;
}

const mockChatMessages: ChatMessage[] = [
  {
    id: 1,
    username: "Anonymous_Helper",
    message: "Remember, everyone here is going through something similar. You're not alone in this journey.",
    timestamp: "2 min ago",
    supportType: "General"
  },
  {
    id: 2,
    username: "StudyWarrior",
    message: "I found that breaking my study sessions into 25-minute chunks really helped with my exam anxiety.",
    timestamp: "5 min ago",
    supportType: "Academic"
  },
  {
    id: 3,
    username: "NightOwl_22",
    message: "Has anyone tried meditation apps for sleep issues? Looking for recommendations.",
    timestamp: "8 min ago",
    supportType: "Sleep"
  },
];

const mockPodcasts: Podcast[] = [
  {
    id: 1,
    title: "From Panic to Peace: My Anxiety Journey",
    author: "Sarah M.",
    duration: "24:30",
    category: "Anxiety",
    description: "How I overcame severe social anxiety through gradual exposure therapy and mindfulness practices.",
    plays: 1247,
    rating: 4.8
  },
  {
    id: 2,
    title: "Breaking the Depression Cycle",
    author: "Mike T.",
    duration: "31:15",
    category: "Depression",
    description: "My 3-year journey from clinical depression to finding joy in life again through therapy and lifestyle changes.",
    plays: 892,
    rating: 4.9
  },
  {
    id: 3,
    title: "Perfectionist to Progress: Study Balance",
    author: "Emma L.",
    duration: "18:45",
    category: "Academic Stress",
    description: "How I learned to balance academic excellence with mental health during my engineering degree.",
    plays: 634,
    rating: 4.7
  },
  {
    id: 4,
    title: "Building Self-Worth After Bullying",
    author: "Alex K.",
    duration: "27:20",
    category: "Self-Esteem",
    description: "Rebuilding confidence and self-love after years of bullying and social rejection.",
    plays: 456,
    rating: 4.6
  },
];

const PeerSupportGuidance: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'chat' | 'podcast'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send to the chat room
      console.log('Sending message:', newMessage);
      setNewMessage('');
      setShowChatModal(false);
    }
  };

  const handlePlayPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    // In a real app, this would open audio player
    console.log('Playing podcast:', podcast.title);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Anxiety': '#FF6B6B',
      'Depression': '#4ECDC4',
      'Academic Stress': '#45B7D1',
      'Self-Esteem': '#96CEB4',
      'Sleep': '#54A0FF',
      'General': '#00B894'
    };
    return colors[category] || '#8E8E93';
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Peer Support</Text>
          <Text style={styles.headerSubtitle}>Community & Stories</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={styles.tabIcon}>💬</Text>
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            Anonymous Chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'podcast' && styles.activeTab]}
          onPress={() => setActiveTab('podcast')}
        >
          <Text style={styles.tabIcon}>🎧</Text>
          <Text style={[styles.tabText, activeTab === 'podcast' && styles.activeTabText]}>
            Recovery Stories
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'chat' ? (
          <View style={styles.chatContainer}>
            {/* Chat Room Info */}
            <View style={styles.chatInfoCard}>
              <Text style={styles.chatInfoTitle}>🛡️ Safe Space Guidelines</Text>
              <Text style={styles.chatInfoText}>
                • All conversations are anonymous{'\n'}
                • Be respectful and supportive{'\n'}
                • No personal information sharing{'\n'}
                • Moderated 24/7 for safety
              </Text>
              <View style={styles.onlineStatus}>
                <View style={styles.onlineIndicator} />
                <Text style={styles.onlineText}>47 people online</Text>
              </View>
            </View>

            {/* Recent Messages */}
            <View style={styles.messagesHeader}>
              <Text style={styles.sectionTitle}>Recent Conversations</Text>
              <TouchableOpacity 
                style={styles.joinChatButton}
                onPress={() => setShowChatModal(true)}
              >
                <Text style={styles.joinChatText}>Join Chat</Text>
              </TouchableOpacity>
            </View>

            {mockChatMessages.map((msg) => (
              <View key={msg.id} style={styles.chatMessage}>
                <View style={styles.messageHeader}>
                  <Text style={styles.username}>{msg.username}</Text>
                  <View style={[styles.supportTypeBadge, { backgroundColor: getCategoryColor(msg.supportType) }]}>
                    <Text style={styles.supportTypeText}>{msg.supportType}</Text>
                  </View>
                  <Text style={styles.timestamp}>{msg.timestamp}</Text>
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            ))}

            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => setShowChatModal(true)}
            >
              <Text style={styles.viewMoreText}>View Full Chat Room →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.podcastContainer}>
            {/* Podcast Library Info */}
            <View style={styles.podcastInfoCard}>
              <Text style={styles.podcastInfoTitle}>🎙️ Recovery Stories</Text>
              <Text style={styles.podcastInfoText}>
                Real stories from people who've overcome mental health challenges. 
                Each story includes detailed strategies and practical advice.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Featured Stories</Text>

            {mockPodcasts.map((podcast) => (
              <TouchableOpacity
                key={podcast.id}
                style={styles.podcastCard}
                onPress={() => handlePlayPodcast(podcast)}
                activeOpacity={0.8}
              >
                <View style={styles.podcastHeader}>
                  <View style={styles.podcastTitleContainer}>
                    <Text style={styles.podcastTitle}>{podcast.title}</Text>
                    <Text style={styles.podcastAuthor}>by {podcast.author}</Text>
                  </View>
                  <View style={styles.podcastMetrics}>
                    <Text style={styles.podcastRating}>
                      {renderStars(podcast.rating)} {podcast.rating}
                    </Text>
                    <Text style={styles.podcastDuration}>{podcast.duration}</Text>
                  </View>
                </View>
                
                <View style={styles.podcastDetails}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(podcast.category) }]}>
                    <Text style={styles.categoryText}>{podcast.category}</Text>
                  </View>
                  <Text style={styles.podcastPlays}>👥 {podcast.plays} listens</Text>
                </View>
                
                <Text style={styles.podcastDescription}>{podcast.description}</Text>
                
                <View style={styles.playButtonContainer}>
                  <TouchableOpacity style={styles.playButton}>
                    <Text style={styles.playButtonText}>▶ Play Story</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Chat Modal */}
      <Modal
        visible={showChatModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join Anonymous Chat</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowChatModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Share your thoughts or ask for support anonymously
            </Text>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              placeholderTextColor="#8E8E93"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={300}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Text style={[styles.sendButtonText, !newMessage.trim() && styles.sendButtonTextDisabled]}>
                  Send Anonymously
                </Text>
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
  backButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#2C2C2E',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    padding: 20,
  },
  chatInfoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#30D158',
  },
  chatInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  chatInfoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  onlineStatus: {
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
  onlineText: {
    fontSize: 12,
    color: '#30D158',
    fontWeight: '500',
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  joinChatButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinChatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatMessage: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  supportTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  supportTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  viewMoreButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  viewMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  podcastContainer: {
    padding: 20,
  },
  podcastInfoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  podcastInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  podcastInfoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  podcastCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  podcastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  podcastTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  podcastAuthor: {
    fontSize: 12,
    color: '#8E8E93',
  },
  podcastMetrics: {
    alignItems: 'flex-end',
  },
  podcastRating: {
    fontSize: 12,
    color: '#FECA57',
    marginBottom: 2,
  },
  podcastDuration: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  podcastDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  podcastPlays: {
    fontSize: 12,
    color: '#8E8E93',
  },
  podcastDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  playButtonContainer: {
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#8E8E93',
  },
});

export default PeerSupportGuidance;