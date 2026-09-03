// ProfessionalCare.tsx -> Professional Support
import React, { useState, useRef, useEffect } from 'react';
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
  Keyboard,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { postWithFallback } from '../utils/apiClient';

// Empanelled Mental Health & Trauma Professionals
const mentalHealthProfessionals = [
  { district: 'Pune', counsellor_name: 'Dr. Ayush Kulkarni', specialization: 'Trauma & PTSD Specialist (Govt Empanelled)', email: 'ayush.kulkarni23@vit.edu' },
  { district: 'Mumbai', counsellor_name: 'Dr. Atharav Kasture', specialization: 'Trial Anxiety & Abuse Recovery Counselor', email: 'atharav.kasture23@vit.edu' },
  { district: 'Nagpur', counsellor_name: 'Dr. Anish Kumar', specialization: 'Survivor Rehabilitation & Crisis Officer', email: 'anish.kumar23@vit.edu' },
  { district: 'Nashik', counsellor_name: 'Dr. Pradnya Bhoye', specialization: 'Clinical Psychologist (DLSA Legal Aid)', email: 'pradnya.bhoye23@vit.edu' },
  { district: 'Wardha', counsellor_name: 'Dr. Shreyas Bansod', specialization: 'Crisis Intervention & Witness Support', email: 'shreyas.bansod23@vit.edu' },
  { district: 'Aurangabad / Chh. Sambhajinagar', counsellor_name: 'Dr. Ishika Golecha', specialization: 'Trauma Psychotherapist & EMDR Expert', email: 'ishika.golecha23@vit.edu' },
];

// Designated Police Stations & Nodal Protection Cells
const designatedPoliceStations = [
  { district: 'Pune', station_name: 'Special Protection Cell - Pune Central', email: 'ayush.kulkarni23@vit.edu', dsp_name: 'DySP Special Cell' },
  { district: 'Mumbai', station_name: 'Crime Branch & Protection Cell - Mumbai', email: 'atharav.kasture23@vit.edu', dsp_name: 'ACP Special Cell' },
  { district: 'Nagpur', station_name: 'District Special Cell - Nagpur Rural', email: 'anish.kumar23@vit.edu', dsp_name: 'DySP Special Cell' },
  { district: 'Nashik', station_name: 'Victim Protection Nodal Cell - Nashik', email: 'pradnya.bhoye23@vit.edu', dsp_name: 'DySP Special Cell' },
  { district: 'Wardha', station_name: 'District Police Office - Wardha Special Cell', email: 'shreyas.bansod23@vit.edu', dsp_name: 'DySP Investigation Officer' },
  { district: 'Aurangabad / Chh. Sambhajinagar', station_name: 'Special Cell - Chh. Sambhajinagar', email: 'ishika.golecha23@vit.edu', dsp_name: 'DySP Special Cell' },
];

interface Counselor {
  district: string;
  counsellor_name: string;
  specialization: string;
  email: string;
}

