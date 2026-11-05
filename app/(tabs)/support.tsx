import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Mail, Phone, MessageSquare, ChevronRight, Globe, Tv, Bell, Info, SquarePlay } from 'lucide-react-native';
import { APP_NAME, CONTACT, WEBSITE_URL, YOUTUBE_URL } from '../../constants/brand';

type MenuItem = {
  key: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  desc: string;
  onPress: () => void;
};

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const go = (href: Href) => () => router.push(href);

  const browseItems: MenuItem[] = [
    { key: 'events', icon: Calendar, title: 'Events', desc: 'Concerts, festivals and tickets', onPress: go('/events') },
    { key: 'tv', icon: Tv, title: 'Video', desc: 'Latest videos from our YouTube channel', onPress: go('/tv') },
    { key: 'notifications', icon: Bell, title: 'Notifications', desc: 'Choose which alerts you get', onPress: go('/notifications') },
    { key: 'about', icon: Info, title: 'About & updates', desc: 'App version and update check', onPress: go('/modal') },
  ];

  // Contact rows only appear once a value is set in constants/brand.ts
  const contactItems: MenuItem[] = [
    CONTACT.email && { key: 'email', icon: Mail, title: 'Email us', desc: CONTACT.email, onPress: () => Linking.openURL(`mailto:${CONTACT.email}`) },
    CONTACT.phone && { key: 'phone', icon: Phone, title: 'Call us', desc: `+${CONTACT.phone}`, onPress: () => Linking.openURL(`tel:+${CONTACT.phone}`) },
    CONTACT.whatsapp && { key: 'whatsapp', icon: MessageSquare, title: 'WhatsApp', desc: 'Chat with the studio', onPress: () => Linking.openURL(`https://wa.me/${CONTACT.whatsapp}`) },
  ].filter(Boolean) as MenuItem[];

  const renderItem = (item: MenuItem) => (
    <Pressable
      key={item.key}
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.menuIconContainer}>
        <item.icon color="#f97316" size={22} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuDesc}>{item.desc}</Text>
      </View>
      <ChevronRight color="#9ca3af" size={20} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 150 }}
      >
        <View style={styles.header}>
          <Text style={styles.titleText}>More</Text>
          <Text style={styles.subtitleText}>{APP_NAME}</Text>
        </View>

        <View style={styles.group}>{browseItems.map(renderItem)}</View>

        {contactItems.length > 0 && (
          <>
            <Text style={styles.groupLabel}>Contact</Text>
            <View style={styles.group}>{contactItems.map(renderItem)}</View>
          </>
        )}

        <Text style={styles.groupLabel}>Follow us</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable
            onPress={() => Linking.openURL(WEBSITE_URL)}
            accessibilityRole="link"
            accessibilityLabel="Open our website"
            style={styles.socialBtn}
          >
            <Globe color="#374151" size={22} />
            <Text style={styles.socialText}>Website</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(YOUTUBE_URL)}
            accessibilityRole="link"
            accessibilityLabel="Open our YouTube channel"
            style={styles.socialBtn}
          >
            <SquarePlay color="#374151" size={22} />
            <Text style={styles.socialText}>YouTube</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0EC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#171717',
    letterSpacing: -0.5,
  },
  subtitleText: {
    color: '#737373',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  group: {
    gap: 12,
    marginBottom: 32,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#737373',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(249,115,22,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
  },
  menuDesc: {
    fontSize: 13,
    color: '#737373',
    marginTop: 2,
    fontWeight: '500',
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
});
