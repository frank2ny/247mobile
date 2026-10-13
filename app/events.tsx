import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Share2, Ticket, Sparkles } from 'lucide-react-native';

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  price: string;
  featured?: boolean;
}

const EVENTS_DATA: EventItem[] = [
  {
    id: 'e1',
    title: 'Dar es Salaam Swahili Summer Fest 2026',
    category: 'Concert',
    date: '15 AUG 2026',
    time: '18:00 EAT',
    location: 'Dar es Salaam',
    venue: 'Coco Beach Grounds',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800',
    price: 'TSH 20,000',
    featured: true
  },
  {
    id: 'e2',
    title: 'Tanzania Tech & Innovation Summit',
    category: 'Conference',
    date: '22 SEP 2026',
    time: '09:00 EAT',
    location: 'Arusha',
    venue: 'AICC Conference Hall',
    imageUrl: 'https://images.unsplash.com/photo-1505373676634-31976f08e4ba?q=80&w=800',
    price: 'Free Registration',
    featured: true
  },
  {
    id: 'e3',
    title: 'Zanzibar Music & Culture Carnival',
    category: 'Festival',
    date: '10 OCT 2026',
    time: '16:00 EAT',
    location: 'Zanzibar',
    venue: 'Stone Town Amphitheatre',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
    price: 'TSH 35,000'
  },
  {
    id: 'e4',
    title: 'Bongo Flava NextGen Awards',
    category: 'Showbiz',
    date: '05 NOV 2026',
    time: '19:00 EAT',
    location: 'Dar es Salaam',
    venue: 'Mlimani City Hall',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
    price: 'TSH 50,000'
  }
];

const CATEGORIES = ['All', 'Concert', 'Conference', 'Festival', 'Showbiz'];

export default function EventsScreen() {
  const router = useRouter();
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
            Hot <Text className="text-primary-500">Events</Text>
          </Text>
          <Text className="text-[9px] font-black text-white/40 uppercase tracking-[2px]">Tanzania Experience</Text>
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
                    <Text className="text-[9px] font-black uppercase text-white tracking-widest">{event.category}</Text>
                  </View>
                  {event.featured && (
                    <View className="px-3 py-1 rounded-full bg-amber-500/80 flex-row items-center gap-1">
                      <Sparkles color="white" size={10} />
                      <Text className="text-[9px] font-black uppercase text-white tracking-widest">Featured</Text>
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
                <Text className="text-xl font-black text-white uppercase leading-snug mb-3">
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
