import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin, Share2, Ticket, Sparkles } from 'lucide-react-native';

import { EVENTS_DATA, EventItem } from '../lib/events';

const CATEGORIES = ['All', 'Concert', 'Conference', 'Festival', 'Showbiz'];

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredEvents = selectedCat === 'All'
    ? EVENTS_DATA
    : EVENTS_DATA.filter(item => item.category === selectedCat);

  const handleShare = async (event: EventItem) => {
    try {
      await Share.share({
        message: `Join me at ${event.title} on ${event.date} in ${event.location}!`,
        title: event.title,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      {/* Fixed Header */}
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
            Hot <Text className="text-primary-500">Events</Text>
          </Text>
          <Text className="text-[11px] font-black text-white/40 uppercase tracking-[1px]">Tanzania Experience</Text>
        </View>

        <View className="w-11 h-11 rounded-2xl bg-primary-500/10 items-center justify-center border border-primary-500/20">
          <Ticket color="#f97316" size={20} />
        </View>
      </View>

      {/* Category Pills */}
      <View className="py-4 bg-[#111111] border-b border-white/5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCat(cat)}
                className={`px-5 py-2.5 rounded-2xl mr-3 border items-center ${
                  isActive ? 'bg-primary-500 border-primary-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-black uppercase ${isActive ? 'text-white' : 'text-white/60'}`}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="gap-6">
          {filteredEvents.map((event) => (
            <View 
              key={event.id}
              className="rounded-[36px] bg-white/5 border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Image Banner */}
              <View className="w-full h-48 relative">
                <Image source={{ uri: event.imageUrl }} className="w-full h-full" />
                <View className="absolute inset-0 bg-black/40" />

                <View className="absolute top-4 left-4 flex-row items-center gap-2">
                  <View className="px-3 py-1 rounded-full bg-primary-500">
                    <Text className="text-[11px] font-black uppercase text-white tracking-widest">{event.category}</Text>
                  </View>
                  {event.featured && (
                    <View className="px-3 py-1 rounded-full bg-amber-500/80 flex-row items-center gap-1">
                      <Sparkles color="white" size={10} />
                      <Text className="text-[11px] font-black uppercase text-white tracking-widest">Featured</Text>
                    </View>
                  )}
                </View>

                <Pressable 
                  onPress={() => handleShare(event)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-black/50 items-center justify-center border border-white/20"
                >
                  <Share2 color="white" size={18} />
                </Pressable>

                <View className="absolute bottom-4 left-4 right-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
                    <Calendar color="#f97316" size={14} />
                    <Text className="text-xs font-black text-white">{event.date}</Text>
                  </View>
                  <View className="bg-primary-500/90 px-3 py-1.5 rounded-xl">
                    <Text className="text-xs font-black text-white">{event.price}</Text>
                  </View>
                </View>
              </View>

              {/* Card Details */}
              <View className="p-6">
                <Text className="text-xl font-black text-white leading-snug mb-3">
                  {event.title}
                </Text>

                <View className="flex-row items-center gap-4 pt-2 border-t border-white/5">
                  <View className="flex-row items-center gap-1.5">
                    <MapPin color="#f97316" size={14} />
                    <Text className="text-xs font-bold text-white/70">{event.venue}, {event.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
