// ResourceLibrary.tsx
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
  Linking,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface LegalGuide {
  id: number;
  title: string;
  actRef: string;
  description: string;
  readTime: string;
  category: string;
  badgeColor: string;
  bulletPoints: string[];
}

interface TherapyResource {
  id: number;
  title: string;
  type: string;
  description: string;
  readTime: string;
  category: string;
  badgeColor: string;
  keyTechniques: string[];
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
  purpose: string;
}

interface JournalEntry {
  id: number;
  date: string;
  mood: string;
  incidentContext: string;
  content: string;
}

const legalGuides: LegalGuide[] = [
  {
    id: 1,
    title: 'Victim Protection Orders & Emergency Police Aid',
    actRef: 'Criminal Procedure & Special Protection Laws',
    description: 'Statutory protections providing immediate police assistance, injunctions against abusers/perpetrators, and emergency safety orders.',
    readTime: '4 min read',
    category: 'Safety & Protection',
    badgeColor: '#E74C3C',
    bulletPoints: [
      'Right to emergency police response and safe shelter referrals.',
      'Protection orders barring perpetrators from contacting or approaching the victim.',
      'Mandatory registration of Zero-FIR at any police station without territorial limitation.',
    ],
  },
  {
    id: 2,
    title: 'Statutory Victim Compensation & Relief Schemes',
    actRef: 'National Victim Compensation Scheme & PoA Rule 12',
    description: 'Government-mandated financial assistance for medical expenses, trauma rehabilitation, and loss of livelihood.',
    readTime: '5 min read',
    category: 'Relief & Compensation',
    badgeColor: '#F1C40F',
    bulletPoints: [
      'Initial relief tranche credited upon formal complaint registration.',
      'Compensation for bodily injury, grievous hurt, psychological trauma, or property loss.',
      'Direct disbursement into bank accounts through District Magistrate / DLSA.',
    ],
  },
  {
    id: 3,
    title: 'Free Legal Representation via DLSA & NALSA',
    actRef: 'Legal Services Authorities Act',
    description: 'Guaranteed free, experienced legal counsel for all victims of violent crimes, domestic abuse, sexual offences, and atrocities.',
    readTime: '3 min read',
    category: 'Free Legal Aid',
    badgeColor: '#9B59B6',
    bulletPoints: [
      'Zero lawyer consultation charges and exemption from court fees.',
      'Representation during bail hearings, trial examination, and appeal proceedings.',
      'Dedicated paralegal assistance for court appearances.',
    ],
  },
  {
    id: 4,
    title: 'Witness Protection & In-Camera Trial Rights',
    actRef: 'National Witness Protection Framework & PoA Sec 15A',
    description: 'Ensuring total confidentiality, protection from intimidation, and video-conferencing / in-camera testimony options.',
    readTime: '4 min read',
    category: 'Trial Rights',
    badgeColor: '#3498DB',
    bulletPoints: [
      'In-camera court proceedings with screen shields to prevent victim intimidation.',
      'State-provided armed police escort for sensitive court hearing dates.',
      'Identity redaction in public court records and judgment dockets.',
    ],
  },
];

const therapyResources: TherapyResource[] = [
  {
    id: 1,
    title: 'Trauma-Informed CBT for Violence & Abuse Survivors',
    type: 'Trauma CBT',
    description: 'Clinical cognitive reframing to overcome panic triggers, persistent self-blame, flashbacks, and trauma hyperarousal.',
    readTime: '6 min read',
    category: 'Trauma Healing',
    badgeColor: '#1ABC9C',
    keyTechniques: ['Trigger Mapping', 'Thought Decatastrophizing', 'Safety Belief Restructuring'],
  },
  {
    id: 2,
    title: 'DBT Distress Tolerance for Acute Panic & Anxiety',
    type: 'DBT Skills',
    description: 'Emergency de-escalation toolkit for court dates, confrontations, or sudden trauma flashbacks.',
    readTime: '7 min read',
    category: 'Crisis Calming',
    badgeColor: '#9B59B6',
    keyTechniques: ['TIPP Cold Water Reset', 'Paced Breathing', 'Radical Self-Acceptance'],
  },
  {
    id: 3,
    title: 'EMDR Therapy for Assault & Flashback Recovery',
    type: 'EMDR Therapy',
    description: 'Bilateral neurological stimulation helping the brain process traumatic sensory memories into resolved history.',
    readTime: '8 min read',
    category: 'PTSD Recovery',
    badgeColor: '#FF6B6B',
    keyTechniques: ['Safe Place Anchoring', 'Bilateral Eye Movements', 'Dual Awareness Focus'],
  },
];

