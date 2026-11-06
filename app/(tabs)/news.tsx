import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  AppState,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowUp, RefreshCw } from 'lucide-react-native';
import { fetchCategories, fetchPosts, NewsCategory, NewsPost } from '../../lib/news';
import { LeadStory, NewsSkeleton, RowSeparator, StoryPreviewSheet, StoryRow } from '../../components/news/NewsCards';

const PAGE_SIZE = 12;
const CHECK_EVERY_MS = 90_000; // look for new stories every 90 s while the tab is open
const ALL = 'all';

type FeedState = { posts: NewsPost[]; page: number; totalPages: number };

export default function NewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<NewsPost>>(null);

  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [activeCat, setActiveCat] = useState<number | typeof ALL>(ALL);
  const [feed, setFeed] = useState<FeedState>({ posts: [], page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freshPosts, setFreshPosts] = useState<NewsPost[]>([]);
  const [preview, setPreview] = useState<NewsPost | null>(null);
  const [now, setNow] = useState(Date.now());

  // Per-category cache so switching chips is instant
  const cacheRef = useRef(new Map<string, FeedState>());
  const feedRef = useRef(feed);
  useEffect(() => {
    feedRef.current = feed;
  }, [feed]);
  const catKey = String(activeCat);
  const categoryId = activeCat === ALL ? null : activeCat;

  const loadFirstPage = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'initial') setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const { posts, totalPages } = await fetchPosts({ page: 1, perPage: PAGE_SIZE, categoryId });
        const next = { posts, page: 1, totalPages };
        cacheRef.current.set(catKey, next);
        setFeed(next);
        setFreshPosts([]);
        setNow(Date.now());
      } catch (e: any) {
        setError(e?.message ?? 'Could not load news.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [catKey, categoryId],
  );

  // Categories once
  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  // Load (or restore) the feed when the category changes
  useEffect(() => {
    const cached = cacheRef.current.get(catKey);
    if (cached) {
      setFeed(cached);
      setLoading(false);
      setError(null);
    } else {
      setFeed({ posts: [], page: 0, totalPages: 1 });
      loadFirstPage('initial');
    }
    setFreshPosts([]);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [catKey, loadFirstPage]);

  const loadMore = useCallback(async () => {
    const f = feedRef.current;
    if (loadingMore || loading || f.page === 0 || f.page >= f.totalPages) return;
    setLoadingMore(true);
    try {
      const { posts, totalPages } = await fetchPosts({ page: f.page + 1, perPage: PAGE_SIZE, categoryId });
      const known = new Set(f.posts.map((p) => p.id));
      const next = {
        posts: [...f.posts, ...posts.filter((p) => !known.has(p.id))],
        page: f.page + 1,
        totalPages,
      };
      cacheRef.current.set(catKey, next);
      setFeed(next);
    } catch {
      // keep what we have; the user can scroll again to retry
    } finally {
      setLoadingMore(false);
    }
  }, [catKey, categoryId, loading, loadingMore]);

  // Quietly check for stories newer than the top one
  const checkForNew = useCallback(async () => {
    const top = feedRef.current.posts[0];
    setNow(Date.now());
    if (!top) return;
    try {
      const { posts } = await fetchPosts({ page: 1, perPage: 6, categoryId });
      const known = new Set(feedRef.current.posts.map((p) => p.id));
      const fresh = posts.filter((p) => !known.has(p.id) && p.dateGmt > top.dateGmt);
      if (fresh.length) setFreshPosts(fresh);
    } catch {
      // offline: try again next tick
    }
  }, [categoryId]);

  // Poll while the tab is focused, and check when the app comes back to the foreground
  useFocusEffect(
    useCallback(() => {
      checkForNew();
      const timer = setInterval(checkForNew, CHECK_EVERY_MS);
      const sub = AppState.addEventListener('change', (s) => s === 'active' && checkForNew());
      return () => {
        clearInterval(timer);
        sub.remove();
      };
    }, [checkForNew]),
  );

  const showFresh = useCallback(() => {
    setFeed((f) => {
      const next = { ...f, posts: [...freshPosts, ...f.posts] };
      cacheRef.current.set(catKey, next);
      return next;
    });
    setFreshPosts([]);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [catKey, freshPosts]);

  const openPost = useCallback((post: NewsPost) => router.push(`/news/${post.id}`), [router]);

  const renderItem = useCallback(
    ({ item, index }: { item: NewsPost; index: number }) =>
      index === 0 ? (
        <LeadStory post={item} now={now} onOpen={openPost} onPreview={setPreview} />
      ) : (
        <StoryRow post={item} now={now} onOpen={openPost} onPreview={setPreview} />
      ),
    [now, openPost],
  );

  const today = useMemo(
    () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
    [],
  );

  // "New stories" pill slides in from the top
  const pill = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(pill, { toValue: freshPosts.length ? 1 : 0, useNativeDriver: true, friction: 8 }).start();
  }, [freshPosts.length, pill]);

  const chips: { key: string; label: string; value: number | typeof ALL }[] = [
    { key: ALL, label: 'All', value: ALL },
    ...categories.map((c) => ({ key: String(c.id), label: c.name, value: c.id })),
  ];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.title} accessibilityRole="header">
          News
        </Text>
      </View>

      {/* Category chips */}
      <View style={styles.chipsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {chips.map((c) => {
            const on = c.value === activeCat;
            return (
              <Pressable
                key={c.key}
                onPress={() => setActiveCat(c.value)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading && feed.posts.length === 0 ? (
        <View style={{ paddingTop: 16 }}>
          <NewsSkeleton />
        </View>
      ) : error && feed.posts.length === 0 ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>News didn&apos;t load</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => loadFirstPage('initial')} style={styles.retry} accessibilityRole="button">
            <RefreshCw color="#fff" size={16} />
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={feed.posts}
          keyExtractor={(p) => String(p.id)}
          renderItem={renderItem}
          extraData={now}
          ItemSeparatorComponent={RowSeparator}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 170 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          initialNumToRender={6}
          maxToRenderPerBatch={8}
          windowSize={9}
          removeClippedSubviews={Platform.OS === 'android'}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadFirstPage('refresh')}
              tintColor="#f97316"
              colors={['#f97316']}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No stories in this section yet.</Text>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color="#f97316" style={{ marginVertical: 24 }} />
            ) : feed.posts.length > 0 && feed.page >= feed.totalPages ? (
              <Text style={styles.footer}>You&apos;re all caught up</Text>
            ) : null
          }
        />
      )}

      {/* New stories pill */}
      {freshPosts.length > 0 && (
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.pillWrap,
          {
            top: insets.top + 118,
            opacity: pill,
            transform: [{ translateY: pill.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          },
        ]}
      >
        <Pressable onPress={showFresh} style={styles.pill} accessibilityRole="button">
          <ArrowUp color="#fff" size={16} />
          <Text style={styles.pillText}>
            {freshPosts.length === 1 ? '1 new story' : `${freshPosts.length} new stories`}
          </Text>
        </Pressable>
      </Animated.View>
      )}

      <StoryPreviewSheet post={preview} now={now} onClose={() => setPreview(null)} onOpen={openPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F0EC' },
  header: { paddingHorizontal: 16, paddingBottom: 4 },
  date: { fontSize: 13, fontWeight: '600', color: '#6b6560' },
  title: { fontSize: 32, fontWeight: '900', color: '#171717', letterSpacing: -0.8, marginTop: 2 },
  chipsBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(23,23,23,0.1)',
  },
  chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    backgroundColor: 'rgba(23,23,23,0.06)',
  },
  chipOn: { backgroundColor: '#171717' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#3d3935' },
  chipTextOn: { color: '#FAF9F6' },
  errorBox: { margin: 16, padding: 24, borderRadius: 16, backgroundColor: '#FAF9F6', alignItems: 'center', gap: 8 },
  errorTitle: { fontSize: 17, fontWeight: '800', color: '#171717' },
  errorText: { fontSize: 14, color: '#6b6560', textAlign: 'center' },
  retry: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f97316',
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 22,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { textAlign: 'center', color: '#6b6560', marginTop: 48, fontSize: 15 },
  footer: { textAlign: 'center', color: '#9a928b', marginVertical: 28, fontSize: 13, fontWeight: '600' },
  pillWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pillText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
