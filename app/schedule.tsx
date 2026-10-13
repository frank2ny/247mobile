import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Calendar, Radio, Tv, User } from 'lucide-react-native';

interface ShowSchedule {
  id: string;
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  category: string;
  type: 'radio' | 'tv';
  imageUrl: string;
  isLive?: boolean;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const SCHEDULE_DATA: Record<string, ShowSchedule[]> = {
  MON: [
    { id: 'm1', title: 'Asubuhi Njema Live', host: 'DJ Sky & Sarah J', startTime: '06:00', endTime: '10:00', category: 'Morning Drive', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800', isLive: true },
    { id: 'm2', title: 'Top 20 Swahili Countdown', host: 'Mike D', startTime: '10:00', endTime: '13:00', category: 'Music & Hits', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=800' },
    { id: 'm3', title: 'Digital Prime News TV', host: 'Editorial Desk', startTime: '13:00', endTime: '14:00', category: 'News Bulletin', type: 'tv', imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800' },
    { id: 'm4', title: 'Vibe la Jioni', host: 'Captain Frank', startTime: '14:00', endTime: '18:00', category: 'Afternoon Show', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1520529277867-dbf8c5e0b340?q=80&w=800' },
    { id: 'm5', title: 'Swahili Cinema Special', host: 'Digital TV Crew', startTime: '18:00', endTime: '21:00', category: 'TV Entertainment', type: 'tv', imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800' },
  ],
  TUE: [
    { id: 't1', title: 'Asubuhi Njema Live', host: 'DJ Sky', startTime: '06:00', endTime: '10:00', category: 'Morning Drive', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800' },
    { id: 't2', title: 'Tech & Bongo Trends', host: 'Sarah J', startTime: '10:00', endTime: '14:00', category: 'Culture & Tech', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1516280440502-6c56b7c53d5a?q=80&w=800' },
    { id: 't3', title: 'Usiku wa Rhythm', host: 'DJ Flex', startTime: '18:00', endTime: '22:00', category: 'Night Session', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800' },
  ],
  WED: [
    { id: 'w1', title: 'Midday Swahili Mix', host: 'Sarah J', startTime: '10:00', endTime: '14:00', category: 'Music', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=800' },
    { id: 'w2', title: 'Spotlight Tanzania', host: 'Editorial Team', startTime: '15:00', endTime: '17:00', category: 'Documentary', type: 'tv', imageUrl: 'https://images.unsplash.com/photo-1505373676634-31976f08e4ba?q=80&w=800' },
  ],
  THU: [
    { id: 'th1', title: 'Asubuhi Njema Live', host: 'DJ Sky', startTime: '06:00', endTime: '10:00', category: 'Morning Drive', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800' },
  ],
  FRI: [
    { id: 'f1', title: 'Weekend Warmup', host: 'Full Crew', startTime: '16:00', endTime: '22:00', category: 'Party Mix', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800' },
  ],
  SAT: [
    { id: 'sa1', title: 'Saturday Bongo Flava', host: 'DJ Sky', startTime: '12:00', endTime: '18:00', category: 'Bongo Flava', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800' },
  ],
  SUN: [
    { id: 'su1', title: 'Sunday Gospel & Reflection', host: 'Sister Mary', startTime: '07:00', endTime: '12:00', category: 'Gospel & Inspiration', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800' },
  ],
};

export default function ScheduleScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('MON');
  const [filterType, setFilterType] = useState<'all' | 'radio' | 'tv'>('all');

  const rawList = SCHEDULE_DATA[selectedDay] || SCHEDULE_DATA['MON'];
  const shows = filterType === 'all' ? rawList : rawList.filter(s => s.type === filterType);

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      {/* Top Header */}
      <View 
        className="px-6 py-4 border-b border-white/10 bg-[#0a0a0a] z-50 flex-row items-center justify-between"
        style={Platform.OS === 'ios' ? { paddingTop: 54 } : { paddingTop: 40 }}
      >
        <Pressable 
          onPress={() => router.back()} 
          className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10 active:scale-95"
        >
          <ArrowLeft color="white" size={20} />
        </Pressable>

        <View className="items-center">
          <Text className="text-lg font-black text-white uppercase tracking-tight">
            Broadcast <Text className="text-primary-500">Timeline</Text>
          </Text>
          <Text className="text-[9px] font-black text-white/40 uppercase tracking-[2px]">247 Digital TV TZ</Text>
        </View>

        <View className="w-11 h-11 rounded-2xl bg-primary-500/10 items-center justify-center border border-primary-500/20">
          <Calendar color="#f97316" size={20} />
        </View>
      </View>

      {/* Day Selector */}
      <View className="py-4 bg-[#111111] border-b border-white/5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {DAYS.map((day) => {
            const isActive = selectedDay === day;
            return (
              <Pressable
                key={day}
                onPress={() => setSelectedDay(day)}
                className={`px-5 py-3 rounded-2xl mr-3 border items-center min-w-[64px] ${
                  isActive ? 'bg-primary-500 border-primary-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-black uppercase ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Media Type Filter */}
      <View className="flex-row px-6 py-3 bg-[#0a0a0a] gap-3">
        {(['all', 'radio', 'tv'] as const).map((type) => {
          const isActive = filterType === type;
          return (
            <Pressable
              key={type}
              onPress={() => setFilterType(type)}
              className={`flex-1 py-2 rounded-xl border items-center justify-center flex-row gap-2 ${
                isActive ? 'bg-white/10 border-primary-500' : 'bg-transparent border-white/10'
              }`}
            >
              {type === 'radio' && <Radio color={isActive ? '#f97316' : '#9ca3af'} size={14} />}
              {type === 'tv' && <Tv color={isActive ? '#f97316' : '#9ca3af'} size={14} />}
              <Text className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-primary-500' : 'text-white/50'}`}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Timeline List */}
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {shows.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-white/40 text-xs font-bold uppercase tracking-widest">No shows scheduled for this filter</Text>
          </View>
        ) : (
          <View className="gap-4">
            {shows.map((show) => (
              <View 
                key={show.id} 
                className={`p-4 rounded-3xl border flex-row gap-4 relative overflow-hidden ${
                  show.isLive ? 'bg-primary-500/10 border-primary-500/40' : 'bg-white/5 border-white/5'
                }`}
              >
                <View className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40">
                  <Image source={{ uri: show.imageUrl }} className="w-full h-full" />
                  {show.isLive && (
                    <View className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-500 flex-row items-center">
                      <View className="w-1.5 h-1.5 rounded-full bg-white mr-1" />
                      <Text className="text-[8px] font-black uppercase text-white tracking-wider">LIVE</Text>
                    </View>
                  )}
                </View>

                <View className="flex-1 justify-between">
                  <View>
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-1.5">
                        <Clock color="#f97316" size={12} />
                        <Text className="text-[10px] font-black text-primary-500 tracking-wider">
                          {show.startTime} - {show.endTime}
                        </Text>
                      </View>
                      <View className="px-2 py-0.5 rounded-md bg-white/10">
                        <Text className="text-[8px] font-black uppercase text-white/60 tracking-widest">{show.type}</Text>
                      </View>
                    </View>

                    <Text className="text-base font-black text-white uppercase leading-tight mb-1" numberOfLines={1}>
                      {show.title}
                    </Text>

                    <View className="flex-row items-center gap-1">
                      <User color="rgba(255,255,255,0.4)" size={12} />
                      <Text className="text-[10px] font-bold text-white/50 uppercase tracking-wide">
                        w/ {show.host}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-[9px] font-bold text-primary-500/80 uppercase tracking-widest mt-2">
                    {show.category}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
