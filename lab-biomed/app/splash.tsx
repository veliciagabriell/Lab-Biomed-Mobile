import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CX = width / 2;
const CY = height / 2;

// KONFIGURASI JALUR SIRKUIT
const CIRCUIT_PATHS = [
  { // Kiri Atas
    id: 1, delay: 0, startX: -160, startY: -120,
    segments: [{ w: 60, h: 2, dx: 0, dy: 0 }, { w: 2, h: 60, dx: 60, dy: 0 }]
  },
  { // Kanan Atas
    id: 2, delay: 300, startX: 160, startY: -80,
    segments: [{ w: -70, h: 2, dx: 0, dy: 0 }, { w: 2, h: 40, dx: -70, dy: 0 }]
  },
  { // Kiri Bawah
    id: 3, delay: 600, startX: -140, startY: 100,
    segments: [{ w: 50, h: 2, dx: 0, dy: 0 }, { w: 2, h: -40, dx: 50, dy: 0 }]
  },
  { // Kanan Bawah
    id: 4, delay: 900, startX: 130, startY: 140,
    segments: [{ w: 2, h: -80, dx: 0, dy: 0 }, { w: -40, h: 2, dx: 0, dy: -80 }]
  },
];

const CircuitLine = ({ config, color }: { config: any, color: string }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      delay: config.delay,
      easing: Easing.bezier(0.2, 0, 0.4, 1),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={{ position: 'absolute', left: CX + config.startX, top: CY + config.startY }}>
      {config.segments.map((seg: any, i: number) => {
        const isHorizontal = Math.abs(seg.w) > Math.abs(seg.h);
        const scale = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              backgroundColor: color,
              left: seg.dx,
              top: seg.dy,
              width: isHorizontal ? Math.abs(seg.w) : seg.w,
              height: !isHorizontal ? Math.abs(seg.h) : seg.h,
              opacity: animatedValue,
              transform: [
                { [isHorizontal ? 'scaleX' : 'scaleY']: scale },
                { [isHorizontal ? 'translateX' : 'translateY']: isHorizontal ? (seg.w < 0 ? -seg.w/2 : 0) : (seg.h < 0 ? -seg.h/2 : 0) }
              ],
              shadowColor: color,
              shadowOpacity: 0.6,
              shadowRadius: 5,
              elevation: 5,
            }}
          />
        );
      })}
    </View>
  );
};

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  const ACCENT_COLOR = '#4ECDC4';

  useEffect(() => {
    // Animasi Muncul Logo
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    // Pindah Screen
    const timer = setTimeout(() => router.replace('/(tabs)'), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Dark */}
      <View style={StyleSheet.absoluteFill} />

      {/* Render Circuit Lines */}
      {CIRCUIT_PATHS.map((item) => (
        <CircuitLine key={item.id} config={item} color={ACCENT_COLOR} />
      ))}

      {/* Main Logo Section */}
      <Animated.View style={[styles.centerNode, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.outerGlow} />
        <View style={styles.innerCircle}>
          <Image
            source={require('@/assets/images/Grafis/LogoWithoutText.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Sesuaikan dengan tema gelapmu
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerNode: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logo: {
    width: '70%',
    height: '70%',
  },
});