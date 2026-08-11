//MentalHealthTests.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface MentalHealthTest {
  id: number;
  name: string;
  fullName: string;
  description: string;
  purpose: string;
  duration: string;
  questions: number;
  url: string;
  color: string;
  icon: string;
  disclaimer: string;
}

const mentalHealthTests: MentalHealthTest[] = [
  {
    id: 1,
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description: "A widely used screening tool for depression severity and symptoms over the past two weeks.",
    purpose: "Depression Screening",
    duration: "5-10 minutes",
    questions: 9,
    url: "https://www.mdcalc.com/calc/1725/phq9-patient-health-questionnaire9",
    color: "#FF6B6B",
    icon: "🧠",
    disclaimer: "This screening tool helps identify symptoms of depression but cannot diagnose clinical depression."
  },
  {
    id: 2,
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder 7-item Scale",
    description: "An effective screening tool for generalized anxiety disorder and measuring anxiety symptom severity.",
    purpose: "Anxiety Assessment",
    duration: "3-5 minutes",
    questions: 7,
    url: "https://www.mdcalc.com/calc/1727/gad7-general-anxiety-disorder7",
    color: "#4ECDC4",
    icon: "😰",
    disclaimer: "This tool screens for anxiety symptoms but professional evaluation is needed for diagnosis."
  },
  {
    id: 3,
    name: "GHQ-12",
    fullName: "General Health Questionnaire-12",
    description: "A brief screening instrument for detecting psychological distress and general mental wellness.",
    purpose: "General Mental Health",
    duration: "5-8 minutes",
    questions: 12,
    url: "https://psychology-tools.com/test/ghq-12",
    color: "#45B7D1",
    icon: "💭",
    disclaimer: "This questionnaire identifies psychological distress but is not a diagnostic tool."
  },
  {
    id: 4,
    name: "DASS-21",
    fullName: "Depression, Anxiety and Stress Scale-21",
    description: "Measures the severity of depression, anxiety, and stress symptoms over the past week.",
    purpose: "Depression, Anxiety & Stress",
    duration: "10-15 minutes",
    questions: 21,
    url: "https://www2.psy.unsw.edu.au/dass/",
    color: "#96CEB4",
    icon: "📊",
    disclaimer: "This scale measures symptom severity but professional consultation is recommended for interpretation."
  }
];

