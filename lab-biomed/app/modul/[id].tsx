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

type TabType = 'deskripsi' | 'tujuan' | 'dasarTeori' | 'alatBahan' | 'prosedur';

export default function ModulDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const [modul, setModul] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('deskripsi');
  
  // Tugas Awal State
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadingTugas, setUploadingTugas] = useState(false);
  const [tugasStatus, setTugasStatus] = useState<any>(null);
  
  // Presensi State
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [kelompok, setKelompok] = useState('');
  const [submittingPresensi, setSubmittingPresensi] = useState(false);

  useEffect(() => {
    if (id) {
      loadModulDetail();
      checkTugasStatus();
    }
    if (user) {
      setNim(user.nim || '');
      // Extract name from email (before @) as fallback
      const nameFromEmail = user.email.split('@')[0];
      setNama(nameFromEmail || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      const response = await fetch(
        `${API_URL}/tugas-awal/modul/${id}/status?nim=${user.nim}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTugasStatus(data);
      }
    } catch (error) {
      console.error('Error checking tugas status:', error);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Gagal memilih file');
    }
  };

  const handleUploadTugas = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Pilih file terlebih dahulu');
      return;
    }

    if (!user?.nim || !user?.email) {
      Alert.alert('Error', 'Data user tidak lengkap');
      return;
    }

    setUploadingTugas(true);
    try {
      // For now, we'll use a placeholder URL. In production, upload to Firebase Storage first
      const fileUrl = `https://storage.example.com/tugas/${user.nim}/${selectedFile.name}`;

      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/tugas-awal/modul/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: user.email.split('@')[0],
          nim: user.nim,
          submission_url: fileUrl,
        }),
      });

      if (response.ok) {
        Alert.alert('Berhasil', 'Tugas awal berhasil disubmit!');
        setSelectedFile(null);
        await checkTugasStatus();
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Gagal submit tugas awal');
      }
    } catch (error) {
      console.error('Error uploading tugas:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat submit tugas');
    } finally {
      setUploadingTugas(false);
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

  const renderTabContent = () => {
    if (!modul) return null;

    const content = {
      deskripsi: modul.deskripsi,
      tujuan: modul.tujuan,
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
            { key: 'deskripsi' as TabType, label: 'Deskripsi', icon: 'document-text' },
            { key: 'tujuan' as TabType, label: 'Tujuan', icon: 'flag' },
            { key: 'dasarTeori' as TabType, label: 'Dasar Teori', icon: 'book' },
            { key: 'alatBahan' as TabType, label: 'Alat & Bahan', icon: 'construct' },
            { key: 'prosedur' as TabType, label: 'Prosedur', icon: 'list' },
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

        {/* Tugas Awal Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Tugas Awal
            </Text>
          </View>

          {tugasStatus?.submitted ? (
            <View style={[styles.statusBanner, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.statusText, { fontFamily: Fonts.medium, color: '#10B981' }]}>
                Tugas sudah disubmit
              </Text>
            </View>
          ) : (
            <>
              {selectedFile ? (
                <View style={[styles.filePreview, { backgroundColor: colors.background }]}>
                  <Ionicons name="document-attach" size={32} color={colors.primary} />
                  <View style={styles.fileInfo}>
                    <Text style={[styles.fileName, { fontFamily: Fonts.medium, color: colors.text }]} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <Text style={[styles.fileSize, { fontFamily: Fonts.regular, color: colors.icon }]}>
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedFile(null)}>
                    <Ionicons name="close-circle" size={24} color={colors.icon} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.uploadButton, { borderColor: colors.border }]}
                  onPress={handlePickDocument}
                >
                  <Ionicons name="cloud-upload" size={32} color={colors.primary} />
                  <Text style={[styles.uploadText, { fontFamily: Fonts.medium, color: colors.text }]}>
                    Pilih File
                  </Text>
                  <Text style={[styles.uploadHint, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    PDF, DOC, DOCX, atau gambar
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.primary },
                  (!selectedFile || uploadingTugas) && styles.disabledButton,
                ]}
                onPress={handleUploadTugas}
                disabled={!selectedFile || uploadingTugas}
              >
                {uploadingTugas ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="send" size={20} color="#FFF" />
                    <Text style={[styles.submitButtonText, { fontFamily: Fonts.semiBold }]}>
                      Submit Tugas Awal
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Presensi Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-done" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Presensi
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
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
});
