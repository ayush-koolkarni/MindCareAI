// SuccessNetwork.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type NavSection = 'all' | 'milestones' | 'podcasts' | 'articles' | 'rehabilitation';
type SubmitType = 'article' | 'podcast' | 'milestone';

interface JusticeStory {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  location: string;
  tag: string;
  tagColor: string;
  title: string;
  views: string;
  helpful: string;
  comments: number;
  duration: string;
  compensationStatus: string;
}

interface PodcastEpisode {
  id: number;
  title: string;
  author: string;
  location: string;
  episode: number;
  duration: string;
  progress: number;
  accentColor: string;
  isNew?: boolean;
}

interface Article {
  id: number;
  author: string;
  initials: string;
  avatarColor: string;
  avatarBg: string;
  location: string;
  tag: string;
  tagColor: string;
  iconBg: string;
  title: string;
  preview: string;
  readTime: string;
  claps: number;
}

interface StateImpactStat {
  state: string;
  casesSupported: number;
  reliefDisbursed: string;
  flag: string;
}

const justiceStories: JusticeStory[] = [
  {
    id: 1,
    author: 'Suresh Meshram',
    initials: 'SM',
    avatarColor: '#5AC8FA',
    location: 'Wardha, Maharashtra',
    tag: 'SPECIAL COURT CONVICTION',
    tagColor: '#30D158',
    title: 'Winning our 2-year SC/ST Special Court trial and securing full Rule-12 economic rehabilitation',
    views: '4.8k',
    helpful: '99%',
    comments: 84,
    duration: '22:15',
    compensationStatus: '₹8,25,000 Disbursed',
  },
  {
    id: 2,
    author: 'Pooja Rathod & Family',
    initials: 'PR',
    avatarColor: '#30D158',
    location: 'Gulbarga, Karnataka',
    tag: 'WITNESS PROTECTION SUCCESS',
    tagColor: '#FF9500',
    title: 'How 24/7 armed police escort under Section 15A protected our family until testimony concluded',
    views: '3.2k',
    helpful: '97%',
    comments: 56,
    duration: '18:40',
    compensationStatus: 'Full Protection Executed',
  },
  {
    id: 3,
    author: 'Babulal Meghwal',
    initials: 'BM',
    avatarColor: '#FF6B6B',
    location: 'Alwar, Rajasthan',
    tag: 'ANTI-BOYCOTT VICTORY',
    tagColor: '#5856D6',
    title: 'Defeating a village social boycott with District Nodal Officer intervention and restoring water access',
    views: '5.1k',
    helpful: '98%',
    comments: 112,
    duration: '26:50',
    compensationStatus: 'Community Dignity Restored',
  },
];

const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 1,
    title: 'Empowered by Law: Demystifying Special Court Cross-Examinations',
    author: 'Adv. Sanjay Kamble (DLSA)',
    location: 'Pune Special Court',
    episode: 14,
    duration: '24:10',
    progress: 75,
    accentColor: '#5856D6',
  },
  {
    id: 2,
    title: 'From Intimidation to Courage: A Witness Story',
    author: 'Anita Valmiki',
    location: 'Indore, MP',
    episode: 9,
    duration: '31:00',
    progress: 0,
    accentColor: '#30D158',
    isNew: true,
  },
  {
    id: 3,
    title: 'Claiming Your Statutory Welfare: Step-by-Step Guide to Rule 12',
    author: 'Rameshwar T. (Rehab Officer)',
    location: 'Nagpur',
    episode: 6,
    duration: '19:45',
    progress: 100,
    accentColor: '#FF9500',
  },
];

const articles: Article[] = [
  {
    id: 1,
    author: 'Kavita D.',
    initials: 'KD',
    avatarColor: '#5AC8FA',
    avatarBg: '#1a1a2e',
    location: 'Kolhapur, Maharashtra',
    tag: 'REHABILITATION',
    tagColor: '#30D158',
    iconBg: '#1a2e1a',
    title: 'How our self-help group rebuilt our livelihood after land dispossession',
    preview:
      'With the government rehabilitation grant and psychological grounding from Elevana AI, we established a collective agricultural enterprise...',
    readTime: '6 min read',
    claps: 642,
  },
  {
    id: 2,
    author: 'Dr. Mohan Sonawane',
    initials: 'MS',
    avatarColor: '#30D158',
    avatarBg: '#1a2e1a',
    location: 'Aurangabad',
    tag: 'TRAUMA OVERCOMING',
    tagColor: '#5856D6',
    iconBg: '#1a1a2e',
    title: 'Overcoming trial-induced insomnia: 5 cognitive strategies that saved my health',
    preview:
      'Preparing for court dates triggered severe panic. Here is how EMDR and bilateral breathwork restored my sleep and focus...',
    readTime: '8 min read',
    claps: 891,
  },
  {
    id: 3,
    author: 'Sunita & Deepak',
    initials: 'SD',
    avatarColor: '#FF6B6B',
    avatarBg: '#2e1a1a',
    location: 'Belagavi, Karnataka',
    tag: 'LEGAL ADVOCACY',
    tagColor: '#FF6B6B',
    iconBg: '#2e1a1a',
    title: 'Why you should never hesitate to demand DSP-level investigation under Rule 7',
    preview:
      'When our initial complaint was delayed, citing Rule 7 of the PoA rules changed everything. Here is the exact procedure...',
    readTime: '7 min read',
    claps: 1204,
  },
];

