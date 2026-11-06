import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, ActivityIndicator, StyleSheet, AccessibilityInfo } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { usePlayer } from '../../context/PlayerContext';
import { onAirNow, OnAir } from '../../lib/schedule';
import { BANNER_IMAGE, SoundBars } from './LivePanel';
import { Tap } from '../ui/Tap';

const BAR_HEIGHT = 64;
const THUMB = 40;

/**
 * Slim live bar that drops in from the top once the Home banner has scrolled away.
 * `appearAt` is the scroll offset where the banner is mostly gone.
 */
export function CompactLiveBar({
  scrollY,
  appearAt,
  topInset,
}: {
  scrollY: Animated.Value;
  appearAt: number;
  topInset: number;
}) {
  const router = useRouter();
  const { isPlaying, isBuffering, toggle } = usePlayer();
  const [air, setAir] = useState<OnAir>(() => onAirNow());
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setAir(onAirNow()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  // Only take touches (and screen-reader focus) once the bar is on screen
  useEffect(() => {
    const id = scrollY.addListener(({ value }) => setVisible(value > appearAt - 40));
    return () => scrollY.removeListener(id);
  }, [scrollY, appearAt]);

  // Orange arc circling the thumbnail while the radio plays
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isPlaying || reduceMotion) return;
    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [isPlaying, reduceMotion, spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const reveal = scrollY.interpolate({
    inputRange: [appearAt - 90, appearAt],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const show = air.current;

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={[
        styles.wrap,
        {
          paddingTop: topInset,
          opacity: reveal,
          transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
        },
      ]}
    >
      <Pressable
        onPress={() => router.push('/radio')}
        accessibilityRole="button"
        accessibilityLabel={`Open the radio player. ${show ? `On air: ${show.title}` : 'Live now'}`}
        style={styles.bar}
      >
        <View style={styles.thumbWrap}>
          <Animated.View
            style={[styles.ring, isPlaying ? styles.ringActive : null, { transform: [{ rotate }] }]}
          />
          <Image source={{ uri: BANNER_IMAGE }} style={styles.thumb} contentFit="cover" cachePolicy="memory-disk" />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
            <Text style={styles.brand}>· 247 Swahili Radio</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {show ? show.title : 'Non-stop Swahili hits'}
          </Text>
        </View>

        <Tap
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause radio' : 'Play radio live'}
          hitSlop={8}
          style={styles.play}
          pressedStyle={{ transform: [{ scale: 0.92 }] }}
        >
          {isBuffering ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : isPlaying ? (
            <View style={{ transform: [{ scale: 0.7 }] }}>
              <SoundBars active />
            </View>
          ) : (
            <Play color="#fff" fill="#fff" size={16} style={{ marginLeft: 2 }} />
          )}
        </Tap>

        {/* How far through the current show's slot */}
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: show ? `${Math.round(air.progress * 100)}%` : '100%' }]} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: '#0a0a0a',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  bar: {
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  thumbWrap: { width: THUMB + 8, height: THUMB + 8, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: THUMB + 8,
    height: THUMB + 8,
    borderRadius: (THUMB + 8) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ringActive: {
    borderColor: 'rgba(249,115,22,0.2)',
    borderTopColor: '#f97316',
    borderRightColor: '#fb923c',
  },
  thumb: { width: THUMB, height: THUMB, borderRadius: THUMB / 2 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ef4444' },
  liveText: { color: '#ef4444', fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  brand: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '600' },
  title: { color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 1 },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.1)' },
  trackFill: { height: '100%', backgroundColor: '#f97316' },
});
