import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function PraktikumScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [modulList, setModulList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModulList();
  }, []);

  const loadModulList = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      // API_URL already includes /api, so just append /modul/praktikum/1
      const url = `${API_URL}/modul/praktikum/1`;
      console.log('Loading modul from:', url);
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Modul data received:', JSON.stringify(data).substring(0, 200));
        setModulList(Array.isArray(data) ? data : [data]);
      } else {
        const errorText = await response.text();
        console.log('Failed to load modul. Status:', response.status, 'Error:', errorText);
        // Set empty array on error
        setModulList([]);
      }
    } catch (error) {
      console.log('Exception while loading modul:', error);
      setModulList([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#10B981';
      case 'ongoing':
        return '#F59E0B';
      case 'locked':
        return '#9CA3AF';
      default:
        return colors.icon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return 'checkmark-circle';
      case 'ongoing':
        return 'time';
      case 'locked':
        return 'lock-closed';
      default:
        return 'ellipse';
    }
  };

  const handleModulPress = (modul: any) => {
    if (modul.status === 'locked') {
      return; // Do nothing for locked modul
    }
    router.push(`/modul/${modul.id}`);
  };

  const filteredModulList = modulList.filter(modul =>
    modul.judul?.toLowerCase().includes('')
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { fontFamily: Fonts.bold }]}>
          Praktikum
        </Text>
        <Text style={[styles.headerSubtitle, { fontFamily: Fonts.regular }]}>
          Pilih modul untuk memulai praktikum
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { fontFamily: Fonts.regular, color: colors.icon }]}>
              Memuat modul...
            </Text>
          </View>
        ) : filteredModulList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.icon} />
            <Text style={[styles.emptyText, { fontFamily: Fonts.medium, color: colors.icon }]}>
              Belum ada modul tersedia
            </Text>
          </View>
        ) : (
          <View style={styles.modulGrid}>
            {filteredModulList.map((modul, index) => (
              <TouchableOpacity
                key={modul.id}
                style={[
                  styles.modulCard, 
                  { backgroundColor: colors.card },
                  modul.status === 'locked' && styles.modulCardLocked
                ]}
                activeOpacity={modul.status === 'locked' ? 1 : 0.7}
                onPress={() => handleModulPress(modul)}
              >
                {/* Orange Left Border Rounded */}
                <View style={styles.orangeBorder} />
                
                {/* Number Badge */}
                <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.numberText, { fontFamily: Fonts.bold }]}>
                    {index + 1}
                  </Text>
                </View>

                {/* Modul Content */}
                <View style={styles.modulContent}>
                  <Text 
                    style={[
                      styles.modulTitle, 
                      { fontFamily: Fonts.semiBold, color: colors.text },
                      modul.status === 'locked' && { color: colors.icon }
                    ]}
                    numberOfLines={2}
                  >
                    {modul.judul}
                  </Text>
                  <Text 
                    style={[
                      styles.modulDesc, 
                      { fontFamily: Fonts.regular, color: colors.icon }
                    ]}
                    numberOfLines={1}
                  >
                    {modul.deskripsi}
                  </Text>
                </View>

                {/* Status Icon */}
                <View style={[styles.statusIconContainer, { backgroundColor: getStatusColor(modul.status) + '20' }]}>
                  <Ionicons 
                    name={getStatusIcon(modul.status) as any} 
                    size={20} 
                    color={getStatusColor(modul.status)} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: isSmallScreen ? 16 : 20,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#FFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: isSmallScreen ? 16 : 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: isSmallScreen ? 13 : 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: isSmallScreen ? 14 : 15,
  },
  modulGrid: {
    gap: 16,
  },
  modulCard: {
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
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
  orangeBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: '#FF6B35',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  modulCardLocked: {
    opacity: 0.6,
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
  modulContent: {
    flex: 1,
    gap: 4,
  },
  modulTitle: {
    fontSize: isSmallScreen ? 15 : 16,
    lineHeight: 22,
  },
  modulDesc: {
    fontSize: isSmallScreen ? 12 : 13,
  },
  statusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
