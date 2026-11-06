import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LivePanel } from '../../components/home/LivePanel';
import { EventsStrip, OnAirStrip, QuickActions, VideoStrip } from '../../components/home/HomeRows';
import { LatestNewsStrip } from '../../components/news/LatestNewsStrip';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

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
      <ScrollView
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
        <LivePanel topInset={insets.top} />

        <View style={styles.content}>
          <QuickActions />
          <OnAirStrip refreshKey={refreshKey} />
          <LatestNewsStrip count={3} refreshKey={refreshKey} />
          <VideoStrip refreshKey={refreshKey} />
          <EventsStrip />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F0EC' },
  statusBand: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', zIndex: 10 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 28 },
});
