import { View, Text, ScrollView, Image, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Radio, Bell, TrendingUp, Mic, Calendar, MapPin, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

// Mocks
const FEATURED_EVENTS = [
  {
    id: 'e1',
    title: 'Summer Music Festival 2024',
    date: '15 AUG',
    location: 'Dar es Salaam',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800',
    category: 'Concert'
  },
  {
    id: 'e2',
    title: 'Tech Innovation Summit',
    date: '22 SEP',
    location: 'Arusha',
    imageUrl: 'https://images.unsplash.com/photo-1505373676634-31976f08e4ba?q=80&w=800',
    category: 'Conference'
  }
];

const MOCK_SHOWS = [
  { id: '1', title: 'Morning Drive', startTime: '06:00', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070' },
  { id: '2', title: 'Midday Mix', startTime: '10:00', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=2070' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const toggle = () => setIsPlaying(!isPlaying);

  return (
    <View className="flex-1 bg-bg-light">
      {/* Fixed Header */}
      <View className="absolute top-0 left-0 right-0 z-50 bg-[#0a0a0a] px-6 py-4 border-b border-white/5" style={Platform.OS === 'ios' ? { paddingTop: 50 } : { paddingTop: 40 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-white">
              DIGITAL TV <Text className="text-primary-500">TZ</Text>
            </Text>
            <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mt-1">
              Premium Media Network
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push('/notifications')}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <Bell color="#f97316" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 130, paddingBottom: 150 }}>
        {/* Welcome */}
        <View className="mb-8">
          <Text className="text-[10px] font-black text-primary-500 uppercase tracking-[3px]">Habari, Tanzania</Text>
          <Text className="text-4xl font-black text-text-main mt-1">Your Daily</Text>
          <Text className="text-5xl font-black text-black/10">Connection</Text>
        </View>

        {/* Featured Radio Card */}
        <Pressable onPress={toggle} className="w-full aspect-[16/10] rounded-[40px] overflow-hidden mb-8 border border-black/5 shadow-sm relative">
          <Image source={{ uri: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800' }} className="absolute inset-0 w-full h-full" />
          <View className="absolute inset-0 bg-brand-dark/40" />
          
          <View className="absolute top-6 left-6 px-3 py-1 rounded-full bg-primary-500 flex-row items-center shadow-lg">
            <View className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
            <Text className="text-[9px] font-black uppercase text-white tracking-widest">Live On Air</Text>
          </View>

          <View className="absolute bottom-8 left-8 right-8 flex-row items-end justify-between">
            <View>
              <Text className="text-3xl font-black text-white uppercase leading-tight">Digital TV</Text>
              <Text className="text-3xl font-black text-primary-500 uppercase leading-tight">Radio</Text>
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">Global Sounds, Local Soul</Text>
            </View>
            <View className="w-16 h-16 rounded-3xl bg-white items-center justify-center shadow-lg">
              <Radio color="#171717" size={28} />
            </View>
          </View>
        </Pressable>

        {/* Action Grid */}
        <View className="flex-row gap-4 mb-8">
          <Pressable onPress={() => router.push('/radio')} className="flex-1 p-6 rounded-[32px] bg-white border border-black/5 shadow-sm">
            <View className="w-12 h-12 rounded-2xl bg-primary-500/10 items-center justify-center mb-6">
              <Radio color="#f97316" size={24} />
            </View>
            <Text className="font-black text-sm text-text-main">Radio Hub</Text>
            <Text className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Listen Live</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/podcasts')} className="flex-1 p-6 rounded-[32px] bg-white border border-black/5 shadow-sm">
            <View className="w-12 h-12 rounded-2xl bg-[#eab308]/10 items-center justify-center mb-6">
              <Mic color="#eab308" size={24} />
            </View>
            <Text className="font-black text-sm text-text-main">Podcasts</Text>
            <Text className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">On Demand</Text>
          </Pressable>
        </View>

        {/* Schedule Strip */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-2 mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-1 h-6 bg-primary-500 rounded-full" />
              <Text className="text-xl font-black text-text-main uppercase">Daily Schedule</Text>
            </View>
            <Text className="text-[10px] text-primary-500 font-black uppercase tracking-[2px]">View Timeline</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            {MOCK_SHOWS.map((show) => (
              <Pressable onPress={() => router.push('/schedule')} key={show.id} className="w-64 mr-4 p-4 rounded-[32px] bg-white border border-black/5 shadow-sm flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-2xl overflow-hidden">
                  <Image source={{ uri: show.imageUrl }} className="w-full h-full" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-text-main uppercase mb-1" numberOfLines={1}>{show.title}</Text>
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <Text className="text-[9px] text-text-muted uppercase font-black tracking-widest">{show.startTime}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Events Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-2 mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-1 h-6 bg-primary-500 rounded-full" />
              <Text className="text-xl font-black text-text-main uppercase">Hot Events</Text>
            </View>
            <Text className="text-[10px] text-primary-500 font-black uppercase tracking-[2px]">Explore All</Text>
          </View>

          <View className="gap-4">
            {FEATURED_EVENTS.map((event) => (
              <Pressable onPress={() => router.push('/events')} key={event.id} className="h-40 rounded-[40px] bg-white border border-black/5 shadow-sm overflow-hidden flex-row">
                <View className="w-1/3 h-full">
                  <Image source={{ uri: event.imageUrl }} className="w-full h-full" />
                </View>
                <View className="flex-1 p-6 justify-between">
                  <View>
                    <Text className="text-[8px] font-black text-primary-500 uppercase px-2 py-1 bg-primary-500/10 rounded-full self-start mb-2">{event.category}</Text>
                    <Text className="text-lg font-black text-text-main uppercase leading-tight" numberOfLines={1}>{event.title}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="flex-row items-center gap-1">
                      <Calendar color="#f97316" size={12} />
                      <Text className="text-[9px] font-bold text-text-muted uppercase">{event.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MapPin color="#f97316" size={12} />
                      <Text className="text-[9px] font-bold text-text-muted uppercase">{event.location}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
