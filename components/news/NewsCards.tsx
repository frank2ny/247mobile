import React, { memo, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Modal, ScrollView, StyleSheet, Share } from 'react-native';
import { Tap } from '../ui/Tap';
import { Image } from 'expo-image';
import { Share2, ArrowRight, X } from 'lucide-react-native';
import { NewsPost, categoryColor, timeAgo } from '../../lib/news';

const C = {
  text: '#171717',
  muted: '#6b6560',
  accent: '#ea580c',
  card: '#FAF9F6',
  line: 'rgba(23,23,23,0.08)',
  skeleton: '#E6E2DC',
};

/** Article image, or a branded colour block with the category when the post has none. */
export const NewsImage = memo(function NewsImage({
  uri,
  category,
  style,
  big = false,
}: {
  uri?: string;
  category: string;
  style: any;
  big?: boolean;
}) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={style}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        recyclingKey={uri}
        accessibilityIgnoresInvertColors
      />
    );
  }
  return (
    <View style={[style, styles.placeholder, { backgroundColor: categoryColor(category) }]}>
      <Text style={[styles.placeholderBrand, big && { fontSize: 34 }]}>247</Text>
      <Text style={[styles.placeholderCat, big && { fontSize: 13 }]} numberOfLines={1}>
        {category}
      </Text>
    </View>
  );
});

function Meta({ post, now }: { post: NewsPost; now: number }) {
  return (
    <Text style={styles.meta} numberOfLines={1}>
      <Text style={styles.metaCategory}>{post.category}</Text>
      {'  ·  '}
      {timeAgo(post.dateGmt, now)}
      {post.author ? `  ·  ${post.author}` : ''}
    </Text>
  );
}

type CardProps = {
  post: NewsPost;
  now: number;
  onOpen: (post: NewsPost) => void;
  onPreview: (post: NewsPost) => void;
};

export const LeadStory = memo(function LeadStory({ post, now, onOpen, onPreview }: CardProps) {
  return (
    <Tap
      onPress={() => onOpen(post)}
      onLongPress={() => onPreview(post)}
      delayLongPress={300}
      accessibilityRole="button"
      accessibilityLabel={post.title}
      accessibilityHint="Opens the story. Long press for a quick preview."
      style={styles.lead} pressedStyle={styles.pressed}
    >
      <NewsImage uri={post.image ?? post.thumb} category={post.category} style={styles.leadImage} big />
      <View style={styles.leadBody}>
        <Text style={styles.leadTitle} numberOfLines={4}>
          {post.title}
        </Text>
        {!!post.excerpt && (
          <Text style={styles.leadExcerpt} numberOfLines={2}>
            {post.excerpt}
          </Text>
        )}
        <Meta post={post} now={now} />
      </View>
    </Tap>
  );
});

export const StoryRow = memo(function StoryRow({ post, now, onOpen, onPreview }: CardProps) {
  return (
    <Tap
      onPress={() => onOpen(post)}
      onLongPress={() => onPreview(post)}
      delayLongPress={300}
      accessibilityRole="button"
      accessibilityLabel={post.title}
      accessibilityHint="Opens the story. Long press for a quick preview."
      style={styles.row} pressedStyle={styles.pressed}
    >
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={3}>
          {post.title}
        </Text>
        <Meta post={post} now={now} />
      </View>
      <NewsImage uri={post.thumb} category={post.category} style={styles.rowImage} />
    </Tap>
  );
});

export const RowSeparator = () => <View style={styles.separator} />;

function usePulse() {
  const v = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return v;
}

export function NewsSkeleton() {
  const opacity = usePulse();
  const bar = (w: number | `${number}%`, h = 14) => (
    <View style={{ width: w, height: h, borderRadius: 6, backgroundColor: C.skeleton }} />
  );
  return (
    <Animated.View style={{ opacity, paddingHorizontal: 16, gap: 18 }} accessibilityLabel="Loading news">
      <View style={{ gap: 10 }}>
        <View style={[styles.leadImage, { backgroundColor: C.skeleton, borderRadius: 16 }]} />
        {bar('92%', 20)}
        {bar('70%', 20)}
        {bar('40%', 12)}
      </View>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View style={{ flex: 1, gap: 8 }}>
            {bar('95%')}
            {bar('75%')}
            {bar('45%', 10)}
          </View>
          <View style={[styles.rowImage, { backgroundColor: C.skeleton }]} />
        </View>
      ))}
    </Animated.View>
  );
}

/** Long-press preview: read the summary without leaving the list. */
export function StoryPreviewSheet({
  post,
  now,
  onClose,
  onOpen,
}: {
  post: NewsPost | null;
  now: number;
  onClose: () => void;
  onOpen: (post: NewsPost) => void;
}) {
  return (
    <Modal visible={!!post} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close preview" />
      {post && (
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
            <NewsImage uri={post.image ?? post.thumb} category={post.category} style={styles.sheetImage} big />
            <Meta post={post} now={now} />
            <Text style={styles.sheetTitle}>{post.title}</Text>
            {!!post.excerpt && <Text style={styles.sheetExcerpt}>{post.excerpt}</Text>}
          </ScrollView>
          <View style={styles.sheetActions}>
            <Pressable
              onPress={() => {
                onClose();
                Share.share({ message: `${post.title}\n${post.link}`, url: post.link, title: post.title }).catch(() => {});
              }}
              accessibilityRole="button"
              accessibilityLabel="Share story"
              style={styles.sheetIconBtn}
            >
              <Share2 color={C.text} size={20} />
            </Pressable>
            <Pressable
              onPress={() => {
                onClose();
                onOpen(post);
              }}
              accessibilityRole="button"
              style={styles.sheetPrimary}
            >
              <Text style={styles.sheetPrimaryText}>Read full story</Text>
              <ArrowRight color="#fff" size={18} />
            </Pressable>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" style={styles.sheetIconBtn}>
              <X color={C.text} size={20} />
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: 2, padding: 6 },
  placeholderBrand: { color: 'rgba(255,255,255,0.95)', fontSize: 20, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
  placeholderCat: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },

  lead: { marginHorizontal: 16, marginBottom: 8 },
  leadImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, overflow: 'hidden' },
  leadBody: { paddingTop: 14, gap: 8 },
  leadTitle: { fontSize: 22, lineHeight: 28, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  leadExcerpt: { fontSize: 15, lineHeight: 22, color: C.muted },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  rowText: { flex: 1, gap: 8 },
  rowTitle: { fontSize: 16, lineHeight: 22, fontWeight: '700', color: C.text },
  rowImage: { width: 92, height: 92, borderRadius: 12, overflow: 'hidden' },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: C.line, marginHorizontal: 16 },

  meta: { fontSize: 12.5, color: C.muted, fontWeight: '500' },
  metaCategory: { color: C.accent, fontWeight: '700' },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '82%',
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.15)', marginBottom: 14 },
  sheetImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 14, overflow: 'hidden' },
  sheetTitle: { fontSize: 21, lineHeight: 27, fontWeight: '800', color: C.text },
  sheetExcerpt: { fontSize: 16, lineHeight: 24, color: '#3d3935' },
  sheetActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  sheetIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sheetPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sheetPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
