import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_HOST } from '../utils/apiClient';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://${API_HOST}:5003/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.user.role === 'admin') {
          navigation.replace('AdminDashboardScreen', { token: data.token, user: data.user });
        } else if (data.hasCompletedDass) {
          navigation.replace('Main', { token: data.token, user: data.user });
        } else {
          navigation.replace('Dass21OnboardingScreen', { token: data.token, user: data.user });
        }
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Cannot connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.headerContainer}>
            <Text style={styles.logoIcon}>🛡️</Text>
            <Text style={styles.title}>Elevana Secure Access</Text>
            <Text style={styles.subtitle}>Confidential portal for dynamic monitoring & support.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secure Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#555"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.loginButton,
                (!email.trim() || !password.trim() || isLoading) ? styles.loginButtonDisabled : null
              ]}
              onPress={handleLogin}
              disabled={!email.trim() || !password.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Enter Safe Space</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}> Sign Up Here</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  keyboardView: { flex: 1, justifyContent: 'center', padding: 24 },
  content: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center', lineHeight: 20 },
  formContainer: { marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, color: '#A0A0A0', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: { backgroundColor: '#2C2C2E', shadowOpacity: 0, elevation: 0 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, borderTopWidth: 1, borderTopColor: '#2C2C2E', paddingTop: 20 },
  footerText: { fontSize: 14, color: '#8E8E93' },
  linkText: { fontSize: 14, color: '#4A90E2', fontWeight: 'bold' },
});
