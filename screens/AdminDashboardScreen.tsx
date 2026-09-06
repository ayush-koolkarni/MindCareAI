import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <View style={styles.header}>
          <Text style={styles.icon}>👑</Text>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name || 'Administrator'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Overview</Text>
          <Text style={styles.cardText}>
            You have successfully bypassed the DASS-21 onboarding as an authenticated Admin.
          </Text>
          <Text style={styles.cardText}>
            From this portal, you can monitor system health, view aggregated victim analytics, and manage support protocols.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Secure Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#30D158',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    borderLeftWidth: 4,
    borderLeftColor: '#30D158',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#30D158',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 15,
    color: '#D0D0D0',
    lineHeight: 24,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  logoutButtonText: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