const MentalHealthTests: React.FC = () => {
  const navigation = useNavigation();
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<MentalHealthTest | null>(null);

  const handleTestPress = (test: MentalHealthTest) => {
    setSelectedTest(test);
    setShowDisclaimerModal(true);
  };

  const handleProceedToTest = async () => {
    if (selectedTest) {
      try {
        const supported = await Linking.canOpenURL(selectedTest.url);
        if (supported) {
          await Linking.openURL(selectedTest.url);
          setShowDisclaimerModal(false);
          setSelectedTest(null);
        } else {
          Alert.alert('Error', 'Cannot open test link');
        }
      } catch (error) {
        Alert.alert('Error', 'Cannot open test link');
      }
    }
  };

  const handleEmergencyResources = () => {
    Alert.alert(
      'Crisis Resources',
      'If you are experiencing thoughts of self-harm or suicide:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nYou are not alone. Help is available 24/7.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
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
          <Text style={styles.headerTitle}>Mental Health Tests</Text>
          <Text style={styles.headerSubtitle}>Self-assessment tools</Text>
        </View>
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyResources}
        >
          <Text style={styles.emergencyText}>🆘</Text>
        </TouchableOpacity>
      </View>

      {/* Important Notice */}
      <View style={styles.noticeContainer}>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>⚠️</Text>
          <View style={styles.noticeTextContainer}>
            <Text style={styles.noticeTitle}>Important Notice</Text>
            <Text style={styles.noticeText}>
              These screening tools are for educational purposes only and do not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper evaluation and care.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validated Assessment Tools</Text>
          <Text style={styles.sectionSubtitle}>
            Evidence-based screening instruments used by healthcare professionals
          </Text>

          {mentalHealthTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[styles.testCard, { borderLeftColor: test.color }]}
              onPress={() => handleTestPress(test)}
              activeOpacity={0.8}
            >
              <View style={styles.testHeader}>
                <View style={styles.testTitleContainer}>
                  <View style={styles.testNameRow}>
                    <Text style={styles.testIcon}>{test.icon}</Text>
                    <Text style={styles.testName}>{test.name}</Text>
                    <View style={[styles.purposeBadge, { backgroundColor: test.color }]}>
                      <Text style={styles.purposeText}>{test.purpose}</Text>
                    </View>
                  </View>
                  <Text style={styles.testFullName}>{test.fullName}</Text>
                </View>
              </View>

              <Text style={styles.testDescription}>{test.description}</Text>

              <View style={styles.testMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricIcon}>⏱️</Text>
                  <Text style={styles.metricText}>{test.duration}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricIcon}>❓</Text>
                  <Text style={styles.metricText}>{test.questions} questions</Text>
                </View>
              </View>

              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>{test.disclaimer}</Text>
              </View>

              <View style={styles.testActions}>
                <TouchableOpacity 
                  style={[styles.takeTestButton, { backgroundColor: test.color }]}
                  onPress={() => handleTestPress(test)}
                >
                  <Text style={styles.takeTestText}>Take Assessment</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>After Taking a Test</Text>
          <View style={styles.resourceCard}>
            <Text style={styles.resourceCardTitle}>🩺 Next Steps</Text>
            <Text style={styles.resourceCardText}>
              • Share results with a healthcare professional{'\n'}
              • Consider scheduling a consultation{'\n'}
              • Remember that tests are screening tools, not diagnoses{'\n'}
              • Seek immediate help if experiencing crisis symptoms
            </Text>
          </View>

          <View style={styles.resourceCard}>
            <Text style={styles.resourceCardTitle}>🔒 Privacy Notice</Text>
            <Text style={styles.resourceCardText}>
              Your responses are private and not stored by this app. The external test sites may have their own privacy policies. Review their terms before proceeding.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Disclaimer Modal */}
      <Modal
        visible={showDisclaimerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDisclaimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Before You Begin</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDisclaimerModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedTest && (
              <>
                <View style={styles.testInfoContainer}>
                  <Text style={styles.modalTestName}>
                    {selectedTest.icon} {selectedTest.name}
                  </Text>
                  <Text style={styles.modalTestFullName}>{selectedTest.fullName}</Text>
                </View>

                <View style={styles.modalDisclaimerContainer}>
                  <Text style={styles.modalDisclaimerTitle}>Important Reminders:</Text>
                  <Text style={styles.modalDisclaimerText}>
                    • This is a screening tool, not a diagnostic test{'\n'}
                    • Results should be discussed with a healthcare professional{'\n'}
                    • Your responses will be handled by the external test site{'\n'}
                    • Seek immediate help if experiencing crisis symptoms
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowDisclaimerModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.proceedButton, { backgroundColor: selectedTest.color }]}
                    onPress={handleProceedToTest}
                  >
                    <Text style={styles.proceedButtonText}>I Understand - Proceed</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  emergencyButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    fontSize: 16,
  },
  noticeContainer: {
    padding: 20,
    backgroundColor: '#000000',
  },
  noticeCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
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
    marginBottom: 24,
  },
  testCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  testHeader: {
    marginBottom: 12,
  },
  testTitleContainer: {
    flex: 1,
  },
  testNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  testIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  testName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  purposeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  testFullName: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  testDescription: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 16,
  },
  testMetrics: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  metricText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  disclaimerContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  testActions: {
    alignItems: 'center',
  },
  takeTestButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  takeTestText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resourcesSection: {
    padding: 20,
    paddingTop: 0,
  },
  resourcesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  resourceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resourceCardText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
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
  testInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTestName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalTestFullName: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalDisclaimerContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalDisclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalDisclaimerText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MentalHealthTests;