//ResourceLibrary.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface TherapyResource {
  id: number;
  title: string;
  type: string;
  description: string;
  readTime: string;
  category: string;
}

interface VideoResource {
  id: number;
  title: string;
  channel: string;
  duration: string;
  category: string;
  url: string;
  description: string;
}

interface MeditationSession {
  id: number;
  title: string;
  duration: string;
  type: string;
  difficulty: string;
  description: string;
}

interface JournalEntry {
  id: number;
  date: string;
  mood: string;
  content: string;
}

const therapyResources: TherapyResource[] = [
  {
    id: 1,
    title: "Understanding Cognitive Behavioral Therapy (CBT)",
    type: "CBT",
    description: "Learn how CBT helps identify and change negative thought patterns that affect emotions and behaviors.",
    readTime: "8 min read",
    category: "Therapy Methods"
  },
  {
    id: 2,
    title: "Dialectical Behavior Therapy: Skills for Emotional Regulation",
    type: "DBT",
    description: "Master DBT techniques including distress tolerance, emotion regulation, and interpersonal effectiveness.",
    readTime: "12 min read",
    category: "Therapy Methods"
  },
  {
    id: 3,
    title: "EMDR: Processing Trauma and Difficult Memories",
    type: "EMDR",
    description: "Understanding Eye Movement Desensitization and Reprocessing therapy for trauma recovery.",
    readTime: "10 min read",
    category: "Trauma Recovery"
  },
  {
    id: 4,
    title: "Psychodynamic Therapy: Exploring the Unconscious Mind",
    type: "Psychodynamic",
    description: "How psychodynamic therapy helps uncover unconscious patterns affecting current relationships and behaviors.",
    readTime: "15 min read",
    category: "Therapy Methods"
  }
];

const videoResources: VideoResource[] = [
  {
    id: 1,
    title: "Anxiety Management Techniques That Actually Work",
    channel: "Therapy in a Nutshell",
    duration: "14:32",
    category: "Anxiety",
    url: "https://youtube.com/watch?v=example1",
    description: "Practical strategies to manage anxiety in daily life"
  },
  {
    id: 2,
    title: "Understanding Depression: Signs, Symptoms, and Hope",
    channel: "Kati Morton",
    duration: "18:45",
    category: "Depression",
    url: "https://youtube.com/watch?v=example2",
    description: "Comprehensive guide to recognizing and addressing depression"
  },
  {
    id: 3,
    title: "Mindfulness for Beginners: Start Your Journey",
    channel: "Headspace",
    duration: "12:20",
    category: "Mindfulness",
    url: "https://youtube.com/watch?v=example3",
    description: "Introduction to mindfulness practice for mental wellness"
  }
];

const meditationSessions: MeditationSession[] = [
  {
    id: 1,
    title: "Morning Anxiety Relief",
    duration: "10 min",
    type: "Breathing",
    difficulty: "Beginner",
    description: "Start your day with calm breathing exercises to reduce morning anxiety"
  },
  {
    id: 2,
    title: "Body Scan for Sleep",
    duration: "20 min",
    type: "Body Scan",
    difficulty: "Intermediate",
    description: "Progressive muscle relaxation to prepare your body and mind for rest"
  },
  {
    id: 3,
    title: "Mindful Focus Session",
    duration: "15 min",
    type: "Concentration",
    difficulty: "Advanced",
    description: "Enhance your ability to maintain focus and attention"
  }
];

