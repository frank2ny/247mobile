import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, Pressable, Platform, ActivityIndicator, Dimensions, StyleSheet, Animated } from 'react-native';
import { Play, Pause, ChevronDown, Bell, Share2, Calendar, Clock, Menu, Globe } from 'lucide-react-native';
import { usePlayer } from '../../context/PlayerContext';
import { useRouter } from 'expo-router';

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
const { width } = Dimensions.get('window');

export default function RadioScreen() {
  const { currentTrack, isPlaying, toggle, isBuffering } = usePlayer();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('player');

  // Animated disc scale: 1.0 when idle → 0.68 when playing (shrinks player)
  const discScale = useRef(new Animated.Value(1)).current;
  // Animated play button scale: 1.0 → 0.82
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(discScale, {
        toValue: isPlaying ? 0.68 : 1,
        useNativeDriver: true,
        friction: 8,
        tension: 60,
      }),
      Animated.spring(btnScale, {
        toValue: isPlaying ? 0.82 : 1,
        useNativeDriver: true,
        friction: 8,
        tension: 60,
      }),
    ]).start();
  }, [isPlaying]);

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronDown color="white" size={24} />
          </Pressable>
          
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

          <Pressable style={styles.backButton}>
            <Bell color="white" size={20} />
          </Pressable>
        </View>
      </View>

      {activeTab === 'player' ? (
        <View style={styles.playerContent}>
          {/* Disc Section — shrinks when playing */}
          <Animated.View style={[styles.discWrapper, { transform: [{ scale: discScale }] }]}>
             <View style={styles.discContainer}>
               <Image source={{ uri: currentTrack.cover }} style={styles.discImage} />
               {isPlaying && <View style={styles.discPulsingRing} />}
             </View>
          </Animated.View>

          {/* Player Info */}
          <View style={styles.playerInfo}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live On Air</Text>
            </View>
            <Text style={styles.trackTitle} adjustsFontSizeToFit numberOfLines={1}>
               {currentTrack.title}
            </Text>
            <Text style={styles.artistName}>With {currentTrack.artist}</Text>
          </View>

          {/* Controls — slightly smaller when playing */}
          <Animated.View style={[styles.controlsRow, { transform: [{ scale: btnScale }] }]}>
            <Pressable style={styles.controlBtnSmall}>
              <Share2 color="rgba(255,255,255,0.4)" size={24} />
            </Pressable>

            <Pressable onPress={toggle} style={styles.playBtnLarge}>
              {isBuffering ? (
                <ActivityIndicator color="white" size="large" />
              ) : isPlaying ? (
                <Pause color="white" size={48} />
              ) : (
                <Play color="white" size={48} style={{ marginLeft: 6 }} />
              )}
            </Pressable>

            <Pressable style={styles.controlBtnSmall}>
              <Menu color="rgba(255,255,255,0.4)" size={24} />
            </Pressable>
          </Animated.View>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 150 }}>
          {activeTab === 'schedule' && (
            <View>
              <View style={styles.sectionHeader}>
                <View>
                   <Text style={styles.sectionTitle}>Timeline</Text>
                   <Text style={styles.sectionSubtitle}>Today's Broadcast</Text>
                </View>
                <View style={styles.dateBadge}>
                  <Calendar color="#f97316" size={16} />
                  <Text style={styles.dateText}>MON, MAY 11</Text>
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
                    <Text style={styles.sectionTitle}>Power Personalities</Text>
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
    paddingTop: 50,
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
    fontSize: 9,
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
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 110,
  },
  discWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxHeight: 380,
  },
  discContainer: {
    aspectRatio: 1,
    width: '100%',
    maxWidth: 340,
    borderRadius: 170,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  discImage: {
    width: '100%',
    height: '100%',
    borderRadius: 170,
    borderWidth: 8,
    borderColor: '#0a0a0a',
  },
  discPulsingRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: 170,
    borderWidth: 2,
    borderColor: 'rgba(249,115,22,0.3)',
    margin: 10,
  },
  playerInfo: {
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
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
    marginBottom: 24,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#f97316',
  },
  trackTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  artistName: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#f97316',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 32,
    marginBottom: 16,
  },
  controlBtnSmall: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnLarge: {
    width: 112,
    height: 112,
    borderRadius: 40,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
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
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
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
    fontSize: 10,
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
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cardTitle: {
    fontWeight: '900',
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
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
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  hostRole: {
    color: '#f97316',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 4,
  }
});
