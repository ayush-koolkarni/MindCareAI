// PeerSupport.tsx (Victim Support Circle)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  Linking,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  supportType: string;
  badgeColor: string;
}

interface Podcast {
  id: number;
  title: string;
  author: string;
  duration: string;
  category: string;
  categoryColor: string;
  description: string;
  plays: number;
  rating: number;
}

const mockChatMessages: ChatMessage[] = [
  {
    id: 1,
    username: 'Survivor_Courage_42',
    message: 'To anyone preparing for their court hearing or feeling overwhelmed: take deep breaths. Legal aid helped me through my statement. You are stronger than you think.',
    timestamp: '2 min ago',
    supportType: 'Trial Support',
    badgeColor: '#9B59B6',
  },
  {
    id: 2,
    username: 'Safety_First_MH',
    message: 'If you or your family are facing threats, do not hesitate to demand police protection orders. The legal framework protects us.',
    timestamp: '7 min ago',
    supportType: 'Safety & Protection',
    badgeColor: '#E74C3C',
  },
  {
    id: 3,
    username: 'Healing_Heart_KA',
    message: 'Practicing 4-7-8 breathing and trauma counseling in the app really helped reduce my panic attacks. Sending strength to everyone here.',
    timestamp: '15 min ago',
    supportType: 'Trauma Healing',
    badgeColor: '#1ABC9C',
  },
  {
    id: 4,
    username: 'Rehab_Hope_TN',
    message: 'Our statutory victim relief grant was approved through the DLSA fast-track cell last month. Don\'t lose hope.',
    timestamp: '28 min ago',
    supportType: 'Relief & Support',
    badgeColor: '#F1C40F',
  },
];

const mockPodcasts: Podcast[] = [
  {
    id: 1,
    title: 'From Intimidation to Courage: Winning My Court Battle',
    author: 'Ramesh K. (Survivor Advocate)',
    duration: '24:15',
    category: 'Justice Journey',
    categoryColor: '#4A90E2',
    description: 'How our family fought against threats, secured police protection, and won conviction in a difficult trial.',
    plays: 2430,
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Rebuilding Dignity & Healing After Severe Trauma',
    author: 'Savitri & Community Counselors',
    duration: '28:40',
    category: 'Trauma Recovery',
    categoryColor: '#1ABC9C',
    description: 'Practical steps taken to overcome social stigma, isolation, and rebuild self-worth after abuse.',
    plays: 1890,
    rating: 4.8,
  },
  {
    id: 3,
    title: 'Navigating Court Testimony Without Fear',
    author: 'Adv. Priya Sharma (DLSA Expert)',
    duration: '18:10',
    category: 'Court Preparation',
    categoryColor: '#9B59B6',
    description: 'Expert psychiatric and legal guidance on managing anxiety during cross-examinations.',
    plays: 3120,
    rating: 5.0,
  },
];

