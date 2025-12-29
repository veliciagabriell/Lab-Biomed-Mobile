import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL, API_ENDPOINTS } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
    disabled?: boolean;
  };
}

export default function PeminjamanLabScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, isAuthenticated } = useAuth();

  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [loading, setLoading] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'peminjaman' | 'riwayat'>('peminjaman');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Form state
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nim, setNim] = useState('');
  const [jumlahOrang, setJumlahOrang] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('');
  const [waktuSelesai, setWaktuSelesai] = useState('');
  const [keperluan, setKeperluan] = useState('');

  // Populate user data
  useEffect(() => {
    if (user) {
      setNim(user.nim);
    }
  }, [user]);

  // Load booked dates and history
  useEffect(() => {
    loadBookedDates();
    loadBookingHistory();
  }, []);

  const loadBookedDates = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}${API_ENDPOINTS.PEMINJAMAN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const bookings = await response.json();
        const marked: MarkedDates = {};

        bookings.forEach((booking: any) => {
          if (booking.status === 'approved' || booking.status === 'pending') {
            marked[booking.tanggal] = {
              marked: true,
              dotColor: booking.status === 'approved' ? '#10B981' : '#F59E0B',
            };
          }
        });

        setMarkedDates(marked);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const loadBookingHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Loading history with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.PEMINJAMAN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('History response status:', response.status);

      if (response.ok) {
        const bookings = await response.json();
        console.log('Bookings loaded:', bookings.length);
        // Sort by date descending
        const sorted = bookings.sort((a: any, b: any) => {
          return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
        });
        setBookingHistory(sorted);
      } else {
        const errorData = await response.json();
        console.error('History load error:', errorData);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDateSelect = (day: DateData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(day.dateString);

    if (selected < today) {
      Alert.alert('Error', 'Tidak bisa memilih tanggal yang sudah lewat');
      return;
    }

    setSelectedDate(day.dateString);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'Please login first');
      router.push('/auth/login');
      return;
    }

    if (!selectedDate || !namaLengkap || !nim || !jumlahOrang || !waktuMulai || !waktuSelesai || !keperluan) {
      Alert.alert('Error', 'Mohon lengkapi semua field');
      return;
    }

    // Validate time format HH:mm
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(waktuMulai) || !timeRegex.test(waktuSelesai)) {
      Alert.alert('Error', 'Format waktu harus HH:mm (contoh: 09:00)');
      return;
    }

    if (waktuSelesai <= waktuMulai) {
      Alert.alert('Error', 'Waktu selesai harus lebih besar dari waktu mulai');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}${API_ENDPOINTS.PEMINJAMAN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName: namaLengkap,
          userNim: nim,
          tanggal: selectedDate,
          waktuMulai,
          waktuSelesai,
          jumlahOrang: parseInt(jumlahOrang),
          keperluan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat peminjaman');
      }

      Alert.alert(
        'Berhasil',
        'Peminjaman berhasil diajukan! Menunggu approval dari asisten.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedDate('');
              setNamaLengkap('');
              setJumlahOrang('');
              setWaktuMulai('');
              setWaktuSelesai('');
              setKeperluan('');
              loadBookedDates();
              loadBookingHistory(); // Reload history
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'Gagal mengajukan peminjaman');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for calendar min date
  const today = new Date().toISOString().split('T')[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      case 'cancelled':
        return '#6B7280';
      default:
        return colors.icon;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'pending':
        return 'Menunggu';
      case 'rejected':
        return 'Ditolak';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const handleApprove = async (bookingId: string) => {
    Alert.alert(
      'Setujui Peminjaman',
      'Apakah Anda yakin ingin menyetujui peminjaman ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Setujui',
          style: 'default',
          onPress: async () => {
            try {
              setProcessingId(bookingId);
              const token = await AsyncStorage.getItem('userToken');
              const response = await fetch(`${API_URL}${API_ENDPOINTS.PEMINJAMAN}/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'approved' }),
              });

              if (response.ok) {
                Alert.alert('Berhasil', 'Peminjaman telah disetujui');
                await loadBookingHistory();
                await loadBookedDates();
              } else {
                const error = await response.json();
                Alert.alert('Error', error.message || 'Gagal menyetujui peminjaman');
              }
            } catch (error) {
              console.error('Error approving:', error);
              Alert.alert('Error', 'Terjadi kesalahan saat menyetujui peminjaman');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (bookingId: string) => {
    Alert.prompt(
      'Tolak Peminjaman',
      'Masukkan alasan penolakan:',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tolak',
          style: 'destructive',
          onPress: async (reason?: string) => {
            if (!reason || reason.trim() === '') {
              Alert.alert('Error', 'Alasan penolakan harus diisi');
              return;
            }

            try {
              setProcessingId(bookingId);
              const token = await AsyncStorage.getItem('userToken');
              const response = await fetch(`${API_URL}${API_ENDPOINTS.PEMINJAMAN}/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                  status: 'rejected',
                  rejectedReason: reason.trim(),
                }),
              });

              if (response.ok) {
                Alert.alert('Berhasil', 'Peminjaman telah ditolak');
                await loadBookingHistory();
                await loadBookedDates();
              } else {
                const error = await response.json();
                Alert.alert('Error', error.message || 'Gagal menolak peminjaman');
              }
            } catch (error) {
              console.error('Error rejecting:', error);
              Alert.alert('Error', 'Terjadi kesalahan saat menolak peminjaman');
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
          Peminjaman Laboratorium
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
              name="calendar" 
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
              setActiveTab('riwayat');
              loadBookingHistory();
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

        {/* Content based on active tab */}
        {activeTab === 'peminjaman' ? (
          <>
            {/* Calendar */}
            <View style={[styles.calendarCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Pilih Tanggal
              </Text>
          <Calendar
            minDate={today}
            onDayPress={handleDateSelect}
            markedDates={{
              ...markedDates,
              ...(selectedDate && {
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary,
                  ...markedDates[selectedDate],
                },
              }),
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
        {selectedDate && (
          <View style={[styles.formCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Formulir Peminjaman Laboratorium
            </Text>
            <Text style={[styles.formSubtitle, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Ajukan peminjaman laboratorium di sini dan tunggu persetujuan asistenmu!
            </Text>

            {/* Nama Lengkap */}
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

            {/* NIM */}
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
                editable={!user} // Disable if user is logged in
              />
            </View>

            {/* Jumlah Orang */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                Jumlah Orang<Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                placeholder="Masukkan jumlah orang"
                placeholderTextColor={colors.icon}
                value={jumlahOrang}
                onChangeText={setJumlahOrang}
                keyboardType="numeric"
              />
            </View>

            {/* Tanggal (readonly) */}
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

            {/* Waktu */}
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

            {/* Keperluan */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.text }]}>
                Keperluan<Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <TextInput
                style={[styles.textArea, { fontFamily: Fonts.regular, color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
                placeholder="Jelaskan keperluan peminjaman laboratorium"
                placeholderTextColor={colors.icon}
                value={keperluan}
                onChangeText={setKeperluan}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
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
                  <Text style={[styles.submitButtonText, { fontFamily: Fonts.bold }]}>
                    Kirim
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {!selectedDate && (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="calendar-outline" size={64} color={colors.icon} />
            <Text style={[styles.emptyText, { fontFamily: Fonts.medium, color: colors.text }]}>
              Pilih tanggal untuk melanjutkan
            </Text>
          </View>
        )}
          </>
        ) : (
          /* Riwayat Tab Content */
          <View>
            {/* Stats Cards */}
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

            {/* History List */}
            <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
              <View style={styles.historyHeader}>
                <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Semua Riwayat
                </Text>
                <TouchableOpacity onPress={loadBookingHistory}>
                  <Ionicons name="refresh" size={20} color={colors.icon} />
                </TouchableOpacity>
              </View>

              {loadingHistory ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 40 }} />
              ) : bookingHistory.length === 0 ? (
                <View style={styles.emptyHistory}>
                  <Ionicons name="calendar-outline" size={64} color={colors.icon} />
                  <Text style={[styles.emptyHistoryText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    Belum ada riwayat peminjaman
                  </Text>
                  <TouchableOpacity
                    style={[styles.createButton, { backgroundColor: colors.primary }]}
                    onPress={() => setActiveTab('peminjaman')}
                  >
                    <Ionicons name="add" size={20} color="#FFF" />
                    <Text style={[styles.createButtonText, { fontFamily: Fonts.semiBold }]}>
                      Buat Peminjaman
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.historyList}>
                  {bookingHistory.map((booking, index) => (
                    <View key={booking.id || index} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                      <View style={styles.historyItemHeader}>
                        <Text style={[styles.historyDate, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                          {new Date(booking.tanggal).toLocaleDateString('id-ID', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                          <Text style={[styles.statusText, { fontFamily: Fonts.semiBold, color: getStatusColor(booking.status) }]}>
                            {getStatusLabel(booking.status)}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.historyTime, { fontFamily: Fonts.regular, color: colors.icon }]}>
                        {booking.waktuMulai} - {booking.waktuSelesai} • {booking.jumlahOrang} orang
                      </Text>
                      <Text style={[styles.historyKeperluan, { fontFamily: Fonts.regular, color: colors.text }]} numberOfLines={2}>
                        {booking.keperluan}
                      </Text>
                      
                      {/* User Info for Asisten */}
                      {user?.role === 'asisten' && (
                        <View style={styles.userInfo}>
                          <Ionicons name="person-outline" size={14} color={colors.icon} />
                          <Text style={[styles.userInfoText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                            {booking.userName} • {booking.userNim}
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

                      {/* Action Buttons for Asisten */}
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
  content: {
    flex: 1,
    padding: isSmallScreen ? 16 : 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardNumber: {
    fontSize: isSmallScreen ? 20 : 24,
  },
  statCardLabel: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 15,
  },
  calendarCard: {
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
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
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
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
  formSubtitle: {
    fontSize: isSmallScreen ? 12 : 13,
    marginBottom: 20,
    lineHeight: 20,
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
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: isSmallScreen ? 14 : 15,
    minHeight: 100,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? 14 : 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 15 : 16,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  historyCard: {
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  emptyHistoryText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 6,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: isSmallScreen ? 11 : 12,
    textTransform: 'uppercase',
  },
  historyTime: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  historyKeperluan: {
    fontSize: isSmallScreen ? 13 : 14,
    marginTop: 4,
  },
  rejectedReason: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  rejectedReasonText: {
    flex: 1,
    fontSize: isSmallScreen ? 12 : 13,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  userInfoText: {
    fontSize: isSmallScreen ? 12 : 13,
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
    fontSize: isSmallScreen ? 13 : 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
});
