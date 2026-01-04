import {
  StyleSheet,
  View,
  Text,
  ScrollView,
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

const RULES = [
  {
    id: 1,
    title: 'Kerapihan dan Kebersihan',
    description: 'Jaga kebersihan laboratorium sebelum dan sesuah praktikum',
  },
  {
    id: 2,
    title: 'Penggunaan Alat',
    description: 'Gunakan alat sesuai prosedur dan kembalikan ke tempat semula',
  },
  {
    id: 3,
    title: 'Penjagaan Alat',
    description: 'Pastikan alat yang Anda gunakan selalu dalam keadaan aman',
  },
  {
    id: 4,
    title: 'Presensi',
    description: 'Hadir tepat waktu dan isi presensi dengan benar',
  },
  {
    id: 5,
    title: 'Kumpulkan Tugas Awal',
    description: 'Jangan lupa untuk mengumpulkan tugas awal tepat waktu',
  },
];

export default function AturanPraktikumScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Sama seperti halaman lain */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>
          Aturan Praktikum
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {RULES.map((rule) => (
          <View
            key={rule.id}
            style={[
              styles.ruleCard,
              { backgroundColor: colors.card },
            ]}
          >
            {/* Number Badge */}
            <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.numberText, { fontFamily: Fonts.bold }]}>
                {rule.id}
              </Text>
            </View>

            {/* Content */}
            <View style={styles.ruleContent}>
              <Text style={[styles.ruleTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                {rule.title}
              </Text>
              <Text style={[styles.ruleDescription, { fontFamily: Fonts.regular, color: colors.icon }]}>
                {rule.description}
              </Text>
            </View>
          </View>
        ))}
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
    color: '#FFF',
    fontSize: isSmallScreen ? 16 : 18,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: isSmallScreen ? 16 : 20,
    gap: 16,
  },
  ruleCard: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4E05',
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
  numberBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 20,
    color: '#FFF',
  },
  ruleContent: {
    flex: 1,
    gap: 4,
  },
  ruleTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    lineHeight: 22,
  },
  ruleDescription: {
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 18,
  },
});