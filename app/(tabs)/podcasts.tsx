import { View, Text, ScrollView, Image } from 'react-native';
import { Mic } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_NAME } from '../../constants/brand';

// Placeholder shows until a real podcast feed is connected (roadmap Phase 3).
// Cards are not pressable so they don't look playable.
const UPCOMING_SHOWS = [
  { id: '1', title: 'The Daily Brief', host: APP_NAME, category: 'News', imageUrl: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=800' },
  { id: '2', title: 'Tech Talk Tanzania', host: 'Tech Team', category: 'Technology', imageUrl: 'https://images.unsplash.com/photo-1516280440502-6c56b7c53d5a?q=80&w=800' },
];

export default function PodcastsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg-light">
      {/* Header */}
      <View className="bg-[#0a0a0a] px-6 pb-4 border-b border-white/5" style={{ paddingTop: insets.top + 12 }}>
        <Text className="text-2xl font-black text-white">Podcasts</Text>
        <Text className="text-white/60 text-[12px] font-medium mt-1">Listen on demand</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingTop: 24, paddingBottom: 150 }}>
        <View className="flex-row items-center gap-3 p-4 mb-6 rounded-3xl bg-primary-500/10 border border-primary-500/20">
          <View className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center">
            <Mic color="white" size={18} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-text-main">Episodes are coming soon</Text>
            <Text className="text-[13px] text-text-muted mt-0.5">These shows will be available to play here.</Text>
          </View>
        </View>

        <View className="gap-4">
          {UPCOMING_SHOWS.map(podcast => (
            <View key={podcast.id} className="flex-row p-4 rounded-3xl bg-card border border-black/5 shadow-sm">
              <View className="w-20 h-20 rounded-2xl overflow-hidden bg-black/5">
                <Image source={{ uri: podcast.imageUrl }} className="w-full h-full" />
              </View>
              <View className="flex-1 ml-4 justify-center">
                <Text className="text-[12px] font-bold text-[#b45309] uppercase tracking-[1px] mb-1">{podcast.category}</Text>
                <Text className="text-lg font-bold text-text-main mb-1 leading-tight">{podcast.title}</Text>
                <Text className="text-[13px] text-text-muted font-medium">By {podcast.host}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
