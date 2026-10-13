import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, RefreshControl, Share, Linking, Platform } from 'react-native';
import { Tv, Share2, Play, RefreshCw } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

const CHANNEL_HANDLE = '@Digitaltvtz-p5p';
const CHANNEL_ID = 'UCuAnKqEQtc7v1-uvXhLmhyg';
const YOUTUBE_RSS_JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`)}`;

interface YouTubeVideo {
  id: string;
  title: string;
  pubDate: string;
  thumbnail: string;
  link: string;
  author: string;
}

const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'O6c5hZIrZ54',
    title: 'AZIZ KI ATOA NENO KWA MARA YA KWANZA',
    pubDate: '2026-08-16',
    thumbnail: 'https://i4.ytimg.com/vi/O6c5hZIrZ54/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=O6c5hZIrZ54',
    author: 'Digitaltvtz'
  },
  {
    id: '-gMRMTBLAKg',
    title: 'KMC LEO PALITAPIKA FULL HOUSE',
    pubDate: '2026-08-15',
    thumbnail: 'https://i2.ytimg.com/vi/-gMRMTBLAKg/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=-gMRMTBLAKg',
    author: 'Digitaltvtz'
  },
  {
    id: 'sgyopy4apME',
    title: 'YANGA WANAMTAMBULISHA AZIZ KI HAPA KMC',
    pubDate: '2026-08-15',
    thumbnail: 'https://i4.ytimg.com/vi/sgyopy4apME/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=sgyopy4apME',
    author: 'Digitaltvtz'
  }
];

export default function TVScreen() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo>(FALLBACK_VIDEOS[0]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const extractVideoId = (guidOrLink: string): string => {
    if (!guidOrLink) return '';
    const match = guidOrLink.match(/(?:v=|yt:video:|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : guidOrLink;
  };

  const fetchLatestVideos = useCallback(async () => {
    try {
      const res = await fetch(YOUTUBE_RSS_JSON);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
        const parsed: YouTubeVideo[] = data.items.map((item: any) => {
          const vId = extractVideoId(item.guid || item.link);
          return {
            id: vId,
            title: item.title || 'Digital TV Video',
            pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent',
            thumbnail: item.thumbnail || item.enclosure?.thumbnail || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
            link: item.link || `https://www.youtube.com/watch?v=${vId}`,
            author: item.author || 'Digitaltvtz'
          };
        });

        setVideos(parsed);
        setSelectedVideo(parsed[0]);
      } else {
        setVideos(FALLBACK_VIDEOS);
      }
    } catch (err: any) {
      console.warn('YouTube feed fetch notice, using fallback feed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestVideos();
  }, [fetchLatestVideos]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLatestVideos();
  }, [fetchLatestVideos]);

  const handleShare = async () => {
    if (!selectedVideo) return;
    try {
      await Share.share({
        message: `${selectedVideo.title} - Watch on Digital TV TZ: ${selectedVideo.link}`,
        url: selectedVideo.link,
        title: selectedVideo.title,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openYouTubeChannel = () => {
    Linking.openURL(`https://www.youtube.com/${CHANNEL_HANDLE}`);
  };

  return (
    <View className="flex-1 bg-bg-light">
      {/* Fixed Dark Header (matching Home & News tabs) */}
      <View 
        className="absolute top-0 left-0 right-0 z-50 bg-[#0a0a0a] px-6 py-4 border-b border-white/5" 
        style={Platform.OS === 'ios' ? { paddingTop: 50 } : { paddingTop: 40 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-2xl bg-red-500 items-center justify-center shadow-md">
              <Tv color="white" size={20} />
            </View>
            <View>
              <Text className="text-xl font-black text-white">
                DIGITAL TV <Text className="text-primary-500">TZ</Text>
              </Text>
              <View className="flex-row items-center gap-1.5 mt-0.5">
                <View className="w-2 h-2 rounded-full bg-red-500" />
                <Text className="text-[9px] font-black text-white/50 uppercase tracking-widest">YouTube Channel Feed</Text>
              </View>
            </View>
          </View>

          <Pressable 
            onPress={openYouTubeChannel}
            className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30"
          >
            <Tv color="#ef4444" size={14} />
            <Text className="text-[9px] font-black text-red-500 uppercase tracking-wider">Subscribe</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ paddingTop: 130, paddingBottom: 150 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" colors={['#f97316']} />
        }
      >
        {/* Embedded YouTube Player Container */}
        <View className="w-full aspect-video rounded-[32px] overflow-hidden bg-black mb-6 border border-black/5 shadow-md relative">
          {selectedVideo?.id ? (
            <WebView
              style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                      <style>
                        body { margin: 0; padding: 0; background-color: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
                        iframe { width: 100%; height: 100%; border: none; }
                      </style>
                    </head>
                    <body>
                      <iframe 
                        src="https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1" 
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

          <View className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-lg border border-white/10 pointer-events-none">
            <Text className="text-[9px] font-black text-red-500 uppercase tracking-widest">1080P HD</Text>
          </View>
        </View>

        {/* Selected Video Info Card (Light Theme) */}
        {selectedVideo && (
          <View className="p-6 rounded-[32px] bg-white border border-black/5 shadow-sm mb-8">
            <Text className="text-lg font-black text-text-main uppercase tracking-tight leading-snug">
              {selectedVideo.title}
            </Text>
            
            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-black/5">
              <View>
                <Text className="text-[9px] font-black text-primary-500 uppercase tracking-widest">
                  Published {selectedVideo.pubDate}
                </Text>
                <Text className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-0.5">
                  @Digitaltvtz-p5p
                </Text>
              </View>

              <Pressable 
                onPress={handleShare} 
                className="flex-row items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary-500/10 border border-primary-500/20 active:scale-95"
              >
                <Share2 color="#f97316" size={14} />
                <Text className="text-[10px] font-black text-primary-500 uppercase tracking-wider">Share</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Latest Videos Feed Section (Light Theme) */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-1 mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-1 h-6 bg-red-500 rounded-full" />
              <Text className="text-xl font-black text-text-main uppercase">Latest Feed</Text>
            </View>
            <Pressable onPress={onRefresh} className="p-2 rounded-xl bg-white border border-black/5 shadow-sm">
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
                    className={`flex-row gap-4 p-4 rounded-[32px] bg-white border shadow-sm ${
                      isCurrent ? 'border-primary-500 bg-primary-500/5' : 'border-black/5'
                    }`}
                  >
                    <View className="w-32 aspect-video rounded-2xl overflow-hidden bg-black relative">
                      <Image source={{ uri: item.thumbnail }} className="w-full h-full" />
                      <View className="absolute inset-0 items-center justify-center bg-black/20">
                        <View className={`w-8 h-8 rounded-full items-center justify-center shadow-md ${isCurrent ? 'bg-primary-500' : 'bg-white'}`}>
                          <Play color={isCurrent ? 'white' : '#171717'} size={14} style={{ marginLeft: 2 }} />
                        </View>
                      </View>
                    </View>

                    <View className="flex-1 justify-center">
                      <Text 
                        className={`text-xs font-black uppercase leading-snug mb-1 ${isCurrent ? 'text-primary-500' : 'text-text-main'}`} 
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-[9px] text-text-muted font-bold uppercase tracking-wider">
                        {item.pubDate} • Digital TV TZ
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
