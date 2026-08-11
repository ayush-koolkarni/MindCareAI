//ProfessionalCare.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock data - In production, this would come from your Excel/PostgreSQL
const counselorData = [
  { college: 'abcd', counsellor_name: 'Ayush', email: 'ayush.kulkarni23@vit.edu' },
  { college: 'vit', counsellor_name: 'Atharav', email: 'atharav.kasture23@vit.edu' },
  { college: 'efgh', counsellor_name: 'Anish', email: 'anish.kumar23@vit.edu' },
  { college: 'ijkl', counsellor_name: 'Pradnya', email: 'pradnya.bhoye23@vit.edu' },
  { college: 'mnop', counsellor_name: 'Shreyash', email: 'shreyas.bansod23@vit.edu' },
  { college: 'qrst', counsellor_name: 'Ishika', email: 'ishika.golecha23@vit.edu' },
  
];

interface Counselor {
  college: string;
  counsellor_name: string;
  email: string;
}

interface AppointmentData {
  studentName: string;
  studentEmail: string;
  college: string;
  selectedCounselor: Counselor | null;
  preferredDate: string;
  concerns: string;
}

const Screen5: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<'search' | 'select' | 'book'>('search');
  const [searchCollege, setSearchCollege] = useState('');
  const [filteredCounselors, setFilteredCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    studentName: '',
    studentEmail: '',
    college: '',
    selectedCounselor: null,
    preferredDate: '',
    concerns: '',
  });

  const searchCounselors = () => {
    if (searchCollege.trim().length < 2) {
      Alert.alert('Search Error', 'Please enter at least 2 characters');
      return;
    }

    const results = counselorData.filter(counselor => 
      counselor.college.toLowerCase().includes(searchCollege.toLowerCase())
    );

    if (results.length === 0) {
      Alert.alert('No Results', 'No counselors found for this college. Please check the spelling or try a different search.');
      return;
    }

    setFilteredCounselors(results);
    setAppointmentData(prev => ({ ...prev, college: searchCollege }));
    setCurrentStep('select');
  };

  const selectCounselor = (counselor: Counselor) => {
    setAppointmentData(prev => ({ ...prev, selectedCounselor: counselor }));
    setCurrentStep('book');
  };

  const bookAppointment = async () => {
    // Validation
    if (!appointmentData.studentName.trim() || !appointmentData.studentEmail.trim() || 
        !appointmentData.preferredDate.trim() || !appointmentData.concerns.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (!appointmentData.studentEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call your Python email service
      const response = await sendAppointmentEmails(appointmentData);
      
      if (response.success) {
        Alert.alert(
          'Appointment Requested!',
          'Emails have been sent to both you and the counselor. You will be contacted within 24-48 hours.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                setCurrentStep('search');
                setSearchCollege('');
                setFilteredCounselors([]);
                setAppointmentData({
                  studentName: '',
                  studentEmail: '',
                  college: '',
                  selectedCounselor: null,
                  preferredDate: '',
                  concerns: '',
                });
              }
            }
          ]
        );
      } else {
        throw new Error(response.error || 'Failed to send emails');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again or contact support.');
      console.error('Email sending error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // This function would call your Python email service
  const sendAppointmentEmails = async (data: AppointmentData) => {
  try {
    const response = await fetch('http://192.168.1.64:5000/send-appointment-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student: {
          name: data.studentName,
          email: data.studentEmail,
          college: data.college,
          preferredDate: data.preferredDate,
          concerns: data.concerns
        },
        counselor: {
          name: data.selectedCounselor?.counsellor_name,
          email: data.selectedCounselor?.email
        }
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

  const renderSearchStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Find Your College Counselor</Text>
      <Text style={styles.stepSubtitle}>Enter your college name to find available counselors</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter college name..."
          placeholderTextColor="#8E8E93"
          value={searchCollege}
          onChangeText={setSearchCollege}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchCounselors}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>What to Expect:</Text>
        <Text style={styles.infoText}>
          • Professional, confidential counseling services{'\n'}
          • In-person meetings on campus{'\n'}
          • Response within 24-48 hours{'\n'}
          • No cost for students
        </Text>
      </View>
    </View>
  );

  const renderSelectStep = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep('search')}>
        <Text style={styles.backButtonText}>← Back to Search</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Available Counselors</Text>
      <Text style={styles.stepSubtitle}>College: {appointmentData.college}</Text>

      {filteredCounselors.map((counselor, index) => (
        <TouchableOpacity
          key={index}
          style={styles.counselorCard}
          onPress={() => selectCounselor(counselor)}
        >
          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>{counselor.counsellor_name}</Text>
            <Text style={styles.counselorEmail}>{counselor.email}</Text>
            <Text style={styles.counselorCollege}>College: {counselor.college}</Text>
          </View>
          <Text style={styles.selectArrow}>→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBookingStep = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep('select')}>
        <Text style={styles.backButtonText}>← Back to Counselors</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Book Appointment</Text>
      <Text style={styles.stepSubtitle}>
        Counselor: {appointmentData.selectedCounselor?.counsellor_name}
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Full Name *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            placeholderTextColor="#8E8E93"
            value={appointmentData.studentName}
            onChangeText={(text) => setAppointmentData(prev => ({ ...prev, studentName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Email Address *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="your.email@example.com"
            placeholderTextColor="#8E8E93"
            value={appointmentData.studentEmail}
            onChangeText={(text) => setAppointmentData(prev => ({ ...prev, studentEmail: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Preferred Date/Time *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Monday 2PM or This week afternoons"
            placeholderTextColor="#8E8E93"
            value={appointmentData.preferredDate}
            onChangeText={(text) => setAppointmentData(prev => ({ ...prev, preferredDate: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Brief Description of Concerns *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Please describe what you'd like to discuss (kept confidential)"
            placeholderTextColor="#8E8E93"
            value={appointmentData.concerns}
            onChangeText={(text) => setAppointmentData(prev => ({ ...prev, concerns: text }))}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.bookButton, isLoading && styles.bookButtonDisabled]} 
          onPress={bookAppointment}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.bookButtonText}>Request Appointment</Text>
          )}
        </TouchableOpacity>

        <View style={styles.privacyNotice}>
          <Text style={styles.privacyText}>
            Your information is kept strictly confidential and will only be shared with your selected counselor.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Professional Care</Text>
          <Text style={styles.headerSubtitle}>Connect with campus counselors</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'search' && renderSearchStep()}
        {currentStep === 'select' && renderSelectStep()}
        {currentStep === 'book' && renderBookingStep()}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#38383A',
  },
  headerBackButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBackButtonText: {
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#30D158',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  counselorCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  counselorEmail: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  counselorCollege: {
    fontSize: 12,
    color: '#8E8E93',
  },
  selectArrow: {
    fontSize: 18,
    color: '#8E8E93',
    marginLeft: 12,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
  },
  bookButton: {
    backgroundColor: '#30D158',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  bookButtonDisabled: {
    backgroundColor: '#2C2C2E',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  privacyNotice: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  privacyText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default Screen5;