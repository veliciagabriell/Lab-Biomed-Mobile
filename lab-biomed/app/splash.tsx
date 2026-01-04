import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // Auto navigate setelah video selesai atau 4 detik
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleVideoLoad = useCallback(() => {
    videoRef.current?.playAsync();
  }, []);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      router.replace('/(tabs)');
    }
  }, [router]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('@/assets/videos/splashscreen2.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        isMuted
        onLoad={handleVideoLoad}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: height,
  },
});