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

export default function PeminjamanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>
          Peminjaman
        </Text>
        <Text style={[styles.headerSubtitle, { fontFamily: Fonts.regular }]}>
          Book lab space and equipment
        </Text>
      </View>

      {/* Options */}
      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
          onPress={() => router.push('/peminjaman/lab')}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Peminjaman Lab
            </Text>
            <Text style={[styles.optionDescription, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Book laboratory space for your research or practice
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.secondary + '20' }]}>
            <Ionicons name="flask" size={32} color={colors.secondary} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Peminjaman Alat
            </Text>
            <Text style={[styles.optionDescription, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Borrow laboratory equipment and tools
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="time" size={32} color={colors.accent} />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Riwayat Peminjaman
            </Text>
            <Text style={[styles.optionDescription, { fontFamily: Fonts.regular, color: colors.icon }]}>
              View your booking history
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={[styles.infoCard, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name="information-circle" size={24} color={colors.primary} />
        <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.text }]}>
          Silakan login untuk melakukan peminjaman lab atau alat
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: isSmallScreen ? 28 : 32,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: isSmallScreen ? 14 : 16,
  },
  content: {
    padding: isSmallScreen ? 16 : 20,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    gap: 16,
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
  iconCircle: {
    width: isSmallScreen ? 60 : 70,
    height: isSmallScreen ? 60 : 70,
    borderRadius: isSmallScreen ? 30 : 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: isSmallScreen ? 16 : 20,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 20,
  },
});
