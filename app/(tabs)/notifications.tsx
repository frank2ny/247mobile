import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ArrowLeft, Newspaper, Calendar, Mic, AlertTriangle, Clock, Tv, Radio, Rss, Volume2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

// ── News Alerts ──
const NEWS_ITEMS = [
  { id: 'news_breaking', title: 'BREAKING NEWS', desc: 'Instant push for major breaking stories', icon: Newspaper },
  { id: 'news_latest', title: 'LATEST UPDATES', desc: 'Hourly top stories delivered to you', icon: Rss },
  { id: 'news_daily', title: 'DAILY DIGEST', desc: 'Morning summary of overnight news', icon: Clock },
];

// ── Radio & Shows ──
const RADIO_ITEMS = [
  { id: 'radio_live', title: 'LIVE RADIO START', desc: 'Alert when a live session goes on air', icon: Radio },
  { id: 'radio_show', title: 'SHOW REMINDERS', desc: 'Notified before your scheduled shows', icon: Volume2 },
];

// ── Podcasts ──
const PODCAST_ITEMS = [
  { id: 'pod_new', title: 'NEW EPISODES', desc: 'Fresh episodes from subscribed podcasts', icon: Mic },
];

// ── Events ──
const EVENT_ITEMS = [
  { id: 'evt_upcoming', title: 'UPCOMING EVENTS', desc: 'Reminders 24 hrs before an event', icon: Calendar },
  { id: 'evt_live', title: 'LIVE EVENTS', desc: 'Flash announcements & ticket drops', icon: Bell },
];

// ── TV ──
const TV_ITEMS = [
  { id: 'tv_program', title: 'PROGRAM ALERTS', desc: 'Alerts for your favourite TV shows', icon: Tv },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    news_breaking: true,
    news_latest: true,
    news_daily: false,
    radio_live: true,
    radio_show: true,
    pod_new: true,
    evt_upcoming: true,
    evt_live: false,
    tv_program: true,
  });

  const toggle = (id: string) =>
    setSettings(p => ({ ...p, [id]: !p[id] }));

  const renderGroup = (items: typeof NEWS_ITEMS) => (
    <View style={styles.prefCard}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isLast = index === items.length - 1;
        return (
          <View key={item.id}>
            <View style={styles.prefRow}>
              <View style={styles.prefIconWrap}>
                <Icon color="#737373" size={19} strokeWidth={1.8} />
              </View>
              <View style={styles.prefText}>
                <Text style={styles.prefTitle}>{item.title}</Text>
                <Text style={styles.prefDesc}>{item.desc}</Text>
              </View>
              <Switch
                trackColor={{ false: '#e2e8f0', true: '#f97316' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#e2e8f0"
                onValueChange={() => toggle(item.id)}
                value={settings[item.id]}
              />
            </View>
            {!isLast && <View style={styles.divider} />}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 56 : 36 }]}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft color="#ffffff" size={22} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            PUSH <Text style={styles.headerTitleOrange}>ALERTS</Text>
          </Text>
          <Text style={styles.headerSubtitle}>NOTIFY ME</Text>
        </View>

        <View style={[styles.headerBtn, styles.headerBtnRight]}>
          <Bell color="#f97316" size={22} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PERMISSIONS CARD ── */}
        <View style={styles.permCard}>
          {/* top row */}
          <View style={styles.permRow}>
            <View style={styles.permIconWrap}>
              <AlertTriangle color="#f97316" size={22} strokeWidth={2.5} />
            </View>
            <View style={styles.permTextWrap}>
              <Text style={styles.permTitle}>PERMISSIONS STATUS</Text>
              <Text style={styles.permSub}>ACTION REQUIRED</Text>
            </View>
            <Pressable style={styles.enableBtn}>
              <Text style={styles.enableBtnText}>ENABLE</Text>
            </Pressable>
          </View>

          {/* alert banner */}
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>
              Push notifications are disabled on this device. Go to your phone
              Settings → Notifications → 247 Digital TV TZ and tap{' '}
              <Text style={{ fontWeight: '900' }}>Allow</Text> to stay updated.
            </Text>
          </View>
        </View>

        {/* ── NEWS ALERTS ── */}
        <Text style={styles.sectionLabel}>📰  NEWS ALERTS</Text>
        {renderGroup(NEWS_ITEMS)}

        {/* ── RADIO & SHOWS ── */}
        <Text style={styles.sectionLabel}>📻  RADIO & SHOWS</Text>
        {renderGroup(RADIO_ITEMS)}

        {/* ── PODCASTS ── */}
        <Text style={styles.sectionLabel}>🎙  PODCASTS</Text>
        {renderGroup(PODCAST_ITEMS)}

        {/* ── EVENTS ── */}
        <Text style={styles.sectionLabel}>🎟  EVENTS</Text>
        {renderGroup(EVENT_ITEMS)}

        {/* ── TV PROGRAMS ── */}
        <Text style={styles.sectionLabel}>📺  TV PROGRAMS</Text>
        {renderGroup(TV_ITEMS)}

        {/* ── STAY CONNECTED ── */}
        <View style={styles.stayCard}>
          <View style={styles.stayAccent} />
          <View style={styles.stayContent}>
            <Text style={styles.stayTitle}>STAY CONNECTED</Text>
            <Text style={styles.stayBody}>
              We use localized background push to ensure you never miss a beat.
              Subscriptions are encrypted and private to your device.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  /* ── Header ── */
  header: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerBtnRight: {
    backgroundColor: 'rgba(249,115,22,0.1)',
    borderColor: 'rgba(249,115,22,0.2)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerTitleOrange: {
    color: '#f97316',
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 3,
    marginTop: 2,
  },
  /* ── Scroll ── */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 150,
    gap: 20,
  },
  /* ── Permissions Card ── */
  permCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  permIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff4ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  permTextWrap: {
    flex: 1,
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 0.2,
  },
  permSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#a3a3a3',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  enableBtn: {
    backgroundColor: '#f97316',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  enableBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  alertBanner: {
    backgroundColor: '#fff1f1',
    borderRadius: 12,
    padding: 12,
  },
  alertText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 17,
  },
  /* ── Section label ── */
  sectionLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#a3a3a3',
    letterSpacing: 3,
    paddingHorizontal: 4,
  },
  /* ── Pref Card ── */
  prefCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  prefIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  prefText: {
    flex: 1,
  },
  prefTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  prefDesc: {
    fontSize: 10,
    fontWeight: '500',
    color: '#a3a3a3',
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 18,
  },
  /* ── Stay Connected ── */
  stayCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 4,
  },
  stayAccent: {
    width: 4,
    height: 60,
    backgroundColor: '#f97316',
    borderRadius: 4,
    marginTop: 2,
  },
  stayContent: {
    flex: 1,
  },
  stayTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stayBody: {
    fontSize: 11,
    fontWeight: '400',
    color: '#94a3b8',
    lineHeight: 18,
  },
});
