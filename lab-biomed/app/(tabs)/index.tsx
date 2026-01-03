import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground,
  Image,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// Responsive dimensions
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414;

export default function HomeScreen() {
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
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          source={require('@/assets/images/LandingPic.png')}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoCircle, { borderColor: colors.primary }]}>
                  <Image 
                    source={require('@/assets/images/Grafis/LogoWithoutText.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.logoText, { fontFamily: Fonts.bold }]}>
                  bio med lab
                </Text>
                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: isAuthenticated ? 'rgba(255,107,44,0.9)' : 'rgba(255,255,255,0.2)' }]}
                  onPress={handleAuthAction}
                >
                  <Ionicons name={isAuthenticated ? 'log-out-outline' : 'person-outline'} size={18} color="#FFF" />
                  <Text style={[styles.loginButtonText, { fontFamily: Fonts.semiBold }]}>
                    {isAuthenticated ? 'Logout' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.heroTitle, { fontFamily: Fonts.bold }]}>
                {isAuthenticated ? `Hello, ${user?.nim}` : 'Hello'}
              </Text>
              <Text style={[styles.heroSubtitle, { fontFamily: Fonts.medium }]}>
                Connecting tech{'\n'}to human health.
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Welcome Card */}
      <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
        <View style={styles.welcomeHeader}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={[styles.welcomeTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
            Welcome to
          </Text>
        </View>
        <Text style={[styles.welcomeSubtitle, { fontFamily: Fonts.bold, color: colors.primary }]}>
          Laboratorium Teknik Biomedika
        </Text>
        <Text style={[styles.welcomeDescription, { fontFamily: Fonts.regular, color: colors.text }]}>
          Laboratorium Teknik Biomedika (Lab TB) adalah fasilitas inti di bawah 
          Sekolah Teknik Elektro dan Informatika (STEI) Institut Teknologi Bandung (ITB) 
          yang berperen penting dalam mendukung kegiatan akademik dan penelitian di Jurusan Teknik Biomedika.
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
          Quick Access
        </Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={isSmallScreen ? 28 : 32} color="#FFF" />
            <Text style={[styles.actionTitle, { fontFamily: Fonts.semiBold }]}>
              Peminjaman Lab
            </Text>
            <Text style={[styles.actionSubtitle, { fontFamily: Fonts.regular }]}>
              Book lab space
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.secondary }]}
            activeOpacity={0.7}
          >
            <Ionicons name="flask-outline" size={isSmallScreen ? 28 : 32} color="#FFF" />
            <Text style={[styles.actionTitle, { fontFamily: Fonts.semiBold }]}>
              Peminjaman Alat
            </Text>
            <Text style={[styles.actionSubtitle, { fontFamily: Fonts.regular }]}>
              Borrow equipment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.accent }]}
            activeOpacity={0.7}
          >
            <Ionicons name="school-outline" size={isSmallScreen ? 28 : 32} color="#FFF" />
            <Text style={[styles.actionTitle, { fontFamily: Fonts.semiBold }]}>
              Praktikum
            </Text>
            <Text style={[styles.actionSubtitle, { fontFamily: Fonts.regular }]}>
              View schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#8B5CF6' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={isSmallScreen ? 28 : 32} color="#FFF" />
            <Text style={[styles.actionTitle, { fontFamily: Fonts.semiBold }]}>
              Aturan Lab
            </Text>
            <Text style={[styles.actionSubtitle, { fontFamily: Fonts.regular }]}>
              Lab rules
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={[styles.aboutSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { fontFamily: Fonts.semiBold, color: colors.text }]}>
          About Us
        </Text>
        
        <View style={styles.aboutGrid}>
          <TouchableOpacity style={styles.aboutItem}>
            <View style={[styles.aboutIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="search" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.aboutText, { fontFamily: Fonts.medium, color: colors.text }]}>
              Research
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <View style={[styles.aboutIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="pulse" size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.aboutText, { fontFamily: Fonts.medium, color: colors.text }]}>
              Activities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <View style={[styles.aboutIcon, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="people" size={24} color={colors.accent} />
            </View>
            <Text style={[styles.aboutText, { fontFamily: Fonts.medium, color: colors.text }]}>
              Lecturers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <View style={[styles.aboutIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
              <Ionicons name="person" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.aboutText, { fontFamily: Fonts.medium, color: colors.text }]}>
              Assistants
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontFamily: Fonts.regular, color: colors.icon }]}>
          © 2025 Lab Biomed. All Rights Reserved.
        </Text>
        <Text style={[styles.footerText, { fontFamily: Fonts.regular, color: colors.icon }]}>
          STEI - Institut Teknologi Bandung
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: isSmallScreen ? 300 : isMediumScreen ? 350 : 400,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: isSmallScreen ? 16 : 20,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    borderRadius: isSmallScreen ? 25 : 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 16 : 18,
    letterSpacing: 1,
    flex: 1,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 13 : 14,
  },
  logoImage: {
    width: isSmallScreen ? 36 : 44,
    height: isSmallScreen ? 36 : 44,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: isSmallScreen ? 36 : isMediumScreen ? 42 : 48,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#FFF',
    fontSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    lineHeight: isSmallScreen ? 24 : 28,
  },
  welcomeCard: {
    margin: isSmallScreen ? 12 : 16,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
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
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: isSmallScreen ? 14 : 16,
    marginLeft: 8,
  },
  welcomeSubtitle: {
    fontSize: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
    marginBottom: 12,
    lineHeight: isSmallScreen ? 24 : 28,
  },
  welcomeDescription: {
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: isSmallScreen ? 20 : 22,
    opacity: 0.8,
  },
  quickActionsContainer: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 10 : 12,
  },
  actionCard: {
    width: (width - (isSmallScreen ? 34 : 44)) / 2,
    aspectRatio: 1,
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionTitle: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 16,
    marginTop: 12,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: isSmallScreen ? 11 : 12,
    marginTop: 4,
    textAlign: 'center',
  },
  aboutSection: {
    margin: isSmallScreen ? 12 : 16,
    marginTop: 24,
    padding: isSmallScreen ? 16 : 20,
    borderRadius: 16,
  },
  aboutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallScreen ? 12 : 16,
  },
  aboutItem: {
    width: (width - (isSmallScreen ? 64 : 84)) / 4,
    alignItems: 'center',
  },
  aboutIcon: {
    width: isSmallScreen ? 56 : 64,
    height: isSmallScreen ? 56 : 64,
    borderRadius: isSmallScreen ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: isSmallScreen ? 11 : 12,
    textAlign: 'center',
  },
  footer: {
    padding: isSmallScreen ? 20 : 24,
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: isSmallScreen ? 11 : 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
