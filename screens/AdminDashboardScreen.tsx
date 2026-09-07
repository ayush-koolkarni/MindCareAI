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
import { WebView } from 'react-native-webview';
import { dashboardHtml } from '../components/DashboardHtml';

export default function AdminDashboardScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name || 'Administrator'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.webviewContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: dashboardHtml }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            bounces={false}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#30D158',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  logoutButton: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  logoutButtonText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  webviewContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#100d1d', // matches dashboard background
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
