import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Home, Newspaper, Radio, Mic, Menu } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const activeColor = '#f97316';
  const inactiveColor = '#9ca3af';
  const bgColor = '#ffffff';

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 20,
        paddingBottom: Math.max(insets.bottom, 8),
        zIndex: 50,
      }}
    >
      {/* The pill row */}
      <View
        style={{
          flexDirection: 'row',
          height: 56,
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          paddingHorizontal: 8,
          paddingBottom: 5,
        }}
      >
        {state.routes
          .filter(r => ['index', 'news', 'radio', 'podcasts', 'support'].includes(r.name))
          .map((route) => {
            const { options } = descriptors[route.key];
            const isFocused =
              state.index === state.routes.findIndex(r => r.key === route.key);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const IconMap: Record<string, any> = {
              index: Home,
              news: Newspaper,
              radio: Radio,
              podcasts: Mic,
              support: Menu,
            };
            const Icon = IconMap[route.name] || Home;
            const isCenter = route.name === 'radio';

            /* ── Center "247" Button ── */
            if (isCenter) {
              return (
                <View
                  key={route.key}
                  style={{ width: 72, alignItems: 'center', marginTop: -32 }}
                >
                  <Pressable
                    onPress={onPress}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      overflow: 'hidden',
                      shadowColor: '#f97316',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.5,
                      shadowRadius: 12,
                      elevation: 12,
                      // White ring that separates button from bar
                      borderWidth: 4,
                      borderColor: '#ffffff',
                    }}
                  >
                    <LinearGradient
                      colors={['#fb923c', '#f97316']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 17,
                          fontWeight: '900',
                          fontStyle: 'italic',
                          letterSpacing: -1,
                        }}
                      >
                        247
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              );
            }

            /* ── Regular Tab ── */
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Icon color={isFocused ? activeColor : inactiveColor} size={22} strokeWidth={isFocused ? 2.5 : 1.8} />
                  <Text
                    style={{
                      fontSize: 9,
                      marginTop: 4,
                      fontWeight: isFocused ? '900' : '600',
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      color: isFocused ? activeColor : inactiveColor,
                    }}
                  >
                    {options.title}
                  </Text>
                </View>
              </Pressable>
            );
          })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="radio"
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="news" options={{ title: 'News' }} />
      <Tabs.Screen name="radio" options={{ title: '247' }} />
      <Tabs.Screen name="podcasts" options={{ title: 'Podcasts' }} />
      <Tabs.Screen name="support" options={{ title: 'More' }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
