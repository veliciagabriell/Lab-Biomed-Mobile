import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  Linking,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

type TabType = 'dasarTeori' | 'alatBahan' | 'prosedur' | 'tugasAwal' | 'presensi';

export default function ModulDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const [modul, setModul] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dasarTeori');
  
  // Tugas Awal State
  const [driveLink, setDriveLink] = useState('');
  const [uploadingTugas, setUploadingTugas] = useState(false);
  const [tugasStatus, setTugasStatus] = useState<any>(null);
  const [soalTugas, setSoalTugas] = useState<any>(null);
  const [loadingSoal, setLoadingSoal] = useState(false);
  
  // Asisten - Upload Soal State
  const [soalDriveLink, setSoalDriveLink] = useState('');
  const [uploadingSoal, setUploadingSoal] = useState(false);
  
  // Asisten - Beri Nilai State
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [nilaiInput, setNilaiInput] = useState('');
  const [givingNilai, setGivingNilai] = useState(false);
  const [showNilaiModal, setShowNilaiModal] = useState(false);
  
  // Presensi State
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [kelompok, setKelompok] = useState('');
  const [submittingPresensi, setSubmittingPresensi] = useState(false);

  // Asisten State
  const [presensiList, setPresensiList] = useState<any[]>([]);
  const [tugasAwalList, setTugasAwalList] = useState<any[]>([]);
  const [loadingAsistenData, setLoadingAsistenData] = useState(false);

  useEffect(() => {
    if (id) {
      loadModulDetail();
      if (user?.role === 'asisten') {
        loadAsistenData();
      }
    }
    if (user) {
      setNim(user.nim || '');
      // Extract name from email (before @) as fallback
      const nameFromEmail = user.email.split('@')[0];
      setNama(nameFromEmail || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Load data when switching to Tugas Awal tab
  useEffect(() => {
    if (activeTab === 'tugasAwal') {
      loadSoalTugas();
      if (user?.nim) {
        checkTugasStatus();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.nim]);

  // Load asisten data when switching to Presensi tab
  useEffect(() => {
    if (activeTab === 'presensi' && user?.role === 'asisten') {
      loadAsistenData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.role]);

  const loadModulDetail = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/modul/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModul(data);
      } else {
        Alert.alert('Error', 'Gagal memuat detail modul');
      }
    } catch (error) {
      console.error('Error loading modul detail:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memuat modul');
    } finally {
      setLoading(false);
    }
  };

  const checkTugasStatus = async () => {
    if (!user?.nim) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Check if user already submitted by getting all submissions and filtering
      const response = await fetch(
        `${API_URL}/tugas-awal/modul/${id}/submission`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const submissions = await response.json();
        const userSubmission = Array.isArray(submissions) 
          ? submissions.find((s: any) => s.nim === user.nim)
          : null;
        setTugasStatus(userSubmission ? { submitted: true, ...userSubmission } : { submitted: false });
      } else {
        setTugasStatus({ submitted: false });
      }
    } catch (error) {
      console.error('Error checking tugas status:', error);
      setTugasStatus({ submitted: false });
    }
  };

  const loadAsistenData = async () => {
    setLoadingAsistenData(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      // Load presensi list
      const presensiResponse = await fetch(`${API_URL}/presensi/modul/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (presensiResponse.ok) {
        const presensiData = await presensiResponse.json();
        console.log('Presensi data:', presensiData);
        setPresensiList(Array.isArray(presensiData) ? presensiData : []);
      } else {
        console.error('Failed to load presensi:', presensiResponse.status);
      }

      // Load tugas awal submission list (endpoint berbeda untuk asisten)
      const tugasResponse = await fetch(`${API_URL}/tugas-awal/modul/${id}/submission`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (tugasResponse.ok) {
        const tugasData = await tugasResponse.json();
        console.log('Tugas awal submissions:', tugasData);
        setTugasAwalList(Array.isArray(tugasData) ? tugasData : []);
      } else {
        console.error('Failed to load tugas submissions:', tugasResponse.status);
      }
    } catch (error) {
      console.error('Error loading asisten data:', error);
    } finally {
      setLoadingAsistenData(false);
    }
  };

  const loadSoalTugas = async () => {
    setLoadingSoal(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/tugas-awal/modul/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Soal tugas data:', data);
        // data is array, get first item if exists
        setSoalTugas(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } else {
        console.error('Failed to load soal:', response.status);
        setSoalTugas(null);
      }
    } catch (error) {
      console.error('Error loading soal:', error);
      setSoalTugas(null);
    } finally {
      setLoadingSoal(false);
    }
  };

  const handleUploadSoal = async () => {
    if (!soalDriveLink.trim()) {
      Alert.alert('Error', 'Masukkan link Google Drive soal');
      return;
    }

    // Validate Google Drive link
    if (!soalDriveLink.includes('drive.google.com')) {
      Alert.alert('Error', 'Link harus dari Google Drive');
      return;
    }

    setUploadingSoal(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/tugas-awal/modul/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tugas_url: soalDriveLink,
          modulId: parseInt(id as string),
        }),
      });

      if (response.ok) {
        Alert.alert('Berhasil', 'Soal tugas awal berhasil diupload!');
        setSoalDriveLink('');
        await loadSoalTugas();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Gagal upload soal');
      }
    } catch (error) {
      console.error('Error uploading soal:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat upload soal');
    } finally {
      setUploadingSoal(false);
    }
  };

  const handleUploadTugas = async () => {
    if (!driveLink.trim()) {
      Alert.alert('Error', 'Masukkan link Google Drive jawaban');
      return;
    }

    // Validate Google Drive link
    if (!driveLink.includes('drive.google.com')) {
      Alert.alert('Error', 'Link harus dari Google Drive');
      return;
    }

    if (!user?.nim || !user?.email) {
      Alert.alert('Error', 'Data user tidak lengkap');
      return;
    }

    setUploadingTugas(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      
      const payload = {
        nama: user.email.split('@')[0],
        nim: user.nim,
        submission_url: driveLink,
      };
      
      console.log('===== SUBMIT TUGAS AWAL =====');
      console.log('Module ID from params:', id);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      const apiResponse = await fetch(`${API_URL}/tugas-awal/modul/${id}/submission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', apiResponse.status);
      
      if (apiResponse.ok) {
        const result = await apiResponse.json();
        console.log('Submit success:', result);
        Alert.alert('Berhasil', 'Tugas awal berhasil disubmit!');
        setDriveLink('');
        await checkTugasStatus();
        // Reload asisten data if asisten
        if (user?.role === 'asisten') {
          await loadAsistenData();
        }
      } else {
        const errorText = await apiResponse.text();
        console.error('Submit failed:', errorText);
        try {
          const error = JSON.parse(errorText);
          Alert.alert('Error', error.message || 'Gagal submit tugas awal');
        } catch {
          Alert.alert('Error', 'Gagal submit tugas awal');
        }
      }
    } catch (error) {
      console.error('Error uploading tugas:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat submit tugas: ' + (error as Error).message);
    } finally {
      setUploadingTugas(false);
    }
  };

  const handleGiveNilai = async () => {
    console.log('=== HANDLE GIVE NILAI START ===');
    console.log('nilaiInput:', nilaiInput);
    console.log('selectedSubmission:', selectedSubmission);
    
    if (!nilaiInput.trim()) {
      Alert.alert('Error', 'Masukkan nilai');
      return;
    }

    const nilai = parseInt(nilaiInput);
    if (isNaN(nilai) || nilai < 0 || nilai > 100) {
      Alert.alert('Error', 'Nilai harus antara 0-100');
      return;
    }

    setGivingNilai(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const submissionId = `${selectedSubmission.nim}_${id}`;
      
      console.log('submissionId:', submissionId);
      console.log('id:', id);
      console.log('API URL:', `${API_URL}/tugas-awal/modul/${id}/submission/${submissionId}/grade`);
      console.log('Body:', JSON.stringify({
        nim: selectedSubmission.nim,
        nama: selectedSubmission.nama,
        submission_url: selectedSubmission.submission_url,
        modulId: parseInt(id as string),
        nilai: nilai,
      }));
      
      const response = await fetch(
        `${API_URL}/tugas-awal/modul/${id}/submission/${submissionId}/grade`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nim: selectedSubmission.nim,
            nama: selectedSubmission.nama,
            submission_url: selectedSubmission.submission_url,
            modulId: parseInt(id as string),
            nilai: nilai,
          }),
        }
      );

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log('Success result:', result);
        Alert.alert('Berhasil', `Nilai ${nilai} berhasil diberikan!`);
        setShowNilaiModal(false);
        setNilaiInput('');
        setSelectedSubmission(null);
        await loadAsistenData();
      } else {
        try {
          const error = JSON.parse(responseText);
          console.error('Error response:', error);
          Alert.alert('Error', error.message || 'Gagal memberi nilai');
        } catch (parseError) {
          console.error('Parse error:', parseError);
          Alert.alert('Error', responseText || 'Gagal memberi nilai');
        }
      }
    } catch (error) {
      console.error('=== ERROR GIVING NILAI ===');
      console.error('Error:', error);
      console.error('Error message:', (error as Error).message);
      console.error('Error stack:', (error as Error).stack);
      Alert.alert('Error', 'Terjadi kesalahan: ' + (error as Error).message);
    } finally {
      setGivingNilai(false);
      console.log('=== HANDLE GIVE NILAI END ===');
    }
  };

  const handleSubmitPresensi = async () => {
    if (!nim || !nama || !kelompok) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (!/^\d+$/.test(kelompok)) {
      Alert.alert('Error', 'Kelompok harus berupa angka');
      return;
    }

    setSubmittingPresensi(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/presensi/modul/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nim,
          nama,
          kelompok: parseInt(kelompok),
          modulId: parseInt(id as string),
        }),
      });

      if (response.ok) {
        Alert.alert('Berhasil', 'Presensi berhasil dicatat!');
        setKelompok('');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Gagal submit presensi');
      }
    } catch (error) {
      console.error('Error submitting presensi:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat submit presensi');
    } finally {
      setSubmittingPresensi(false);
    }
  };

  const handleViewFile = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'File URL', 
          url,
          [
            { text: 'Copy', onPress: () => {
              // In production, use Clipboard API
              Alert.alert('URL', url);
            }},
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('File URL', url);
    }
  };

  const renderTabContent = () => {
    if (!modul) return null;

    // Render Dasar Teori, Alat & Bahan, Prosedur
    if (activeTab === 'dasarTeori' || activeTab === 'alatBahan' || activeTab === 'prosedur') {
      const content = {
        dasarTeori: modul.dasarTeori,
        alatBahan: modul.alatBahan,
        prosedur: modul.prosedur,
      };

      return (
        <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.contentText, { fontFamily: Fonts.regular, color: colors.text }]}>
            {content[activeTab] || 'Belum ada konten'}
          </Text>
        </View>
      );
    }

    // Render Tugas Awal Tab
    if (activeTab === 'tugasAwal') {
      // Asisten View
      if (user?.role === 'asisten') {
        return (
          <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
            {/* Upload Soal Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="cloud-upload" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Upload Soal Tugas Awal
              </Text>
            </View>

            {loadingSoal ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : soalTugas ? (
              <View style={[styles.statusBanner, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={[styles.statusText, { fontFamily: Fonts.medium, color: '#10B981' }]}>
                  Soal sudah diupload
                </Text>
                <TouchableOpacity
                  style={[styles.viewButton, { backgroundColor: colors.primary + '20', marginLeft: 'auto' }]}
                  onPress={() => handleViewFile(soalTugas.tugas_url)}
                >
                  <Ionicons name="eye" size={18} color={colors.primary} />
                  <Text style={[styles.viewButtonText, { fontFamily: Fonts.medium, color: colors.primary }]}>
                    Lihat Soal
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TextInput
                  style={[styles.input, { 
                    fontFamily: Fonts.regular, 
                    color: colors.text, 
                    borderColor: colors.border,
                    backgroundColor: colors.background 
                  }]}
                  placeholder="Masukkan link Google Drive soal"
                  placeholderTextColor={colors.icon}
                  value={soalDriveLink}
                  onChangeText={setSoalDriveLink}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: colors.primary },
                    (!soalDriveLink.trim() || uploadingSoal) && styles.disabledButton,
                  ]}
                  onPress={handleUploadSoal}
                  disabled={!soalDriveLink.trim() || uploadingSoal}
                >
                  {uploadingSoal ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload" size={20} color="#FFF" />
                      <Text style={[styles.submitButtonText, { fontFamily: Fonts.semiBold }]}>
                        Upload Soal
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Daftar Submission */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={24} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Daftar Submission ({tugasAwalList.length})
              </Text>
            </View>

            {loadingAsistenData ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : tugasAwalList.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={48} color={colors.icon} />
                <Text style={[styles.emptyStateText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Belum ada submission
                </Text>
              </View>
            ) : (
              <View style={styles.listContainer}>
                {tugasAwalList.map((tugas, index) => (
                  <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.listItemHeader}>
                      <View style={styles.listItemInfo}>
                        <Text style={[styles.listItemName, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                          {tugas.nama}
                        </Text>
                        <Text style={[styles.listItemSubtext, { fontFamily: Fonts.regular, color: colors.icon }]}>
                          NIM: {tugas.nim}
                        </Text>
                        {tugas.nilai !== null && tugas.nilai !== undefined ? (
                          <View style={[styles.nilaiBadge, { backgroundColor: '#10B98120' }]}>
                            <Text style={[styles.nilaiText, { fontFamily: Fonts.semiBold, color: '#10B981' }]}>
                              Nilai: {tugas.nilai}
                            </Text>
                          </View>
                        ) : (
                          <Text style={[styles.listItemSubtext, { fontFamily: Fonts.regular, color: '#F59E0B' }]}>
                            Belum dinilai
                          </Text>
                        )}
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.viewButton, { backgroundColor: colors.primary + '20' }]}
                          onPress={() => handleViewFile(tugas.submission_url)}
                        >
                          <Ionicons name="eye" size={18} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.viewButton, { backgroundColor: '#F59E0B20', marginLeft: 8 }]}
                          onPress={() => {
                            setSelectedSubmission(tugas);
                            setNilaiInput(tugas.nilai?.toString() || '');
                            setShowNilaiModal(true);
                          }}
                        >
                          <Ionicons name="create" size={18} color="#F59E0B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    {tugas.submittedAt && (
                      <Text style={[styles.timestampText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                        {new Date(tugas.submittedAt).toLocaleString('id-ID')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      }

      // Praktikan View
      return (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
              {/* Soal Section */}
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={24} color={colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Soal Tugas Awal
                </Text>
              </View>

              {loadingSoal ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
              ) : soalTugas ? (
                <TouchableOpacity
                  style={[styles.soalCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => handleViewFile(soalTugas.tugas_url)}
                >
                  <Ionicons name="document" size={32} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.soalTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                      Soal Tersedia
                    </Text>
                    <Text style={[styles.soalSubtext, { fontFamily: Fonts.regular, color: colors.icon }]}>
                      Tap untuk melihat soal
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.icon} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.statusBanner, { backgroundColor: '#F59E0B20' }]}>
                  <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                  <Text style={[styles.statusText, { fontFamily: Fonts.medium, color: '#F59E0B' }]}>
                    Soal belum tersedia
                  </Text>
                </View>
              )}

              {/* Submission Section */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.sectionHeader}>
                <Ionicons name="cloud-upload" size={24} color={colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Submit Jawaban
                </Text>
              </View>

              {tugasStatus?.submitted ? (
                <View>
                  <View style={[styles.statusBanner, { backgroundColor: '#10B98120' }]}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={[styles.statusText, { fontFamily: Fonts.medium, color: '#10B981' }]}>
                      Tugas sudah disubmit
                    </Text>
                  </View>
                  
                  {tugasStatus.nilai !== null && tugasStatus.nilai !== undefined ? (
                    <View style={[styles.nilaiCard, { backgroundColor: '#10B98110', borderColor: '#10B981' }]}>
                      <Text style={[styles.nilaiLabel, { fontFamily: Fonts.regular, color: colors.text }]}>
                        Nilai Anda:
                      </Text>
                      <Text style={[styles.nilaiValue, { fontFamily: Fonts.bold, color: '#10B981' }]}>
                        {tugasStatus.nilai}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.statusBanner, { backgroundColor: '#F59E0B20' }]}>
                      <Ionicons name="time" size={20} color="#F59E0B" />
                      <Text style={[styles.statusText, { fontFamily: Fonts.medium, color: '#F59E0B' }]}>
                        Menunggu penilaian
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <>
                  <View style={[styles.infoBanner, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} />
                    <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.text }]}>
                      Upload jawaban ke Google Drive terlebih dahulu, lalu input link di bawah
                    </Text>
                  </View>

                  <TextInput
                    style={[styles.input, { 
                      fontFamily: Fonts.regular, 
                      color: colors.text, 
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      minHeight: 80,
                    }]}
                    placeholder="Paste link Google Drive jawaban"
                    placeholderTextColor={colors.icon}
                    value={driveLink}
                    onChangeText={setDriveLink}
                    autoCapitalize="none"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: colors.primary },
                      (!driveLink.trim() || uploadingTugas) && styles.disabledButton,
                    ]}
                    onPress={handleUploadTugas}
                    disabled={!driveLink.trim() || uploadingTugas}
                  >
                    {uploadingTugas ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="send" size={20} color="#FFF" />
                        <Text style={[styles.submitButtonText, { fontFamily: Fonts.semiBold }]}>
                          Submit Jawaban
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    // Render Presensi Tab
    if (activeTab === 'presensi') {
      return (
        <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
          {/* Submit Presensi Form - Only for non-asisten */}
          {user?.role !== 'asisten' && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-done" size={24} color={colors.primary} />
                <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Submit Presensi
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.medium, color: colors.text }]}>
                  NIM
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  value={nim}
                  onChangeText={setNim}
                  placeholder="Masukkan NIM"
                  placeholderTextColor={colors.icon}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.medium, color: colors.text }]}>
                  Nama Lengkap
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  value={nama}
                  onChangeText={setNama}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={colors.icon}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.medium, color: colors.text }]}>
                  Kelompok
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  value={kelompok}
                  onChangeText={setKelompok}
                  placeholder="Masukkan nomor kelompok"
                  placeholderTextColor={colors.icon}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.primary },
                  (!nim || !nama || !kelompok || submittingPresensi) && styles.disabledButton,
                ]}
                onPress={handleSubmitPresensi}
                disabled={!nim || !nama || !kelompok || submittingPresensi}
              >
                {submittingPresensi ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={[styles.submitButtonText, { fontFamily: Fonts.semiBold }]}>
                      Submit Presensi
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Asisten Dashboard - Daftar Presensi */}
          {user?.role === 'asisten' && (
            <View>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={24} color="#10B981" />
                <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Daftar Presensi ({presensiList.length})
                </Text>
              </View>

              {loadingAsistenData ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
              ) : presensiList.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color={colors.icon} />
                  <Text style={[styles.emptyStateText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    Belum ada yang presensi
                  </Text>
                </View>
              ) : (
                <View style={styles.listContainer}>
                  {presensiList.map((presensi, index) => (
                    <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                      <View style={styles.presensiRow}>
                        <View style={[styles.kelompokBadge, { backgroundColor: colors.primary }]}>
                          <Text style={[styles.kelompokText, { fontFamily: Fonts.bold }]}>
                            {presensi.kelompok}
                          </Text>
                        </View>
                        <View style={styles.presensiInfo}>
                          <Text style={[styles.listItemName, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                            {presensi.nama}
                          </Text>
                          <Text style={[styles.listItemSubtext, { fontFamily: Fonts.regular, color: colors.icon }]}>
                            NIM: {presensi.nim}
                          </Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      </View>
                      {presensi.createdAt && (
                        <Text style={[styles.timestampText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                          {new Date(presensi.createdAt).toLocaleString('id-ID')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Detail Modul</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { fontFamily: Fonts.regular, color: colors.icon }]}>
            Memuat detail modul...
          </Text>
        </View>
      </View>
    );
  }

  if (!modul) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Detail Modul</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.icon} />
          <Text style={[styles.errorText, { fontFamily: Fonts.regular, color: colors.icon }]}>
            Modul tidak ditemukan
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]} numberOfLines={1}>
          {modul.judul}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {[
            { key: 'dasarTeori' as TabType, label: 'Dasar Teori', icon: 'book' },
            { key: 'alatBahan' as TabType, label: 'Alat & Bahan', icon: 'construct' },
            { key: 'prosedur' as TabType, label: 'Prosedur', icon: 'list' },
            { key: 'tugasAwal' as TabType, label: 'Tugas Awal', icon: 'document' },
            { key: 'presensi' as TabType, label: 'Presensi', icon: 'checkmark-done' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: activeTab === tab.key ? colors.primary : colors.card },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.key ? '#FFF' : colors.icon}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    fontFamily: activeTab === tab.key ? Fonts.semiBold : Fonts.regular,
                    color: activeTab === tab.key ? '#FFF' : colors.text,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Beri Nilai */}
      <Modal
        visible={showNilaiModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNilaiModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontFamily: Fonts.bold, color: colors.text }]}>
                Beri Nilai
              </Text>
              <TouchableOpacity onPress={() => setShowNilaiModal(false)}>
                <Ionicons name="close" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>

            {selectedSubmission && (
              <View style={styles.modalBody}>
                <Text style={[styles.modalLabel, { fontFamily: Fonts.medium, color: colors.text }]}>
                  {selectedSubmission.nama}
                </Text>
                <Text style={[styles.modalSubtext, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  NIM: {selectedSubmission.nim}
                </Text>

                <TextInput
                  style={[styles.modalInput, { 
                    fontFamily: Fonts.regular, 
                    color: colors.text, 
                    borderColor: colors.border,
                    backgroundColor: colors.background 
                  }]}
                  placeholder="Masukkan nilai (0-100)"
                  placeholderTextColor={colors.icon}
                  value={nilaiInput}
                  onChangeText={setNilaiInput}
                  keyboardType="number-pad"
                />

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                    (!nilaiInput.trim() || givingNilai) && styles.disabledButton,
                  ]}
                  onPress={handleGiveNilai}
                  disabled={!nilaiInput.trim() || givingNilai}
                >
                  {givingNilai ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={[styles.modalButtonText, { fontFamily: Fonts.semiBold }]}>
                      Simpan Nilai
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  tabsContainer: {
    marginVertical: 16,
  },
  tabsContent: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  contentCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentText: {
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: 24,
  },
  sectionCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  uploadHint: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: isSmallScreen ? 14 : 15,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: isSmallScreen ? 13 : 14,
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: isSmallScreen ? 14 : 15,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: isSmallScreen ? 14 : 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: isSmallScreen ? 15 : 16,
    marginBottom: 4,
  },
  listItemSubtext: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  timestampText: {
    fontSize: 11,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  presensiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  kelompokBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kelompokText: {
    color: '#FFF',
    fontSize: 16,
  },
  presensiInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  asistenSection: {
    marginTop: 16,
  },
  // New styles for Tugas Awal redesign
  soalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  soalTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    marginBottom: 4,
  },
  soalSubtext: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 18,
  },
  nilaiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 12,
  },
  nilaiLabel: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  nilaiValue: {
    fontSize: isSmallScreen ? 24 : 28,
  },
  nilaiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  nilaiText: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 18 : 20,
  },
  modalBody: {
    gap: 16,
  },
  modalLabel: {
    fontSize: isSmallScreen ? 15 : 16,
  },
  modalSubtext: {
    fontSize: isSmallScreen ? 12 : 13,
    marginTop: -8,
  },
  modalInput: {
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: isSmallScreen ? 14 : 15,
  },
  modalButton: {
    paddingVertical: isSmallScreen ? 14 : 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 15,
  },
});