const PeerSupportGuidance: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'chat' | 'podcast' | 'upload'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState('Trial Support');
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Upload Story state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Healing Journey');
  const [uploadStory, setUploadStory] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newChat: ChatMessage = {
        id: Date.now(),
        username: `Anonymous_Survivor_${Math.floor(100 + Math.random() * 900)}`,
        message: newMessage.trim(),
        timestamp: 'Just now',
        supportType: selectedTag,
        badgeColor: selectedTag === 'Safety & Protection' ? '#E74C3C' : selectedTag === 'Trial Support' ? '#9B59B6' : '#1ABC9C',
      };
      setMessages([newChat, ...messages]);
      setNewMessage('');
      setShowChatModal(false);
      Alert.alert('✅ Message Posted', 'Your message has been posted anonymously with zero PII exposure.');
    }
  };

  const handlePlayPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setIsPlaying(true);
  };

  const handleUploadSubmit = () => {
    if (!uploadTitle.trim() || !uploadStory.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a title and story details.');
      return;
    }
    Alert.alert(
      '🌟 Story Submitted',
      'Thank you for contributing your voice. Our trauma-informed team will review and publish your story anonymously within 24 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setUploadTitle('');
            setUploadAuthor('');
            setUploadStory('');
            setActiveTab('podcast');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Victim Support Circle</Text>
          <Text style={styles.headerSubtitle}>Anonymous Community & Audio Stories</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Emergency Quick Bar */}
      <TouchableOpacity 
        style={styles.helplineBanner}
        onPress={() => Linking.openURL('tel:14566').catch(() => Alert.alert('Helpline', 'Connecting to 14566...'))}
        activeOpacity={0.8}
      >
        <Text style={styles.helplineText}>
          🛡️ 24/7 Crisis Helplines: <Text style={styles.boldText}>14566 (NHAA / Tap to Call)</Text> | <Text style={styles.boldText}>112</Text> | <Text style={styles.boldText}>14416</Text>
        </Text>
      </TouchableOpacity>

      {/* Sleek Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
            💬 Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'podcast' && styles.activeTab]}
          onPress={() => setActiveTab('podcast')}
        >
          <Text style={[styles.tabText, activeTab === 'podcast' && styles.activeTabText]}>
            🎧 Audio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'upload' && styles.activeTab]}
          onPress={() => setActiveTab('upload')}
        >
          <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>
            🎙️ Share
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? 80 : 150 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'chat' && (
            <View style={styles.chatContainer}>
              {/* Safe Space Card */}
              <View style={styles.chatInfoCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.chatInfoTitle}>🛡️ Anonymous Safe Space</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineIndicator} />
                    <Text style={styles.onlineCount}>64 survivors online</Text>
                  </View>
                </View>
                <Text style={styles.chatInfoText}>
                  • All conversations are 100% anonymous with automatic PII redaction{'\n'}
                  • Share recovery experiences, court trial courage, and mutual healing
                </Text>
              </View>

              {/* Header & Post Button */}
              <View style={styles.messagesHeader}>
                <Text style={styles.sectionTitle}>Shared Reflections</Text>
                <TouchableOpacity
                  style={styles.joinChatButton}
                  onPress={() => setShowChatModal(true)}
                >
                  <Text style={styles.joinChatText}>+ Share Thought</Text>
                </TouchableOpacity>
              </View>

              {/* Chat List */}
              {messages.map((msg) => (
                <View key={msg.id} style={styles.chatMessage}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.username}>{msg.username}</Text>
                    <View style={[styles.supportTypeBadge, { backgroundColor: msg.badgeColor }]}>
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
                <Text style={styles.viewMoreText}>Post Anonymous Encouragement →</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'podcast' && (
            <View style={styles.podcastContainer}>
              {/* Now Playing Widget if active */}
              {selectedPodcast && (
                <View style={styles.nowPlayingCard}>
                  <View style={styles.nowPlayingHeader}>
                    <Text style={styles.nowPlayingLabel}>🎧 NOW PLAYING</Text>
                    <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                      <Text style={styles.playPauseToggle}>{isPlaying ? '⏸ Pause' : '▶ Play'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.nowPlayingTitle}>{selectedPodcast.title}</Text>
                  <Text style={styles.nowPlayingAuthor}>{selectedPodcast.author}</Text>
                  <View style={styles.playbackBarContainer}>
                    <View style={styles.playbackProgress} />
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>Featured Audio Journeys</Text>

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
                      <Text style={styles.podcastAuthor}>🎙️ {podcast.author}</Text>
                    </View>
                    <Text style={styles.podcastDuration}>{podcast.duration}</Text>
                  </View>

                  <View style={styles.podcastDetails}>
                    <View style={[styles.categoryBadge, { backgroundColor: podcast.categoryColor }]}>
                      <Text style={styles.categoryText}>{podcast.category}</Text>
                    </View>
                    <Text style={styles.podcastPlays}>👥 {podcast.plays.toLocaleString()} listens</Text>
                  </View>

                  <Text style={styles.podcastDescription}>{podcast.description}</Text>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => handlePlayPodcast(podcast)}
                  >
                    <Text style={styles.playButtonText}>▶ Listen to Story</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'upload' && (
            <View style={styles.uploadContainer}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Share Your Experience or Audio</Text>
                <Text style={styles.formSub}>All submissions are scrubbed of personal identifiers.</Text>

                <Text style={styles.formLabel}>Story Title *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Overcoming Panic Attacks & Finding Courage"
                  placeholderTextColor="#8E8E93"
                  value={uploadTitle}
                  onChangeText={setUploadTitle}
                />

                <Text style={styles.formLabel}>Pen Name / Alias</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Anonymous Survivor / Fighter"
                  placeholderTextColor="#8E8E93"
                  value={uploadAuthor}
                  onChangeText={setUploadAuthor}
                />

                <Text style={styles.formLabel}>Your Experience *</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Share what helped you heal, how you managed difficult moments..."
                  placeholderTextColor="#8E8E93"
                  value={uploadStory}
                  onChangeText={setUploadStory}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />

                <TouchableOpacity style={styles.submitStoryButton} onPress={handleUploadSubmit}>
                  <Text style={styles.submitStoryButtonText}>Submit Anonymously</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={showChatModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowChatModal(false)}
      >
        <View style={[styles.modalOverlay, { paddingBottom: keyboardHeight }]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Anonymous Support</Text>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.modalSubtitle}>
                Share encouragement or ask questions. Your identity is 100% protected.
              </Text>

              <View style={styles.tagRow}>
                {['Trial Support', 'Safety & Protection', 'Trauma Healing', 'Relief & Support'].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.modalTag, selectedTag === tag && styles.selectedModalTag]}
                    onPress={() => setSelectedTag(tag)}
                  >
                    <Text style={[styles.modalTagText, selectedTag === tag && styles.selectedModalTagText]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                placeholderTextColor="#8E8E93"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={400}
              />

              <TouchableOpacity
                style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Text style={styles.sendButtonText}>Send Anonymously</Text>
              </TouchableOpacity>
            </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  placeholder: {
    width: 36,
  },
  helplineBanner: {
    backgroundColor: '#162216',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#285E28',
    alignItems: 'center',
  },
  helplineText: {
    fontSize: 11,
    color: '#A8E6CF',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#30D158',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#2C2C2E',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 11,
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
    padding: 14,
  },
  chatInfoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#30D158',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#30D158',
    marginRight: 5,
  },
  onlineCount: {
    fontSize: 10,
    color: '#30D158',
    fontWeight: '600',
  },
  chatInfoText: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 16,
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  joinChatButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  joinChatText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatMessage: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 6,
  },
  supportTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 6,
  },
  supportTypeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 10,
    color: '#8E8E93',
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: 13,
    color: '#D8D8D8',
    lineHeight: 18,
  },
  viewMoreButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  viewMoreText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  podcastContainer: {
    padding: 14,
  },
  nowPlayingCard: {
    backgroundColor: '#241432',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#9B59B6',
  },
  nowPlayingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nowPlayingLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9B59B6',
    letterSpacing: 0.5,
  },
  playPauseToggle: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: '#9B59B6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  nowPlayingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  nowPlayingAuthor: {
    fontSize: 11,
    color: '#D1C4E9',
    marginBottom: 8,
  },
  playbackBarContainer: {
    height: 3,
    backgroundColor: '#382348',
    borderRadius: 2,
    overflow: 'hidden',
  },
  playbackProgress: {
    width: '40%',
    height: '100%',
    backgroundColor: '#9B59B6',
  },
  podcastCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  podcastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  podcastTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  podcastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  podcastAuthor: {
    fontSize: 11,
    color: '#8E8E93',
  },
  podcastDuration: {
    fontSize: 11,
    color: '#8E8E93',
  },
  podcastDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  podcastPlays: {
    fontSize: 10,
    color: '#8E8E93',
  },
  podcastDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  uploadContainer: {
    padding: 14,
  },
  formCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  formSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  formTextArea: {
    minHeight: 90,
  },
  submitStoryButton: {
    backgroundColor: '#30D158',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  submitStoryButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  modalTag: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  selectedModalTag: {
    backgroundColor: '#007AFF',
  },
  modalTagText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  selectedModalTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default PeerSupportGuidance;