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

const LECTURERS = [
  {
    id: 1,
    name: 'Dr. Tami Tina, S.T., M.T.',
    title: 'Kepala Laboratorium',
    expertise: ['Medical Imaging', 'Signal Processing', 'AI in Healthcare'],
    email: 'tami@stei.itb.ac.id',
    image: require('@/assets/images/Dosen/people5.jpeg'),
  },
  {
    id: 2,
    name: 'Kania Melati, S.T., M.T., PhD.',
    title: 'Dosen Senior',
    expertise: ['Medical Image Processing', 'Telemedicine', 'Bioinformatics'],
    email: 'kania@stei.itb.ac.id',
    image: require('@/assets/images/Dosen/people1.jpeg'),
  },
  {
    id: 3,
    name: 'Afan Pramesworo, S.T., M.T.',
    title: 'Dosen',
    expertise: ['Biomedical Instrumentation', 'Embedded Systems', 'IoT Healthcare'],
    email: 'afan@stei.itb.ac.id',
    image: require('@/assets/images/Dosen/people2.jpeg'),
  },
  {
    id: 4,
    name: 'Santoso Heri, S.T., M.T.',
    title: 'Dosen',
    expertise: ['Biomechanics', 'Rehabilitation Engineering', 'Assistive Technology'],
    email: 'heri@stei.itb.ac.id',
    image: require('@/assets/images/Dosen/people3.jpeg'),
  },
  {
    id: 5,
    name: 'Marcus Gideon, S.T., M.T.',
    title: 'Dosen',
    expertise: ['Biosignal Processing', 'Neural Engineering', 'Brain-Computer Interface'],
    email: 'gideon@stei.itb.ac.id',
    image: require('@/assets/images/Dosen/people4.jpeg'),
  },
];

export default function LecturersScreen() {
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
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Lecturers</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="people" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { fontFamily: Fonts.regular, color: colors.text }]}>
            Tim dosen berpengalaman di bidang teknik biomedis dan teknologi kesehatan
          </Text>
        </View>

        {/* Lecturers List */}
        <View style={styles.content}>
          {LECTURERS.map((lecturer, index) => (
            <View
              key={lecturer.id}
              style={[
                styles.lecturerCard,
                { backgroundColor: colors.card },
                index !== LECTURERS.length - 1 && { marginBottom: 16 },
              ]}
            >
              {/* Photo and Basic Info */}
              <View style={styles.cardHeader}>
                <Image
                  source={lecturer.image}
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View style={styles.basicInfo}>
                  <Text style={[styles.name, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                    {lecturer.name}
                  </Text>
                  <View style={[styles.titleBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.titleText, { fontFamily: Fonts.medium, color: colors.primary }]}>
                      {lecturer.title}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Expertise */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bulb" size={18} color={colors.accent} />
                  <Text style={[styles.sectionTitle, { fontFamily: Fonts.medium, color: colors.text }]}>
                    Bidang Keahlian
                  </Text>
                </View>
                <View style={styles.expertiseList}>
                  {lecturer.expertise.map((exp, idx) => (
                    <View key={idx} style={[styles.expertiseTag, { backgroundColor: colors.background }]}>
                      <Text style={[styles.expertiseText, { fontFamily: Fonts.regular, color: colors.text }]}>
                        {exp}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Contact */}
              <View style={styles.contactRow}>
                <Ionicons name="mail" size={16} color={colors.icon} />
                <Text style={[styles.email, { fontFamily: Fonts.regular, color: colors.icon }]}>
                  {lecturer.email}
                </Text>
              </View>
            </View>
          ))}
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: isSmallScreen ? 12 : 13,
    lineHeight: 18,
  },
  content: {
    padding: isSmallScreen ? 16 : 20,
  },
  lecturerCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  basicInfo: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  name: {
    fontSize: isSmallScreen ? 14 : 15,
    lineHeight: 20,
  },
  titleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  titleText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  expertiseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expertiseTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  expertiseText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  email: {
    fontSize: isSmallScreen ? 11 : 12,
  },
});
