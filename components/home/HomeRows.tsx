import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Tap } from '../ui/Tap';
import { useRouter, type Href } from 'expo-router';
import { Image } from 'expo-image';
import { Radio, Tv, Mic, CalendarDays, Play, MapPin } from 'lucide-react-native';
import { dayKey, isOnNow, showsForDay } from '../../lib/schedule';
import { fetchLatestVideos, formatViews, YouTubeVideo } from '../../lib/videos';
import { EVENTS_DATA, dateParts } from '../../lib/events';

const C = {
  text: '#171717',
  muted: '#6b6560',
  accent: '#ea580c',
  orange: '#f97316',
  card: '#FAF9F6',
  border: 'rgba(0,0,0,0.06)',
  skeleton: '#E6E2DC',
};

/** Section title with an optional "See all" link, matching the rest of Home. */
export function SectionHeader({ title, linkLabel, href }: { title: string; linkLabel?: string; href?: Href }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        {title}
      </Text>
      {href && (
        <Pressable onPress={() => router.push(href)} accessibilityRole="link" hitSlop={12}>
          <Text style={styles.headerLink}>{linkLabel ?? 'See all'}</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ── Quick actions: 2×2 shortcuts ── */

const ACTIONS: { key: string; label: string; href: Href; icon: any; color: string; tint: string }[] = [
  { key: 'radio', label: 'Live radio', href: '/radio', icon: Radio, color: '#ea580c', tint: 'rgba(249,115,22,0.12)' },
  { key: 'video', label: 'Video', href: '/tv', icon: Tv, color: '#dc2626', tint: 'rgba(239,68,68,0.12)' },
  { key: 'podcasts', label: 'Podcasts', href: '/podcasts', icon: Mic, color: '#a16207', tint: 'rgba(234,179,8,0.16)' },
  { key: 'schedule', label: 'Schedule', href: '/schedule', icon: CalendarDays, color: '#2563eb', tint: 'rgba(59,130,246,0.12)' },
];

export function QuickActions() {
  const router = useRouter();
  return (
    <View style={styles.grid}>
      {ACTIONS.map((a) => (
        <Tap
          key={a.key}
          onPress={() => router.push(a.href)}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          style={styles.quick}
        >
          <View style={[styles.quickIcon, { backgroundColor: a.tint }]}>
            <a.icon color={a.color} size={20} />
          </View>
          <Text style={styles.quickLabel} numberOfLines={1}>
            {a.label}
          </Text>
        </Tap>
      ))}
    </View>
  );
}

/* ── On air today: today's shows, opening on the one that's live ── */

const SLOT_W = 150;
const GAP = 12;

export function OnAirStrip({ refreshKey }: { refreshKey: number }) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  // Re-read the clock on refresh and every minute
  const [now, setNow] = useState(() => new Date());
  useEffect(() => setNow(new Date()), [refreshKey]);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const today = dayKey(now);
  const shows = useMemo(() => showsForDay(today), [today]);
  const liveIndex = shows.findIndex((s) => isOnNow(s, now));

  const scrollToLive = useCallback(() => {
    if (liveIndex > 0) scrollRef.current?.scrollTo({ x: liveIndex * (SLOT_W + GAP), animated: false });
  }, [liveIndex]);

  return (
    <View style={styles.section}>
      <SectionHeader title="On air today" linkLabel="Full schedule" href="/schedule" />
      {shows.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No shows listed for today. The station plays non-stop music.</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={scrollToLive}
          decelerationRate="fast"
          snapToInterval={SLOT_W + GAP}
          style={styles.bleed}
          contentContainerStyle={styles.shelf}
        >
          {shows.map((s) => {
            const live = isOnNow(s, now);
            return (
              <Tap
                key={s.id}
                onPress={() => router.push({ pathname: '/schedule', params: { day: today } })}
                accessibilityRole="button"
                accessibilityLabel={`${s.startTime} to ${s.endTime}, ${s.title} with ${s.host}${live ? ', on air now' : ''}`}
                style={[styles.slot, live && styles.slotLive]}
              >
                <View style={styles.slotTop}>
                  <Text style={[styles.slotTime, !live && { color: C.muted }]}>{s.startTime}</Text>
                  {live ? (
                    <Text style={styles.nowTag}>NOW</Text>
                  ) : s.type === 'tv' ? (
                    <Text style={styles.tvTag}>TV</Text>
                  ) : null}
                </View>
                <Text style={styles.slotTitle} numberOfLines={2}>
                  {s.title}
                </Text>
                <Text style={styles.slotHost} numberOfLines={1}>
                  {s.host}
                </Text>
              </Tap>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

/* ── Latest videos from YouTube ── */

const VIDEO_W = 220;

export function VideoStrip({ refreshKey }: { refreshKey: number }) {
  const router = useRouter();
  const [videos, setVideos] = useState<YouTubeVideo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    fetchLatestVideos(refreshKey > 0)
      .then((v) => alive && setVideos(v.slice(0, 4)))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  // Hide quietly when offline instead of showing an error on Home
  if (failed && !videos) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title="Latest videos" href="/tv" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={VIDEO_W + GAP}
        style={styles.bleed}
        contentContainerStyle={styles.shelf}
      >
        {videos
          ? videos.map((v) => (
              <Tap
                key={v.id}
                onPress={() => router.push({ pathname: '/tv', params: { v: v.id } })}
                accessibilityRole="button"
                accessibilityLabel={`Play video: ${v.title}`}
                style={styles.videoCard}
              >
                <View>
                  <Image
                    source={{ uri: v.thumbnail }}
                    style={styles.videoThumb}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                  <View style={styles.playBadge}>
                    <Play color="#fff" fill="#fff" size={14} style={{ marginLeft: 2 }} />
                  </View>
                  {v.live ? (
                    <Text style={[styles.thumbTag, styles.liveTag]}>{v.live === 'live' ? '● LIVE' : 'UPCOMING'}</Text>
                  ) : v.duration ? (
                    <Text style={styles.thumbTag}>{v.duration}</Text>
                  ) : null}
                </View>
                <View style={styles.videoBody}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {v.title}
                  </Text>
                  <Text style={styles.videoMeta}>{[formatViews(v.views), v.pubDate].filter(Boolean).join('  ·  ')}</Text>
                </View>
              </Tap>
            ))
          : [0, 1].map((i) => (
              <View key={i} style={styles.videoCard}>
                <View style={[styles.videoThumb, { backgroundColor: C.skeleton }]} />
                <View style={[styles.videoBody, { gap: 8 }]}>
                  <View style={{ width: '90%', height: 12, borderRadius: 6, backgroundColor: C.skeleton }} />
                  <View style={{ width: '40%', height: 10, borderRadius: 5, backgroundColor: C.skeleton }} />
                </View>
              </View>
            ))}
      </ScrollView>
    </View>
  );
}

/* ── Events as a row with calendar date blocks ── */

const EVENT_W = 260;

export function EventsStrip() {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <SectionHeader title="Events" href="/events" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={EVENT_W + GAP}
        style={styles.bleed}
        contentContainerStyle={styles.shelf}
      >
        {EVENTS_DATA.map((e) => {
          const { day, month } = dateParts(e.date);
          return (
            <Tap
              key={e.id}
              onPress={() => router.push('/events')}
              accessibilityRole="button"
              accessibilityLabel={`${e.title}, ${e.date}, ${e.location}`}
              style={styles.eventCard}
            >
              <View style={styles.dateBlock}>
                <Text style={styles.dateDay}>{day}</Text>
                <Text style={styles.dateMonth}>{month}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.eventCat}>{e.category}</Text>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {e.title}
                </Text>
                <View style={styles.eventPlace}>
                  <MapPin color={C.muted} size={12} />
                  <Text style={styles.eventPlaceText} numberOfLines={1}>
                    {e.location}
                  </Text>
                </View>
              </View>
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 19, fontWeight: '900', color: C.text, letterSpacing: -0.3 },
  headerLink: { fontSize: 13, fontWeight: '700', color: C.accent },
  bleed: { marginHorizontal: -20 },
  shelf: { paddingHorizontal: 20, gap: GAP },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quick: {
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  quickIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: C.text },

  slot: {
    width: SLOT_W,
    padding: 12,
    gap: 4,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  slotLive: { borderColor: C.orange, borderWidth: 1.5, backgroundColor: '#FFF6EE' },
  slotTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  slotTime: { fontSize: 14, fontWeight: '800', color: C.text, fontVariant: ['tabular-nums'] },
  nowTag: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
    backgroundColor: C.orange,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  tvTag: { fontSize: 11, fontWeight: '800', color: '#dc2626' },
  slotTitle: { fontSize: 14, lineHeight: 18, fontWeight: '700', color: C.text },
  slotHost: { fontSize: 12, color: C.muted, fontWeight: '500' },
  emptyCard: { padding: 14, borderRadius: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  emptyText: { fontSize: 14, color: C.muted },

  videoCard: {
    width: VIDEO_W,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  videoThumb: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#111' },
  playBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(220,38,38,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBody: { padding: 10, gap: 4 },
  videoTitle: { fontSize: 14, lineHeight: 18, fontWeight: '700', color: C.text },
  videoMeta: { fontSize: 12, color: C.muted, fontWeight: '500' },
  thumbTag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    fontVariant: ['tabular-nums'],
  },
  liveTag: { backgroundColor: '#dc2626' },

  eventCard: {
    width: EVENT_W,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  dateBlock: {
    width: 56,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: { color: '#fff', fontSize: 22, fontWeight: '900', lineHeight: 26 },
  dateMonth: { color: '#fb923c', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  eventCat: { fontSize: 11, fontWeight: '800', color: C.accent, textTransform: 'uppercase', letterSpacing: 0.6 },
  eventTitle: { fontSize: 15, lineHeight: 19, fontWeight: '800', color: C.text },
  eventPlace: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eventPlaceText: { fontSize: 12, color: C.muted, fontWeight: '500', flex: 1 },
});
