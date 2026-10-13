import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Radio, Tv, Newspaper, Mic, Compass, ChevronRight } from 'lucide-react-native';

const CHANNELS = [
  {
    id: 'c1',
    title: '247 Digital Radio',
    subtitle: 'Swahili Live Streaming 24/7',
    icon: Radio,
    route: '/radio',
    color: '#f97316',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800'
  },
  {
    id: 'c2',
    title: 'Digital TV TZ Live',
    subtitle: '1080P HD Live Video Stream',
    icon: Tv,
    route: '/tv',
    color: '#ef4444',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800'
  },
  {
    id: 'c3',
    title: 'Digital Press & News',
    subtitle: 'Latest Tanzania Breaking News',
    icon: Newspaper,
    route: '/news',
    color: '#3b82f6',
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800'
  },
  {
    id: 'c4',
    title: 'EduTech & Podcasts',
    subtitle: 'On-Demand Audio Shows',
    icon: Mic,
    route: '/podcasts',
    color: '#eab308',
    imageUrl: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=800'
  }
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      {/* Header */}
      <View 
        className="px-6 py-4 border-b border-white/10 bg-[#0a0a0a] z-50 flex-row items-center justify-between"
        style={Platform.OS === 'ios' ? { paddingTop: 54 } : { paddingTop: 40 }}
      >
        <View>
          <Text className="text-2xl font-black text-white uppercase tracking-tight">
            Explore <Text className="text-primary-500">Channels</Text>
          </Text>
          <Text className="text-[9px] font-black text-white/40 uppercase tracking-[2px]">Digital Media Directory</Text>
        </View>

        <View className="w-11 h-11 rounded-2xl bg-primary-500/10 items-center justify-center border border-primary-500/20">
          <Compass color="#f97316" size={22} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Channel Cards */}
        <View className="gap-6 mb-8">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <Pressable
                key={ch.id}
                onPress={() => router.push(ch.route as any)}
                className="w-full h-44 rounded-[32px] overflow-hidden relative border border-white/10 shadow-2xl active:scale-[0.98]"
              >
                <Image source={{ uri: ch.imageUrl }} className="w-full h-full absolute inset-0" />
                <View className="absolute inset-0 bg-black/60" />

                <View className="absolute inset-0 p-6 justify-between">
                  <View className="flex-row items-center justify-between">
                    <View 
                      className="w-12 h-12 rounded-2xl items-center justify-center border border-white/20"
                      style={{ backgroundColor: `${ch.color}30` }}
                    >
                      <Icon color={ch.color} size={24} />
                    </View>
                    <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                      <ChevronRight color="white" size={18} />
                    </View>
                  </View>

                  <View>
                    <Text className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      {ch.title}
                    </Text>
                    <Text className="text-xs font-bold text-white/60 mt-1 uppercase tracking-wider">
                      {ch.subtitle}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
