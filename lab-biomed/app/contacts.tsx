import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const CONTACT_INFO = [
  {
    id: 1,
    type: 'Alamat',
    icon: 'location',
    color: '#EF4444',
    value: 'Gedung STEI-K Lantai 2\nJl. Ganesha No.10, Bandung 40132',
    action: null,
  },
  {
    id: 2,
    type: 'Email',
    icon: 'mail',
    color: '#3B82F6',
    value: 'labbiomed@stei.itb.ac.id',
    action: () => Linking.openURL('mailto:labbiomed@stei.itb.ac.id'),
  },
  {
    id: 3,
    type: 'Telepon',
    icon: 'call',
    color: '#10B981',
    value: '+62 22 2500935',
    action: () => Linking.openURL('tel:+622225009335'),
  },
  {
    id: 4,
    type: 'WhatsApp',
    icon: 'logo-whatsapp',
    color: '#25D366',
    value: '+62 812-3456-7890',
    action: () => Linking.openURL('https://wa.me/6281234567890'),
  },
  {
    id: 5,
    type: 'Instagram',
    icon: 'logo-instagram',
    color: '#E4405F',
    value: '@labbiomed.itb',
    action: () => Linking.openURL('https://instagram.com/labbiomed.itb'),
  },
  {
    id: 6,
    type: 'Website',
    icon: 'globe',
    color: '#8B5CF6',
    value: 'labbiomed.stei.itb.ac.id',
    action: () => Linking.openURL('https://labbiomed.stei.itb.ac.id'),
  },
];

const OFFICE_HOURS = [
  { day: 'Senin - Jumat', hours: '08:00 - 17:00', status: 'Buka' },
  { day: 'Sabtu', hours: '09:00 - 13:00', status: 'Buka' },
  { day: 'Minggu & Libur', hours: '-', status: 'Tutup' },
];

const CONTACT_PERSONS = [
  {
    id: 1,
    name: 'Dr. Doni Danudirjo',
    position: 'Kepala Laboratorium',
    phone: '+62 812-1111-2222',
    email: 'doni@stei.itb.ac.id',
  },
  {
    id: 2,
    name: 'Ahmad Rizky Pratama',
    position: 'Koordinator Asisten',
    phone: '+62 813-3333-4444',
    email: 'ahmad.rizky@students.itb.ac.id',
  },
  {
    id: 3,
    name: 'Staff Administrasi',
    position: 'Admin Lab',
    phone: '+62 814-5555-6666',
    email: 'admin.labbiomed@stei.itb.ac.id',
  },
];

