import React from 'react';
import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { Mic, Play, Pause, Headphones, Radio } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '../../context/PlayerContext';

interface PodcastItem {
  id: string;
  title: string;
  host: string;
  category: string;
  duration: string;
  imageUrl: string;
  audioUrl: string;
}

const MOCK_PODCASTS: PodcastItem[] = [
  { 
    id: 'pod-1', 
    title: 'The Daily Swahili Brief', 
    host: 'Digital TV TZ Editorial', 
    category: 'News & Current Affairs', 
    duration: '24 min', 
    imageUrl: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=800',
    audioUrl: 'https://a4.asurahosting.com:8330/radio.mp3'
  },
  { 
    id: 'pod-2', 
    title: 'Tech Talk Tanzania', 
    host: 'Frank & Innovation Desk', 
    category: 'Technology & Startups', 
    duration: '42 min', 
    imageUrl: 'https://images.unsplash.com/photo-1516280440502-6c56b7c53d5a?q=80&w=800',
    audioUrl: 'https://a4.asurahosting.com:8330/radio.mp3'
  },
  { 
    id: 'pod-3', 
    title: 'Bongo Flava Inside Story', 
    host: 'DJ Sky & Entertainment Crew', 
    category: 'Music & Culture', 
    duration: '35 min', 
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
    audioUrl: 'https://a4.asurahosting.com:8330/radio.mp3'
  },
  { 
    id: 'pod-4', 
    title: 'Biashara na Uchumi TZ', 
    host: 'Sarah J & Guest Analysts', 
    category: 'Business & Finance', 
    duration: '28 min', 
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800',
    audioUrl: 'https://a4.asurahosting.com:8330/radio.mp3'
  },
];

export default function PodcastsScreen() {
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, isBuffering, play, pause } = usePlayer();

  const handleTogglePodcast = (podcast: PodcastItem) => {
    const isThisPlaying = isPlaying && currentTrack?.id === podcast.id;
    if (isThisPlaying) {
      pause();
    } else {
      play({
        id: podcast.id,
        title: podcast.title,
        artist: podcast.host,
        cover: podcast.imageUrl,
        url: podcast.audioUrl,
        type: 'podcast',
      });
    }
  };

  return (
    <View className="flex-1 bg-bg-light">
      {/* Fixed Header */}
      <View 
        className="absolute top-0 left-0 right-0 z-50 bg-[#0a0a0a] px-6 py-4 border-b border-white/5" 
        style={{ paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 50 : 38) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-white uppercase">
              EduTech <Text className="text-primary-500">Corner</Text>
            </Text>
            <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mt-1">
              On-Demand Audio & Podcasts
            </Text>
          </View>
          <View className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Mic color="#f97316" size={20} />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5" 
        contentContainerStyle={{ 
          paddingTop: Math.max(insets.top, 40) + 76, 
          paddingBottom: 150 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <View className="p-6 rounded-[32px] bg-white border border-black/5 shadow-sm mb-6 flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <View className="flex-row items-center gap-1.5 mb-2">
              <Headphones color="#f97316" size={14} />
              <Text className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Listen Anywhere</Text>
            </View>
            <Text className="text-xl font-black text-text-main uppercase leading-snug">
              Curated Shows & Deep Dives
            </Text>
            <Text className="text-xs text-text-muted mt-1 font-medium">
              Catch up on exclusive interviews, business insights, and youth lifestyle podcasts.
            </Text>
          </View>
          <View className="w-14 h-14 rounded-2xl bg-primary-500/10 items-center justify-center">
            <Radio color="#f97316" size={28} />
          </View>
        </View>

        {/* Podcast List */}
        <View className="gap-4">
          {MOCK_PODCASTS.map((podcast) => {
            const isThisTrack = currentTrack?.id === podcast.id;
            const isThisPlaying = isThisTrack && isPlaying;

            return (
              <Pressable 
                key={podcast.id} 
                onPress={() => handleTogglePodcast(podcast)}
                className={`flex-row p-4 rounded-3xl bg-white border shadow-sm active:scale-[0.99] ${
                  isThisPlaying ? 'border-primary-500 bg-primary-500/5' : 'border-black/5'
                }`}
              >
                <View className="w-24 h-24 rounded-2xl overflow-hidden bg-black/5 relative">
                  <Image 
                    source={{ uri: podcast.imageUrl }} 
                    style={{ width: '100%', height: '100%' }} 
                    contentFit="cover" 
                  />
                  <View className="absolute inset-0 items-center justify-center bg-black/25">
                    <View className={`w-9 h-9 rounded-full items-center justify-center shadow-lg ${
                      isThisPlaying ? 'bg-primary-500' : 'bg-white'
                    }`}>
                      {isThisTrack && isBuffering ? (
                        <ActivityIndicator color={isThisPlaying ? 'white' : '#f97316'} size="small" />
                      ) : isThisPlaying ? (
                        <Pause color="white" size={16} />
                      ) : (
                        <Play color={isThisPlaying ? 'white' : '#171717'} size={16} style={{ marginLeft: 2 }} />
                      )}
                    </View>
                  </View>
                </View>

                <View className="flex-1 ml-4 justify-center">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-[9px] font-black text-primary-500 uppercase tracking-widest">
                      {podcast.category}
                    </Text>
                    {isThisPlaying && (
                      <View className="px-2 py-0.5 rounded-full bg-primary-500 flex-row items-center gap-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-white" />
                        <Text className="text-[8px] font-black text-white uppercase">Playing</Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-base font-bold text-text-main mb-1 leading-snug" numberOfLines={2}>
                    {podcast.title}
                  </Text>
                  <Text className="text-[10px] text-text-muted uppercase font-bold">
                    {podcast.duration} • By {podcast.host}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