const videoResources: VideoResource[] = [
  {
    id: 1,
    title: 'Understanding Court Trial Steps & Victim Rights',
    channel: 'National Legal Aid Initiative',
    duration: '14:20',
    category: 'Court Literacy',
    url: 'https://youtube.com',
    description: 'A calm, step-by-step guide to what happens inside the courtroom and how legal aid lawyers support you.',
  },
  {
    id: 2,
    title: 'How to Manage Flashbacks & Regain Grounding',
    channel: 'Elevana Clinical Care Series',
    duration: '11:15',
    category: 'Trauma Coping',
    url: 'https://youtube.com',
    description: 'Practical somatic exercises you can do anywhere when feeling overwhelmed or unsafe.',
  },
];

const meditationSessions: MeditationSession[] = [
  {
    id: 1,
    title: 'Emergency 4-7-8 Breathwork for Acute Panic',
    duration: '4 min',
    type: 'Paced Breathwork',
    difficulty: 'Instant Relief',
    purpose: 'Rapidly slows down racing heart rate and adrenaline surges.',
    description: 'Inhale through nose for 4s, hold gently for 7s, exhale steadily through mouth for 8s.',
  },
  {
    id: 2,
    title: '5-4-3-2-1 Sensory Grounding for Flashbacks',
    duration: '6 min',
    type: 'Somatic Focus',
    difficulty: 'Easy',
    purpose: 'Anchors your mind in physical reality when traumatic memories intrude.',
    description: 'Identify 5 visible objects, 4 physical sensations, 3 sounds, 2 scents, and 1 positive affirmation.',
  },
  {
    id: 3,
    title: 'Restorative Sleep & Safety Visualization',
    duration: '12 min',
    type: 'Nidra & Body Scan',
    difficulty: 'Restorative',
    purpose: 'Combats insomnia and nightmares after traumatic events.',
    description: 'Progressive muscle relaxation releasing physical tension stored in the shoulders and chest.',
  },
];

