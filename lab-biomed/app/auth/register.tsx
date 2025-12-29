import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_URL, API_ENDPOINTS } from '@/constants/api';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [activeTab, setActiveTab] = useState<'asisten' | 'praktikan'>('praktikan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nim, setNim] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !nim) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password minimal 8 karakter');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nim,
          role: activeTab,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Registration successful:', data);
      Alert.alert(
        'Success',
        'Registrasi berhasil! Silakan login.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Register error:', error);
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: Fonts.bold, color: colors.text }]}>
            Register
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logoCircle, { backgroundColor: colors.card }]}>
            <Image
              source={require('@/assets/images/Grafis/LogoWithoutText.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'asisten' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab('asisten')}
          >
            <Text
              style={[
                styles.tabText,
                { fontFamily: Fonts.semiBold },
                activeTab === 'asisten'
                  ? { color: '#FFF' }
                  : { color: colors.icon },
              ]}
            >
              Asisten
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'praktikan' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab('praktikan')}
          >
            <Text
              style={[
                styles.tabText,
                { fontFamily: Fonts.semiBold },
                activeTab === 'praktikan'
                  ? { color: '#FFF' }
                  : { color: colors.icon },
              ]}
            >
              Praktikan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Email
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { fontFamily: Fonts.regular, color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* NIM Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.icon }]}>
              NIM
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="card-outline" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { fontFamily: Fonts.regular, color: colors.text }]}
                placeholder="Enter your NIM"
                placeholderTextColor={colors.icon}
                value={nim}
                onChangeText={setNim}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Password
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.icon} />
              <TextInput
                style={[styles.input, { fontFamily: Fonts.regular, color: colors.text }]}
                placeholder="Min. 8 characters"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.icon}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.hint, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Password harus mengandung huruf besar, kecil, dan angka
            </Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={[styles.registerButtonText, { fontFamily: Fonts.bold }]}>
              {loading ? 'Loading...' : 'Register'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
              <Text style={[styles.loginLink, { fontFamily: Fonts.semiBold, color: colors.primary }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isSmallScreen ? 20 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 18 : 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: isSmallScreen ? 20 : 30,
  },
  logoCircle: {
    width: isSmallScreen ? 100 : 120,
    height: isSmallScreen ? 100 : 120,
    borderRadius: isSmallScreen ? 50 : 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoImage: {
    width: isSmallScreen ? 60 : 70,
    height: isSmallScreen ? 60 : 70,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: isSmallScreen ? 20 : 30,
  },
  tab: {
    flex: 1,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: isSmallScreen ? 14 : 16,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: isSmallScreen ? 16 : 20,
  },
  label: {
    fontSize: isSmallScreen ? 13 : 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
  },
  hint: {
    fontSize: isSmallScreen ? 11 : 12,
    marginTop: 4,
  },
  registerButton: {
    paddingVertical: isSmallScreen ? 14 : 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: isSmallScreen ? 8 : 12,
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
  registerButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 15 : 17,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isSmallScreen ? 20 : 24,
    marginBottom: 20,
  },
  loginText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  loginLink: {
    fontSize: isSmallScreen ? 13 : 14,
  },
});
