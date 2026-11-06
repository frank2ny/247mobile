import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions, Linking, Share, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, ExternalLink } from 'lucide-react-native';
import RenderHtml from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPost, postCache, readingMinutes, timeAgo, NewsPost } from '../../lib/news';
import { NewsImage } from '../../components/news/NewsCards';

type FullPost = NewsPost & { content?: string };

const tagsStyles: any = {
  body: { color: '#2b2724' },
  p: { fontSize: 17, lineHeight: 28, marginTop: 0, marginBottom: 18 },
  h2: { fontSize: 21, lineHeight: 27, fontWeight: '800', color: '#171717', marginTop: 26, marginBottom: 12 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: '#171717', marginTop: 22, marginBottom: 10 },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#f97316',
    paddingLeft: 14,
    marginVertical: 18,
    fontStyle: 'italic',
    color: '#4a4541',
  },
  img: { borderRadius: 14 },
  li: { fontSize: 17, lineHeight: 28 },
  a: { color: '#ea580c', textDecorationLine: 'none' },
};

export default function NewsDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Show what the list already knows straight away, then fill in the body
  const [post, setPost] = useState<FullPost | null>(() => postCache.get(Number(id)) ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    fetchPost(id)
      .then((full) => alive && setPost(full))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [id]);

  const minutes = useMemo(() => (post?.content ? readingMinutes(post.content) : null), [post?.content]);
  const contentWidth = Math.min(width, 720) - 40;

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/news'));

  const handleShare = () => {
    if (!post) return;
    Share.share({ message: `${post.title}\n${post.link}`, url: post.link, title: post.title }).catch(() => {});
  };

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={handleBack} accessibilityRole="button" accessibilityLabel="Back" style={styles.iconBtn} hitSlop={6}>
          <ArrowLeft color="#171717" size={22} />
        </Pressable>
        <Pressable
          onPress={handleShare}
          disabled={!post}
          accessibilityRole="button"
          accessibilityLabel="Share story"
          style={styles.iconBtn}
          hitSlop={6}
        >
          <Share2 color="#171717" size={20} />
        </Pressable>
      </View>

      {!post && failed ? (
        <View style={styles.center}>
          <Text style={styles.notFoundTitle}>This story didn&apos;t load</Text>
          <Text style={styles.notFoundText}>Check your connection, or go back and try another story.</Text>
          <Pressable onPress={handleBack} style={styles.primaryBtn} accessibilityRole="button">
            <Text style={styles.primaryBtnText}>Back to News</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
          <View style={styles.inner}>
            {post ? (
              <>
                <Text style={styles.category}>{post.category}</Text>
                <Text style={styles.headline} accessibilityRole="header">
                  {post.title}
                </Text>
                <Text style={styles.byline}>
                  {post.author ? `By ${post.author}  ·  ` : ''}
                  {timeAgo(post.dateGmt)}
                  {minutes ? `  ·  ${minutes} min read` : ''}
                </Text>
                <NewsImage uri={post.image ?? post.thumb} category={post.category} style={styles.hero} big />

                {post.content ? (
                  <RenderHtml
                    contentWidth={contentWidth}
                    source={{ html: post.content }}
                    tagsStyles={tagsStyles}
                    enableExperimentalMarginCollapsing
                  />
                ) : (
                  <BodySkeleton />
                )}

                <Pressable
                  onPress={() => Linking.openURL(post.link)}
                  accessibilityRole="link"
                  style={styles.sourceLink}
                >
                  <Text style={styles.sourceText}>Read on the website</Text>
                  <ExternalLink color="#ea580c" size={16} />
                </Pressable>
              </>
            ) : (
              <BodySkeleton withHeader />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function BodySkeleton({ withHeader = false }: { withHeader?: boolean }) {
  const line = (w: `${number}%`, h = 14) => <View style={{ width: w, height: h, borderRadius: 6, backgroundColor: '#E6E2DC' }} />;
  return (
    <View style={{ gap: 12, paddingTop: 4 }} accessibilityLabel="Loading story">
      {withHeader && (
        <>
          {line('30%', 12)}
          {line('95%', 24)}
          {line('80%', 24)}
          {line('50%', 12)}
          <View style={[styles.hero, { backgroundColor: '#E6E2DC' }]} />
        </>
      )}
      {line('100%')}
      {line('96%')}
      {line('92%')}
      {line('70%')}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF9F6' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    backgroundColor: '#FAF9F6',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(23,23,23,0.06)',
  },
  inner: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 8 },
  category: { fontSize: 13, fontWeight: '800', color: '#ea580c', marginBottom: 8 },
  headline: { fontSize: 26, lineHeight: 32, fontWeight: '900', color: '#171717', letterSpacing: -0.5 },
  byline: { fontSize: 13.5, color: '#6b6560', fontWeight: '500', marginTop: 10, marginBottom: 16 },
  hero: { width: '100%', aspectRatio: 16 / 9, borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 10,
  },
  sourceText: { color: '#ea580c', fontWeight: '700', fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  notFoundTitle: { fontSize: 19, fontWeight: '800', color: '#171717' },
  notFoundText: { fontSize: 15, color: '#6b6560', textAlign: 'center' },
  primaryBtn: { marginTop: 12, backgroundColor: '#f97316', paddingHorizontal: 22, height: 46, borderRadius: 23, justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
