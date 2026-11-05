import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, StyleSheet, Animated, Share, Easing, AccessibilityInfo, useWindowDimensions } from 'react-native';
import { Play, Pause, Bell, Share2, Calendar, Clock, CalendarDays, Globe } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '../../context/PlayerContext';
import { useRouter } from 'expo-router';
import { APP_NAME, WEBSITE_URL } from '../../constants/brand';

const MOCK_SCHEDULE = [
  { id: '1', title: 'Morning Drive', host: 'DJ Sky', startTime: '06:00', endTime: '10:00', day: 'Monday', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop' },
  { id: '2', title: 'Midday Mix', host: 'Sarah J', startTime: '10:00', endTime: '14:00', day: 'Monday', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=2070&auto=format&fit=crop' },
  { id: '3', title: 'The Afternoon Show', host: 'Mike D', startTime: '14:00', endTime: '18:00', day: 'Monday', imageUrl: 'https://images.unsplash.com/photo-1520529277867-dbf8c5e0b340?q=80&w=2070&auto=format&fit=crop' }
];

const MOCK_HOSTS = [
  { id: '1', name: 'DJ Sky', role: 'Morning Show Host', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop', socials: { instagram: '@djsky', twitter: '@sky_radio' } },
  { id: '2', name: 'Sarah J', role: 'Midday Presenter', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop', socials: { instagram: '@sarahj_radio' } }
];

type Tab = 'player' | 'schedule' | 'hosts';

export default function RadioScreen() {
  const { currentTrack, isPlaying, toggle, isBuffering } = usePlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('player');

  const today = new Date()
    .toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm listening to ${APP_NAME} live. Listen here: ${WEBSITE_URL}`,
        url: WEBSITE_URL,
        title: APP_NAME,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Disc size scales with the screen so it never pushes into the header or title
  const { width, height } = useWindowDimensions();
  const discSize = Math.round(Math.min(width * 0.58, height * 0.3, 260));
  const ringSize = discSize + 22;
  const stageSize = Math.round(discSize * 1.3);

  // While playing: an accent arc spins around the disc and two soft waves pulse outward
  const spin = useRef(new Animated.Value(0)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  const animate = isPlaying && !reduceMotion;

  useEffect(() => {
    if (!animate) {
      wave.setValue(0);
      return;
    }
    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true }),
    );
    const waveLoop = Animated.loop(
      Animated.timing(wave, { toValue: 1, duration: 2400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    );
    spin.setValue(0);
    wave.setValue(0);
    spinLoop.start();
    waveLoop.start();
    return () => {
      spinLoop.stop();
      waveLoop.stop();
    };
  }, [animate, spin, wave]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const waveB = Animated.modulo(Animated.add(wave, 0.5), 1);
  const waveStyle = (v: Animated.AnimatedInterpolation<number> | Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) }],
  });

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          
          <View style={styles.tabContainer}>
            {(['player', 'schedule', 'hosts'] as Tab[]).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              >
                <Text 
                  style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
                  numberOfLines={1}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => router.push('/notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
            style={styles.backButton}
          >
            <Bell color="white" size={20} />
          </Pressable>
        </View>
      </View>

      {activeTab === 'player' ? (
        <View style={styles.playerContent}>
          {/* Disc with spinning ring and pulse waves */}
          <View style={{ width: stageSize, height: stageSize, alignItems: 'center', justifyContent: 'center' }}>
            {animate && (
              <>
                <Animated.View
                  pointerEvents="none"
                  style={[styles.wave, { width: discSize, height: discSize, borderRadius: discSize / 2 }, waveStyle(wave)]}
                />
                <Animated.View
                  pointerEvents="none"
                  style={[styles.wave, { width: discSize, height: discSize, borderRadius: discSize / 2 }, waveStyle(waveB)]}
                />
              </>
            )}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ring,
                { width: ringSize, height: ringSize, borderRadius: ringSize / 2 },
                isPlaying ? styles.ringActive : null,
                { transform: [{ rotate }] },
              ]}
            />
            <View style={[styles.disc, { width: discSize, height: discSize, borderRadius: discSize / 2 }]}>
              <Image source={{ uri: currentTrack.cover }} style={styles.discImage} resizeMode="cover" />
            </View>
          </View>

          {/* Player Info */}
          <View style={styles.playerInfo}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{isPlaying ? 'Live on air' : 'Live'}</Text>
            </View>
            <Text style={styles.trackTitle} adjustsFontSizeToFit numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artistName}>{currentTrack.artist}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <Pressable
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share the radio"
              style={styles.controlBtnSmall}
            >
              <Share2 color="rgba(255,255,255,0.8)" size={22} />
            </Pressable>

            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play live radio'}
              style={({ pressed }) => [styles.playBtnLarge, pressed && { transform: [{ scale: 0.95 }] }]}
            >
              {isBuffering ? (
                <ActivityIndicator color="white" size="large" />
              ) : isPlaying ? (
                <Pause color="white" fill="white" size={34} />
              ) : (
                <Play color="white" fill="white" size={34} style={{ marginLeft: 4 }} />
              )}
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('schedule')}
              accessibilityRole="button"
              accessibilityLabel="Show today's schedule"
              style={styles.controlBtnSmall}
            >
              <CalendarDays color="rgba(255,255,255,0.8)" size={22} />
            </Pressable>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 150 }}>
          {activeTab === 'schedule' && (
            <View>
              <View style={styles.sectionHeader}>
                <View>
                   <Text style={styles.sectionTitle}>Timeline</Text>
                   <Text style={styles.sectionSubtitle}>Today&apos;s Broadcast</Text>
                </View>
                <View style={styles.dateBadge}>
                  <Calendar color="#f97316" size={16} />
                  <Text style={styles.dateText}>{today}</Text>
                </View>
              </View>

              <View style={{ gap: 24 }}>
                {MOCK_SCHEDULE.map((show) => (
                  <View key={show.id} style={styles.scheduleCard}>
                    <View style={styles.cardImageContainer}>
                      <Image source={{ uri: show.imageUrl }} style={styles.cardImage} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <View style={styles.cardTimeRow}>
                        <Clock color="#f97316" size={14} />
                        <Text style={styles.cardTimeText}>{show.startTime} - {show.endTime}</Text>
                      </View>
                      <Text style={styles.cardTitle} numberOfLines={1}>{show.title}</Text>
                      <Text style={styles.cardSubtitle}>W/ {show.host}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'hosts' && (
            <View>
               <View style={[styles.sectionHeader, { justifyContent: 'center' }]}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.sectionTitle}>Presenters</Text>
                    <Text style={styles.sectionSubtitle}>Meet the voices</Text>
                  </View>
               </View>
               <View style={styles.hostsGrid}>
                  {MOCK_HOSTS.map((host) => (
                    <View key={host.id} style={styles.hostCard}>
                      <View style={styles.hostImageContainer}>
                        <Image source={{ uri: host.imageUrl }} style={styles.hostImage} />
                        <View style={styles.hostSocialOverlay}>
                          {host.socials.instagram && <Globe color="white" size={16} />}
                          {host.socials.twitter && <Share2 color="white" size={16} />}
                        </View>
                      </View>
                      <Text style={styles.hostName}>{host.name}</Text>
                      <Text style={styles.hostRole}>{host.role}</Text>
                    </View>
                  ))}
               </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    gap: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    padding: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#f97316',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.5)',
  },
  tabTextActive: {
    color: 'white',
  },
  playerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 32,
    paddingBottom: 110,
  },
  wave: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#f97316',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  ringActive: {
    borderWidth: 3,
    borderColor: 'rgba(249,115,22,0.15)',
    borderTopColor: '#f97316',
    borderRightColor: '#fb923c',
  },
  disc: {
    overflow: 'hidden',
    backgroundColor: '#FAF9F6',
    borderWidth: 4,
    borderColor: '#1a1a1a',
  },
  discImage: {
    width: '100%',
    height: '100%',
  },
  playerInfo: {
    alignItems: 'center',
    width: '100%',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(249,115,22,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.2)',
    borderRadius: 100,
    marginBottom: 14,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#f97316',
  },
  trackTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 32,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    marginTop: 8,
  },
  controlBtnSmall: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  sectionHeader: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  dateBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
  },
  scheduleCard: {
    flexDirection: 'row',
    gap: 24,
    padding: 20,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 32,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTimeText: {
    color: '#f97316',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontWeight: '900',
    color: 'white',
    fontSize: 20,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hostsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hostCard: {
    width: '48%',
    marginBottom: 24,
  },
  hostImageContainer: {
    aspectRatio: 0.8,
    borderRadius: 48,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hostImage: {
    width: '100%',
    height: '100%',
  },
  hostSocialOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  hostName: {
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: -0.5,
  },
  hostRole: {
    color: '#f97316',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
  }
});
