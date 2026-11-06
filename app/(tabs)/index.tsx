import React, { useCallback, useRef, useState } from 'react';
import { View, Animated, RefreshControl, StyleSheet, Platform } from 'react-native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LivePanel } from '../../components/home/LivePanel';
import { CompactLiveBar } from '../../components/home/CompactLiveBar';
import { EventsStrip, OnAirStrip, QuickActions, VideoStrip } from '../../components/home/HomeRows';
import { LatestNewsStrip } from '../../components/news/LatestNewsStrip';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Scroll-linked effects: the banner sinks and fades under the content,
  // then a compact live bar drops in at the top
  const scrollY = useRef(new Animated.Value(0)).current;
  const [panelHeight, setPanelHeight] = useState(420);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: Platform.OS !== 'web',
  });
  const panelMotion = {
    opacity: scrollY.interpolate({
      inputRange: [panelHeight * 0.3, panelHeight * 0.9],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, panelHeight],
          outputRange: [0, panelHeight * 0.5],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [0, panelHeight],
          outputRange: [1, 0.94],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  // White status-bar icons over the black panel; back to dark when leaving Home
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, []),
  );

  // Pull down: every row reloads; the spinner hides after a moment either way
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  return (
    <View style={styles.screen}>
      {/* Black band behind the status bar so scrolled content never shows under it */}
      <View style={[styles.statusBand, { height: insets.top }]} />
      <CompactLiveBar scrollY={scrollY} appearAt={panelHeight - insets.top - 64} topInset={insets.top} />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#f97316"
            colors={['#f97316']}
            progressViewOffset={insets.top}
          />
        }
      >
        <Animated.View style={panelMotion} onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}>
          <LivePanel topInset={insets.top} />
        </Animated.View>

        <View style={styles.content}>
          <QuickActions />
          <OnAirStrip refreshKey={refreshKey} />
          <LatestNewsStrip count={3} refreshKey={refreshKey} />
          <VideoStrip refreshKey={refreshKey} />
          <EventsStrip />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F0EC' },
  statusBand: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', zIndex: 10 },
  // Solid background so the content slides over the sinking banner like a sheet
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 28, backgroundColor: '#F2F0EC' },
});