const ResourceLibrary: React.FC = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState<'resources' | 'journal' | 'videos' | 'meditation' | 'tracker'>('resources');
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [trackerType, setTrackerType] = useState<'habit' | 'emotion' | 'goal'>('habit');

  const moods = ['😊 Happy', '😔 Sad', '😰 Anxious', '😤 Angry', '😐 Neutral', '😴 Tired', '🤔 Thoughtful'];

  const handleSaveJournal = () => {
    if (journalEntry.trim() && selectedMood) {
      const newEntry: JournalEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        mood: selectedMood,
        content: journalEntry.trim()
      };
      setJournalEntries(prev => [newEntry, ...prev]);
      setJournalEntry('');
      setSelectedMood('');
      setShowJournalModal(false);
      Alert.alert('Success', 'Journal entry saved!');
    }
  };

  const handleVideoPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open video link');
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot open video link');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Therapy Methods': '#007AFF',
      'Trauma Recovery': '#FF6B6B',
      'Anxiety': '#FF9500',
      'Depression': '#4ECDC4',
      'Mindfulness': '#30D158',
      'Breathing': '#5856D6',
      'Body Scan': '#AF52DE',
      'Concentration': '#FF2D92'
    };
    return colors[category] || '#8E8E93';
  };

  const renderNavButtons = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navContainer}>
      {[
        { key: 'resources', label: 'Therapy Guides', icon: '📚' },
        { key: 'journal', label: 'Journal', icon: '✍️' },
        { key: 'videos', label: 'Videos', icon: '📺' },
        { key: 'meditation', label: 'Meditation', icon: '🧘' },
        { key: 'tracker', label: 'Trackers', icon: '📊' },
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.navButton, activeSection === item.key && styles.activeNavButton]}
          onPress={() => setActiveSection(item.key as any)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[styles.navText, activeSection === item.key && styles.activeNavText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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
          <Text style={styles.headerTitle}>Resource Library</Text>
          <Text style={styles.headerSubtitle}>Your mental health toolkit</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Navigation */}
      {renderNavButtons()}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSection === 'resources' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Therapy Methods & Techniques</Text>
            <Text style={styles.sectionSubtitle}>Evidence-based approaches to mental health</Text>
            
            {therapyResources.map((resource) => (
              <TouchableOpacity key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: getCategoryColor(resource.category) }]}>
                    <Text style={styles.typeBadgeText}>{resource.type}</Text>
                  </View>
                  <Text style={styles.readTime}>{resource.readTime}</Text>
                </View>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
                <TouchableOpacity style={styles.readButton}>
                  <Text style={styles.readButtonText}>Read Guide →</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeSection === 'journal' && (
          <View style={styles.section}>
            <View style={styles.journalHeader}>
              <View>
                <Text style={styles.sectionTitle}>Personal Journal</Text>
                <Text style={styles.sectionSubtitle}>Track your thoughts and emotions</Text>
              </View>
              <TouchableOpacity 
                style={styles.addJournalButton}
                onPress={() => setShowJournalModal(true)}
              >
                <Text style={styles.addJournalText}>+ New Entry</Text>
              </TouchableOpacity>
            </View>

            {journalEntries.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📝</Text>
                <Text style={styles.emptyStateText}>Start your journaling journey</Text>
                <Text style={styles.emptyStateSubtext}>Regular journaling can help process emotions and track progress</Text>
              </View>
            ) : (
              journalEntries.map((entry) => (
                <View key={entry.id} style={styles.journalEntryCard}>
                  <View style={styles.journalEntryHeader}>
                    <Text style={styles.journalMood}>{entry.mood}</Text>
                    <Text style={styles.journalDate}>{entry.date}</Text>
                  </View>
                  <Text style={styles.journalContent}>{entry.content}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeSection === 'videos' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Educational Videos</Text>
            <Text style={styles.sectionSubtitle}>Expert insights and practical guidance</Text>
            
            {videoResources.map((video) => (
              <TouchableOpacity 
                key={video.id} 
                style={styles.videoCard}
                onPress={() => handleVideoPress(video.url)}
              >
                <View style={styles.videoThumbnail}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoChannel}>by {video.channel}</Text>
                  <Text style={styles.videoDescription}>{video.description}</Text>
                  <View style={styles.videoMeta}>
                    <View style={[styles.videoCategoryBadge, { backgroundColor: getCategoryColor(video.category) }]}>
                      <Text style={styles.videoCategoryText}>{video.category}</Text>
                    </View>
                    <Text style={styles.videoDuration}>{video.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeSection === 'meditation' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guided Meditations</Text>
            <Text style={styles.sectionSubtitle}>Mindfulness sessions for different needs</Text>
            
            {meditationSessions.map((session) => (
              <TouchableOpacity key={session.id} style={styles.meditationCard}>
                <View style={styles.meditationHeader}>
                  <View style={styles.meditationTitleContainer}>
                    <Text style={styles.meditationTitle}>{session.title}</Text>
                    <Text style={styles.meditationType}>{session.type} • {session.difficulty}</Text>
                  </View>
                  <View style={styles.meditationDuration}>
                    <Text style={styles.durationText}>{session.duration}</Text>
                  </View>
                </View>
                <Text style={styles.meditationDescription}>{session.description}</Text>
                <TouchableOpacity style={styles.startMeditationButton}>
                  <Text style={styles.startMeditationText}>🎵 Start Session</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeSection === 'tracker' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress Trackers</Text>
            <Text style={styles.sectionSubtitle}>Monitor your mental health journey</Text>
            
            <View style={styles.trackerTabs}>
              {['habit', 'emotion', 'goal'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.trackerTab, trackerType === type && styles.activeTrackerTab]}
                  onPress={() => setTrackerType(type as any)}
                >
                  <Text style={[styles.trackerTabText, trackerType === type && styles.activeTrackerTabText]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.trackerContent}>
              <View style={styles.trackerCard}>
                <Text style={styles.trackerCardTitle}>
                  {trackerType === 'habit' ? '🔄 Daily Habits' : 
                   trackerType === 'emotion' ? '💭 Mood Tracking' : '🎯 Goal Progress'}
                </Text>
                <Text style={styles.trackerCardDescription}>
                  {trackerType === 'habit' ? 'Track daily mental health practices like meditation, exercise, and sleep' : 
                   trackerType === 'emotion' ? 'Monitor your emotional patterns and triggers over time' : 
                   'Set and track progress on your mental wellness goals'}
                </Text>
                <TouchableOpacity style={styles.trackerButton}>
                  <Text style={styles.trackerButtonText}>
                    {trackerType === 'habit' ? 'Log Today\'s Habits' : 
                     trackerType === 'emotion' ? 'Record Current Mood' : 'Update Goals'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Journal Modal */}
      <Modal
        visible={showJournalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowJournalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.journalModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Journal Entry</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowJournalModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.moodLabel}>How are you feeling?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodButton, selectedMood === mood && styles.selectedMoodButton]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodButtonText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.journalLabel}>What's on your mind?</Text>
            <TextInput
              style={styles.journalInput}
              placeholder="Express your thoughts, feelings, or experiences..."
              placeholderTextColor="#8E8E93"
              value={journalEntry}
              onChangeText={setJournalEntry}
              multiline
              textAlignVertical="top"
            />
            
            <TouchableOpacity 
              style={[styles.saveJournalButton, (!journalEntry.trim() || !selectedMood) && styles.disabledButton]}
              onPress={handleSaveJournal}
              disabled={!journalEntry.trim() || !selectedMood}
            >
              <Text style={styles.saveJournalText}>Save Entry</Text>
            </TouchableOpacity>
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
  navContainer: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
  },
  activeNavButton: {
    backgroundColor: '#007AFF',
  },
  navIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  navText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  resourceCard: {
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
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  readTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  readButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  addJournalButton: {
    backgroundColor: '#30D158',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addJournalText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  journalEntryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  journalEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalMood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  journalDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  journalContent: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  videoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  videoChannel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoCategoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  videoCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoDuration: {
    fontSize: 12,
    color: '#8E8E93',
  },
  meditationCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  meditationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  meditationTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  meditationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meditationType: {
    fontSize: 12,
    color: '#8E8E93',
  },
  meditationDuration: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  meditationDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 12,
  },
  startMeditationButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  startMeditationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trackerTabs: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  trackerTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTrackerTab: {
    backgroundColor: '#007AFF',
  },
  trackerTabText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeTrackerTabText: {
    color: '#FFFFFF',
  },
  trackerContent: {
    marginTop: 10,
  },
  trackerCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  trackerCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackerCardDescription: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  trackerButton: {
    backgroundColor: '#30D158',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  trackerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  journalModalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
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
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  moodSelector: {
    marginBottom: 20,
  },
  moodButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedMoodButton: {
    backgroundColor: '#007AFF',
  },
  moodButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  journalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  journalInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveJournalButton: {
    backgroundColor: '#30D158',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#2C2C2E',
  },
  saveJournalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResourceLibrary;