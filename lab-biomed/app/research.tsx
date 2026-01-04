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

const RESEARCH_AREAS = [
  {
    id: 1,
    title: 'Medical Imaging & AI',
    icon: 'scan',
    color: '#3B82F6',
    description: 'Pengembangan sistem pemrosesan citra medis menggunakan kecerdasan buatan untuk diagnosis otomatis',
    projects: ['Deep Learning for CT Scan Analysis', 'X-Ray Classification System', 'MRI Segmentation'],
  },
  {
    id: 2,
    title: 'Biosignal Processing',
    icon: 'pulse',
    color: '#10B981',
    description: 'Analisis dan pemrosesan sinyal biomedis seperti ECG, EEG, dan EMG untuk aplikasi medis',
    projects: ['ECG Arrhythmia Detection', 'EEG-based Emotion Recognition', 'EMG Gesture Control'],
  },
  {
    id: 3,
    title: 'Biomedical Instrumentation',
    icon: 'hardware-chip',
    color: '#F59E0B',
    description: 'Perancangan dan pengembangan alat-alat medis berbasis teknologi elektronika dan embedded systems',
    projects: ['Portable Vital Signs Monitor', 'Smart Wheelchair', 'Telemedicine Device'],
  },
  {
    id: 4,
    title: 'Healthcare IoT',
    icon: 'wifi',
    color: '#8B5CF6',
    description: 'Implementasi Internet of Things untuk monitoring kesehatan dan sistem rumah sakit pintar',
    projects: ['Remote Patient Monitoring', 'Smart Hospital System', 'Wearable Health Devices'],
  },
  {
    id: 5,
    title: 'Rehabilitation Engineering',
    icon: 'fitness',
    color: '#EC4899',
    description: 'Teknologi bantu dan rehabilitasi untuk pasien dengan disabilitas fisik',
    projects: ['Exoskeleton for Stroke Patients', 'Prosthetic Hand Control', 'Gait Analysis System'],
  },
  {
    id: 6,
    title: 'Bioinformatics',
    icon: 'git-network',
    color: '#06B6D4',
    description: 'Analisis data genomik dan proteomik menggunakan computational methods',
    projects: ['Disease Prediction Model', 'Drug Discovery Platform', 'Genetic Variant Analysis'],
  },
];

export default function ResearchScreen() {
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
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Research</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/Labdas/GambarLab2.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, { fontFamily: Fonts.bold }]}>
              Riset & Inovasi
            </Text>
            <Text style={[styles.heroSubtitle, { fontFamily: Fonts.regular }]}>
              Mendorong pengembangan teknologi kesehatan masa depan
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { fontFamily: Fonts.bold, color: colors.primary }]}>
              25+
            </Text>
            <Text style={[styles.statLabel, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Ongoing Projects
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { fontFamily: Fonts.bold, color: colors.primary }]}>
              50+
            </Text>
            <Text style={[styles.statLabel, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Publications
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statNumber, { fontFamily: Fonts.bold, color: colors.primary }]}>
              15+
            </Text>
            <Text style={[styles.statLabel, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Collaborations
            </Text>
          </View>
        </View>

        {/* Research Areas */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flask" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Bidang Riset
            </Text>
          </View>

          <View style={styles.researchList}>
            {RESEARCH_AREAS.map((area) => (
              <View
                key={area.id}
                style={[styles.researchCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: area.color + '20' }]}>
                    <Ionicons name={area.icon as any} size={28} color={area.color} />
                  </View>
                  <Text style={[styles.cardTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                    {area.title}
                  </Text>
                </View>

                <Text style={[styles.description, { fontFamily: Fonts.regular, color: colors.text }]}>
                  {area.description}
                </Text>

                <View style={styles.projectsSection}>
                  <Text style={[styles.projectsLabel, { fontFamily: Fonts.medium, color: colors.icon }]}>
                    Current Projects:
                  </Text>
                  {area.projects.map((project, idx) => (
                    <View key={idx} style={styles.projectItem}>
                      <View style={[styles.projectBullet, { backgroundColor: area.color }]} />
                      <Text style={[styles.projectText, { fontFamily: Fonts.regular, color: colors.text }]}>
                        {project}
                      </Text>
                    </View>
                  ))}
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
  heroContainer: {
    height: 200,
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
    fontSize: 22,
    color: '#FFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: isSmallScreen ? 16 : 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  content: {
    padding: isSmallScreen ? 16 : 20,
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  researchList: {
    gap: 16,
  },
  researchCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 15,
  },
  description: {
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 20,
  },
  projectsSection: {
    gap: 8,
  },
  projectsLabel: {
    fontSize: isSmallScreen ? 11 : 12,
    marginBottom: 4,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  projectBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  projectText: {
    flex: 1,
    fontSize: isSmallScreen ? 11 : 12,
    lineHeight: 18,
  },
});
