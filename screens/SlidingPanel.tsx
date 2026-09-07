// SlidingPanel.tsx
import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

interface SlidingPanelProps {
  slideAnim: Animated.Value;
  children?: React.ReactNode;
  onNavigate: (screenName: string) => void;
}

const { height: screenHeight } = Dimensions.get('window');

const SlidingPanel: React.FC<SlidingPanelProps> = ({ 
  slideAnim, 
  children, 
  onNavigate 
}) => {
  const handlePress = (target: string) => {
    switch (target) {
      case 'ResourceLibrary':
      case 'Resource Library':
        onNavigate('ResourceLibrary');
        break;
      case 'SwitchCategory':
      case 'Switch Category':
        onNavigate('SwitchCategory');
        break;
      case 'PeerSupport':
      case 'Victim Support Circle':
      case 'Peer Support Guidance':
        onNavigate('PeerSupport');
        break;
      case 'MentalHealthTests':
      case 'Mental Health Assessment':
      case 'Mental Health Tests':
        onNavigate('MentalHealthTests');
        break;
      case 'ProfessionalCare':
      case 'Professional Support':
      case 'Professional Care':
        onNavigate('ProfessionalCare');
        break;
      case 'SuccessNetwork':
      case 'Success Network':
        onNavigate('SuccessNetwork');
        break;
      default:
        console.log(`${target} - default navigate`);
        onNavigate(target);
    }
  };

  const menuItems = [
    { target: 'SwitchCategory', label: 'Switch Category', icon: '🔄', description: 'Change support context & AI focus' },
    { target: 'PeerSupport', label: 'Victim Support Circle', icon: '👥', description: 'Anonymous community & audio stories' },
    { target: 'ResourceLibrary', label: 'Resource Library', icon: '📚', description: 'Rights, legal aid & trauma recovery' },
    { target: 'MentalHealthTests', label: 'Mental Health Assessment', icon: '📊', description: 'DASS-21, PHQ-9 & clinical scales' },
    { target: 'ProfessionalCare', label: 'Professional Support', icon: '🏥', description: 'Police FIR & counselor booking' },
    { target: 'SuccessNetwork', label: 'Success Network', icon: '⭐', description: 'Justice milestones & survivor journeys' },
    { target: 'Logout', label: 'Log out', icon: '🚪', description: 'Securely sign out of your account' },
  ];

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {children}

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.brandingRow}>
            <Text style={styles.headerLogo}>🛡️</Text>
            <Text style={styles.headerText}>Elevana AI</Text>
          </View>
          <Text style={styles.headerSubtext}>Dynamic Distress Monitoring & Victim Support</Text>
          <View style={styles.nhaaBadge}>
            <Text style={styles.nhaaBadgeText}>Integrated with NHAA (14566)</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
        >
          <View style={styles.buttonsContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handlePress(item.target)}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>{item.icon}</Text>
                  <View style={styles.buttonTextContainer}>
                    <Text style={styles.buttonText}>{item.label}</Text>
                    <Text style={styles.buttonDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Elevana AI v2.0</Text>
            <Text style={styles.footerSubtext}>National Mental Health & Atrocity Relief Network</Text>
            <Text style={styles.privacyGuarantee}>🔒 RoBERTa PII Anonymization Active</Text>
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 320,
    height: screenHeight,
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    zIndex: 1000,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    paddingBottom: 14,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLogo: {
    fontSize: 22,
    marginRight: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  nhaaBadge: {
    backgroundColor: '#1A2E1A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#285E28',
  },
  nhaaBadgeText: {
    fontSize: 10,
    color: '#30D158',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  buttonsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 22,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  buttonDescription: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '400',
  },
  arrowIcon: {
    color: '#8E8E93',
    fontSize: 14,
    marginLeft: 6,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 4,
  },
  privacyGuarantee: {
    fontSize: 10,
    color: '#30D158',
    fontWeight: '600',
  },
});

export default SlidingPanel;