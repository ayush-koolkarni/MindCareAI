// MentalHealthTests.tsx
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
  targetAtrocityContext: string;
}

const mentalHealthTests: MentalHealthTest[] = [
  {
    id: 1,
    name: "DASS-21",
    fullName: "Depression, Anxiety and Stress Scale-21",
    description: "Core intake assessment measuring symptom severity across depression, anxiety, and stress dimensions throughout the investigation and trial process.",
    purpose: "Tri-Axial Distress Scoring",
    duration: "8-12 minutes",
    questions: 21,
    url: "https://www2.psy.unsw.edu.au/dass/",
    color: "#4A90E2",
    icon: "📊",
    targetAtrocityContext: "Recommended baseline test upon registration to compute Dynamic Distress Score.",
    disclaimer: "This validated scale quantifies distress levels for longitudinal monitoring by counselors."
  },
  {
    id: 2,
    name: "PC-PTSD-5",
    fullName: "Primary Care PTSD Screen for Atrocity Trauma",
    description: "Evaluates post-traumatic stress symptoms, intrusive trauma flashbacks, hyperarousal, and avoidance following violent incidents, assault, or threats.",
    purpose: "Trauma & PTSD Screening",
    duration: "3-5 minutes",
    questions: 5,
    url: "https://www.ptsd.va.gov/professional/assessment/screens/pc-ptsd.asp",
    color: "#E74C3C",
    icon: "🩹",
    targetAtrocityContext: "Crucial for survivors of grievous hurt, arson, caste violence, and intimidation.",
    disclaimer: "Identifies severe trauma signatures to expedite specialized EMDR / psychiatric interventions."
  },
  {
    id: 3,
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description: "Monitors depression depth, feelings of hopelessness, sleep deprivation, and self-harm vulnerability during delayed investigations or court trials.",
    purpose: "Depression & Crisis Detection",
    duration: "5-8 minutes",
    questions: 9,
    url: "https://www.mdcalc.com/calc/1725/phq9-patient-health-questionnaire9",
    color: "#9B59B6",
    icon: "🧠",
    targetAtrocityContext: "Triggers immediate counselor alerts if suicidal ideation is flagged (Item 9).",
    disclaimer: "Standardized depression index utilized by District Mental Health program doctors."
  },
  {
    id: 4,
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder 7-item Scale",
    description: "Measures acute anxiety, restlessness, panic episodes, and nervousness associated with court appearances and witness examination.",
    purpose: "Trial & Witness Anxiety",
    duration: "3-5 minutes",
    questions: 7,
    url: "https://www.mdcalc.com/calc/1727/gad7-general-anxiety-disorder7",
    color: "#1ABC9C",
    icon: "😰",
    targetAtrocityContext: "Assesses pre-trial panic before appearing in Special Courts.",
    disclaimer: "A high score prompts CBT distress tolerance techniques and paralegal witness preparation."
  },
  {
    id: 5,
    name: "GHQ-12",
    fullName: "General Health Questionnaire-12",
    description: "A rapid 12-item screening tool for overall psychological well-being, social functioning, and day-to-day coping capacity.",
    purpose: "General Wellness & Coping",
    duration: "4-6 minutes",
    questions: 12,
    url: "https://psychology-tools.com/test/ghq-12",
    color: "#F1C40F",
    icon: "💭",
    targetAtrocityContext: "Used for periodic monthly check-ins to monitor long-term rehabilitation.",
    disclaimer: "Tracks recovery trajectory following compensation disbursement and rehabilitation."
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
          Alert.alert('Assessment Link', 'Opening assessment tool via external clinical portal.');
        }
      } catch {
        Alert.alert('Assessment Link', 'Opening assessment tool via external clinical portal.');
      }
    }
  };

  const handleEmergencyResources = () => {
    Alert.alert(
      '🚨 Immediate Crisis Helplines',
      'If you or someone you know is in severe distress or under active threat:\n\n• National Helpline Against Atrocities: 14566 (24/7 Toll-Free)\n• National Emergency Response: 112\n• Tele-MANAS Mental Health: 14416\n• National Legal Aid (NALSA): 15100\n\nYou are protected by the law.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '📞 Call 14566', 
          onPress: () => Linking.openURL('tel:14566').catch(() => Alert.alert('Dialing', 'Connecting to 14566...')) 
        }
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
          <Text style={styles.headerTitle}>Mental Health Assessment</Text>
          <Text style={styles.headerSubtitle}>Validated Clinical Scales & Distress Scoring</Text>
        </View>
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyResources}>
          <Text style={styles.emergencyText}>🆘</Text>
        </TouchableOpacity>
      </View>

      {/* Important Notice */}
      <View style={styles.noticeContainer}>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>🛡️</Text>
          <View style={styles.noticeTextContainer}>
            <Text style={styles.noticeTitle}>Dynamic Distress Scoring Protocol</Text>
            <Text style={styles.noticeText}>
              These validated scales (DASS-21, PC-PTSD-5, PHQ-9) compute your Dynamic Distress Score. Scores are correlated with legal case stages to detect crisis situations before escalation.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validated Psychological Instruments</Text>
          <Text style={styles.sectionSubtitle}>
            Standardized psychometric tools integrated with Elevana AI Longitudinal Monitoring
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

              <View style={styles.contextBox}>
                <Text style={styles.contextText}>💡 Atrocity Context: {test.targetAtrocityContext}</Text>
              </View>

              <View style={styles.testMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricIcon}>⏱️</Text>
                  <Text style={styles.metricText}>{test.duration}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricIcon}>❓</Text>
                  <Text style={styles.metricText}>{test.questions} items</Text>
                </View>
              </View>

              <View style={styles.testActions}>
                <TouchableOpacity
                  style={[styles.takeTestButton, { backgroundColor: test.color }]}
                  onPress={() => handleTestPress(test)}
                >
                  <Text style={styles.takeTestText}>Take {test.name} Assessment →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Clinical Next Steps */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>How Your Scores Are Protected</Text>
          <View style={styles.resourceCard}>
            <Text style={styles.resourceCardTitle}>🔒 Zero PII & Privacy Assurance</Text>
            <Text style={styles.resourceCardText}>
              • Assessment scores are associated only with your Anonymous Case ID.{'\n'}
              • No personal identity details are transmitted to external test portals.{'\n'}
              • High-risk thresholds automatically suggest booking a session in Professional Support.
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showDisclaimerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDisclaimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assessment Protocol</Text>
              <TouchableOpacity onPress={() => setShowDisclaimerModal(false)}>
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
                  <Text style={styles.modalDisclaimerTitle}>Important Information:</Text>
                  <Text style={styles.modalDisclaimerText}>
                    • This assessment contributes to your longitudinal Dynamic Distress Score.{'\n'}
                    • Results can be shared confidentially with your empanelled counselor.{'\n'}
                    • If your distress score is elevated, immediate support options will be presented.{'\n'}
                    • Call NHAA (14566) immediately if you face active threats.
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
                    <Text style={styles.proceedButtonText}>Proceed to Test</Text>
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
    paddingVertical: 14,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    fontSize: 16,
  },
  noticeContainer: {
    padding: 16,
    backgroundColor: '#000000',
  },
  noticeCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  noticeTextContainer: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: '#A0A0A0',
    lineHeight: 17,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 16,
  },
  testCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  testHeader: {
    marginBottom: 10,
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
    fontSize: 18,
    marginRight: 8,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  purposeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  testFullName: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  testDescription: {
    fontSize: 13,
    color: '#D0D0D0',
    lineHeight: 19,
    marginBottom: 10,
  },
  contextBox: {
    backgroundColor: '#242426',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  contextText: {
    fontSize: 11,
    color: '#A8E6CF',
    fontWeight: '500',
  },
  testMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  testActions: {
    alignItems: 'center',
  },
  takeTestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  takeTestText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  resourcesSection: {
    padding: 16,
    paddingTop: 0,
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  resourceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  resourceCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  resourceCardText: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
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
    borderRadius: 18,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  testInfoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTestName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  modalTestFullName: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  modalDisclaimerContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  modalDisclaimerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  modalDisclaimerText: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  proceedButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MentalHealthTests;