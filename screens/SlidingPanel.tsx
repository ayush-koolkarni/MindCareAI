//SlidingPanel.tsx
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
  const handlePress = (label: string) => {
    console.log(`${label} clicked`);
    
    switch (label) {
      case 'Resource Library':
        onNavigate('ResourceLibrary');
        break;
      case 'Switch Category':
        onNavigate('SwitchCategory');
        break;
      case 'Peer Support Guidance':
        onNavigate('PeerSupport');
        break;
      case 'Mental Health Tests':
        onNavigate('MentalHealthTests');
        break;
      case 'Professional Care':
        onNavigate('ProfessionalCare');
        break;
      case 'Success Network':
        onNavigate('SuccessNetwork');
        break;
      default:
        console.log(`${label} - no navigation defined`);
    }
  };

  const menuItems = [
    { label: 'Switch Category', icon: '🔄', description: 'Change support category' },
    { label: 'Peer Support Guidance', icon: '👥', description: 'Connect with peers' },
    { label: 'Resource Library', icon: '📚', description: 'Browse helpful resources' },
    { label: 'Mental Health Tests', icon: '📊', description: 'Self-assessment tools' },
    { label: 'Professional Care', icon: '🏥', description: 'Find professional help' },
    { label: 'Success Network', icon: '⭐', description: 'Success stories & tips' },
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
          <Text style={styles.headerText}>Navigator</Text>
          <Text style={styles.headerSubtext}>Mental Health Support Hub</Text>
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
                onPress={() => handlePress(item.label)}
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
            <Text style={styles.footerText}>MindCare AI v1.0</Text>
            <Text style={styles.footerSubtext}>Your mental wellness companion</Text>
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
    paddingTop: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  buttonDescription: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '400',
  },
  arrowIcon: {
    color: '#8E8E93',
    fontSize: 16,
    marginLeft: 8,
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#38383A',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default SlidingPanel;