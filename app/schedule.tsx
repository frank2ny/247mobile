import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_NAME } from '../constants/brand';
import { ArrowLeft, Clock, Calendar, Radio, Tv, User } from 'lucide-react-native';
import { DAYS, SCHEDULE_DATA, dayKey, isOnNow } from '../lib/schedule';

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { day } = useLocalSearchParams<{ day?: string }>();
  const [selectedDay, setSelectedDay] = useState<string>(day && DAYS.includes(day as any) ? day : dayKey());
  const [filterType, setFilterType] = useState<'all' | 'radio' | 'tv'>('all');

  const rawList = SCHEDULE_DATA[selectedDay] || SCHEDULE_DATA['MON'];
  const shows = filterType === 'all' ? rawList : rawList.filter(s => s.type === filterType);

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      {/* Top Header */}
      <View 
        className="px-6 py-4 border-b border-white/10 bg-[#0a0a0a] z-50 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Pressable 
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} 
          className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10 active:scale-95"
        >
          <ArrowLeft color="white" size={20} />
        </Pressable>

        <View className="items-center">
          <Text className="text-lg font-black text-white tracking-tight">
            Broadcast <Text className="text-primary-500">Timeline</Text>
          </Text>
          <Text className="text-[12px] font-medium text-white/60">{APP_NAME}</Text>
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
              <Text className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'text-primary-500' : 'text-white/50'}`}>
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
                  (selectedDay === dayKey() && isOnNow(show)) ? 'bg-primary-500/10 border-primary-500/40' : 'bg-white/5 border-white/5'
                }`}
              >
                <View className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40">
                  <Image source={{ uri: show.imageUrl }} className="w-full h-full" />
                  {(selectedDay === dayKey() && isOnNow(show)) && (
                    <View className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-500 flex-row items-center">
                      <View className="w-1.5 h-1.5 rounded-full bg-card mr-1" />
                      <Text className="text-[11px] font-black uppercase text-white tracking-wider">LIVE</Text>
                    </View>
                  )}
                </View>

                <View className="flex-1 justify-between">
                  <View>
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center gap-1.5">
                        <Clock color="#f97316" size={12} />
                        <Text className="text-[11px] font-black text-primary-500 tracking-wider">
                          {show.startTime} - {show.endTime}
                        </Text>
                      </View>
                      <View className="px-2 py-0.5 rounded-md bg-white/10">
                        <Text className="text-[11px] font-black uppercase text-white/60 tracking-widest">{show.type}</Text>
                      </View>
                    </View>

                    <Text className="text-base font-black text-white leading-tight mb-1" numberOfLines={1}>
                      {show.title}
                    </Text>

                    <View className="flex-row items-center gap-1">
                      <User color="rgba(255,255,255,0.4)" size={12} />
                      <Text className="text-[11px] font-bold text-white/50 uppercase tracking-wide">
                        w/ {show.host}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-[11px] font-bold text-primary-500/80 uppercase tracking-widest mt-2">
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
