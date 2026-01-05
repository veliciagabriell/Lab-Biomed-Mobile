import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto navigate setelah 4 detik
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/gif/splashscreengif.gif')}
        style={styles.gif}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gif: {
    width: width,
    height: height,
  },
});