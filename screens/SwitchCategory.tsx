// SwitchCategory.tsx
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
    id: '0',
    name: 'Default - General Trauma & Crisis Support',
    hashtag: '#ElevanaCare',
    icon: '🌟',
    color: '#007AFF',
    description: 'Comprehensive emotional support, crisis de-escalation & general guidance'
  },
  {
    id: '1',
    name: 'Sexual Violence & Assault Recovery',
    hashtag: '#SurvivorsCare',
    icon: '💜',
    color: '#9B59B6',
    description: 'Specialized trauma-informed healing, medical aid & legal protections'
  },
  {
    id: '2',
    name: 'Domestic Abuse & Family Harassment',
    hashtag: '#SafetyFirst',
    icon: '🛡️',
    color: '#E74C3C',
    description: 'Safety planning, emergency protection orders & emotional sanctuary'
  },
  {
    id: '3',
    name: 'Threat & Active Witness Intimidation',
    hashtag: '#WitnessProtection',
    icon: '🚨',
    color: '#FF9500',
    description: 'Immediate police escort requests, safety protocols & threat de-escalation'
  },
  {
    id: '4',
    name: 'Court Trial & Legal Anxiety',
    hashtag: '#TrialAnxiety',
    icon: '🏛️',
    color: '#3498DB',
    description: 'Coping with cross-examinations, testimony stress & DLSA legal aid'
  },
  {
    id: '5',
    name: 'SC/ST Atrocity Victim Support',
    hashtag: '#SCSTPoAAct',
    icon: '⚖️',
    color: '#4A90E2',
    description: 'Dedicated assistance under Scheduled Castes & Scheduled Tribes Act 1989'
  },
  {
    id: '6',
    name: 'Violent Incident & Physical Trauma',
    hashtag: '#TraumaHealing',
    icon: '🩹',
    color: '#1ABC9C',
    description: 'Psychological recovery from assault, grievous hurt, and arson'
  },
  {
    id: '7',
    name: 'Police Complaint & FIR Registration',
    hashtag: '#FIRSupport',
    icon: '🚔',
    color: '#5856D6',
    description: 'Support during zero-FIR filing, investigation follow-up & police visits'
  },
  {
    id: '8',
    name: 'Social Boycott & Hate Crimes',
    hashtag: '#AntiDiscrimination',
    icon: '🤝',
    color: '#2ECC71',
    description: 'Overcoming social ostracism, discrimination & restoring dignity'
  },
  {
    id: '9',
    name: 'Compensation & Welfare Entitlements',
    hashtag: '#RehabilitationAid',
    icon: '📑',
    color: '#F1C40F',
    description: 'Guidance on government compensation, statutory relief & rehabilitation'
  },
  {
    id: '10',
    name: 'Economic Hardship & Displacement',
    hashtag: '#LivelihoodRelief',
    icon: '🌾',
    color: '#D35400',
    description: 'Financial recovery assistance and livelihood restoration after trauma'
  },
  {
    id: '11',
    name: 'Psychological & Suicidal Crisis',
    hashtag: '#EmergencyIntervention',
    icon: '🆘',
    color: '#C0392B',
    description: 'Immediate 24/7 crisis de-escalation, suicide prevention & psychiatric aid'
  },
];

const SwitchCategory: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentCategory } = (route.params as any) || { currentCategory: 'Default - General Trauma & Crisis Support' };
  
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
        toValue: 0.96,
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
      (navigation as any).navigate('Main', { 
        selectedCategory: category.name 
      });
    }, 400);
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
          <Text style={styles.headerSubtitle}>Choose support context & AI focus</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Active: <Text style={styles.currentCategoryText}>{currentCategory}</Text>
        </Text>
        <Text style={styles.instructionSubText}>
          Select any category to tailor the AI guidance, resources, and clinical recommendations
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
  instructionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#141416',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  instructionText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 2,
  },
  currentCategoryText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  instructionSubText: {
    fontSize: 11,
    color: '#6E6E73',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  categoriesGrid: {
    gap: 10,
  },
  categoryCardContainer: {
    marginBottom: 2,
  },
  categoryCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  selectedCard: {
    backgroundColor: '#242A36',
    borderColor: '#007AFF',
  },
  currentCard: {
    backgroundColor: '#161B26',
    borderLeftWidth: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryHashtag: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  currentBadge: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 17,
    marginLeft: 30,
    marginTop: 2,
  },
  selectedIndicator: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default SwitchCategory;