import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, RefreshControl, Share, Linking } from 'react-native';
import { Tv, Share2, Play, RefreshCw } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_NAME, WEBSITE_URL, YOUTUBE_URL } from '../../constants/brand';
import { useLocalSearchParams } from 'expo-router';
import { isYouTubeEmbedUrl, isYouTubeId, openExternal } from '../../utils/safeLink';
import { FALLBACK_VIDEOS, fetchLatestVideos, formatViews, YouTubeVideo } from '../../lib/videos';

// YouTube refuses embeds without a referrer (player error 153). Loading the player page
// "from" our website gives the iframe a real origin and Referer.
const EMBED_ORIGIN = WEBSITE_URL;

export default function TVScreen() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo>(FALLBACK_VIDEOS[0]);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { v } = useLocalSearchParams<{ v?: string }>();

  const loadVideos = useCallback(async (force = false) => {
    try {
      const list = await fetchLatestVideos(force);
      setVideos(list);
      setSelectedVideo(list.find((x) => x.id === v) ?? list[0]);
    } catch (err: any) {
      console.warn('YouTube feed fetch notice, using fallback feed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [v]);

  // A video tapped on Home arrives as ?v=<id>
  useEffect(() => {
    if (!v) return;
    setSelectedVideo((cur) => videos.find((x) => x.id === v) ?? cur);
  }, [v, videos]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadVideos(true);
  }, [loadVideos]);

  const handleShare = async () => {
    if (!selectedVideo) return;
    try {
      await Share.share({
        message: `${selectedVideo.title} - Watch on ${APP_NAME}: ${selectedVideo.link}`,
        url: selectedVideo.link,
        title: selectedVideo.title,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openYouTubeChannel = () => {
    Linking.openURL(YOUTUBE_URL);
  };

  return (
    <View className="flex-1 bg-bg-light">
      {/* Fixed Dark Header (matching Home & News tabs) */}
      <View 
        className="bg-[#0a0a0a] px-6 pb-4 border-b border-white/5"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-2xl bg-red-500 items-center justify-center shadow-md">
              <Tv color="white" size={20} />
            </View>
            <View>
              <Text className="text-xl font-black text-white">Video</Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="w-2 h-2 rounded-full bg-red-500" />
                <Text className="text-[11px] font-black text-white/50 uppercase tracking-widest">YouTube Channel Feed</Text>
              </View>
            </View>
          </View>

          <Pressable 
            onPress={openYouTubeChannel}
            className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30"
          >
            <Tv color="#ef4444" size={14} />
            <Text className="text-[11px] font-black text-red-500 uppercase tracking-wider">Subscribe</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 150 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" colors={['#f97316']} />
        }
      >
        {/* Embedded YouTube Player Container */}
        <View className="w-full aspect-video rounded-[32px] overflow-hidden bg-black mb-6 border border-black/5 shadow-md relative">
          {isYouTubeId(selectedVideo?.id) ? (
            <WebView
              style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}
              javaScriptEnabled
              domStorageEnabled
              // Keep the WebView to the YouTube player: no file access, no pop-up windows,
              // and any other page (e.g. "Watch on YouTube") opens outside the app
              originWhitelist={['about:*', 'data:*', EMBED_ORIGIN, 'https://www.youtube-nocookie.com', 'https://www.youtube.com']}
              allowFileAccess={false}
              allowFileAccessFromFileURLs={false}
              allowUniversalAccessFromFileURLs={false}
              setSupportMultipleWindows={false}
              javaScriptCanOpenWindowsAutomatically={false}
              mixedContentMode="never"
              onShouldStartLoadWithRequest={(req) => {
                if (req.url.startsWith('about:') || req.url.startsWith('data:')) return true;
                // The player page itself, loaded with our website as its base URL
                if (req.url.replace(/\/$/, '') === EMBED_ORIGIN) return true;
                if (req.isTopFrame === false || isYouTubeEmbedUrl(req.url)) return true;
                openExternal(req.url);
                return false;
              }}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              source={{
                baseUrl: EMBED_ORIGIN,
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                      <meta name="referrer" content="strict-origin-when-cross-origin">
                      <style>
                        body { margin: 0; padding: 0; background-color: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
                        iframe { width: 100%; height: 100%; border: none; }
                      </style>
                    </head>
                    <body>
                      <iframe 
                        src="https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&origin=${encodeURIComponent(EMBED_ORIGIN)}&widget_referrer=${encodeURIComponent(EMBED_ORIGIN)}"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                      ></iframe>
                    </body>
                  </html>
                `
              }}
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-black/80">
              <ActivityIndicator color="#f97316" size="large" />
            </View>
          )}

          {selectedVideo?.live && (
            <View className="absolute top-3 right-3 bg-red-600 px-2 py-1 rounded-lg pointer-events-none">
              <Text className="text-[11px] font-black text-white uppercase tracking-widest">
                {selectedVideo.live === 'live' ? '● Live' : 'Upcoming'}
              </Text>
            </View>
          )}
        </View>

        {/* Selected Video Info Card (Light Theme) */}
        {selectedVideo && (
          <View className="p-6 rounded-[32px] bg-card border border-black/5 shadow-sm mb-8">
            <Text className="text-lg font-black text-text-main tracking-tight leading-snug">
              {selectedVideo.title}
            </Text>
            
            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-black/5">
              <View>
                <Text className="text-[11px] font-black text-primary-500 uppercase tracking-widest">
                  {[formatViews(selectedVideo.views), `Published ${selectedVideo.pubDate}`].filter(Boolean).join('  ·  ')}
                </Text>
                <Text className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
                  @Digitaltvtz-p5p
                </Text>
              </View>

              <Pressable 
                onPress={handleShare} 
                className="flex-row items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary-500/10 border border-primary-500/20 active:scale-95"
              >
                <Share2 color="#f97316" size={14} />
                <Text className="text-[11px] font-black text-primary-500 uppercase tracking-wider">Share</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Latest Videos Feed Section (Light Theme) */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-1 mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-1 h-6 bg-red-500 rounded-full" />
              <Text className="text-xl font-black text-text-main">Latest videos</Text>
            </View>
            <Pressable onPress={onRefresh} className="p-2 rounded-xl bg-card border border-black/5 shadow-sm">
              <RefreshCw color="#737373" size={16} />
            </Pressable>
          </View>

          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator color="#f97316" size="large" />
            </View>
          ) : (
            <View className="gap-4">
              {videos.map((item) => {
                const isCurrent = item.id === selectedVideo?.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedVideo(item)}
                    className={`flex-row gap-4 p-4 rounded-[32px] bg-card border shadow-sm ${
                      isCurrent ? 'border-primary-500 bg-primary-500/5' : 'border-black/5'
                    }`}
                  >
                    <View className="w-32 aspect-video rounded-2xl overflow-hidden bg-black relative">
                      <Image source={{ uri: item.thumbnail }} className="w-full h-full" />
                      {(item.duration || item.live) && (
                        <View className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md ${item.live ? 'bg-red-600' : 'bg-black/75'}`}>
                          <Text className="text-[11px] font-bold text-white">{item.live === 'live' ? 'LIVE' : item.live ? 'SOON' : item.duration}</Text>
                        </View>
                      )}
                      <View className="absolute inset-0 items-center justify-center bg-black/20">
                        <View className={`w-8 h-8 rounded-full items-center justify-center shadow-md ${isCurrent ? 'bg-primary-500' : 'bg-card'}`}>
                          <Play color={isCurrent ? 'white' : '#171717'} size={14} style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                    </View>

                    <View className="flex-1 justify-center">
                      <Text 
                        className={`text-[14px] font-bold leading-snug mb-1 ${isCurrent ? 'text-primary-500' : 'text-text-main'}`} 
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-[11px] text-text-muted font-bold uppercase tracking-wider">
                        {[formatViews(item.views), item.pubDate].filter(Boolean).join(' • ')}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
