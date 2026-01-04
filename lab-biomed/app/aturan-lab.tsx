import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

interface Rule {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const LAB_RULES: Rule[] = [
  {
    id: 1,
    title: 'Keselamatan & Keamanan',
    description: 'Selalu gunakan alat pelindung diri (APD) yang sesuai. Dilarang membawa makanan dan minuman ke dalam laboratorium. Pastikan semua peralatan dalam keadaan aman sebelum dan sesudah digunakan.',
    icon: 'shield-checkmark',
    color: '#10B981',
  },
  {
    id: 2,
    title: 'Penggunaan Peralatan',
    description: 'Gunakan peralatan sesuai prosedur yang telah ditetapkan. Laporkan segera jika terjadi kerusakan atau masalah pada peralatan. Jangan meminjamkan peralatan kepada pihak lain tanpa izin.',
    icon: 'settings',
    color: '#3B82F6',
  },
  {
    id: 3,
    title: 'Kebersihan & Kerapihan',
    description: 'Jaga kebersihan area kerja sebelum dan sesudah praktikum. Buang sampah pada tempatnya. Kembalikan semua peralatan ke tempat semula dalam keadaan bersih dan rapi.',
    icon: 'sparkles',
    color: '#8B5CF6',
  },
  {
    id: 4,
    title: 'Etika & Disiplin',
    description: 'Datang tepat waktu sesuai jadwal yang telah ditentukan. Berpakaian rapi dan sopan. Tidak diperkenankan membuat keributan yang mengganggu praktikan lain.',
    icon: 'time',
    color: '#F59E0B',
  },
  {
    id: 5,
    title: 'Peminjaman & Pengembalian',
    description: 'Lakukan pemesanan/peminjaman melalui sistem yang telah disediakan. Kembalikan peralatan sesuai waktu yang telah disepakati. Periksa kondisi peralatan sebelum dan sesudah peminjaman.',
    icon: 'repeat',
    color: '#EF4444',
  },
  {
    id: 6,
    title: 'Tanggung Jawab',
    description: 'Setiap pengguna bertanggung jawab penuh atas peralatan yang dipinjam. Kerusakan atau kehilangan peralatan akan dikenakan sanksi sesuai ketentuan yang berlaku. Laporkan segera jika terjadi insiden.',
    icon: 'person-circle',
    color: '#EC4899',
  },
  {
    id: 7,
    title: 'Dokumentasi',
    description: 'Isi form peminjaman dengan lengkap dan benar. Simpan bukti peminjaman sebagai arsip pribadi. Pastikan mendapat konfirmasi dari petugas lab sebelum menggunakan fasilitas.',
    icon: 'document-text',
    color: '#14B8A6',
  },
  {
    id: 8,
    title: 'Larangan Khusus',
    description: 'Dilarang keras merokok di area laboratorium. Dilarang menggunakan peralatan untuk kepentingan pribadi di luar akademik. Dilarang mengubah setting atau konfigurasi peralatan tanpa izin.',
    icon: 'close-circle',
    color: '#DC2626',
  },
];

const ADDITIONAL_INFO = [
  {
    id: 1,
    title: 'Jam Operasional',
    content: 'Senin - Jumat: 08.00 - 17.00 WIB\nSabtu: 08.00 - 12.00 WIB\nMinggu & Libur Nasional: Tutup',
    icon: 'time-outline',
  },
  {
    id: 2,
    title: 'Kontak Darurat',
    content: 'Lab Manager: (022) 2501234\nEmail: lab.biomed@itb.ac.id\nWhatsApp: 0812-3456-7890',
    icon: 'call-outline',
  },
  {
    id: 3,
    title: 'Sanksi Pelanggaran',
    content: 'Peringatan tertulis untuk pelanggaran ringan\nSuspend akses lab untuk pelanggaran sedang\nBlacklist untuk pelanggaran berat',
    icon: 'warning-outline',
  },
];

export default function AturanLabScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#8B5CF6' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="document-text" size={32} color="#FFF" />
          <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>
            Aturan Lab
          </Text>
          <Text style={[styles.headerSubtitle, { fontFamily: Fonts.regular }]}>
            Peraturan & Tata Tertib Laboratorium
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction Card */}
        <View style={[styles.introCard, { backgroundColor: colors.card }]}>
          <View style={[styles.introIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
            <Ionicons name="information-circle" size={28} color="#8B5CF6" />
          </View>
          <Text style={[styles.introTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
            Penting untuk Diperhatikan
          </Text>
          <Text style={[styles.introText, { fontFamily: Fonts.regular, color: colors.icon }]}>
            Semua pengguna laboratorium wajib mematuhi peraturan berikut untuk menjaga keselamatan, 
            keamanan, dan kelancaran kegiatan di Laboratorium Teknik Biomedika.
          </Text>
        </View>

        {/* Rules Section */}
        <View style={styles.rulesSection}>
          <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
            Peraturan Utama
          </Text>
          
          {LAB_RULES.map((rule, index) => (
            <View
              key={rule.id}
              style={[styles.ruleCard, { backgroundColor: colors.card }]}
            >
              {/* Left Border */}
              <View style={[styles.ruleBorder, { backgroundColor: rule.color }]} />
              
              {/* Icon */}
              <View style={[styles.ruleIconContainer, { backgroundColor: rule.color + '20' }]}>
                <Ionicons name={rule.icon as any} size={24} color={rule.color} />
              </View>

              {/* Content */}
              <View style={styles.ruleContent}>
                <View style={styles.ruleHeader}>
                  <View style={[styles.ruleNumber, { backgroundColor: rule.color }]}>
                    <Text style={[styles.ruleNumberText, { fontFamily: Fonts.bold }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={[styles.ruleTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                    {rule.title}
                  </Text>
                </View>
                <Text style={[styles.ruleDescription, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  {rule.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Information */}
        <View style={styles.additionalSection}>
          <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
            Informasi Tambahan
          </Text>
          
          {ADDITIONAL_INFO.map((info) => (
            <View
              key={info.id}
              style={[styles.infoCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.infoIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={info.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  {info.title}
                </Text>
                <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  {info.content}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer Note */}
        <View style={[styles.footerNote, { backgroundColor: colors.card }]}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={[styles.footerText, { fontFamily: Fonts.regular, color: colors.text }]}>
            Dengan menggunakan fasilitas laboratorium, Anda dianggap telah membaca, 
            memahami, dan menyetujui untuk mematuhi seluruh peraturan yang berlaku.
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: isSmallScreen ? 16 : 20,
  },
  introCard: {
    padding: isSmallScreen ? 20 : 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
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
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  rulesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    marginBottom: 16,
  },
  ruleCard: {
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
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
  ruleBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  ruleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ruleContent: {
    flex: 1,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleNumberText: {
    fontSize: 14,
    color: '#FFF',
  },
  ruleTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    flex: 1,
  },
  ruleDescription: {
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 20,
  },
  additionalSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    marginBottom: 12,
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
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: isSmallScreen ? 14 : 15,
    marginBottom: 6,
  },
  infoText: {
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 20,
  },
  footerNote: {
    flexDirection: 'row',
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    gap: 12,
    marginBottom: 8,
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
  footerText: {
    flex: 1,
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
