import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Tv, Monitor, Video as VideoIcon, Share2 } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const TV_STREAM_URL = 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'; // Using standard demo HLS stream or substitute with constants.ts

export default function TVScreen() {
  const player = useVideoPlayer(TV_STREAM_URL, player => {
    player.loop = false;
  });

  return (
    <ScrollView className="flex-1 bg-brand-dark px-4" contentContainerStyle={{ paddingBottom: 150, paddingTop: 60 }}>
      <View className="flex-row items-center gap-3 mb-6 mt-4">
        <View className="w-12 h-12 rounded-2xl bg-primary-500 items-center justify-center shadow-2xl">
           <Tv color="white" size={24} />
        </View>
        <View>
          <Text className="text-2xl font-bold text-white">Digital TV <Text className="text-primary-500">TZ</Text> Live</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Text className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Live Stream</Text>
          </View>
        </View>
      </View>

      {/* Video Player */}
      <View className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black mb-6 border border-white/10">
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
        
        <View className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded border border-white/10">
           <Text className="text-[10px] font-bold text-white uppercase">1080P HD</Text>
        </View>
      </View>

      {/* Channel Actions */}
      <View className="flex-row gap-3 mb-8">
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Share2 color="#f97316" size={20} />
          <Text className="text-sm font-semibold text-white">Share Link</Text>
        </Pressable>
        <Pressable className="flex-1 flex-row items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
          <Monitor color="#f97316" size={20} />
          <Text className="text-sm font-semibold text-white">Cast to TV</Text>
        </Pressable>
      </View>

      {/* More Content */}
      <View className="mb-4">
        <View className="flex-row items-center gap-2 mb-4">
          <VideoIcon color="#f97316" size={20} />
          <Text className="text-lg font-bold text-white">More Streams</Text>
        </View>

        <View className="gap-3">
          {[1, 2, 3].map((item) => (
            <Pressable key={item} className="flex-row gap-4 p-3 rounded-3xl bg-white/5 border border-white/5">
              <View className="w-32 aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a]">
                 <Image source={{ uri: `https://images.unsplash.com/photo-${1500000000000 + item}?q=80&w=400` }} className="w-full h-full" />
              </View>
              <View className="flex-1 justify-center">
                 <Text className="text-sm font-bold text-white mb-1" numberOfLines={2}>Exclusive Interview: Tanzania Artists</Text>
                 <Text className="text-[10px] text-white/50 font-bold uppercase">2.4k Watching • Showbiz</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
