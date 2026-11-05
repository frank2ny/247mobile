import { View, Text, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Radio, Bell, Mic, Calendar, MapPin, Tv, Play, Pause, RadioTower, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { usePlayer } from '../../context/PlayerContext';

const FEATURED_EVENTS = [
  {
    id: 'e1',
    title: 'Summer Music Festival 2026',
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
  { id: '1', title: 'Asubuhi Njema Live', startTime: '06:00', host: 'DJ Sky', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800' },
  { id: '2', title: 'Top 20 Swahili Hits', startTime: '10:00', host: 'Sarah J', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=800' },
  { id: '3', title: 'Vibe la Jioni', startTime: '14:00', host: 'Mike D', imageUrl: 'https://images.unsplash.com/photo-1520529277867-dbf8c5e0b340?q=80&w=800' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isPlaying, isBuffering, toggle, currentTrack } = usePlayer();

  const isRadioActive = isPlaying && currentTrack?.type === 'radio';

  return (
    <View className="flex-1 bg-bg-light">
      {/* Fixed Header */}
      <View 
        className="absolute top-0 left-0 right-0 z-50 bg-[#0a0a0a] px-6 py-4 border-b border-white/5" 
        style={{ paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 50 : 38) }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-white">
              DIGITAL TV <Text className="text-primary-500">TZ</Text>
            </Text>
            <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mt-1">
              Premium Swahili Media Network
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push('/notifications')}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95"
          >
            <Bell color="#f97316" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ 
          paddingTop: Math.max(insets.top, 40) + 76, 
          paddingBottom: 150 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View className="mb-7">
          <View className="flex-row items-center gap-2 mb-1">
            <RadioTower color="#f97316" size={14} />
            <Text className="text-[10px] font-black text-primary-500 uppercase tracking-[3px]">Habari, Tanzania</Text>
          </View>
          <Text className="text-4xl font-black text-text-main">Your Daily</Text>
          <Text className="text-4xl font-black text-black/15">Connection</Text>
        </View>

        {/* Featured Live Radio Card (Connected to PlayerContext) */}
        <View className="w-full aspect-[16/10] rounded-[36px] overflow-hidden mb-8 border border-black/5 shadow-md relative bg-[#0a0a0a]">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800' }} 
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            contentFit="cover"
            transition={300}
          />
          <View className="absolute inset-0 bg-brand-dark/50" />
          
          {/* Top badges row */}
          <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between">
            <View className={`px-3 py-1.5 rounded-full flex-row items-center shadow-lg ${isRadioActive ? 'bg-primary-500' : 'bg-black/60 border border-white/20'}`}>
              <View className={`w-2 h-2 rounded-full mr-2 ${isRadioActive ? 'bg-white' : 'bg-red-500'}`} />
              <Text className="text-[9px] font-black uppercase text-white tracking-widest">
                {isRadioActive ? 'Live On Air' : 'Live Radio'}
              </Text>
            </View>

            <Pressable 
              onPress={() => router.push('/radio')}
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 flex-row items-center gap-1 active:scale-95"
            >
              <Sparkles color="#f97316" size={12} />
              <Text className="text-[9px] font-black uppercase text-white tracking-wider">Radio Hub</Text>
            </Pressable>
          </View>

          {/* Bottom Info & Play Controller */}
          <View className="absolute bottom-6 left-6 right-6 flex-row items-end justify-between">
            <Pressable 
              onPress={() => router.push('/radio')} 
              className="flex-1 pr-3"
            >
              <Text className="text-2xl font-black text-white uppercase leading-tight">247 Digital</Text>
              <Text className="text-2xl font-black text-primary-500 uppercase leading-tight">Swahili Radio</Text>
              <Text className="text-white/70 text-[10px] font-bold uppercase tracking-wider mt-1.5" numberOfLines={1}>
                {currentTrack?.artist || 'Global Sounds, Local Soul'}
              </Text>
            </Pressable>

            {/* Play/Pause Button connected to Audio Context */}
            <Pressable 
              onPress={toggle} 
              className="w-16 h-16 rounded-3xl bg-primary-500 items-center justify-center shadow-2xl active:scale-95 border-2 border-white/20"
            >
              {isBuffering ? (
                <ActivityIndicator color="white" size="small" />
              ) : isRadioActive ? (
                <Pause color="white" size={28} />
              ) : (
                <Play color="white" size={28} style={{ marginLeft: 3 }} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Action Grid */}
        <View className="flex-row gap-3 mb-8">
          <Pressable 
            onPress={() => router.push('/radio')} 
            className="flex-1 p-4 rounded-[28px] bg-white border border-black/5 shadow-sm active:scale-95"
          >
            <View className="w-10 h-10 rounded-2xl bg-primary-500/10 items-center justify-center mb-3">
              <Radio color="#f97316" size={20} />
            </View>
            <Text className="font-black text-xs text-text-main" numberOfLines={1}>Radio Hub</Text>
            <Text className="text-[9px] text-text-muted uppercase font-bold tracking-wider mt-0.5">Listen Live</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/tv')} 
            className="flex-1 p-4 rounded-[28px] bg-white border border-black/5 shadow-sm active:scale-95"
          >
            <View className="w-10 h-10 rounded-2xl bg-red-500/10 items-center justify-center mb-3">
              <Tv color="#ef4444" size={20} />
            </View>
            <Text className="font-black text-xs text-text-main" numberOfLines={1}>Digital TV</Text>
            <Text className="text-[9px] text-text-muted uppercase font-bold tracking-wider mt-0.5">Watch Feed</Text>
          </Pressable>

          <Pressable 
            onPress={() => router.push('/podcasts')} 
            className="flex-1 p-4 rounded-[28px] bg-white border border-black/5 shadow-sm active:scale-95"
          >
            <View className="w-10 h-10 rounded-2xl bg-[#eab308]/10 items-center justify-center mb-3">
              <Mic color="#eab308" size={20} />
            </View>
            <Text className="font-black text-xs text-text-main" numberOfLines={1}>Podcasts</Text>
            <Text className="text-[9px] text-text-muted uppercase font-bold tracking-wider mt-0.5">On Demand</Text>
          </Pressable>
        </View>

        {/* Schedule Strip */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-1 mb-5">
            <View className="flex-row items-center gap-2.5">
              <View className="w-1 h-5 bg-primary-500 rounded-full" />
              <Text className="text-lg font-black text-text-main uppercase">Daily Schedule</Text>
            </View>
            <Pressable onPress={() => router.push('/schedule')}>
              <Text className="text-[10px] text-primary-500 font-black uppercase tracking-[2px]">View Timeline</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            {MOCK_SHOWS.map((show) => (
              <Pressable 
                onPress={() => router.push('/schedule')} 
                key={show.id} 
                className="w-64 mr-4 p-4 rounded-[30px] bg-white border border-black/5 shadow-sm flex-row items-center gap-3.5 active:scale-95"
              >
                <View className="w-14 h-14 rounded-2xl overflow-hidden bg-black/5">
                  <Image source={{ uri: show.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-black text-text-main uppercase mb-0.5" numberOfLines={1}>{show.title}</Text>
                  <Text className="text-[9px] text-text-muted uppercase font-bold mb-1">w/ {show.host}</Text>
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <Text className="text-[9px] text-primary-500 uppercase font-black tracking-widest">{show.startTime}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Events Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between px-1 mb-5">
            <View className="flex-row items-center gap-2.5">
              <View className="w-1 h-5 bg-primary-500 rounded-full" />
              <Text className="text-lg font-black text-text-main uppercase">Hot Events</Text>
            </View>
            <Pressable onPress={() => router.push('/events')}>
              <Text className="text-[10px] text-primary-500 font-black uppercase tracking-[2px]">Explore All</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            {FEATURED_EVENTS.map((event) => (
              <Pressable 
                onPress={() => router.push('/events')} 
                key={event.id} 
                className="h-36 rounded-[32px] bg-white border border-black/5 shadow-sm overflow-hidden flex-row active:scale-[0.99]"
              >
                <View className="w-32 h-full bg-black/10">
                  <Image source={{ uri: event.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
                <View className="flex-1 p-5 justify-between">
                  <View>
                    <Text className="text-[8px] font-black text-primary-500 uppercase px-2.5 py-1 bg-primary-500/10 rounded-full self-start mb-2">{event.category}</Text>
                    <Text className="text-base font-black text-text-main uppercase leading-snug" numberOfLines={2}>{event.title}</Text>
                  </View>
                  <View className="flex-row gap-4 pt-1">
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
