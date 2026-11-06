import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Tap } from '../ui/Tap';
import { useRouter } from 'expo-router';
import { fetchPosts, NewsPost, timeAgo } from '../../lib/news';
import { NewsImage } from './NewsCards';
import { SectionHeader } from '../home/HomeRows';

const CARD_WIDTH = 210;

/**
 * Home-page strip of the latest stories. Bleeds to the screen edges,
 * so it expects to sit inside a container with 20px side padding.
 */
export function LatestNewsStrip({ count = 3, refreshKey = 0 }: { count?: number; refreshKey?: number }) {
  const router = useRouter();
  const [posts, setPosts] = useState<NewsPost[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    fetchPosts({ page: 1, perPage: count })
      .then(({ posts: p }) => setPosts(p))
      .catch(() => setFailed(true));
  }, [count]);

  // Load on mount and whenever Home is pulled to refresh
  useEffect(load, [load, refreshKey]);

  // Nothing to show offline: hide the section instead of showing an error on Home
  if (failed && !posts) return null;

  const now = Date.now();

  return (
    <View style={{ gap: 12 }}>
      <SectionHeader title="Latest news" href="/news" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
        snapToAlignment="start"
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {posts
          ? posts.map((post) => (
              <Tap
                key={post.id}
                onPress={() => router.push(`/news/${post.id}`)}
                accessibilityRole="button"
                accessibilityLabel={post.title}
                style={styles.card} pressedStyle={{ opacity: 0.85 }}
              >
                <NewsImage uri={post.thumb ?? post.image} category={post.category} style={styles.image} />
                <View style={styles.body}>
                  <Text style={styles.meta} numberOfLines={1}>
                    <Text style={styles.category}>{post.category}</Text>
                    {'  ·  '}
                    {timeAgo(post.dateGmt, now)}
                  </Text>
                  <Text style={styles.title} numberOfLines={3}>
                    {post.title}
                  </Text>
                </View>
              </Tap>
            ))
          : [0, 1, 2].map((i) => (
              <View key={i} style={styles.card} accessibilityLabel={i === 0 ? 'Loading news' : undefined}>
                <View style={[styles.image, styles.skeleton]} />
                <View style={[styles.body, { gap: 8 }]}>
                  <View style={[styles.skeleton, { width: '45%', height: 10, borderRadius: 5 }]} />
                  <View style={[styles.skeleton, { width: '95%', height: 14, borderRadius: 6 }]} />
                  <View style={[styles.skeleton, { width: '70%', height: 14, borderRadius: 6 }]} />
                </View>
              </View>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 18,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  image: { width: '100%', aspectRatio: 16 / 9 },
  body: { padding: 12, gap: 6, minHeight: 96 },
  meta: { fontSize: 12, color: '#6b6560', fontWeight: '500' },
  category: { color: '#ea580c', fontWeight: '700' },
  title: { fontSize: 15, lineHeight: 20, fontWeight: '700', color: '#171717' },
  skeleton: { backgroundColor: '#E6E2DC' },
});