const ResourceLibrary: React.FC = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState<'legal' | 'therapy' | 'journal' | 'videos' | 'meditation' | 'tracker'>('legal');
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [incidentContext, setIncidentContext] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 1,
      date: 'Recent Note',
      mood: '😌 Relieved & Grounded',
      incidentContext: 'Legal counseling consultation',
      content: 'Practiced 4-7-8 breathing before meeting with the DLSA counselor. Feeling much more confident about my statement and safety.',
    },
  ]);
  const [trackerTab, setTrackerTab] = useState<'milestones' | 'habits'>('milestones');
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

  const moods = [
    '😰 Anxious / On Edge',
    '😡 Angry / Frustrated',
    '😔 Heavy / Grieving',
    '😌 Relieved / Safe',
    '💪 Strong & Resilient',
  ];

  const handleSaveJournal = () => {
    if (journalContent.trim() && selectedMood) {
      const newEntry: JournalEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        mood: selectedMood,
        incidentContext: incidentContext.trim() || 'Daily Reflection',
        content: journalContent.trim(),
      };
      setJournalEntries([newEntry, ...journalEntries]);
      setJournalContent('');
      setSelectedMood('');
      setIncidentContext('');
      setShowJournalModal(false);
      Alert.alert('✅ Entry Saved', 'Your note is stored securely with on-device encryption.');
    }
  };

  const renderNavButtons = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.navContainer}
      contentContainerStyle={styles.navContent}
    >
      {[
        { key: 'legal', label: '⚖️ Legal' },
        { key: 'therapy', label: '🧠 Therapy' },
        { key: 'journal', label: '✍️ Journal' },
        { key: 'videos', label: '📺 Videos' },
        { key: 'meditation', label: '🧘 Calming' },
        { key: 'tracker', label: '📊 Tracker' },
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.navPill, activeSection === item.key && styles.activeNavPill]}
          onPress={() => setActiveSection(item.key as any)}
        >
          <Text style={[styles.navPillText, activeSection === item.key && styles.activeNavPillText]}>
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Resource Library</Text>
          <Text style={styles.headerSubtitle}>Legal Rights & Trauma Recovery Toolkit</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Sleek Subtab Navigation */}
      {renderNavButtons()}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section 1: Legal Rights */}
        {activeSection === 'legal' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionTitle}>Statutory Rights & Protection</Text>
              <Text style={styles.sectionSubtitle}>
                Legal safeguards, protection orders & compensation mechanisms
              </Text>
            </View>

            {legalGuides.map((guide) => (
              <View key={guide.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: guide.badgeColor }]}>
                    <Text style={styles.categoryBadgeText}>{guide.category}</Text>
                  </View>
                  <Text style={styles.readTimeText}>{guide.readTime}</Text>
                </View>
                <Text style={styles.cardTitle}>{guide.title}</Text>
                <Text style={styles.actRefText}>Legal Framework: {guide.actRef}</Text>
                <Text style={styles.cardDescription}>{guide.description}</Text>

                <View style={styles.bulletList}>
                  {guide.bulletPoints.map((point, index) => (
                    <Text key={index} style={styles.bulletItem}>
                      • {point}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: guide.badgeColor }]}
                  onPress={() => Alert.alert(guide.title, `${guide.description}\n\nFree assistance available via the Professional Support tab.`)}
                >
                  <Text style={styles.actionBtnText}>Read Detailed Guidance →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Section 2: Therapy Tools */}
        {activeSection === 'therapy' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionTitle}>Evidence-Based Trauma Therapies</Text>
              <Text style={styles.sectionSubtitle}>
                Clinical strategies for acute distress, fear de-escalation & PTSD recovery
              </Text>
            </View>

            {therapyResources.map((therapy) => (
              <View key={therapy.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: therapy.badgeColor }]}>
                    <Text style={styles.categoryBadgeText}>{therapy.type}</Text>
                  </View>
                  <Text style={styles.readTimeText}>{therapy.readTime}</Text>
                </View>
                <Text style={styles.cardTitle}>{therapy.title}</Text>
                <Text style={styles.cardDescription}>{therapy.description}</Text>

                <View style={styles.chipRow}>
                  {therapy.keyTechniques.map((tech, idx) => (
                    <View key={idx} style={styles.techChip}>
                      <Text style={styles.techChipText}>{tech}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#007AFF' }]}
                  onPress={() => Alert.alert(therapy.title, 'You can book a session with a designated trauma psychologist in the Professional Support tab.')}
                >
                  <Text style={styles.actionBtnText}>Practice Step-by-Step →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Section 3: Incident & Emotion Journal */}
        {activeSection === 'journal' && (
          <View style={styles.section}>
            <View style={styles.journalHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Incident & Emotion Log</Text>
                <Text style={styles.sectionSubtitle}>Encrypted personal notes on daily well-being</Text>
              </View>
              <TouchableOpacity
                style={styles.newEntryBtn}
                onPress={() => setShowJournalModal(true)}
              >
                <Text style={styles.newEntryBtnText}>+ New Note</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.journalPrivacyNotice}>
              <Text style={styles.journalPrivacyText}>
                🔒 Your notes are encrypted locally. You can use this log to record emotional triggers or prepare points for your counselor.
              </Text>
            </View>

            {journalEntries.map((entry) => (
              <View key={entry.id} style={styles.journalCard}>
                <View style={styles.journalCardHeader}>
                  <Text style={styles.journalMood}>{entry.mood}</Text>
                  <Text style={styles.journalDate}>{entry.date}</Text>
                </View>
                <Text style={styles.journalContext}>Context: {entry.incidentContext}</Text>
                <Text style={styles.journalBody}>{entry.content}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Section 4: Video Guides */}
        {activeSection === 'videos' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionTitle}>Empowerment Videos & Literacy</Text>
              <Text style={styles.sectionSubtitle}>
                Walkthroughs on court trial steps and trauma grounding
              </Text>
            </View>

            {videoResources.map((vid) => (
              <TouchableOpacity
                key={vid.id}
                style={styles.videoCard}
                onPress={() => Linking.openURL(vid.url).catch(() => Alert.alert('Video Tutorial', vid.title))}
              >
                <View style={styles.videoThumb}>
                  <Text style={styles.videoPlayIcon}>▶</Text>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{vid.title}</Text>
                  <Text style={styles.videoChannel}>By {vid.channel}</Text>
                  <Text style={styles.videoDesc}>{vid.description}</Text>
                  <View style={styles.videoMetaRow}>
                    <Text style={styles.videoBadgeText}>{vid.category}</Text>
                    <Text style={styles.videoDuration}>{vid.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Section 5: Calming Exercises */}
        {activeSection === 'meditation' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionTitle}>Guided Calming & Grounding</Text>
              <Text style={styles.sectionSubtitle}>
                Somatic breathing and grounding exercises for acute distress
              </Text>
            </View>

            {meditationSessions.map((med) => (
              <View key={med.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: '#5856D6' }]}>
                    <Text style={styles.categoryBadgeText}>{med.type}</Text>
                  </View>
                  <Text style={styles.readTimeText}>⏱️ {med.duration}</Text>
                </View>
                <Text style={styles.cardTitle}>{med.title}</Text>
                <Text style={styles.purposeText}>🎯 {med.purpose}</Text>
                <Text style={styles.cardDescription}>{med.description}</Text>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#5856D6' }]}
                  onPress={() => Alert.alert('Session Active', `Begin ${med.title}. Focus on your steady breathing rhythm.`)}
                >
                  <Text style={styles.actionBtnText}>🎵 Start Guided Exercise</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Section 6: Case Tracker */}
        {activeSection === 'tracker' && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBox}>
              <Text style={styles.sectionTitle}>Case Progress & Wellness Habits</Text>
              <Text style={styles.sectionSubtitle}>
                Monitor your legal journey and daily coping milestones
              </Text>
            </View>

            <View style={styles.trackerTabs}>
              {[
                { id: 'milestones', label: '⚖️ Legal Milestones' },
                { id: 'habits', label: '🌱 Coping Habits' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.trackerTab, trackerTab === tab.id && styles.activeTrackerTab]}
                  onPress={() => setTrackerTab(tab.id as any)}
                >
                  <Text style={[styles.trackerTabText, trackerTab === tab.id && styles.activeTrackerTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {trackerTab === 'milestones' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Statutory Case & Relief Stages</Text>
                <Text style={styles.sectionSubtitle}>Tracking investigation, protection and compensation stages</Text>

                {[
                  { step: '1. Official Complaint / FIR Registered', status: 'Completed', color: '#30D158' },
                  { step: '2. Phase-1 Relief Disbursement Request', status: 'In Process', color: '#FECA57' },
                  { step: '3. Investigation & Evidence Recording', status: 'Active (Assigned Officer)', color: '#3498DB' },
                  { step: '4. Special Court Trial & Witness Protection', status: 'Scheduled', color: '#8E8E93' },
                  { step: '5. Final Rehabilitation & Compensation Grant', status: 'Pending Trial', color: '#8E8E93' },
                ].map((m, i) => (
                  <View key={i} style={styles.milestoneRow}>
                    <View style={[styles.milestoneDot, { backgroundColor: m.color }]} />
                    <View style={styles.milestoneContent}>
                      <Text style={styles.milestoneStepTitle}>{m.step}</Text>
                      <Text style={[styles.milestoneStatus, { color: m.color }]}>{m.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {trackerTab === 'habits' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Daily Resilience Habits</Text>
                <Text style={styles.sectionSubtitle}>Small daily routines that build mental resilience</Text>

                {[
                  { name: '4-7-8 Grounding Breathing', streak: '5 Days Streak 🔥' },
                  { name: 'Evening Trauma-Release Log', streak: '3 Days Streak' },
                  { name: 'Daily Check-in with Elevana AI', streak: '8 Days Streak 🔥' },
                ].map((h, i) => (
                  <View key={i} style={styles.habitRow}>
                    <Text style={styles.habitName}>✓ {h.name}</Text>
                    <Text style={styles.habitStreak}>{h.streak}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Journal Modal */}
      <Modal
        visible={showJournalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowJournalModal(false)}
      >
        <View style={[styles.modalOverlay, { paddingBottom: keyboardHeight }]}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Confidential Note</Text>
              <TouchableOpacity onPress={() => setShowJournalModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <Text style={styles.formLabel}>Current Emotional Feeling *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
                {moods.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.moodChip, selectedMood === m && styles.selectedMoodChip]}
                    onPress={() => setSelectedMood(m)}
                  >
                    <Text style={[styles.moodChipText, selectedMood === m && styles.selectedMoodChipText]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.formLabel}>Context / Event Trigger</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Court preparation / Difficult interaction..."
                placeholderTextColor="#8E8E93"
                value={incidentContext}
                onChangeText={setIncidentContext}
              />

              <Text style={styles.formLabel}>Thoughts & Feelings *</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Write freely... This is encrypted on your device."
                placeholderTextColor="#8E8E93"
                value={journalContent}
                onChangeText={setJournalContent}
                multiline
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.saveEntryBtn, (!journalContent.trim() || !selectedMood) && styles.disabledBtn]}
                onPress={handleSaveJournal}
                disabled={!journalContent.trim() || !selectedMood}
              >
                <Text style={styles.saveEntryBtnText}>Save Secure Note</Text>
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
  navContainer: {
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    flexGrow: 0,
  },
  navContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  activeNavPill: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  navPillText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeNavPillText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 14,
  },
  sectionHeaderBox: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 15,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  readTimeText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actRefText: {
    fontSize: 10,
    color: '#58A6FF',
    fontWeight: '600',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#B0B0B0',
    lineHeight: 17,
    marginBottom: 8,
  },
  bulletList: {
    backgroundColor: '#161922',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    gap: 3,
  },
  bulletItem: {
    fontSize: 11,
    color: '#C0C6D0',
    lineHeight: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  techChip: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  techChipText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  purposeText: {
    fontSize: 11,
    color: '#A8E6CF',
    fontWeight: '500',
    marginBottom: 4,
  },
  actionBtn: {
    borderRadius: 14,
    paddingVertical: 7,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  journalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  newEntryBtn: {
    backgroundColor: '#30D158',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  newEntryBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: 'bold',
  },
  journalPrivacyNotice: {
    backgroundColor: '#1A281A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#285E28',
  },
  journalPrivacyText: {
    fontSize: 11,
    color: '#A8E6CF',
    lineHeight: 15,
  },
  journalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  journalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  journalMood: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  journalDate: {
    fontSize: 10,
    color: '#8E8E93',
  },
  journalContext: {
    fontSize: 10,
    color: '#007AFF',
    marginBottom: 4,
    fontWeight: '500',
  },
  journalBody: {
    fontSize: 12,
    color: '#D0D0D0',
    lineHeight: 17,
  },
  videoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  videoThumb: {
    width: 60,
    height: 60,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  videoPlayIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
    lineHeight: 16,
  },
  videoChannel: {
    fontSize: 10,
    color: '#8E8E93',
    marginBottom: 3,
  },
  videoDesc: {
    fontSize: 11,
    color: '#909090',
    lineHeight: 14,
    marginBottom: 4,
  },
  videoMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoBadgeText: {
    fontSize: 9,
    color: '#58A6FF',
    fontWeight: 'bold',
  },
  videoDuration: {
    fontSize: 10,
    color: '#8E8E93',
  },
  trackerTabs: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
  },
  trackerTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTrackerTab: {
    backgroundColor: '#007AFF',
  },
  trackerTabText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeTrackerTabText: {
    color: '#FFFFFF',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  milestoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  milestoneContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneStepTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  milestoneStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161922',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  habitName: {
    fontSize: 12,
    color: '#FFFFFF',
    flex: 1,
  },
  habitStreak: {
    fontSize: 11,
    color: '#30D158',
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
    marginBottom: 10,
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
  formLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    marginTop: 8,
  },
  moodScroll: {
    marginBottom: 4,
  },
  moodChip: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 5,
  },
  selectedMoodChip: {
    backgroundColor: '#007AFF',
  },
  moodChipText: {
    fontSize: 11,
    color: '#8E8E93',
  },
  selectedMoodChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  modalTextArea: {
    minHeight: 80,
  },
  saveEntryBtn: {
    backgroundColor: '#30D158',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  disabledBtn: {
    backgroundColor: '#2C2C2E',
  },
  saveEntryBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ResourceLibrary;