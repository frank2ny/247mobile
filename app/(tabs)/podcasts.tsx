import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { Mic, Play, ArrowRight, TrendingUp } from 'lucide-react-native';

const MOCK_PODCASTS = [
  { id: '1', title: 'The Daily Brief', host: 'Digital TV TZ', category: 'News', duration: '45 min', imageUrl: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=800' },
  { id: '2', title: 'Tech Talk Tanzania', host: 'Tech Team', category: 'Technology', duration: '1 hr 15 min', imageUrl: 'https://images.unsplash.com/photo-1516280440502-6c56b7c53d5a?q=80&w=800' },
];

export default function PodcastsScreen() {
  return (
    <View className="flex-1 bg-bg-light">
      {/* Fixed Header */}
      <View className="absolute top-0 left-0 right-0 z-50 bg-[#0a0a0a] px-6 py-4 border-b border-white/5" style={Platform.OS === 'ios' ? { paddingTop: 50 } : { paddingTop: 40 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-black text-white uppercase">
              EduTech <Text className="text-primary-500">Corner</Text>
            </Text>
            <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mt-1">
              Listen on Demand
            </Text>
          </View>
          <Pressable className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Mic color="#f97316" size={20} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingTop: 130, paddingBottom: 150 }}>

        <View className="gap-4">
          {MOCK_PODCASTS.map(podcast => (
            <Pressable key={podcast.id} className="flex-row p-4 rounded-3xl bg-white border border-black/5 shadow-sm">
               <View className="w-24 h-24 rounded-2xl overflow-hidden bg-black/5">
                 <Image source={{ uri: podcast.imageUrl }} className="w-full h-full" />
                 <View className="absolute inset-0 items-center justify-center bg-black/20">
                   <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow-md">
                     <Play color="#eab308" size={16} style={{ marginLeft: 2 }} />
                   </View>
                 </View>
               </View>
               <View className="flex-1 ml-4 justify-center">
                 <Text className="text-[10px] font-black text-[#eab308] uppercase tracking-widest mb-1">{podcast.category}</Text>
                 <Text className="text-lg font-bold text-text-main mb-1 leading-tight">{podcast.title}</Text>
                 <Text className="text-[10px] text-text-muted uppercase font-bold">{podcast.duration} • By {podcast.host}</Text>
               </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
