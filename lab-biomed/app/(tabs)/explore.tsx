import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const MENU_ITEMS = [
  { id: 1, title: 'About Us', icon: 'information-circle', color: '#3B82F6' },
  { id: 2, title: 'Research', icon: 'search', color: '#10B981' },
  { id: 3, title: 'Activities', icon: 'pulse', color: '#F59E0B' },
  { id: 4, title: 'Lecturers', icon: 'people', color: '#8B5CF6' },
  { id: 5, title: 'Assistants', icon: 'person', color: '#EC4899' },
  { id: 6, title: 'Contacts', icon: 'call', color: '#EF4444' },
  { id: 7, title: 'Praktikum', icon: 'school', color: '#06B6D4' },
  { id: 8, title: 'Aturan Lab', icon: 'document-text', color: '#84CC16' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, isAuthenticated, logout } = useAuth();

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await logout();
              Alert.alert('Success', 'Logged out successfully');
            },
          },
        ]
      );
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#FF4E05' }]}>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>
          More
        </Text>
        <Text style={[styles.headerSubtitle, { fontFamily: Fonts.regular }]}>
          Explore lab information and resources
        </Text>
      </View>

      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: isAuthenticated ? colors.primary : colors.icon }]}>
          <Ionicons name="person" size={32} color="#FFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { fontFamily: Fonts.semiBold, color: colors.text }]}>
            {isAuthenticated ? user?.nim : 'Guest User'}
          </Text>
          <Text style={[styles.profileEmail, { fontFamily: Fonts.regular, color: colors.icon }]}>
            {isAuthenticated ? `${user?.email} • ${user?.role?.toUpperCase()}` : 'Please login to access all features'}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: isAuthenticated ? '#EF4444' : colors.primary }]}
          onPress={handleAuthAction}
        >
          <Text style={[styles.loginButtonText, { fontFamily: Fonts.semiBold }]}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Menu Grid */}
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
          Information
        </Text>
        
        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuCard, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
              onPress={() => {
                if (item.title === 'Aturan Lab') {
                  router.push('/aturan/aturan-praktikum');
                }
                else if (item.title === 'Praktikum') {
                  router.push('/(tabs)/praktikum');
                } else {
                  Alert.alert('Coming Soon', `${item.title} feature will be available soon`);
                }
              }}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              <Text style={[styles.menuTitle, { fontFamily: Fonts.medium, color: colors.text }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
          Settings
        </Text>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Ionicons name="notifications" size={24} color={colors.text} />
          <Text style={[styles.settingText, { fontFamily: Fonts.regular, color: colors.text }]}>
            Notifications
          </Text>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Ionicons name="language" size={24} color={colors.text} />
          <Text style={[styles.settingText, { fontFamily: Fonts.regular, color: colors.text }]}>
            Language
          </Text>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <Ionicons name="help-circle" size={24} color={colors.text} />
          <Text style={[styles.settingText, { fontFamily: Fonts.regular, color: colors.text }]}>
            Help & Support
          </Text>
          <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontFamily: Fonts.regular, color: colors.icon }]}>
          Lab Biomed Mobile App v1.0.0
        </Text>
        <Text style={[styles.footerText, { fontFamily: Fonts.regular, color: colors.icon }]}>
          © 2025 Laboratorium Teknik Biomedika
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: isSmallScreen ? 16 : 20,
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
  avatar: {
    width: isSmallScreen ? 56 : 64,
    height: isSmallScreen ? 56 : 64,
    borderRadius: isSmallScreen ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isSmallScreen ? 16 : 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  loginButton: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 8 : 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 13 : 14,
  },
  content: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 10 : 12,
  },
  menuCard: {
    width: (width - (isSmallScreen ? 42 : 52)) / 2,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
    alignItems: 'center',
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
  menuIcon: {
    width: isSmallScreen ? 56 : 64,
    height: isSmallScreen ? 56 : 64,
    borderRadius: isSmallScreen ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: isSmallScreen ? 13 : 14,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
  },
  footer: {
    padding: isSmallScreen ? 20 : 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: isSmallScreen ? 11 : 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
