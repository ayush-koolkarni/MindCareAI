import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_HOST } from '../utils/apiClient';

const DASS21_QUESTIONS = [
  "I found it hard to wind down",
  "I was aware of dryness of my mouth",
  "I couldn't seem to experience any positive feeling at all",
  "I experienced breathing difficulty",
  "I found it difficult to work up the initiative to do things",
  "I tended to over-react to situations",
  "I experienced trembling (e.g. in the hands)",
  "I felt that I was using a lot of nervous energy",
  "I was worried about situations in which I might panic and make a fool of myself",
  "I felt that I had nothing to look forward to",
  "I found myself getting agitated",
  "I found it difficult to relax",
  "I felt down-hearted and blue",
  "I was intolerant of anything that kept me from getting on with what I was doing",
  "I felt I was close to panic",
  "I was unable to become enthusiastic about anything",
  "I felt I wasn't worth much as a person",
  "I felt that I was rather touchy",
  "I was aware of the action of my heart in the absence of physical exertion",
  "I felt scared without any good reason",
  "I felt that life was meaningless"
];

// DASS scoring mapping (D, A, S)
const SCORING_MAP = {
  Depression: [3, 5, 10, 13, 16, 17, 21],
  Anxiety: [2, 4, 7, 9, 15, 19, 20],
  Stress: [1, 6, 8, 11, 12, 14, 18],
};

const OPTIONS = [
  { value: 0, label: '0 - Did not apply to me at all' },
  { value: 1, label: '1 - Applied to me to some degree, or some of the time' },
  { value: 2, label: '2 - Applied to me to a considerable degree, or a good part of time' },
  { value: 3, label: '3 - Applied to me very much, or most of the time' },
];

export default function Dass21OnboardingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token, user } = route.params || {};

  const [responses, setResponses] = useState<number[]>(new Array(21).fill(-1));
  const [isLoading, setIsLoading] = useState(false);

  const handleOptionSelect = (qIndex: number, val: number) => {
    const newResp = [...responses];
    newResp[qIndex] = val;
    setResponses(newResp);
  };

  const calculateScores = () => {
    let d = 0, a = 0, s = 0;
    SCORING_MAP.Depression.forEach(q => d += responses[q - 1]);
    SCORING_MAP.Anxiety.forEach(q => a += responses[q - 1]);
    SCORING_MAP.Stress.forEach(q => s += responses[q - 1]);
    // DASS-21 scores are multiplied by 2 to match DASS-42
    return { depression: d * 2, anxiety: a * 2, stress: s * 2 };
  };

  const handleSubmit = async () => {
    if (responses.includes(-1)) {
      Alert.alert('Incomplete', 'Please answer all 21 questions to proceed.');
      return;
    }

    if (!token) {
      Alert.alert('Auth Error', 'Missing authentication token. Please login again.');
      navigation.replace('Login');
      return;
    }

    setIsLoading(true);
    const scores = calculateScores();

    try {
      const response = await fetch(`http://${API_HOST}:5003/api/dass21`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ responses, scores }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        Alert.alert('Assessment Complete', 'Your baseline distress score has been securely saved.');
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.error || 'Failed to save assessment');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Cannot connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DASS-21 Assessment</Text>
        <Text style={styles.subtitle}>Please read each statement and select a number 0, 1, 2 or 3 which indicates how much the statement applied to you over the past week.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {DASS21_QUESTIONS.map((question, index) => (
          <View key={index} style={styles.questionCard}>
            <Text style={styles.questionText}>{index + 1}. {question}</Text>
            
            <View style={styles.optionsContainer}>
              {OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.optionButton,
                    responses[index] === opt.value && styles.optionButtonActive
                  ]}
                  onPress={() => handleOptionSelect(index, opt.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    responses[index] === opt.value && styles.optionTextActive
                  ]}>{opt.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.optionHint}>
              {responses[index] !== -1 ? OPTIONS.find(o => o.value === responses[index])?.label : 'Select an option'}
            </Text>
          </View>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.primaryButton, responses.includes(-1) && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading || responses.includes(-1)}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Submit Assessment</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
            <Text style={styles.secondaryButtonText}>Skip & Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    backgroundColor: '#1C1C1E',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4A90E2', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#A0A0A0', lineHeight: 18 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  questionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  questionText: { fontSize: 16, color: '#FFFFFF', marginBottom: 16, fontWeight: '500' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  optionButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  optionButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  optionText: { color: '#8E8E93', fontSize: 16, fontWeight: 'bold' },
  optionTextActive: { color: '#FFFFFF' },
  optionHint: { fontSize: 12, color: '#8E8E93', textAlign: 'center', marginTop: 4, fontStyle: 'italic' },
  actions: { marginTop: 10, gap: 16 },
  primaryButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: { backgroundColor: '#2C2C2E' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  secondaryButtonText: { color: '#8E8E93', fontSize: 15, fontWeight: '600' },
});
