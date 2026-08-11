//SwitchCategory.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Category {
  id: string;
  name: string;
  hashtag: string;
  icon: string;
  color: string;
  description: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Exam Stress',
    hashtag: '#ExamStress',
    icon: '📚',
    color: '#FF6B6B',
    description: 'Academic pressure and test anxiety support'
  },
  {
    id: '2',
    name: 'Relationship Issues',
    hashtag: '#RelationshipIssues',
    icon: '💔',
    color: '#4ECDC4',
    description: 'Dating, friendships, and family conflicts'
  },
  {
    id: '3',
    name: 'Social Anxiety',
    hashtag: '#SocialAnxiety',
    icon: '😰',
    color: '#45B7D1',
    description: 'Fear of social situations and interactions'
  },
  {
    id: '4',
    name: 'Career Confusion',
    hashtag: '#CareerConfusion',
    icon: '🤔',
    color: '#96CEB4',
    description: 'Uncertainty about future and career choices'
  },
  {
    id: '5',
    name: 'Financial Stress',
    hashtag: '#FinancialStress',
    icon: '💸',
    color: '#FECA57',
    description: 'Money worries and financial planning'
  },
  {
    id: '6',
    name: 'Body Image',
    hashtag: '#BodyImage',
    icon: '🪞',
    color: '#FF9FF3',
    description: 'Self-image and appearance concerns'
  },
  {
    id: '7',
    name: 'Sleep Issues',
    hashtag: '#SleepIssues',
    icon: '😴',
    color: '#54A0FF',
    description: 'Insomnia and sleep schedule problems'
  },
  {
    id: '8',
    name: 'Family Pressure',
    hashtag: '#FamilyPressure',
    icon: '👨‍👩‍👧‍👦',
    color: '#5F27CD',
    description: 'Family expectations and conflicts'
  },
  {
    id: '9',
    name: 'FOMO',
    hashtag: '#FOMO',
    icon: '📱',
    color: '#00D2D3',
    description: 'Fear of missing out and social comparison'
  },
  {
    id: '10',
    name: 'Procrastination',
    hashtag: '#Procrastination',
    icon: '⏰',
    color: '#FF7675',
    description: 'Time management and motivation issues'
  },
  {
    id: '11',
    name: 'Identity Crisis',
    hashtag: '#IdentityCrisis',
    icon: '🎭',
    color: '#A29BFE',
    description: 'Self-discovery and identity confusion'
  },
  {
    id: '12',
    name: 'Loneliness',
    hashtag: '#Loneliness',
    icon: '😔',
    color: '#6C5CE7',
    description: 'Feeling isolated and disconnected'
  },
  {
    id: '13',
    name: 'Perfectionism',
    hashtag: '#Perfectionism',
    icon: '🎯',
    color: '#FD79A8',
    description: 'Unrealistic standards and self-criticism'
  },
  {
    id: '14',
    name: 'Peer Pressure',
    hashtag: '#PeerPressure',
    icon: '👫',
    color: '#FDCB6E',
    description: 'Social influence and conformity stress'
  },
  {
    id: '15',
    name: 'Time Management',
    hashtag: '#TimeManagement',
    icon: '⌚',
    color: '#E17055',
    description: 'Balancing studies, work, and personal life'
  },
  {
    id: '16',
    name: 'General Support',
    hashtag: '#GeneralSupport',
    icon: '🤗',
    color: '#00B894',
    description: 'Overall mental wellness and support'
  },
];

const SwitchCategory: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentCategory } = (route.params as any) || { currentCategory: 'General Support' };
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scaleAnimations] = useState(
    categories.reduce((acc, category) => {
      acc[category.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category.id);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnimations[category.id], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[category.id], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate back with the selected category
    setTimeout(() => {
      navigation.navigate('Main' as never, { 
        selectedCategory: category.name 
        } as never);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Switch Category</Text>
          <Text style={styles.headerSubtitle}>Choose your support focus</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Current: <Text style={styles.currentCategoryText}>{currentCategory}</Text>
        </Text>
        <Text style={styles.instructionSubText}>
          Select a category to start a fresh conversation tailored to your specific needs
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Animated.View
              key={category.id}
              style={[
                styles.categoryCardContainer,
                {
                  transform: [{ scale: scaleAnimations[category.id] }],
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCard,
                  currentCategory === category.name && styles.currentCard,
                  { borderLeftColor: category.color }
                ]}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={[styles.categoryHashtag, { color: category.color }]}>
                      {category.hashtag}
                    </Text>
                  </View>
                  {currentCategory === category.name && (
                    <Text style={styles.currentBadge}>Current</Text>
                  )}
                </View>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                
                {selectedCategory === category.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedText}>✓ Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Text style={styles.bottomText}>
          💡 Tip: Each category provides specialized support and resources
        </Text>
      </View>
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
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
  },
  instructionText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 5,
  },
  currentCategoryText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  instructionSubText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCardContainer: {
    marginBottom: 4,
  },
  categoryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#2C2C2E',
    shadowColor: '#007AFF',
    shadowOpacity: 0.5,
    elevation: 5,
  },
  currentCard: {
    backgroundColor: '#1A1A2E',
    borderLeftWidth: 6,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  categoryHashtag: {
    fontSize: 14,
    fontWeight: '600',
  },
  currentBadge: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginLeft: 36,
  },
  selectedIndicator: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#38383A',
  },
  bottomText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SwitchCategory;