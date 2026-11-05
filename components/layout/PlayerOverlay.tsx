import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Animated } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { usePlayer } from '../../context/PlayerContext';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const PlayerOverlay = () => {
  const { isPlaying, currentTrack, toggle, isBuffering } = usePlayer();
  const pathname = usePathname();

  // Tooltip visibility — auto-hides after 3 s
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      // Show tooltip
      setShowTooltip(true);
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide after 3 s
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setShowTooltip(false));
      }, 3000);
    } else {
      // Hide immediately when paused
      if (hideTimer.current) clearTimeout(hideTimer.current);
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowTooltip(false));
    }

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [isPlaying, tooltipOpacity]);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Hide overlay on the main radio/player page
  if (!currentTrack || pathname === '/radio') return null;

  const bottomOffset = 56 + Math.max(insets.bottom, 8) + 14;

  return (
    <View 
      pointerEvents="box-none" 
      style={{ bottom: bottomOffset }}
      className="absolute right-5 z-[100] flex-row items-center"
    >
      {showTooltip && (
        <Animated.View
          style={{ opacity: tooltipOpacity }}
          className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl mr-3 border border-white/10 shadow-lg"
        >
          <Pressable onPress={() => router.push('/radio')} className="active:opacity-80">
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              <Text className="text-[11px] uppercase tracking-[1px] font-black text-primary-500 leading-none">On Air</Text>
            </View>
            <Text className="text-xs font-bold text-white" numberOfLines={1}>{currentTrack.artist}</Text>
          </Pressable>
        </Animated.View>
      )}

      <View>
        {isPlaying && (
          <View className="absolute -inset-1 rounded-full border-2 border-primary-500/40" />
        )}

        <Pressable
          onPress={toggle}
          onLongPress={() => router.push('/radio')}
          className="w-14 h-14 rounded-full bg-primary-500 shadow-2xl border-2 border-white/20 items-center justify-center active:scale-95"
        >
          {isBuffering ? (
            <ActivityIndicator color="white" size="small" />
          ) : isPlaying ? (
            <Pause color="white" size={24} />
          ) : (
            <Play color="white" size={24} style={{ marginLeft: 3 }} />
          )}
        </Pressable>
      </View>
    </View>
  );
};
