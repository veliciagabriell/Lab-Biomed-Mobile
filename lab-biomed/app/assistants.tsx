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

const ASSISTANTS = [
  {
    id: 1,
    name: 'Ahmad Rizky Pratama',
    nim: '13220001',
    expertise: 'Medical Imaging',
    contact: 'ahmad.rizky@students.itb.ac.id',
    responsible: ['Praktikum Instrumentasi', 'Workshop AI'],
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    nim: '13220015',
    expertise: 'Biosignal Processing',
    contact: 'siti.nurhaliza@students.itb.ac.id',
    responsible: ['Praktikum Pemrosesan Sinyal', 'Lab Maintenance'],
  },
  {
    id: 3,
    name: 'Budi Santoso',
    nim: '13220023',
    expertise: 'Embedded Systems',
    contact: 'budi.santoso@students.itb.ac.id',
    responsible: ['Praktikum Mikrokontroler', 'Equipment Training'],
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    nim: '13220037',
    expertise: 'Bioinformatics',
    contact: 'dewi.lestari@students.itb.ac.id',
    responsible: ['Praktikum Komputasi', 'Data Analysis Support'],
  },
  {
    id: 5,
    name: 'Eko Prasetyo',
    nim: '13220042',
    expertise: 'Biomechanics',
    contact: 'eko.prasetyo@students.itb.ac.id',
    responsible: ['Praktikum Biomekanika', 'Research Assistant'],
  },
  {
    id: 6,
    name: 'Fitri Ramadhani',
    nim: '13220056',
    expertise: 'Healthcare IoT',
    contact: 'fitri.ramadhani@students.itb.ac.id',
    responsible: ['Praktikum IoT', 'Lab Inventory'],
  },
];

export default function AssistantsScreen() {
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
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Assistants</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="people-circle" size={32} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Tim Asisten Laboratorium
            </Text>
            <Text style={[styles.bannerSubtext, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Mahasiswa senior yang membantu kegiatan praktikum dan riset
            </Text>
          </View>
        </View>

        {/* Lab Photo */}
        <View style={styles.photoSection}>
          <Image
            source={require('@/assets/images/Labdas/labdas4.jpeg')}
            style={styles.labPhoto}
            resizeMode="cover"
          />
        </View>

        {/* Assistants List */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Daftar Asisten ({ASSISTANTS.length})
            </Text>
          </View>

          <View style={styles.assistantsList}>
            {ASSISTANTS.map((assistant, index) => (
              <View
                key={assistant.id}
                style={[
                  styles.assistantCard,
                  { backgroundColor: colors.card },
                  index !== ASSISTANTS.length - 1 && { marginBottom: 12 },
                ]}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.avatarText, { fontFamily: Fonts.bold }]}>
                      {assistant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={[styles.name, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                      {assistant.name}
                    </Text>
                    <Text style={[styles.nim, { fontFamily: Fonts.regular, color: colors.icon }]}>
                      NIM: {assistant.nim}
                    </Text>
                  </View>
                </View>

                {/* Expertise */}
                <View style={styles.section}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="bulb" size={16} color={colors.accent} />
                    <Text style={[styles.subsectionTitle, { fontFamily: Fonts.medium, color: colors.text }]}>
                      Keahlian
                    </Text>
                  </View>
                  <View style={[styles.expertiseBadge, { backgroundColor: colors.background }]}>
                    <Text style={[styles.expertiseText, { fontFamily: Fonts.regular, color: colors.text }]}>
                      {assistant.expertise}
                    </Text>
                  </View>
                </View>

                {/* Responsibilities */}
                <View style={styles.section}>
                  <View style={styles.subsectionHeader}>
                    <Ionicons name="clipboard" size={16} color="#10B981" />
                    <Text style={[styles.subsectionTitle, { fontFamily: Fonts.medium, color: colors.text }]}>
                      Tanggung Jawab
                    </Text>
                  </View>
                  <View style={styles.responsibilitiesList}>
                    {assistant.responsible.map((item, idx) => (
                      <View key={idx} style={styles.responsibilityItem}>
                        <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                        <Text style={[styles.responsibilityText, { fontFamily: Fonts.regular, color: colors.text }]}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Contact */}
                <View style={[styles.contactRow, { borderTopColor: colors.border }]}>
                  <Ionicons name="mail" size={16} color={colors.icon} />
                  <Text style={[styles.contactText, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    {assistant.contact}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* How to Become Assistant */}
        <View style={[styles.content, { paddingTop: 0 }]}>
          <View style={[styles.joinCard, { backgroundColor: colors.card }]}>
            <View style={[styles.joinIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="rocket" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.joinTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Ingin Menjadi Asisten Lab?
            </Text>
            <Text style={[styles.joinText, { fontFamily: Fonts.regular, color: colors.text }]}>
              Buka setiap semester untuk mahasiswa yang telah menyelesaikan praktikum dengan nilai A/A-
            </Text>
            <View style={styles.requirementsList}>
              <View style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={[styles.requirementText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  IPK minimal 3.50
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={[styles.requirementText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Nilai praktikum A/A-
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={[styles.requirementText, { fontFamily: Fonts.regular, color: colors.text }]}>
                  Komitmen waktu min. 8 jam/minggu
                </Text>
              </View>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 16,
    borderRadius: 12,
  },
  bannerTitle: {
    fontSize: isSmallScreen ? 14 : 15,
    marginBottom: 4,
  },
  bannerSubtext: {
    fontSize: isSmallScreen ? 11 : 12,
    lineHeight: 18,
  },
  photoSection: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: 16,
  },
  labPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
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
  assistantsList: {
    gap: 0,
  },
  assistantCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#FFF',
  },
  nameContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  nim: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  section: {
    gap: 8,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subsectionTitle: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  expertiseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  expertiseText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  responsibilitiesList: {
    gap: 6,
  },
  responsibilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  responsibilityText: {
    flex: 1,
    fontSize: isSmallScreen ? 11 : 12,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  contactText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  joinCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  joinIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    textAlign: 'center',
  },
  joinText: {
    fontSize: isSmallScreen ? 12 : 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  requirementsList: {
    gap: 8,
    width: '100%',
    marginTop: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: isSmallScreen ? 12 : 13,
  },
});
