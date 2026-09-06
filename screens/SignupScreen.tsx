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

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://${API_HOST}:5003/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        // Successful signup, pass token to next screen
        navigation.replace('Dass21OnboardingScreen', { token: data.token, user: data.user });
      } else {
        Alert.alert('Signup Failed', data.error || 'Something went wrong');
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
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register for secure and private access.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#555"
                value={name}
                onChangeText={setName}
              />
            </View>

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
                styles.signupButton,
                (!name.trim() || !email.trim() || !password.trim() || isLoading) ? styles.buttonDisabled : null
              ]}
              onPress={handleSignup}
              disabled={!name.trim() || !email.trim() || !password.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Register Now</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}> Login Here</Text>
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
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  headerContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center' },
  formContainer: { marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: '#A0A0A0', marginBottom: 8, fontWeight: '600', textTransform: 'uppercase' },
  input: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  signupButton: {
    backgroundColor: '#30D158',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: '#2C2C2E' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { color: '#8E8E93', fontSize: 14 },
  linkText: { color: '#4A90E2', fontSize: 14, fontWeight: 'bold' },
});
