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

type NavSection = 'all' | 'videos' | 'podcasts' | 'articles' | 'live';
type SubmitType = 'video' | 'podcast' | 'article';

interface VideoStory {
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
  isLive?: boolean;
  watching?: number;
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
  isCompleted?: boolean;
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

interface CountryStat {
  flag: string;
  name: string;
  count: number;
}

const videoStories: VideoStory[] = [
  {
    id: 1,
    author: 'Sofia L.',
    initials: 'SL',
    avatarColor: '#5AC8FA',
    location: 'Amsterdam, Netherlands',
    tag: 'ANXIETY · RECOVERY',
    tagColor: '#5856D6',
    title: 'How I stopped panic attacks from ruling my life — 3 years later',
    views: '1.2k',
    helpful: '94%',
    comments: 47,
    duration: '24:18',
    isLive: true,
    watching: 38,
  },
  {
    id: 2,
    author: 'Yuki T.',
    initials: 'YT',
    avatarColor: '#30D158',
    location: 'Seoul, South Korea',
    tag: 'BURNOUT',
    tagColor: '#FF9500',
    title: 'Quitting a corporate job that was destroying my mental health',
    views: '3.4k',
    helpful: '97%',
    comments: 112,
    duration: '31:44',
  },
];

const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 1,
    title: 'From rock bottom to running marathons',
    author: 'Marcus T.',
    location: 'Lagos, Nigeria',
    episode: 12,
    duration: '28:14',
    progress: 62,
    accentColor: '#5856D6',
  },
  {
    id: 2,
    title: 'Learning to trust again after trauma',
    author: 'Priya K.',
    location: 'Mumbai, India',
    episode: 7,
    duration: '41:02',
    progress: 0,
    accentColor: '#30D158',
    isNew: true,
  },
  {
    id: 3,
    title: 'Beating depression without medication',
    author: 'James W.',
    location: 'Toronto, Canada',
    episode: 4,
    duration: '19:38',
    progress: 100,
    accentColor: '#FF9500',
    isCompleted: true,
  },
];

const articles: Article[] = [
  {
    id: 1,
    author: 'Aiko O.',
    initials: 'AO',
    avatarColor: '#5AC8FA',
    avatarBg: '#1a1a2e',
    location: 'Tokyo, Japan',
    tag: 'DEPRESSION',
    tagColor: '#5856D6',
    iconBg: '#1a1a2e',
    title: 'The 5 things that actually helped me get out of bed every morning',
    preview:
      'I spent 18 months barely leaving my apartment. Here is what finally worked — not what I expected...',
    readTime: '6 min read',
    claps: 312,
  },
  {
    id: 2,
    author: 'Remi B.',
    initials: 'RB',
    avatarColor: '#30D158',
    avatarBg: '#1a2e1a',
    location: 'Nairobi, Kenya',
    tag: 'GRIEF',
    tagColor: '#30D158',
    iconBg: '#1a2e1a',
    title: 'Losing my mother and finding myself — a year of healing in letters',
    preview:
      'Writing unsent letters to her changed something in me I cannot fully explain. Maybe it will help you too...',
    readTime: '9 min read',
    claps: 541,
  },
  {
    id: 3,
    author: 'Carlos M.',
    initials: 'CM',
    avatarColor: '#FF6B6B',
    avatarBg: '#2e1a1a',
    location: 'São Paulo, Brazil',
    tag: 'PTSD',
    tagColor: '#FF6B6B',
    iconBg: '#2e1a1a',
    title: 'Two years of EMDR therapy — an honest review from a skeptic',
    preview:
      'I went in rolling my eyes. I came out crying — in the best way. This is my unfiltered experience...',
    readTime: '11 min read',
    claps: 887,
  },
];

const countryStats: CountryStat[] = [
  { flag: '🇺🇸', name: 'United States', count: 412 },
  { flag: '🇮🇳', name: 'India', count: 289 },
  { flag: '🇬🇧', name: 'UK', count: 174 },
  { flag: '🇧🇷', name: 'Brazil', count: 138 },
  { flag: '🇳🇬', name: 'Nigeria', count: 96 },
  { flag: '🇦🇺', name: 'Australia', count: 81 },
];

