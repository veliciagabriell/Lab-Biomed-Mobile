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

export default function AboutUsScreen() {
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
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>About Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/Labdas/GambarLab1.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, { fontFamily: Fonts.bold }]}>
              Laboratorium Biomedis
            </Text>
            <Text style={[styles.heroSubtitle, { fontFamily: Fonts.regular }]}>
              Institut Teknologi Bandung
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          {/* Vision */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="eye" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Visi
              </Text>
            </View>
            <Text style={[styles.paragraph, { fontFamily: Fonts.regular, color: colors.text }]}>
              Menjadi laboratorium riset dan praktikum biomedis yang unggul dalam pengembangan teknologi kesehatan dan inovasi medis di tingkat nasional dan internasional.
            </Text>
          </View>

          {/* Mission */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flag" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Misi
              </Text>
            </View>
            <View style={styles.missionList}>
              <View style={styles.missionItem}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.missionText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Menyelenggarakan pendidikan dan praktikum berkualitas tinggi di bidang teknik biomedis
                </Text>
              </View>
              <View style={styles.missionItem}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.missionText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Melakukan penelitian inovatif untuk pengembangan teknologi medis dan kesehatan
                </Text>
              </View>
              <View style={styles.missionItem}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.missionText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Berkontribusi dalam peningkatan kualitas pelayanan kesehatan masyarakat
                </Text>
              </View>
              <View style={styles.missionItem}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.missionText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Membangun kolaborasi dengan industri dan institusi kesehatan
                </Text>
              </View>
            </View>
          </View>

          {/* Facilities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cube" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Fasilitas
              </Text>
            </View>
            
            <View style={styles.facilitiesGrid}>
              <View style={[styles.facilityCard, { backgroundColor: colors.background }]}>
                <Ionicons name="flask" size={32} color="#10B981" />
                <Text style={[styles.facilityTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Peralatan Modern
                </Text>
                <Text style={[styles.facilityDesc, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Alat-alat praktikum dan riset terkini
                </Text>
              </View>

              <View style={[styles.facilityCard, { backgroundColor: colors.background }]}>
                <Ionicons name="desktop" size={32} color="#3B82F6" />
                <Text style={[styles.facilityTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Laboratorium Digital
                </Text>
                <Text style={[styles.facilityDesc, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Sistem digital terintegrasi
                </Text>
              </View>

              <View style={[styles.facilityCard, { backgroundColor: colors.background }]}>
                <Ionicons name="people" size={32} color="#F59E0B" />
                <Text style={[styles.facilityTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Ruang Kolaborasi
                </Text>
                <Text style={[styles.facilityDesc, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Area diskusi dan kerja tim
                </Text>
              </View>

              <View style={[styles.facilityCard, { backgroundColor: colors.background }]}>
                <Ionicons name="shield-checkmark" size={32} color="#EF4444" />
                <Text style={[styles.facilityTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                  Standar Keamanan
                </Text>
                <Text style={[styles.facilityDesc, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  Protokol keselamatan ketat
                </Text>
              </View>
            </View>
          </View>

          {/* Lab Photos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                Galeri Laboratorium
              </Text>
            </View>
            
            <View style={styles.gallery}>
              <Image
                source={require('@/assets/images/Labdas/Labdas1.jpg')}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              <Image
                source={require('@/assets/images/Labdas/Labdas2.jpg')}
                style={styles.galleryImage}
                resizeMode="cover"
              />
              <Image
                source={require('@/assets/images/Labdas/Labdas3.jpg')}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            </View>
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
  heroContainer: {
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    padding: isSmallScreen ? 16 : 20,
    gap: 24,
  },
  section: {
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
  paragraph: {
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 22,
  },
  missionList: {
    gap: 12,
  },
  missionItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  missionText: {
    flex: 1,
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 22,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  facilityCard: {
    width: (width - (isSmallScreen ? 44 : 52)) / 2,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    alignItems: 'center',
  },
  facilityTitle: {
    fontSize: isSmallScreen ? 12 : 13,
    textAlign: 'center',
  },
  facilityDesc: {
    fontSize: isSmallScreen ? 10 : 11,
    textAlign: 'center',
  },
  gallery: {
    gap: 12,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});
