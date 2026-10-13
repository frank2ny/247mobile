import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Animated } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { usePlayer } from '../../context/PlayerContext';
import { usePathname } from 'expo-router';

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

  // Hide overlay on the main radio/player page
  if (!currentTrack || pathname === '/radio') return null;

  return (
    <View pointerEvents="box-none" className="absolute bottom-[90px] right-6 z-[100] flex-row items-center">
      {showTooltip && (
        <Animated.View
          style={{ opacity: tooltipOpacity }}
          className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg mr-4 border border-white/10"
        >
          <Text className="text-[10px] uppercase tracking-[1px] font-bold text-primary-500 leading-none">On Air</Text>
          <Text className="text-xs font-semibold text-white">{currentTrack.artist}</Text>
        </Animated.View>
      )}

      <View>
        {isPlaying && (
          <View className="absolute -inset-1 rounded-full border-2 border-primary-500/40" />
        )}

        <Pressable
          onPress={toggle}
          className="w-16 h-16 rounded-full bg-primary-500 shadow-2xl border-2 border-white/20 items-center justify-center active:scale-95"
        >
          {isBuffering ? (
            <ActivityIndicator color="white" size="small" />
          ) : isPlaying ? (
            <Pause color="white" size={28} />
          ) : (
            <Play color="white" size={28} style={{ marginLeft: 4 }} />
          )}
        </Pressable>
      </View>
    </View>
  );
};