const SuccessNetwork: React.FC = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState<NavSection>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [submitType, setSubmitType] = useState<SubmitType>('article');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [clapCounts, setClapCounts] = useState<{ [id: number]: number }>({});

  const handleClap = (articleId: number, baseClaps: number) => {
    setClapCounts((prev) => ({
      ...prev,
      [articleId]: (prev[articleId] ?? baseClaps) + 1,
    }));
  };

  const handleSubmitStory = () => {
    if (!storyTitle.trim() || !storyContent.trim()) return;
    Alert.alert(
      'Story submitted!',
      'Thank you for sharing your journey. Our team will review your story and publish it shortly.',
      [{ text: 'OK', onPress: () => setShowShareModal(false) }]
    );
    setStoryTitle('');
    setStoryContent('');
  };

  const showVideos = activeSection === 'all' || activeSection === 'videos' || activeSection === 'live';
  const showPodcasts = activeSection === 'all' || activeSection === 'podcasts';
  const showArticles = activeSection === 'all' || activeSection === 'articles';

  const navItems: { key: NavSection; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'videos', label: 'Videos' },
    { key: 'podcasts', label: 'Podcasts' },
    { key: 'articles', label: 'Articles' },
    { key: 'live', label: '● Live Now' },
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
          <Text style={styles.headerSubtitle}>
            <Text style={styles.onlineDot}>● </Text>
            2,841 members sharing their journey
          </Text>
        </View>
        <View style={styles.placeholder} />
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
        {/* Videos / Featured */}
        {showVideos && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {activeSection === 'live' ? 'Live Now' : 'Featured stories'}
            </Text>
            {videoStories
              .filter((v) => activeSection !== 'live' || v.isLive)
              .map((video) => (
                <TouchableOpacity key={video.id} style={styles.videoCard}>
                  <View style={styles.videoThumb}>
                    {video.isLive && (
                      <View style={styles.liveBadge}>
                        <Text style={styles.liveBadgeText}>● LIVE</Text>
                      </View>
                    )}
                    <View style={styles.playCircle}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>
                        {video.isLive ? `${video.watching} watching` : video.duration}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.videoBody}>
                    <Text style={[styles.videoTag, { color: video.tagColor }]}>{video.tag}</Text>
                    <Text style={styles.videoTitle}>{video.title}</Text>
                    <View style={styles.videoMeta}>
                      <View style={[styles.avatar, { backgroundColor: '#1a1a2e' }]}>
                        <Text style={[styles.avatarText, { color: video.avatarColor }]}>
                          {video.initials}
                        </Text>
                      </View>
                      <Text style={styles.videoAuthor}>
                        {video.author} · {video.location}
                      </Text>
                    </View>
                    <View style={styles.videoStats}>
                      <Text style={styles.videoStat}>
                        <Text style={styles.videoStatValue}>{video.views}</Text> views
                      </Text>
                      <Text style={styles.videoStat}>
                        <Text style={styles.videoStatValue}>{video.helpful}</Text> helpful
                      </Text>
                      <Text style={styles.videoStat}>
                        <Text style={styles.videoStatValue}>{video.comments}</Text> comments
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* Podcasts */}
        {showPodcasts && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Podcast episodes</Text>
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
                    {ep.isNew ? ' · New' : ep.isCompleted ? ' · Completed' : ` · ${ep.progress}% complete`}
                  </Text>
                </View>
                <View style={[styles.podPlayBtn, { backgroundColor: ep.accentColor }]}>
                  <Text style={styles.podPlayIcon}>▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Articles */}
        {showArticles && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>User articles</Text>
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

        {/* Global Stats */}
        {(activeSection === 'all') && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Stories from around the world</Text>
            <View style={styles.globalCard}>
              <View style={styles.globeRow}>
                <View style={styles.globeIcon}>
                  <Text style={styles.globeEmoji}>🌍</Text>
                </View>
                <View>
                  <Text style={styles.globeTitle}>Global voices</Text>
                  <Text style={styles.globeSub}>Stories from 74 countries this month</Text>
                </View>
              </View>
              <View style={styles.countryChips}>
                {countryStats.map((c) => (
                  <View key={c.name} style={styles.countryChip}>
                    <Text style={styles.chipFlag}>{c.flag}</Text>
                    <Text style={styles.chipText}>{c.name} · {c.count}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Share CTA */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.shareBtn} onPress={() => setShowShareModal(true)}>
            <Text style={styles.shareBtnText}>+ Share Your Story</Text>
          </TouchableOpacity>
          <Text style={styles.shareSub}>Your journey could be the hope someone needs today</Text>
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
              <Text style={styles.modalTitle}>Share Your Story</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Choose how you'd like to share your recovery journey
            </Text>

            <View style={styles.typeRow}>
              {(['article', 'podcast', 'video'] as SubmitType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typePill, submitType === t && styles.activeTypePill]}
                  onPress={() => setSubmitType(t)}
                >
                  <Text style={[styles.typePillText, submitType === t && styles.activeTypePillText]}>
                    {t === 'article' ? '📝 Article' : t === 'podcast' ? '🎙️ Podcast' : '🎬 Video'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder={
                submitType === 'article'
                  ? 'e.g. How I overcame social anxiety...'
                  : submitType === 'podcast'
                  ? 'e.g. My journey through depression'
                  : 'e.g. Life after addiction — 2 years free'
              }
              placeholderTextColor="#8E8E93"
              value={storyTitle}
              onChangeText={setStoryTitle}
            />

            <Text style={styles.inputLabel}>
              {submitType === 'article' ? 'Your story' : submitType === 'podcast' ? 'Episode description' : 'Video description'}
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Share the details of your journey — what happened, what helped, and what you'd tell others going through the same..."
              placeholderTextColor="#8E8E93"
              value={storyContent}
              onChangeText={setStoryContent}
              multiline
              textAlignVertical="top"
            />

            {submitType !== 'article' && (
              <View style={styles.uploadArea}>
                <Text style={styles.uploadIcon}>
                  {submitType === 'podcast' ? '🎙️' : '🎬'}
                </Text>
                <Text style={styles.uploadText}>
                  Tap to upload your {submitType} file
                </Text>
                <Text style={styles.uploadSub}>MP3, MP4 · Max 500MB</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!storyTitle.trim() || !storyContent.trim()) && styles.disabledBtn,
              ]}
              onPress={handleSubmitStory}
              disabled={!storyTitle.trim() || !storyContent.trim()}
            >
              <Text style={styles.submitBtnText}>Submit for Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 0.5,
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
  onlineDot: { color: '#30D158' },
  placeholder: { width: 40 },

  // Nav
  navContainer: {
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 0.5,
    borderBottomColor: '#38383A',
  },
  navContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 6, flexDirection: 'row' },
  navPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
  },
  activePill: { backgroundColor: '#5856D6' },
  navPillText: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
  activePillText: { color: '#FFFFFF' },

  content: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Video cards
  videoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#38383A',
  },
  videoThumb: {
    height: 160,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveBadgeText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  playCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.18)',
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
  videoBody: { padding: 14 },
  videoTag: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
  videoTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, lineHeight: 22 },
  videoMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 11, fontWeight: '600' },
  videoAuthor: { fontSize: 12, color: '#8E8E93', flex: 1 },
  videoStats: { flexDirection: 'row', gap: 16 },
  videoStat: { fontSize: 12, color: '#8E8E93' },
  videoStatValue: { color: '#FFFFFF', fontWeight: '600' },

  // Podcast cards
  podcastCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 0.5,
    borderColor: '#38383A',
  },
  podIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podIconEmoji: { fontSize: 24 },
  podInfo: { flex: 1 },
  podTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 3 },
  podSub: { fontSize: 12, color: '#8E8E93', marginBottom: 8 },
  podProgressBar: {
    height: 3,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    marginBottom: 5,
  },
  podProgressFill: { height: 3, borderRadius: 2 },
  podTime: { fontSize: 11, color: '#8E8E93' },
  podPlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podPlayIcon: { fontSize: 14, color: '#FFFFFF', marginLeft: 2 },

  // Article cards
  articleCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#38383A',
  },
  articleTop: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  articleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleIconEmoji: { fontSize: 22 },
  articleInfo: { flex: 1 },
  articleTag: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  articleTitle: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', lineHeight: 20 },
  articlePreview: { fontSize: 13, color: '#8E8E93', lineHeight: 19 },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#38383A',
  },
  articleAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleAvatarText: { fontSize: 10, fontWeight: '600' },
  articleAuthor: { fontSize: 12, color: '#8E8E93', flex: 1 },
  clapButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  clapText: { fontSize: 12, color: '#FFFFFF' },

  // Global card
  globalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#38383A',
  },
  globeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  globeIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#1a2a3a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globeEmoji: { fontSize: 22 },
  globeTitle: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  globeSub: { fontSize: 12, color: '#8E8E93' },
  countryChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  countryChip: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chipFlag: { fontSize: 14 },
  chipText: { fontSize: 12, color: '#8E8E93' },

  // Share CTA
  shareBtn: {
    backgroundColor: '#5856D6',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 6,
  },
  shareBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  shareSub: { fontSize: 12, color: '#8E8E93', textAlign: 'center' },

  // Modal
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
    marginBottom: 6,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  modalClose: {
    backgroundColor: '#2C2C2E',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600' },
  modalSub: { fontSize: 13, color: '#8E8E93', marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
  },
  activeTypePill: { backgroundColor: '#5856D6' },
  typePillText: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
  activeTypePillText: { color: '#FFFFFF' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  uploadArea: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#38383A',
    borderStyle: 'dashed',
  },
  uploadIcon: { fontSize: 28, marginBottom: 8 },
  uploadText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500', marginBottom: 4 },
  uploadSub: { fontSize: 12, color: '#8E8E93' },
  submitBtn: {
    backgroundColor: '#30D158',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#2C2C2E' },
  submitBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
});

export default SuccessNetwork;