import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function EventsScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-bg-light px-4 pt-16">
      <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-black/5 mb-4 shadow-sm">
        <ArrowLeft color="#737373" size={20} />
      </Pressable>
      <Text className="text-2xl font-bold text-text-main">Events Screen</Text>
    </View>
  );
}
