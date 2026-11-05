import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Radio, Bell, Mic, Calendar, MapPin, Tv, Play, Pause } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '../../context/PlayerContext';
import { APP_NAME } from '../../constants/brand';

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
  const insets = useSafeAreaInsets();
  const { isPlaying, isBuffering, toggle } = usePlayer();

  return (
    <View className="flex-1 bg-bg-light">
      {/* Header */}
      <View className="bg-[#0a0a0a] px-6 pb-4 border-b border-white/5" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-xl font-black text-white" numberOfLines={1}>
              247 Digital <Text className="text-primary-500">Swahili Radio</Text>
            </Text>
            <Text className="text-white/60 text-[12px] font-medium mt-1">
              Live radio, news and podcasts
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <Bell color="#f97316" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 24, paddingBottom: 150 }}>
        {/* Welcome */}
        <View className="mb-8">
          <Text className="text-[14px] font-bold text-primary-500">Tunakuunganisha saa 24 kila siku</Text>
          <Text className="text-3xl font-black text-text-main mt-1">Your Daily Connection</Text>
        </View>

        {/* Featured Radio Card */}
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? `Pause ${APP_NAME}` : `Play ${APP_NAME} live`}
          className="w-full aspect-[16/10] rounded-[40px] overflow-hidden mb-8 border border-black/5 shadow-sm relative"
        >
          <Image source={{ uri: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800' }} className="absolute inset-0 w-full h-full" />
          <View className="absolute inset-0 bg-brand-dark/40" />
          
          <View className="absolute top-6 left-6 px-3 py-1 rounded-full bg-primary-500 flex-row items-center shadow-lg">
            <View className="w-1.5 h-1.5 rounded-full bg-card mr-1.5" />
            <Text className="text-[11px] font-black uppercase text-white tracking-widest">Live On Air</Text>
          </View>

          <View className="absolute bottom-8 left-8 right-8 flex-row items-end justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-black text-white leading-tight">247 Digital</Text>
              <Text className="text-2xl font-black text-primary-500 leading-tight">Swahili Radio</Text>
              <Text className="text-white/80 text-[12px] font-semibold mt-2">{isPlaying ? 'Playing now' : 'Tap to listen live'}</Text>
            </View>
            <View className="w-16 h-16 rounded-full bg-card items-center justify-center shadow-lg">
              {isBuffering ? (
                <ActivityIndicator color="#f97316" />
              ) : isPlaying ? (
                <Pause color="#171717" size={28} />
              ) : (
                <Play color="#171717" size={28} style={{ marginLeft: 3 }} />
              )}
            </View>
          </View>
        </Pressable>

        {/* Action Grid */}
        <View className="flex-row gap-3 mb-8">
          <Pressable onPress={() => router.push('/radio')} className="flex-1 p-4 rounded-[28px] bg-card border border-black/5 shadow-sm">
            <View className="w-10 h-10 rounded-2xl bg-primary-500/10 items-center justify-center mb-4">
              <Radio color="#f97316" size={20} />
            </View>
            <Text className="font-black text-xs text-text-main" numberOfLines={1}>Radio Hub</Text>
            <Text className="text-[11px] text-text-muted uppercase font-bold tracking-wider mt-0.5">Listen Live</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/tv')} className="flex-1 p-4 rounded-[28px] bg-card border border-black/5 shadow-sm">
            <View className="w-10 h-10 rounded-2xl bg-red-500/10 items-center justify-center mb-4">
              <Tv color="#ef4444" size={20} />
            </View>
            <Text className="font-black text-xs text-text-main" numberOfLines={1}>Video</Text>
            <Text className="text-[11px] text-text-muted uppercase font-bold tracking-wider mt-0.5">Watch on YouTube</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/podcasts')} className="flex-1 p-4 rounded-[28px] bg-card border border-black/5 shadow-sm">
            <View className="w-10 h-10 rounded-2xl bg-[#eab308]/10 items-center justify-center mb-4">
              <Mic color="#eab308" size={20} />
            </View>
            <Text className="font-black text-xs text-text-main" numberOfLines={1}>Podcasts</Text>
            <Text className="text-[11px] text-text-muted uppercase font-bold tracking-wider mt-0.5">On Demand</Text>
          </Pressable>
        </View>

        {/* Schedule Strip */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-2 mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-1 h-6 bg-primary-500 rounded-full" />
              <Text className="text-xl font-black text-text-main">Today&apos;s schedule</Text>
            </View>
            <Pressable onPress={() => router.push('/schedule')} accessibilityRole="link" hitSlop={12}>
              <Text className="text-[13px] text-primary-500 font-bold">See all</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            {MOCK_SHOWS.map((show) => (
              <Pressable onPress={() => router.push('/schedule')} key={show.id} className="w-64 mr-4 p-4 rounded-[32px] bg-card border border-black/5 shadow-sm flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-2xl overflow-hidden">
                  <Image source={{ uri: show.imageUrl }} className="w-full h-full" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-black text-text-main mb-1" numberOfLines={1}>{show.title}</Text>
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <Text className="text-[11px] text-text-muted uppercase font-black tracking-widest">{show.startTime}</Text>
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
              <Text className="text-xl font-black text-text-main">Events</Text>
            </View>
            <Pressable onPress={() => router.push('/events')} accessibilityRole="link" hitSlop={12}>
              <Text className="text-[13px] text-primary-500 font-bold">See all</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            {FEATURED_EVENTS.map((event) => (
              <Pressable onPress={() => router.push('/events')} key={event.id} className="h-40 rounded-[40px] bg-card border border-black/5 shadow-sm overflow-hidden flex-row">
                <View className="w-1/3 h-full">
                  <Image source={{ uri: event.imageUrl }} className="w-full h-full" />
                </View>
                <View className="flex-1 p-6 justify-between">
                  <View>
                    <Text className="text-[11px] font-black text-primary-500 uppercase px-2 py-1 bg-primary-500/10 rounded-full self-start mb-2">{event.category}</Text>
                    <Text className="text-lg font-black text-text-main leading-tight" numberOfLines={2}>{event.title}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="flex-row items-center gap-1">
                      <Calendar color="#f97316" size={12} />
                      <Text className="text-[11px] font-bold text-text-muted uppercase">{event.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MapPin color="#f97316" size={12} />
                      <Text className="text-[11px] font-bold text-text-muted uppercase">{event.location}</Text>
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