const stateStats: StateImpactStat[] = [
  { flag: '🇮🇳', state: 'Maharashtra', casesSupported: 1420, reliefDisbursed: '₹6.2 Cr' },
  { flag: '🇮🇳', state: 'Karnataka', casesSupported: 980, reliefDisbursed: '₹4.1 Cr' },
  { flag: '🇮🇳', state: 'Rajasthan', casesSupported: 840, reliefDisbursed: '₹3.8 Cr' },
  { flag: '🇮🇳', state: 'Madhya Pradesh', casesSupported: 790, reliefDisbursed: '₹3.1 Cr' },
  { flag: '🇮🇳', state: 'Tamil Nadu', casesSupported: 510, reliefDisbursed: '₹2.4 Cr' },
  { flag: '🇮🇳', state: 'Uttar Pradesh', casesSupported: 680, reliefDisbursed: '₹2.9 Cr' },
];

const SuccessNetwork: React.FC = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState<NavSection>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [submitType, setSubmitType] = useState<SubmitType>('article');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyDistrict, setStoryDistrict] = useState('');
  const [clapCounts, setClapCounts] = useState<{ [id: number]: number }>({});

  const handleClap = (articleId: number, baseClaps: number) => {
    setClapCounts((prev) => ({
      ...prev,
      [articleId]: (prev[articleId] ?? baseClaps) + 1,
    }));
  };

  const handleSubmitStory = () => {
    if (!storyTitle.trim() || !storyContent.trim()) {
      Alert.alert('Incomplete', 'Please provide a title and story description.');
      return;
    }
    Alert.alert(
      '🌟 Victory Journey Submitted!',
      'Thank you for inspiring fellow survivors. Your story has been queued for anonymization and publication.',
      [{ text: 'OK', onPress: () => setShowShareModal(false) }]
    );
    setStoryTitle('');
    setStoryContent('');
    setStoryDistrict('');
  };

  const navItems: { key: NavSection; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'milestones', label: '🏛️ Victories' },
    { key: 'podcasts', label: '🎙️ Podcasts' },
    { key: 'articles', label: '📝 Articles' },
    { key: 'rehabilitation', label: '🌱 Rehab' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Success Network</Text>
          <Text style={styles.headerSubtitle}>Justice Milestones & Survivor Victories</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Impact Numbers Banner */}
      <View style={styles.impactBanner}>
        <View style={styles.impactCol}>
          <Text style={styles.impactNum}>4,820+</Text>
          <Text style={styles.impactLabel}>Victims Monitored</Text>
        </View>
        <View style={styles.impactDivider} />
        <View style={styles.impactCol}>
          <Text style={styles.impactNum}>₹18.6 Cr</Text>
          <Text style={styles.impactLabel}>Relief Fast-Tracked</Text>
        </View>
        <View style={styles.impactDivider} />
        <View style={styles.impactCol}>
          <Text style={styles.impactNum}>94%</Text>
          <Text style={styles.impactLabel}>Trial Distress Relief</Text>
        </View>
      </View>

      {/* Nav */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.navContainer}
        contentContainerStyle={styles.navContent}
      >
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.navPill, activeSection === item.key && styles.activePill]}
            onPress={() => setActiveSection(item.key)}
          >
            <Text style={[styles.navPillText, activeSection === item.key && styles.activePillText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Court & Justice Victories */}
        {(activeSection === 'all' || activeSection === 'milestones') && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Landmark Justice Milestones</Text>
            {justiceStories.map((story) => (
              <View key={story.id} style={styles.storyCard}>
                <View style={styles.storyThumb}>
                  <View style={styles.compBadge}>
                    <Text style={styles.compBadgeText}>⚖️ {story.compensationStatus}</Text>
                  </View>
                  <View style={styles.playCircle}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{story.duration}</Text>
                  </View>
                </View>

                <View style={styles.storyBody}>
                  <Text style={[styles.storyTag, { color: story.tagColor }]}>{story.tag}</Text>
                  <Text style={styles.storyTitle}>{story.title}</Text>
                  <View style={styles.storyMeta}>
                    <View style={[styles.avatar, { backgroundColor: '#1a1a2e' }]}>
                      <Text style={[styles.avatarText, { color: story.avatarColor }]}>
                        {story.initials}
                      </Text>
                    </View>
                    <Text style={styles.storyAuthor}>
                      {story.author} · {story.location}
                    </Text>
                  </View>
                  <View style={styles.storyStats}>
                    <Text style={styles.storyStat}>
                      <Text style={styles.statValue}>{story.views}</Text> listens
                    </Text>
                    <Text style={styles.storyStat}>
                      <Text style={styles.statValue}>{story.helpful}</Text> found inspiring
                    </Text>
                    <Text style={styles.storyStat}>
                      <Text style={styles.statValue}>{story.comments}</Text> reflections
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Podcasts */}
        {(activeSection === 'all' || activeSection === 'podcasts') && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Empowerment Podcasts & Legal Dialogues</Text>
            {podcastEpisodes.map((ep) => (
              <TouchableOpacity key={ep.id} style={styles.podcastCard}>
                <View style={[styles.podIcon, { backgroundColor: ep.accentColor + '22' }]}>
                  <Text style={styles.podIconEmoji}>🎙️</Text>
                </View>
                <View style={styles.podInfo}>
                  <Text style={styles.podTitle} numberOfLines={1}>{ep.title}</Text>
                  <Text style={styles.podSub}>
                    {ep.author} · {ep.location} · Ep. {ep.episode}
                  </Text>
                  <View style={styles.podProgressBar}>
                    <View
                      style={[
                        styles.podProgressFill,
                        { width: `${ep.progress}%` as any, backgroundColor: ep.accentColor },
                      ]}
                    />
                  </View>
                  <Text style={styles.podTime}>
                    {ep.duration}
                    {ep.isNew ? ' · New Release' : ` · ${ep.progress}% Completed`}
                  </Text>
                </View>
                <View style={[styles.podPlayBtn, { backgroundColor: ep.accentColor }]}>
                  <Text style={styles.podPlayIcon}>▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Articles & Personal Essays */}
        {(activeSection === 'all' || activeSection === 'articles' || activeSection === 'rehabilitation') && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Survivor Guides & Recovery Articles</Text>
            {articles.map((article) => (
              <View key={article.id} style={styles.articleCard}>
                <View style={styles.articleTop}>
                  <View style={[styles.articleIconWrap, { backgroundColor: article.iconBg }]}>
                    <Text style={styles.articleIconEmoji}>📝</Text>
                  </View>
                  <View style={styles.articleInfo}>
                    <Text style={[styles.articleTag, { color: article.tagColor }]}>
                      {article.tag}
                    </Text>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                  </View>
                </View>
                <Text style={styles.articlePreview}>{article.preview}</Text>
                <View style={styles.articleFooter}>
                  <View style={[styles.articleAvatar, { backgroundColor: article.avatarBg }]}>
                    <Text style={[styles.articleAvatarText, { color: article.avatarColor }]}>
                      {article.initials}
                    </Text>
                  </View>
                  <Text style={styles.articleAuthor}>
                    {article.author} · {article.location} · {article.readTime}
                  </Text>
                  <TouchableOpacity
                    style={styles.clapButton}
                    onPress={() => handleClap(article.id, article.claps)}
                  >
                    <Text style={styles.clapText}>
                      👏 {clapCounts[article.id] ?? article.claps}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* State Impact Map & Stats */}
        {activeSection === 'all' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>State-Wise Protection & Relief Impact</Text>
            <View style={styles.globalCard}>
              <View style={styles.globeRow}>
                <View style={styles.globeIcon}>
                  <Text style={styles.globeEmoji}>🏛️</Text>
                </View>
                <View>
                  <Text style={styles.globeTitle}>National Special Cell Integration</Text>
                  <Text style={styles.globeSub}>Elevana AI active across 18 State Welfare Depts</Text>
                </View>
              </View>
              <View style={styles.stateChips}>
                {stateStats.map((s) => (
                  <View key={s.state} style={styles.stateChip}>
                    <Text style={styles.stateFlag}>{s.flag}</Text>
                    <Text style={styles.stateText}>{s.state} · {s.casesSupported} cases ({s.reliefDisbursed})</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Share CTA */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.shareBtn} onPress={() => setShowShareModal(true)}>
            <Text style={styles.shareBtnText}>+ Share Your Justice or Recovery Journey</Text>
          </TouchableOpacity>
          <Text style={styles.shareSub}>Your courage breaks the silence and guides fellow survivors to justice</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Your Journey to Justice</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Share how legal aid, police protection, or counseling helped you overcome adversity.
            </Text>

            <View style={styles.typeRow}>
              {(['article', 'milestone', 'podcast'] as SubmitType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typePill, submitType === t && styles.activeTypePill]}
                  onPress={() => setSubmitType(t)}
                >
                  <Text style={[styles.typePillText, submitType === t && styles.activeTypePillText]}>
                    {t === 'article' ? '📝 Article' : t === 'milestone' ? '🏛️ Court Victory' : '🎙️ Audio'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Story Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., How we secured witness protection & won our trial"
              placeholderTextColor="#8E8E93"
              value={storyTitle}
              onChangeText={setStoryTitle}
            />

            <Text style={styles.inputLabel}>District / State (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Wardha, Maharashtra"
              placeholderTextColor="#8E8E93"
              value={storyDistrict}
              onChangeText={setStoryDistrict}
            />

            <Text style={styles.inputLabel}>Your Experience & Insights *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Detail your legal or recovery steps, what advice you would give other victims..."
              placeholderTextColor="#8E8E93"
              value={storyContent}
              onChangeText={setStoryContent}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!storyTitle.trim() || !storyContent.trim()) && styles.disabledBtn,
              ]}
              onPress={handleSubmitStory}
              disabled={!storyTitle.trim() || !storyContent.trim()}
            >
              <Text style={styles.submitBtnText}>Submit Anonymously for Publication</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  backButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: '600' },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  placeholder: { width: 40 },
  impactBanner: {
    flexDirection: 'row',
    backgroundColor: '#1A241A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#285E28',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  impactCol: { alignItems: 'center' },
  impactNum: { fontSize: 15, fontWeight: 'bold', color: '#30D158' },
  impactLabel: { fontSize: 10, color: '#A8E6CF', marginTop: 1 },
  impactDivider: { width: 1, height: 24, backgroundColor: '#285E28' },
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
  activePill: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  navPillText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activePillText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8E8E93',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  storyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  storyThumb: {
    height: 140,
    backgroundColor: '#14202C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#30D158',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  compBadgeText: { fontSize: 11, color: '#000000', fontWeight: 'bold' },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,122,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 18, color: '#FFFFFF', marginLeft: 3 },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: { fontSize: 11, color: '#FFFFFF' },
  storyBody: { padding: 14 },
  storyTag: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  storyTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, lineHeight: 20 },
  storyMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 10, fontWeight: 'bold' },
  storyAuthor: { fontSize: 12, color: '#8E8E93', flex: 1 },
  storyStats: { flexDirection: 'row', gap: 14 },
  storyStat: { fontSize: 11, color: '#8E8E93' },
  statValue: { color: '#FFFFFF', fontWeight: '600' },
  podcastCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  podIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podIconEmoji: { fontSize: 22 },
  podInfo: { flex: 1 },
  podTitle: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  podSub: { fontSize: 11, color: '#8E8E93', marginBottom: 6 },
  podProgressBar: {
    height: 3,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    marginBottom: 4,
  },
  podProgressFill: { height: 3, borderRadius: 2 },
  podTime: { fontSize: 10, color: '#8E8E93' },
  podPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podPlayIcon: { fontSize: 12, color: '#FFFFFF', marginLeft: 2 },
  articleCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  articleTop: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  articleIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleIconEmoji: { fontSize: 20 },
  articleInfo: { flex: 1 },
  articleTag: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  articleTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', lineHeight: 18 },
  articlePreview: { fontSize: 12, color: '#A0A0A0', lineHeight: 17 },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
  },
  articleAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleAvatarText: { fontSize: 10, fontWeight: 'bold' },
  articleAuthor: { fontSize: 11, color: '#8E8E93', flex: 1 },
  clapButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clapText: { fontSize: 11, color: '#FFFFFF' },
  globalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  globeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  globeIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1A2A3A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeEmoji: { fontSize: 20 },
  globeTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  globeSub: { fontSize: 11, color: '#8E8E93' },
  stateChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stateChip: {
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stateFlag: { fontSize: 12 },
  stateText: { fontSize: 11, color: '#A0A0A0' },
  shareBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 6,
  },
  shareBtnText: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  shareSub: { fontSize: 11, color: '#8E8E93', textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  modalCloseText: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
  modalSub: { fontSize: 12, color: '#8E8E93', marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#2C2C2E',
  },
  activeTypePill: { backgroundColor: '#007AFF' },
  typePillText: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
  activeTypePillText: { color: '#FFFFFF', fontWeight: 'bold' },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#FFFFFF', marginBottom: 4, marginTop: 8 },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  textArea: { minHeight: 90 },
  submitBtn: {
    backgroundColor: '#30D158',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledBtn: { backgroundColor: '#2C2C2E' },
  submitBtnText: { fontSize: 14, fontWeight: 'bold', color: '#000000' },
});

export default SuccessNetwork;