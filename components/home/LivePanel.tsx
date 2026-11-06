import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, ActivityIndicator, AccessibilityInfo, StyleSheet } from 'react-native';
import { Tap } from '../ui/Tap';
import { useRouter } from 'expo-router';
import { Bell, Play } from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayer } from '../../context/PlayerContext';
import { onAirNow, OnAir } from '../../lib/schedule';
import { APP_NAME } from '../../constants/brand';

// Studio microphone photo used on the Home banner (the image from the original design)
export const BANNER_IMAGE = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200';

function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Four bars that bounce while audio plays; still when Reduce Motion is on. */
export function SoundBars({ active }: { active: boolean }) {
  const bars = useRef([0, 1, 2, 3].map(() => new Animated.Value(0.4))).current;
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!active || reduce) {
      bars.forEach((b) => b.setValue(0.6));
      return;
    }
    const loops = bars.map((b, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(b, { toValue: 1, duration: 320 + i * 70, useNativeDriver: true }),
          Animated.timing(b, { toValue: 0.3, duration: 320 + i * 70, useNativeDriver: true }),
        ]),
      ),
    );
    loops.forEach((l, i) => setTimeout(() => l.start(), i * 90));
    return () => loops.forEach((l) => l.stop());
  }, [active, reduce, bars]);

  return (
    <View style={styles.bars}>
      {bars.map((b, i) => (
        <Animated.View key={i} style={[styles.bar, { transform: [{ scaleY: b }] }]} />
      ))}
    </View>
  );
}

export function LivePanel({ topInset }: { topInset: number }) {
  const router = useRouter();
  const { isPlaying, isBuffering, toggle } = usePlayer();
  const [air, setAir] = useState<OnAir>(() => onAirNow());
  const [hello, setHello] = useState(() => greeting());

  // Keep the progress bar and "what's on" current
  useEffect(() => {
    const t = setInterval(() => {
      setAir(onAirNow());
      setHello(greeting());
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  const show = air.current;

  const zoom = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (!isPlaying || reduceMotion) {
      Animated.timing(zoom, { toValue: 1, duration: 600, useNativeDriver: true }).start();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, { toValue: 1.08, duration: 9000, useNativeDriver: true }),
        Animated.timing(zoom, { toValue: 1, duration: 9000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isPlaying, reduceMotion, zoom]);

  return (
    <View style={[styles.zone, { paddingTop: topInset + 10 }]}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>247</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.hello}>{hello}</Text>
            <Text style={styles.brand} numberOfLines={1}>
              {APP_NAME}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Notification settings"
          style={styles.iconBtn}
          hitSlop={6}
        >
          <Bell color="#ffffff" size={19} />
        </Pressable>
      </View>

      <View>
        <Text style={styles.tagline}>Tunakuunganisha saa 24 kila siku</Text>
        <Text style={styles.title}>Your Daily Connection</Text>
      </View>

      <Pressable
        onPress={() => router.push('/radio')}
        accessibilityRole="button"
        accessibilityLabel={`Open the radio player. ${show ? `On air: ${show.title}` : 'Live now'}`}
        style={styles.banner}
      >
        {/* Studio photo, slowly drifting while the radio plays */}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: zoom }] }]}>
          <Image source={{ uri: BANNER_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} cachePolicy="memory-disk" />
        </Animated.View>
        <LinearGradient
          colors={['rgba(10,10,10,0.25)', 'rgba(10,10,10,0.35)', 'rgba(10,10,10,0.92)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
        {/* Warm brand glow from the corner */}
        <LinearGradient
          colors={['rgba(249,115,22,0.35)', 'rgba(249,115,22,0)']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.3, y: 0.3 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.bannerTop}>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.onAir}>{isPlaying ? 'Playing now' : 'On air now'}</Text>
        </View>

        <View style={styles.bannerBottom}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.showTitle} numberOfLines={2}>
                {show ? show.title : '247 Live'}
              </Text>
              <Text style={styles.host} numberOfLines={1}>
                {show ? `with ${show.host}` : 'Non-stop Swahili hits'}
              </Text>
            </View>
            <Tap
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause radio' : 'Play radio live'}
              style={styles.play} pressedStyle={{ transform: [{ scale: 0.94 }] }}
              hitSlop={6}
            >
              {isBuffering ? (
                <ActivityIndicator color="#fff" />
              ) : isPlaying ? (
                <SoundBars active />
              ) : (
                <Play color="#fff" fill="#fff" size={24} style={{ marginLeft: 3 }} />
              )}
            </Tap>
          </View>

          {show && (
            <>
              <View style={styles.track}>
                <View style={[styles.trackFill, { width: `${Math.round(air.progress * 100)}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.time}>{show.startTime}</Text>
                {air.next && (
                  <Text style={styles.next} numberOfLines={1}>
                    Next · {air.next.startTime} {air.next.title}
                  </Text>
                )}
                <Text style={styles.time}>{show.endTime}</Text>
              </View>
            </>
          )}
          {!show && air.next && (
            <Text style={[styles.next, { textAlign: 'left' }]} numberOfLines={1}>
              Next · {air.next.startTime} {air.next.title}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    backgroundColor: '#0a0a0a',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  logo: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '900', fontStyle: 'italic', fontSize: 13, letterSpacing: -0.5 },
  hello: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  brand: { color: '#fff', fontSize: 15, fontWeight: '800' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: { color: '#fb923c', fontSize: 13, fontWeight: '700' },
  title: { color: '#fff', fontSize: 27, fontWeight: '900', letterSpacing: -0.6, marginTop: 2 },
  banner: {
    minHeight: 230,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerBottom: { gap: 12 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ef4444',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#fff' },
  liveText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  onAir: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },
  showTitle: { color: '#fff', fontSize: 24, lineHeight: 29, fontWeight: '900', letterSpacing: -0.4 },
  host: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  play: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  bars: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 20 },
  bar: { width: 4, height: 20, borderRadius: 2, backgroundColor: '#fff' },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden' },
  trackFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: -4 },
  time: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
  next: { flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
});
