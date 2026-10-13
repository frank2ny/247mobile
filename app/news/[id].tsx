import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator, useWindowDimensions, Linking, Share } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Share2, User, Calendar, ExternalLink } from 'lucide-react-native';
import RenderHtml from 'react-native-render-html';

const API_BASE = 'https://247digitaltvtz.co.tz/wp/wp-json/wp/v2';

export default function NewsDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE}/posts/${id}?_embed`);
        const data = await res.json();
        setPost({
          id: data.id,
          title: data.title.rendered,
          excerpt: data.excerpt.rendered,
          content: data.content.rendered,
          date: new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          category: data._embedded?.['wp:term']?.[0]?.[0]?.name || 'News',
          imageUrl: data._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800',
          link: data.link
        });
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleShare = async () => {
    if (post) {
      try {
        await Share.share({
          message: `${post.title} - Read more: ${post.link}`,
          url: post.link,
          title: post.title,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const tagsStyles = {
    p: { fontSize: 16, lineHeight: 26, color: '#333', marginBottom: 20 },
    h2: { fontSize: 24, fontWeight: '900', color: '#000', marginTop: 30, marginBottom: 16, textTransform: 'uppercase' },
    blockquote: { borderLeftWidth: 4, borderLeftColor: '#f97316', paddingLeft: 16, fontStyle: 'italic', fontSize: 18, color: '#555', marginVertical: 20 },
    img: { borderRadius: 24, marginVertical: 20 },
    li: { fontSize: 16, lineHeight: 26, color: '#333' }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/news' as any);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#f97316" size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-xl font-black text-text-main mb-2">Article Not Found</Text>
        <Text className="text-xs text-text-muted text-center mb-6">The requested news post could not be loaded or is unavailable.</Text>
        <Pressable onPress={handleBack} className="bg-primary-500 px-6 py-3 rounded-2xl flex-row items-center gap-2">
          <ArrowLeft color="white" size={18} />
          <Text className="text-white text-xs font-black uppercase tracking-wider">Back to News</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Fixed Header Controls */}
      <View className="absolute top-0 left-0 right-0 z-[100] flex-row justify-between items-center px-6" style={{ paddingTop: 60 }}>
        <Pressable onPress={handleBack} className="w-12 h-12 rounded-2xl bg-[#00000050] items-center justify-center border border-white/20">
          <ArrowLeft color="white" size={24} />
        </Pressable>
        <Pressable onPress={handleShare} className="w-12 h-12 rounded-2xl bg-primary-500/90 items-center justify-center border border-primary-500/30 shadow-lg">
          <Share2 color="white" size={20} />
        </Pressable>
      </View>

      <ScrollView bounces={false} className="flex-1">
        {/* Immersive Hero Header */}
        <View className="w-full" style={{ height: height * 0.6 }}>
          <Image source={{ uri: post.imageUrl }} className="w-full h-full absolute inset-0" />
          <View className="absolute inset-0 bg-black/40" />

          {/* Title Overlay */}
          <View className="absolute bottom-0 left-0 right-0 p-8">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="bg-primary-500 px-3 py-1.5 rounded-md">
                <Text className="text-white text-[9px] font-black uppercase tracking-[2px]">{post.category}</Text>
              </View>
              <View className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <Text className="text-[10px] text-white/70 font-black uppercase tracking-widest">{post.date}</Text>
            </View>
            <Text className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">{post.title}</Text>
          </View>
        </View>

        {/* Article Content */}
        <View className="bg-white rounded-t-[40px] -mt-10 pt-10 px-6 pb-32 shadow-2xl">
          {/* Meta Info */}
          <View className="flex-row items-center gap-6 pb-8 mb-8 border-b border-black/5">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary-500/10 items-center justify-center">
                <User color="#f97316" size={20} />
              </View>
              <View>
                <Text className="text-[9px] font-black uppercase tracking-widest text-text-muted">Broadcast by</Text>
                <Text className="text-xs font-black text-text-main uppercase tracking-tighter mt-0.5">Digital Editorial</Text>
              </View>
            </View>
            <View className="w-[1px] h-10 bg-black/5" />
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-yellow-500/10 items-center justify-center">
                <Calendar color="#eab308" size={20} />
              </View>
              <View>
                <Text className="text-[9px] font-black uppercase tracking-widest text-text-muted">Published on</Text>
                <Text className="text-xs font-black text-text-main uppercase tracking-tighter mt-0.5">{post.date}</Text>
              </View>
            </View>
          </View>

          {/* HTML Render */}
          <RenderHtml
            contentWidth={width - 48}
            source={{ html: post.content }}
            tagsStyles={tagsStyles as any}
          />

          {/* Official Source Link */}
          <View className="mt-10 pt-10 border-t border-black/5 items-center">
            <Text className="text-xs font-black uppercase tracking-[3px] text-text-muted mb-6">Supported Channel</Text>
            <Pressable 
              onPress={() => Linking.openURL(post.link)}
              className="w-full h-16 rounded-[32px] bg-[#0a0a0a] flex-row items-center justify-center gap-4 shadow-xl"
            >
              <Text className="text-white text-[11px] font-black uppercase tracking-[3px]">Official Source</Text>
              <ExternalLink color="white" size={20} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