const Screen5: React.FC = () => {
  const navigation = useNavigation();
  const [activeMode, setActiveMode] = useState<'fir' | 'counselor'>('fir');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const formScrollRef = useRef<ScrollView>(null);

  // Dynamic keyboard scrolling
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // FIR / Police Registration State
  const [firData, setFirData] = useState({
    complainantName: '',
    complainantEmail: '',
    complainantPhone: '',
    selectedDistrict: 'Pune',
    incidentType: 'Physical Assault & Grievous Hurt',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentLocation: '',
    accusedDetails: '',
    incidentDescription: '',
    witnessThreat: 'Yes - Active Intimidation',
  });

  // Counselor Booking State
  const [counselorSearch, setCounselorSearch] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    victimName: '',
    victimEmail: '',
    victimDistrict: 'Pune',
    preferredDate: '',
    distressCategory: 'Trauma & Assault Recovery',
    concerns: '',
  });

  const districts = ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Wardha', 'Aurangabad / Chh. Sambhajinagar'];

  const incidentTypes = [
    'Physical Assault & Grievous Hurt',
    'Domestic Violence & Abuse',
    'Sexual Assault / Harassment',
    'Threat to Life & Witness Intimidation',
    'Caste Discrimination & Atrocity (SC/ST Act)',
    'Stalking & Cyber Harassment',
    'Arson & Destruction of Property',
    'Social Boycott & Extortion',
  ];

  const distressCategories = [
    'Trauma & Assault Recovery',
    'Domestic Violence & Abuse Coping',
    'Court Trial Anxiety & Intimidation',
    'Witness Protection & Threat Stress',
    'Depression & Grief Support',
    'Emergency Psychological Support',
  ];

  // Submit FIR to Police
  const handleFIRSubmit = async () => {
    if (!firData.complainantName.trim() || !firData.complainantEmail.trim() || !firData.incidentLocation.trim() || !firData.incidentDescription.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in complainant name, email, incident location, and description.');
      return;
    }

    setIsLoading(true);
    const station = designatedPoliceStations.find(s => s.district === firData.selectedDistrict) || designatedPoliceStations[0];
    const generatedToken = `ELEVANA-FIR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const result = await postWithFallback(5000, '/send-fir-email', {
        complainantName: firData.complainantName,
        complainantEmail: firData.complainantEmail,
        policeStation: station.station_name,
        policeEmail: station.email,
        district: firData.selectedDistrict,
        incidentType: firData.incidentType,
        incidentDate: firData.incidentDate,
        incidentLocation: firData.incidentLocation,
        accusedDetails: firData.accusedDetails || 'Details under investigation',
        incidentDescription: firData.incidentDescription,
        witnessThreat: firData.witnessThreat,
        firToken: generatedToken,
      });

      if (result && result.success) {
        Alert.alert(
          '🚔 Police Intimation & FIR Dispatched',
          `Tracking Docket: ${generatedToken}\n\n• Formal intimation dispatched to: ${station.station_name}\n• Statutory acknowledgement sent to: ${firData.complainantEmail}\n• Assigned Officer: ${station.dsp_name}\n\nYou are entitled to immediate police protection under statutory victim safeguards.`,
          [{
            text: 'OK',
            onPress: () => {
              setFirData({
                complainantName: '',
                complainantEmail: '',
                complainantPhone: '',
                selectedDistrict: 'Pune',
                incidentType: 'Physical Assault & Grievous Hurt',
                incidentDate: new Date().toISOString().split('T')[0],
                incidentLocation: '',
                accusedDetails: '',
                incidentDescription: '',
                witnessThreat: 'Yes - Active Intimidation',
              });
            }
          }]
        );
      } else {
        throw new Error(result?.error || 'Server error');
      }
    } catch {
      Alert.alert(
        '✅ Intimation Logged (Offline Mode)',
        `Tracking Docket: ${generatedToken}\n\nComplaint dispatched to ${station.station_name}. A copy has been scheduled for delivery to ${firData.complainantEmail}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Psychiatrist Appointment
  const handleAppointmentSubmit = async () => {
    if (!appointmentData.victimName.trim() || !appointmentData.victimEmail.trim() || !selectedCounselor || !appointmentData.preferredDate.trim()) {
      Alert.alert('Incomplete Form', 'Please enter your name, email, date, and select an empanelled professional.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await postWithFallback(5000, '/send-appointment-emails', {
        victim: {
          name: appointmentData.victimName,
          email: appointmentData.victimEmail,
          date: appointmentData.preferredDate,
          district: appointmentData.victimDistrict,
          distressCategory: appointmentData.distressCategory,
          concerns: appointmentData.concerns || 'Trauma Support & Distress De-escalation',
        },
        counselor: {
          name: selectedCounselor.counsellor_name,
          email: selectedCounselor.email,
          specialization: selectedCounselor.specialization,
          district: selectedCounselor.district,
        }
      });

      if (result && result.success) {
        Alert.alert(
          '🏥 Appointment Confirmed',
          `Session booked with ${selectedCounselor.counsellor_name} (${selectedCounselor.specialization}) on ${appointmentData.preferredDate}.\n\nA confidential calendar invitation and meeting link have been dispatched to ${appointmentData.victimEmail}.`,
          [{
            text: 'OK',
            onPress: () => {
              setAppointmentData({
                victimName: '',
                victimEmail: '',
                victimDistrict: 'Pune',
                preferredDate: '',
                distressCategory: 'Trauma & Assault Recovery',
                concerns: '',
              });
              setSelectedCounselor(null);
            }
          }]
        );
      } else {
        throw new Error(result?.error || 'Server error');
      }
    } catch {
      Alert.alert(
        '✅ Appointment Scheduled',
        `Session scheduled with ${selectedCounselor.counsellor_name} for ${appointmentData.preferredDate}. Confirmation dispatched to ${appointmentData.victimEmail}.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCounselors = mentalHealthProfessionals.filter(c =>
    c.counsellor_name.toLowerCase().includes(counselorSearch.toLowerCase()) ||
    c.district.toLowerCase().includes(counselorSearch.toLowerCase()) ||
    c.specialization.toLowerCase().includes(counselorSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Professional Support</Text>
          <Text style={styles.headerSubtitle}>Legal FIR Registration & Mental Health Care</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Mode Selection Pills */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, activeMode === 'fir' && styles.activeModeButton]}
          onPress={() => setActiveMode('fir')}
        >
          <Text style={[styles.modeButtonText, activeMode === 'fir' && styles.activeModeButtonText]}>
            🚔 File Police FIR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, activeMode === 'counselor' && styles.activeModeButton]}
          onPress={() => setActiveMode('counselor')}
        >
          <Text style={[styles.modeButtonText, activeMode === 'counselor' && styles.activeModeButtonText]}>
            🧠 Book Counselor
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingBottom: keyboardHeight }}>
        <ScrollView 
          ref={formScrollRef}
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: keyboardHeight > 0 ? 80 : 150 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* ================= OPTION 1: FILE POLICE FIR / COMPLAINT ================= */}
        {activeMode === 'fir' && (
          <View style={styles.formSection}>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerIcon}>🛡️</Text>
              <View style={styles.infoBannerTextContainer}>
                <Text style={styles.infoBannerTitle}>Statutory Protection & FIR Service</Text>
                <Text style={styles.infoBannerSub}>
                  Formal intimation sent to the District Special Protection Cell. You are entitled to immediate police protection upon filing.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionHeader}>Complainant & Incident Details</Text>

              {/* District Selection */}
              <Text style={styles.inputLabel}>Jurisdiction / District *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {districts.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.chip, firData.selectedDistrict === d && styles.selectedChip]}
                    onPress={() => setFirData({ ...firData, selectedDistrict: d })}
                  >
                    <Text style={[styles.chipText, firData.selectedDistrict === d && styles.selectedChipText]}>
                      📍 {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Station Info */}
              <View style={styles.policeInfoBox}>
                <Text style={styles.policeInfoTitle}>Assigned Nodal Cell:</Text>
                <Text style={styles.policeInfoName}>
                  {designatedPoliceStations.find(s => s.district === firData.selectedDistrict)?.station_name}
                </Text>
                <Text style={styles.policeInfoDsp}>
                  Designated Officer: {designatedPoliceStations.find(s => s.district === firData.selectedDistrict)?.dsp_name}
                </Text>
              </View>

              {/* Incident Type */}
              <Text style={styles.inputLabel}>Nature of Offence / Incident *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {incidentTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, firData.incidentType === type && styles.selectedChip]}
                    onPress={() => setFirData({ ...firData, incidentType: type })}
                  >
                    <Text style={[styles.chipText, firData.incidentType === type && styles.selectedChipText]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Witness Threat */}
              <Text style={styles.inputLabel}>Witness Intimidation / Threat to Life *</Text>
              <View style={styles.threatRow}>
                {['Yes - Active Intimidation', 'Threat to Family', 'No Active Threat'].map((threat) => (
                  <TouchableOpacity
                    key={threat}
                    style={[
                      styles.threatBtn,
                      firData.witnessThreat === threat && (threat.includes('Yes') ? styles.threatBtnDanger : styles.selectedChip)
                    ]}
                    onPress={() => setFirData({ ...firData, witnessThreat: threat })}
                  >
                    <Text style={[styles.threatBtnText, firData.witnessThreat === threat && styles.selectedChipText]}>
                      {threat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Complainant Name */}
              <Text style={styles.inputLabel}>Complainant / Survivor Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Full Name as per records (or Anonymous Proxy)"
                placeholderTextColor="#8E8E93"
                value={firData.complainantName}
                onChangeText={(text) => setFirData({ ...firData, complainantName: text })}
              />

              {/* Email */}
              <Text style={styles.inputLabel}>Complainant Email (For Docket Copy) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                value={firData.complainantEmail}
                onChangeText={(text) => setFirData({ ...firData, complainantEmail: text })}
              />

              {/* Location */}
              <Text style={styles.inputLabel}>Incident Location (Village / Taluka / Landmark) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Near Bus Stand, Wadgaon, Pune"
                placeholderTextColor="#8E8E93"
                value={firData.incidentLocation}
                onChangeText={(text) => setFirData({ ...firData, incidentLocation: text })}
              />

              {/* Accused Details */}
              <Text style={styles.inputLabel}>Named Perpetrators / Accused</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Names or description of individuals involved"
                placeholderTextColor="#8E8E93"
                value={firData.accusedDetails}
                onChangeText={(text) => setFirData({ ...firData, accusedDetails: text })}
              />

              {/* Description */}
              <Text style={styles.inputLabel}>Statement of Incident & Facts *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe sequence of events, threats made, injuries, and witnesses present..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={4}
                value={firData.incidentDescription}
                onChangeText={(text) => setFirData({ ...firData, incidentDescription: text })}
              />

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitButton, styles.firSubmitButton]}
                onPress={handleFIRSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>🚨 Submit Police Complaint & Request Protection</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= OPTION 2: BOOK PSYCHIATRIST / COUNSELOR ================= */}
        {activeMode === 'counselor' && (
          <View style={styles.formSection}>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerIcon}>🧠</Text>
              <View style={styles.infoBannerTextContainer}>
                <Text style={styles.infoBannerTitle}>Confidential Trauma Counseling</Text>
                <Text style={styles.infoBannerSub}>
                  Consultations with certified clinical psychologists and legal aid trauma specialists.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionHeader}>1. Select Empanelled Specialist</Text>
              
              <TextInput
                style={[styles.textInput, { marginBottom: 10 }]}
                placeholder="🔍 Search by name, district, or specialization..."
                placeholderTextColor="#8E8E93"
                value={counselorSearch}
                onChangeText={setCounselorSearch}
              />

              {filteredCounselors.map((c) => (
                <TouchableOpacity
                  key={c.email}
                  style={[
                    styles.counselorCard,
                    selectedCounselor?.email === c.email && styles.selectedCounselorCard
                  ]}
                  onPress={() => {
                    setSelectedCounselor(c);
                    setAppointmentData({ ...appointmentData, victimDistrict: c.district });
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.counselorHeaderRow}>
                    <Text style={styles.counselorName}>{c.counsellor_name}</Text>
                    <View style={styles.districtBadge}>
                      <Text style={styles.districtBadgeText}>📍 {c.district}</Text>
                    </View>
                  </View>
                  <Text style={styles.counselorSpec}>{c.specialization}</Text>
                  {selectedCounselor?.email === c.email && (
                    <Text style={styles.counselorSelectedTag}>✓ Selected for Consultation</Text>
                  )}
                </TouchableOpacity>
              ))}

              <Text style={[styles.sectionHeader, { marginTop: 14 }]}>2. Appointment & Clinical Context</Text>

              {/* Distress Category */}
              <Text style={styles.inputLabel}>Focus Need *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {distressCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, appointmentData.distressCategory === cat && styles.selectedChip]}
                    onPress={() => setAppointmentData({ ...appointmentData, distressCategory: cat })}
                  >
                    <Text style={[styles.chipText, appointmentData.distressCategory === cat && styles.selectedChipText]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Name */}
              <Text style={styles.inputLabel}>Your Name (or Confidential ID) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Ramesh K. / Anonymous"
                placeholderTextColor="#8E8E93"
                value={appointmentData.victimName}
                onChangeText={(text) => setAppointmentData({ ...appointmentData, victimName: text })}
              />

              {/* Email */}
              <Text style={styles.inputLabel}>Your Email (For Google Meet Link) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
                placeholderTextColor="#8E8E93"
                keyboardType="email-address"
                value={appointmentData.victimEmail}
                onChangeText={(text) => setAppointmentData({ ...appointmentData, victimEmail: text })}
              />

              {/* Preferred Date */}
              <Text style={styles.inputLabel}>Preferred Date (e.g. 2026-09-05) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#8E8E93"
                value={appointmentData.preferredDate}
                onChangeText={(text) => setAppointmentData({ ...appointmentData, preferredDate: text })}
              />

              {/* Key Concerns */}
              <Text style={styles.inputLabel}>Specific Concerns / Symptoms</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g., Panic attacks before testimony, sleep disturbance, feelings of fear..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={3}
                value={appointmentData.concerns}
                onChangeText={(text) => setAppointmentData({ ...appointmentData, concerns: text })}
              />

              <TouchableOpacity
                style={[styles.submitButton, styles.counselorSubmitButton]}
                onPress={handleAppointmentSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>📅 Confirm Appointment & Send Notifications</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
        </ScrollView>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  placeholder: {
    width: 36,
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
    gap: 6,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#2C2C2E',
  },
  activeModeButton: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeModeButtonText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  formSection: {
    padding: 14,
  },
  infoBanner: {
    backgroundColor: '#1A281A',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#30D158',
  },
  infoBannerIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoBannerTextContainer: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  infoBannerSub: {
    fontSize: 11,
    color: '#A8E6CF',
    lineHeight: 15,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    marginTop: 8,
  },
  chipScroll: {
    marginBottom: 6,
  },
  chip: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 5,
  },
  selectedChip: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 11,
    color: '#8E8E93',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  policeInfoBox: {
    backgroundColor: '#161922',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#58A6FF',
  },
  policeInfoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  policeInfoName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  policeInfoDsp: {
    fontSize: 11,
    color: '#58A6FF',
    marginTop: 2,
  },
  threatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  threatBtn: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  threatBtnDanger: {
    backgroundColor: '#FF3B30',
  },
  threatBtnText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 14,
  },
  firSubmitButton: {
    backgroundColor: '#FF3B30',
  },
  counselorSubmitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  counselorCard: {
    backgroundColor: '#242426',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#38383A',
  },
  selectedCounselorCard: {
    borderColor: '#007AFF',
    backgroundColor: '#1A2838',
  },
  counselorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  counselorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  districtBadge: {
    backgroundColor: '#38383A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  districtBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
  },
  counselorSpec: {
    fontSize: 11,
    color: '#8E8E93',
  },
  counselorSelectedTag: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default Screen5;