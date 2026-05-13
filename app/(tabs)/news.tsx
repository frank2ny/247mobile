import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Share } from 'react-native';
import { Newspaper, ArrowLeft, Calendar, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Constants locally defined to avoid import issues until everything is ported
const API_BASE = 'https://247digitaltvtz.co.tz/wp/wp-json/wp/v2';

export default function NewsScreen() {
  const [news, setNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_BASE}/posts?_embed&per_page=15`);
        const data = await res.json();
        const formatted = data.map((post: any) => ({
          id: post.id,
          title: post.title.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...',
          date: new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          imageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800',
          link: post.link,
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'News'
        }));
        
        const uniqueCats = Array.from(new Set(formatted.map((item: any) => item.category))) as string[];
        setCategories(['All', ...uniqueCats]);
        setNews(formatted);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleShare = async (post: any) => {
    try {
      await Share.share({
        message: `${post.title} - Read more: ${post.link}`,
        url: post.link,
        title: post.title,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <View className="flex-1 bg-bg-light">
      <View className="absolute top-0 left-0 right-0 z-50 bg-[#0a0a0a] px-6 py-4 border-b border-white/5" style={{ paddingTop: 50 }}>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center border border-white/10">
            <ArrowLeft color="white" size={20} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-black text-white uppercase">Digital <Text className="text-primary-500">Press</Text></Text>
            <Text className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-0.5">Insight Tanzania</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 flex-row">
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl mr-3 border ${selectedCategory === cat ? 'bg-primary-500 border-primary-500' : 'bg-white/5 border-white/10'}`}
            >
              <Text className={`text-[10px] font-black uppercase tracking-widest ${selectedCategory === cat ? 'text-white' : 'text-white/60'}`}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingTop: 170, paddingBottom: 120 }}>
        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator color="#f97316" size="large" />
          </View>
        ) : (
          <View className="gap-6">
            {selectedCategory === 'All' && news.length > 0 && (
              <View className="mb-2">
                <View className="flex-row items-center gap-2 mb-4 px-1">
                  <View className="w-1 h-4 bg-primary-500 rounded-full" />
                  <Text className="text-[10px] font-black uppercase tracking-[3px] text-text-main">Lead Stories</Text>
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  pagingEnabled
                  decelerationRate="fast"
                  className="w-full overflow-visible"
                >
                  {news.slice(0, 3).map((post) => (
                    <Pressable 
                      key={post.id} 
                      onPress={() => router.push(`/news/${post.id}`)}
                      className="mr-4 w-[88vw]"
                    >
                      <View className="aspect-[16/10] w-full rounded-[40px] overflow-hidden bg-[#0a0a0a] border border-black/5 shadow-xl relative">
                        <Image source={{ uri: post.imageUrl }} className="absolute inset-0 w-full h-full" />
                        <View className="absolute inset-0 bg-black/50" />
                        

                        {/* Removed Breaking badge */}

                        <View className="absolute bottom-8 left-8 right-8">
                          <Text className="text-primary-500 text-[10px] font-black uppercase tracking-[2px] mb-2">{post.category}</Text>
                          <Text className="text-xl font-black text-white uppercase tracking-tighter leading-tight mb-4">{post.title}</Text>
                          <View className="flex-row items-center gap-2">
                            <Calendar color="#f97316" size={14} />
                            <Text className="text-white/80 text-[10px] font-black uppercase tracking-widest">{post.date}</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            <View className="gap-4">
              {(selectedCategory === 'All' ? filteredNews.slice(3) : filteredNews).map((post) => (
              <Pressable
                key={post.id}
                onPress={() => router.push(`/news/${post.id}`)}
                className="flex-row gap-4 p-4 rounded-[32px] bg-white border border-black/5"
              >
                <View className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100">
                  <Image source={{ uri: post.imageUrl }} className="w-full h-full" />
                </View>
                
                <View className="flex-1 justify-between">
                  <View>
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-[9px] font-black text-primary-500 uppercase tracking-widest">{post.category}</Text>
                      <Text className="text-[9px] font-black text-black/40 uppercase tracking-widest">{post.date}</Text>
                    </View>
                    <Text className="text-[13px] font-black text-[#0a0a0a] uppercase leading-tight">{post.title}</Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Full Coverage</Text>
                    <Pressable onPress={() => handleShare(post)} className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                      <Share2 color="#0a0a0a" size={14} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        )}
      </ScrollView>
    </View>
  );
}
