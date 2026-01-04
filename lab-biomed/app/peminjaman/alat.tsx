import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

type TabType = 'peminjaman' | 'riwayat';

const ALAT_CATALOG = [
  { id: 1, name: 'Biopac', image: require('@/assets/images/Alat Lab/Biopac.jpg'), stock: 5 },
  { id: 2, name: 'Generator Sinyal', image: require('@/assets/images/Alat Lab/GeneratorSinyal.webp'), stock: 3 },
  { id: 3, name: 'Jangka Sorong', image: require('@/assets/images/Alat Lab/JangkaSorong.jpg'), stock: 10 },
  { id: 4, name: 'Osiloskop', image: require('@/assets/images/Alat Lab/Osiloskop.jpg'), stock: 4 },
  { id: 5, name: 'Power Supply', image: require('@/assets/images/Alat Lab/PowerSupply.jpg'), stock: 6 },
  { id: 6, name: 'Mikrometer', image: require('@/assets/images/Alat Lab/mikrometer.jpg'), stock: 8 },
];

export default function PeminjamanAlatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('peminjaman');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAlat, setSelectedAlat] = useState<any>(null);
  
  // Form state
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nim, setNim] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('');
  const [waktuSelesai, setWaktuSelesai] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [loading, setLoading] = useState(false);

  // History state
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNamaLengkap(user.email.split('@')[0] || '');
      setNim(user.nim || '');
    }
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, [user]);

  useEffect(() => {
    if (activeTab === 'riwayat') {
      loadBookingHistory();
    }
  }, [activeTab]);

  const loadBookingHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/peminjaman-alat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookingHistory(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(
        'Login Diperlukan',
        'Silakan login terlebih dahulu untuk melakukan peminjaman alat',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    if (!selectedAlat) {
      Alert.alert('Error', 'Pilih alat terlebih dahulu');
      return;
    }

    if (!namaLengkap || !nim || !jumlah || !waktuMulai || !waktuSelesai || !keperluan) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    const jumlahInt = parseInt(jumlah);
    if (isNaN(jumlahInt) || jumlahInt < 1) {
      Alert.alert('Error', 'Jumlah harus berupa angka positif');
      return;
    }

    if (jumlahInt > selectedAlat.stock) {
      Alert.alert('Error', `Stok tidak cukup. Tersedia: ${selectedAlat.stock}`);
      return;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(waktuMulai) || !timeRegex.test(waktuSelesai)) {
      Alert.alert('Error', 'Format waktu harus HH:mm (contoh: 08:00)');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/peminjaman-alat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alatId: selectedAlat.id,
          namaAlat: selectedAlat.name,
          namaLengkap,
          nim,
          jumlah: jumlahInt,
          tanggal: selectedDate,
          waktuMulai,
          waktuSelesai,
          keperluan,
        }),
      });

      if (response.ok) {
        Alert.alert('Berhasil', 'Peminjaman alat berhasil diajukan!');
        // Reset form
        setSelectedAlat(null);
        setJumlah('');
        setWaktuMulai('');
        setWaktuSelesai('');
        setKeperluan('');
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Gagal mengajukan peminjaman');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengajukan peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return colors.icon;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui';
      case 'pending': return 'Menunggu';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const handleApprove = async (id: string) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menyetujui peminjaman ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Setujui',
          onPress: async () => {
            setProcessingId(id);
            try {
              const token = await AsyncStorage.getItem('userToken');
              const response = await fetch(`${API_URL}/peminjaman-alat/${id}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'approved' }),
              });

              if (response.ok) {
                Alert.alert('Berhasil', 'Peminjaman disetujui');
                loadBookingHistory();
              } else {
                Alert.alert('Error', 'Gagal menyetujui peminjaman');
              }
            } catch (error) {
              Alert.alert('Error', 'Terjadi kesalahan');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (id: string) => {
    Alert.prompt(
      'Alasan Penolakan',
      'Masukkan alasan penolakan:',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tolak',
          onPress: async (reason) => {
            if (!reason) {
              Alert.alert('Error', 'Alasan penolakan harus diisi');
              return;
            }
            setProcessingId(id);
            try {
              const token = await AsyncStorage.getItem('userToken');
              const response = await fetch(`${API_URL}/peminjaman-alat/${id}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'rejected', rejectedReason: reason }),
              });

              if (response.ok) {
                Alert.alert('Berhasil', 'Peminjaman ditolak');
                loadBookingHistory();
              } else {
                Alert.alert('Error', 'Gagal menolak peminjaman');
              }
            } catch (error) {
              Alert.alert('Error', 'Terjadi kesalahan');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>
          Peminjaman Alat
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tab Switcher */}
        <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'peminjaman' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveTab('peminjaman')}
        >
          <Ionicons 
            name="flask" 
            size={20} 
            color={activeTab === 'peminjaman' ? '#FFF' : colors.icon} 
          />
          <Text
            style={[
              styles.tabText,
              { fontFamily: Fonts.semiBold },
              activeTab === 'peminjaman'
                ? { color: '#FFF' }
                : { color: colors.icon },
            ]}
          >
            Peminjaman
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'riwayat' && { backgroundColor: colors.primary },
          ]}
          onPress={() => {
            if (!user) {
              Alert.alert(
                'Login Diperlukan',
                'Silakan login terlebih dahulu untuk melihat riwayat peminjaman',
                [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Login', onPress: () => router.push('/auth/login') }
                ]
              );
              return;
            }
            setActiveTab('riwayat');
          }}
        >
          <Ionicons 
            name="time" 
            size={20} 
            color={activeTab === 'riwayat' ? '#FFF' : colors.icon} 
          />
          <Text
            style={[
              styles.tabText,
              { fontFamily: Fonts.semiBold },
              activeTab === 'riwayat'
                ? { color: '#FFF' }
                : { color: colors.icon },
            ]}
          >
            Riwayat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'peminjaman' ? (
          <>
            {/* Login Info for non-logged users */}
            {!user && (
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Silakan login terlebih dahulu untuk melakukan peminjaman alat
                </Text>
              </View>
            )}
            
            {/* Catalog Section */}
            <View style={[styles.catalogCard, { backgroundColor: colors.card }]}>
              <View style={styles.catalogHeader}>
                <Ionicons name="hardware-chip" size={24} color={colors.primary} />
                <Text style={[styles.catalogTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Pilih Alat
                </Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catalogScroll}
              >
                {ALAT_CATALOG.map((alat) => (
                  <TouchableOpacity
                    key={alat.id}
                    style={[
                      styles.catalogItem,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      selectedAlat?.id === alat.id && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedAlat(alat)}
                  >
                    <Image source={alat.image} style={styles.catalogImage} />
                    <Text style={[styles.catalogItemName, { fontFamily: Fonts.medium, color: colors.text }]}>
                      {alat.name}
                    </Text>
                    <View style={[styles.stockBadge, { backgroundColor: alat.stock > 0 ? '#10B98120' : '#EF444420' }]}>
                      <Text style={[styles.stockText, { fontFamily: Fonts.semiBold, color: alat.stock > 0 ? '#10B981' : '#EF4444' }]}>
                        Stok: {alat.stock}
                      </Text>
                    </View>
                    {selectedAlat?.id === alat.id && (
                      <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={16} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Calendar */}
            <View style={[styles.calendarCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Pilih Tanggal
              </Text>
              <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: colors.primary }
                }}
                theme={{
                  backgroundColor: colors.card,
                  calendarBackground: colors.card,
                  textSectionTitleColor: colors.text,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: '#FFF',
                  todayTextColor: colors.primary,
                  dayTextColor: colors.text,
                  textDisabledColor: colors.icon,
                  dotColor: colors.primary,
                  monthTextColor: colors.text,
                  textMonthFontFamily: Fonts.semiBold,
                  textDayFontFamily: Fonts.regular,
                  textDayHeaderFontFamily: Fonts.medium,
                }}
                minDate={new Date().toISOString().split('T')[0]}
              />
              
              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.legendText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    Approved
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={[styles.legendText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>

            {/* Form */}
            <View style={[styles.formCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Form Peminjaman
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Nama Lengkap<Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={colors.icon}
                  value={namaLengkap}
                  onChangeText={setNamaLengkap}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                  NIM<Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  placeholder="Masukkan NIM"
                  placeholderTextColor={colors.icon}
                  value={nim}
                  onChangeText={setNim}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Jumlah<Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  placeholder="Masukkan jumlah alat"
                  placeholderTextColor={colors.icon}
                  value={jumlah}
                  onChangeText={setJumlah}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Tanggal<Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <View style={[styles.input, styles.readonlyInput, { backgroundColor: colors.icon + '20', borderColor: colors.border }]}>
                  <Text style={[styles.readonlyText, { fontFamily: Fonts.medium, color: colors.text }]}>
                    {selectedDate}
                  </Text>
                </View>
              </View>

              <View style={styles.timeRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                    Waktu Mulai<Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                    placeholder="08:00"
                    placeholderTextColor={colors.icon}
                    value={waktuMulai}
                    onChangeText={setWaktuMulai}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                    Waktu Selesai<Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                    placeholder="17:00"
                    placeholderTextColor={colors.icon}
                    value={waktuSelesai}
                    onChangeText={setWaktuSelesai}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Keperluan<Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textArea, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                  placeholder="Jelaskan keperluan peminjaman alat"
                  placeholderTextColor={colors.icon}
                  value={keperluan}
                  onChangeText={setKeperluan}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    <Text style={[styles.submitButtonText, { fontFamily: Fonts.semiBold }]}>
                      Ajukan Peminjaman
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Riwayat Tab

          <View>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIconCircle, { backgroundColor: '#F59E0B20' }]}>
                  <Ionicons name="time" size={24} color="#F59E0B" />
                </View>
                <Text style={[styles.statCardNumber, { fontFamily: Fonts.bold, color: colors.text }]}>
                  {bookingHistory.filter(b => b.status === 'pending').length}
                </Text>
                <Text style={[styles.statCardLabel, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Menunggu
                </Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIconCircle, { backgroundColor: '#10B98120' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
                <Text style={[styles.statCardNumber, { fontFamily: Fonts.bold, color: colors.text }]}>
                  {bookingHistory.filter(b => b.status === 'approved').length}
                </Text>
                <Text style={[styles.statCardLabel, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Disetujui
                </Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIconCircle, { backgroundColor: '#EF444420' }]}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </View>
                <Text style={[styles.statCardNumber, { fontFamily: Fonts.bold, color: colors.text }]}>
                  {bookingHistory.filter(b => b.status === 'rejected').length}
                </Text>
                <Text style={[styles.statCardLabel, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Ditolak
                </Text>
              </View>
            </View>
          

          <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
            <View style={styles.historyHeader}>
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Riwayat Peminjaman
              </Text>
              <TouchableOpacity onPress={loadBookingHistory}>
                <Ionicons name="refresh" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>

            {loadingHistory ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 40 }} />
            ) : bookingHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="cube-outline" size={64} color={colors.icon} />
                <Text style={[styles.emptyHistoryText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Belum ada riwayat peminjaman alat
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {bookingHistory.map((booking, index) => (
                  <View key={booking.id || index} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.historyItemHeader}>
                      <View>
                        <Text style={[styles.historyAlatName, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                          {booking.namaAlat}
                        </Text>
                        <Text style={[styles.historyDate, { fontFamily: Fonts.regular, color: colors.icon }]}>
                          {new Date(booking.tanggal).toLocaleDateString('id-ID')} • {booking.jumlah} unit
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                        <Text style={[styles.statusText, { fontFamily: Fonts.semiBold, color: getStatusColor(booking.status) }]}>
                          {getStatusLabel(booking.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.historyTime, { fontFamily: Fonts.regular, color: colors.icon }]}>
                      {booking.waktuMulai} - {booking.waktuSelesai}
                    </Text>
                    <Text style={[styles.historyKeperluan, { fontFamily: Fonts.regular, color: colors.text }]} numberOfLines={2}>
                      {booking.keperluan}
                    </Text>

                    {user?.role === 'asisten' && (
                      <View style={styles.userInfo}>
                        <Ionicons name="person-outline" size={14} color={colors.icon} />
                        <Text style={[styles.userInfoText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                          {booking.namaLengkap} • {booking.nim}
                        </Text>
                      </View>
                    )}

                    {booking.status === 'rejected' && booking.rejectedReason && (
                      <View style={[styles.rejectedReason, { backgroundColor: '#FEE2E2' }]}>
                        <Ionicons name="information-circle" size={16} color="#EF4444" />
                        <Text style={[styles.rejectedReasonText, { fontFamily: Fonts.regular, color: '#DC2626' }]}>
                          {booking.rejectedReason}
                        </Text>
                      </View>
                    )}

                    {user?.role === 'asisten' && booking.status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.approveButton, processingId === booking.id && styles.disabledButton]}
                          onPress={() => handleApprove(booking.id)}
                          disabled={processingId === booking.id}
                        >
                          {processingId === booking.id ? (
                            <ActivityIndicator size="small" color="#FFF" />
                          ) : (
                            <>
                              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
                              <Text style={[styles.actionButtonText, { fontFamily: Fonts.semiBold }]}>Setujui</Text>
                            </>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.rejectButton, processingId === booking.id && styles.disabledButton]}
                          onPress={() => handleReject(booking.id)}
                          disabled={processingId === booking.id}
                        >
                          <Ionicons name="close-circle" size={18} color="#FFF" />
                          <Text style={[styles.actionButtonText, { fontFamily: Fonts.semiBold }]}>Tolak</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
          </View>
        )}
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: isSmallScreen ? 16 : 18,
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
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
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  content: {
    flex: 1,
  },
  catalogCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 20,
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
  catalogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  catalogTitle: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  catalogScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  catalogItem: {
    width: 140,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    position: 'relative',
  },
  catalogImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  catalogItemName: {
    fontSize: 14,
    marginBottom: 6,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 11,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCard: {
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
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
  },
  formCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 20,
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
  inputGroup: {
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
  readonlyInput: {
    justifyContent: 'center',
  },
  readonlyText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: isSmallScreen ? 14 : 15,
    height: 100,
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
  historyCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 20,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 20,
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyHistoryText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  historyAlatName: {
    fontSize: isSmallScreen ? 15 : 16,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
  },
  historyTime: {
    fontSize: isSmallScreen ? 12 : 13,
    marginBottom: 6,
  },
  historyKeperluan: {
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  userInfoText: {
    fontSize: 12,
  },
  rejectedReason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  rejectedReasonText: {
    fontSize: 12,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 20,
    marginBottom: 16,
    padding: isSmallScreen ? 14 : 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoText: {
    flex: 1,
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
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
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardNumber: {
    fontSize: isSmallScreen ? 22 : 24,
    marginTop: 4,
  },
  statCardLabel: {
    fontSize: isSmallScreen ? 11 : 12,
    textAlign: 'center',
  },
  historyCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 20,
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
});
