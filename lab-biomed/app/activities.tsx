import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const ACTIVITIES = [
  {
    id: 1,
    title: 'Praktikum Mingguan',
    icon: 'flask',
    color: '#3B82F6',
    description: 'Praktikum rutin setiap minggu untuk setiap mata kuliah yang melibatkan eksperimen langsung dengan peralatan medis',
    schedule: 'Senin - Jumat, 08:00 - 17:00',
    participants: '15-20 mahasiswa per sesi',
  },
  {
    id: 2,
    title: 'Workshop & Seminar',
    icon: 'people',
    color: '#10B981',
    description: 'Seminar bulanan dengan menghadirkan praktisi industri dan peneliti untuk berbagi knowledge terkini',
    schedule: 'Setiap bulan',
    participants: '50-100 peserta',
  },
  {
    id: 3,
    title: 'Kompetisi Inovasi',
    icon: 'trophy',
    color: '#F59E0B',
    description: 'Kompetisi tahunan untuk mahasiswa merancang dan membuat prototype alat kesehatan inovatif',
    schedule: 'Setiap semester',
    participants: '20-30 tim',
  },
  {
    id: 4,
    title: 'Riset Kolaboratif',
    icon: 'git-network',
    color: '#8B5CF6',
    description: 'Program riset bersama dengan rumah sakit dan industri kesehatan untuk proyek aplikatif',
    schedule: 'Ongoing',
    participants: 'Dosen & Mahasiswa S2/S3',
  },
  {
    id: 5,
    title: 'Lab Tour & Open House',
    icon: 'home',
    color: '#EC4899',
    description: 'Kunjungan laboratorium untuk siswa SMA dan masyarakat umum untuk mengenal teknologi biomedis',
    schedule: 'Setiap 3 bulan',
    participants: '30-50 pengunjung',
  },
  {
    id: 6,
    title: 'Training Alat Medis',
    icon: 'settings',
    color: '#EF4444',
    description: 'Pelatihan penggunaan dan maintenance peralatan medis untuk teknisi rumah sakit',
    schedule: 'Sesuai permintaan',
    participants: '10-15 teknisi',
  },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Workshop AI in Medical Imaging',
    date: '15 Januari 2026',
    time: '13:00 - 16:00',
    location: 'Lab Biomedis Gedung STEI-K',
    type: 'Workshop',
    status: 'Registrasi Dibuka',
  },
  {
    id: 2,
    title: 'Seminar Telemedicine Technology',
    date: '25 Januari 2026',
    time: '09:00 - 12:00',
    location: 'Aula STEI',
    type: 'Seminar',
    status: 'Coming Soon',
  },
  {
    id: 3,
    title: 'Biomedical Innovation Competition 2026',
    date: '10 Februari 2026',
    time: '08:00 - 17:00',
    location: 'Lab Biomedis',
    type: 'Competition',
    status: 'Registrasi Dibuka',
  },
];

export default function ActivitiesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Activities</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/Labdas/Labdas3.jpg')}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Ionicons name="calendar" size={32} color="#FFF" />
            <Text style={[styles.bannerTitle, { fontFamily: Fonts.bold }]}>
              Kegiatan Laboratorium
            </Text>
            <Text style={[styles.bannerSubtitle, { fontFamily: Fonts.regular }]}>
              Berbagai aktivitas edukatif dan kolaboratif
            </Text>
          </View>
        </View>

        {/* Regular Activities */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pulse" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Kegiatan Rutin
            </Text>
          </View>

          <View style={styles.activitiesList}>
            {ACTIVITIES.map((activity) => (
              <View
                key={activity.id}
                style={[styles.activityCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBadge, { backgroundColor: activity.color + '20' }]}>
                    <Ionicons name={activity.icon as any} size={24} color={activity.color} />
                  </View>
                  <View style={styles.titleContainer}>
                    <Text style={[styles.activityTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                      {activity.title}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.description, { fontFamily: Fonts.regular, color: colors.text }]}>
                  {activity.description}
                </Text>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons name="time" size={16} color={colors.icon} />
                    <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                      {activity.schedule}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="people" size={16} color={colors.icon} />
                    <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                      {activity.participants}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={[styles.content, { paddingTop: 0 }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Event Mendatang
            </Text>
          </View>

          <View style={styles.eventsList}>
            {UPCOMING_EVENTS.map((event) => (
              <View
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.eventHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.typeText, { fontFamily: Fonts.medium, color: colors.primary }]}>
                      {event.type}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor: event.status === 'Registrasi Dibuka' ? '#10B98120' : colors.background
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      {
                        fontFamily: Fonts.medium,
                        color: event.status === 'Registrasi Dibuka' ? '#10B981' : colors.icon
                      }
                    ]}>
                      {event.status}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.eventTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  {event.title}
                </Text>

                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color={colors.icon} />
                    <Text style={[styles.detailText, { fontFamily: Fonts.regular, color: colors.text }]}>
                      {event.date}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color={colors.icon} />
                    <Text style={[styles.detailText, { fontFamily: Fonts.regular, color: colors.text }]}>
                      {event.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color={colors.icon} />
                    <Text style={[styles.detailText, { fontFamily: Fonts.regular, color: colors.text }]}>
                      {event.location}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
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
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontSize: 22,
    color: '#FFF',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    padding: isSmallScreen ? 16 : 20,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  description: {
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 20,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
  },
  eventTitle: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: isSmallScreen ? 12 : 13,
  },
});