export default function ContactsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleContact = async (action: (() => void) | null, type: string) => {
    if (!action) return;
    
    try {
      await action();
    } catch (error) {
      Alert.alert('Error', `Tidak dapat membuka ${type}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>Contacts</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="chatbubbles" size={48} color={colors.primary} />
          <Text style={[styles.bannerTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
            Hubungi Kami
          </Text>
          <Text style={[styles.bannerSubtext, { fontFamily: Fonts.regular, color: colors.icon }]}>
            Kami siap membantu pertanyaan dan kebutuhan Anda
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Informasi Kontak
            </Text>
          </View>

          <View style={styles.contactList}>
            {CONTACT_INFO.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { backgroundColor: colors.card }]}
                onPress={() => handleContact(contact.action, contact.type)}
                disabled={!contact.action}
              >
                <View style={[styles.iconCircle, { backgroundColor: contact.color + '20' }]}>
                  <Ionicons name={contact.icon as any} size={24} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactType, { fontFamily: Fonts.medium, color: colors.icon }]}>
                    {contact.type}
                  </Text>
                  <Text style={[styles.contactValue, { fontFamily: Fonts.regular, color: colors.text }]}>
                    {contact.value}
                  </Text>
                </View>
                {contact.action && (
                  <Ionicons name="chevron-forward" size={20} color={colors.icon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Office Hours */}
        <View style={[styles.content, { paddingTop: 0 }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Jam Operasional
            </Text>
          </View>

          <View style={[styles.hoursCard, { backgroundColor: colors.card }]}>
            {OFFICE_HOURS.map((schedule, index) => (
              <View
                key={index}
                style={[
                  styles.hourRow,
                  index !== OFFICE_HOURS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.dayText, { fontFamily: Fonts.medium, color: colors.text }]}>
                  {schedule.day}
                </Text>
                <View style={styles.hourInfo}>
                  <Text style={[styles.hourText, { fontFamily: Fonts.regular, color: colors.text }]}>
                    {schedule.hours}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          schedule.status === 'Buka' ? '#10B98120' : colors.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          fontFamily: Fonts.medium,
                          color: schedule.status === 'Buka' ? '#10B981' : colors.icon,
                        },
                      ]}
                    >
                      {schedule.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Persons */}
        <View style={[styles.content, { paddingTop: 0 }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Narahubung
            </Text>
          </View>

          <View style={styles.personList}>
            {CONTACT_PERSONS.map((person) => (
              <View
                key={person.id}
                style={[styles.personCard, { backgroundColor: colors.card }]}
              >
                <View style={[styles.personAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.avatarText, { fontFamily: Fonts.bold }]}>
                    {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.personInfo}>
                  <Text style={[styles.personName, { fontFamily: Fonts.semiBold, color: colors.text }]}>
                    {person.name}
                  </Text>
                  <Text style={[styles.personPosition, { fontFamily: Fonts.regular, color: colors.icon }]}>
                    {person.position}
                  </Text>
                  <View style={styles.personContacts}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => Linking.openURL(`tel:${person.phone}`)}
                    >
                      <Ionicons name="call" size={14} color={colors.primary} />
                      <Text style={[styles.contactButtonText, { fontFamily: Fonts.regular, color: colors.primary }]}>
                        Call
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => Linking.openURL(`mailto:${person.email}`)}
                    >
                      <Ionicons name="mail" size={14} color={colors.primary} />
                      <Text style={[styles.contactButtonText, { fontFamily: Fonts.regular, color: colors.primary }]}>
                        Email
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Map Info */}
        <View style={[styles.content, { paddingTop: 0 }]}>
          <View style={[styles.mapCard, { backgroundColor: colors.card }]}>
            <Ionicons name="map" size={32} color={colors.primary} />
            <Text style={[styles.mapTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
              Lokasi Laboratorium
            </Text>
            <Text style={[styles.mapText, { fontFamily: Fonts.regular, color: colors.text }]}>
              Gedung STEI-K Lantai 2{'\n'}Institut Teknologi Bandung
            </Text>
            <TouchableOpacity
              style={[styles.mapButton, { backgroundColor: colors.primary }]}
              onPress={() => Linking.openURL('https://maps.google.com/?q=ITB+Bandung')}
            >
              <Ionicons name="navigate" size={18} color="#FFF" />
              <Text style={[styles.mapButtonText, { fontFamily: Fonts.semiBold }]}>
                Buka di Maps
              </Text>
            </TouchableOpacity>
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
  banner: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  bannerTitle: {
    fontSize: isSmallScreen ? 18 : 20,
  },
  bannerSubtext: {
    fontSize: isSmallScreen ? 12 : 13,
    textAlign: 'center',
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
  contactList: {
    gap: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactType: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  contactValue: {
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: 20,
  },
  hoursCard: {
    borderRadius: 12,
    padding: 16,
    gap: 0,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  dayText: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  hourInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hourText: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
  },
  personList: {
    gap: 12,
  },
  personCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  personAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    color: '#FFF',
  },
  personInfo: {
    flex: 1,
    gap: 6,
  },
  personName: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  personPosition: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  personContacts: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactButtonText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  mapCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  mapTitle: {
    fontSize: isSmallScreen ? 15 : 16,
  },
  mapText: {
    fontSize: isSmallScreen ? 12 : 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  mapButtonText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#FFF',
  },
});
