import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Info, Calendar, Mail, Phone, MessageSquare, ArrowRight, Globe, Users, Share2, Shield, ChevronRight } from 'lucide-react-native';
import { PRIVACY_POLICY_URL, CURRENT_APP_VERSION } from '../../utils/updateChecker';

interface SupportItem {
  icon: any;
  title: string;
  desc: string;
  action: () => void;
  accent?: string;
}

export default function SupportScreen() {
  const router = useRouter();

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Listen to 247 Digital Swahili Radio & TV live: https://247digitaltvtz.co.tz',
        title: '247 Digital Swahili Radio',
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  const MENU_ITEMS: SupportItem[] = [
    { 
      icon: Calendar, 
      title: 'UPCOMING EVENTS', 
      desc: 'Tickets, concerts and festivals in Tanzania',
      action: () => router.push('/events')
    },
    { 
      icon: MessageSquare, 
      title: 'WHATSAPP CHAT', 
      desc: 'Instant help on WhatsApp (+255)',
      action: () => Linking.openURL('https://wa.me/255745247247?text=Habari%20247%20Digital%20TV')
    },
    { 
      icon: Mail, 
      title: 'EMAIL SUPPORT', 
      desc: 'info@247digitaltvtz.co.tz',
      action: () => Linking.openURL('mailto:info@247digitaltvtz.co.tz?subject=247%20Digital%20App%20Support')
    },
    { 
      icon: Phone, 
      title: 'CALL CENTER', 
      desc: 'Speak to a support representative',
      action: () => Linking.openURL('tel:+255745247247')
    },
    { 
      icon: Shield, 
      title: 'PRIVACY POLICY', 
      desc: 'Official data protection & user rights',
      action: () => Linking.openURL(PRIVACY_POLICY_URL),
      accent: '#3b82f6'
    },
    { 
      icon: Info, 
      title: 'ABOUT 247 MEDIA', 
      desc: `Version ${CURRENT_APP_VERSION} • Updates & info`,
      action: () => router.push('/modal')
    }
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View 
        style={[
          styles.topHeader, 
          { paddingTop: Platform.OS === 'ios' ? 52 : 38 }
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerBrand}>
              247 DIGITAL <Text style={{ color: '#f97316' }}>HUB</Text>
            </Text>
            <Text style={styles.headerSub}>Help Center & Information</Text>
          </View>

          <Pressable 
            onPress={() => router.push('/modal')}
            style={styles.headerInfoBtn}
          >
            <Info color="#f97316" size={18} />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Info color="white" size={28} />
          </View>
          <Text style={styles.titleText}>
            Need <Text style={{ color: '#f97316' }}>Help?</Text>
          </Text>
          <Text style={styles.subtitleText}>
            Our team is available 24/7. Connect directly via WhatsApp, email, or explore live schedules and upcoming events.
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const iconColor = item.accent || '#f97316';
            return (
              <Pressable 
                key={idx} 
                onPress={item.action}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }
                ]}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${iconColor}15` }]}>
                  <Icon color={iconColor} size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
                <ChevronRight color="#9ca3af" size={18} />
              </Pressable>
            );
          })}
        </View>

        {/* Social Follow */}
        <View style={styles.socialSection}>
          <Text style={styles.followText}>CONNECT WITH US</Text>
          <View style={styles.socialRow}>
            <Pressable 
              onPress={() => Linking.openURL('https://247digitaltvtz.co.tz')} 
              style={styles.socialBtn}
            >
              <Globe color="#171717" size={20} />
            </Pressable>
            <Pressable 
              onPress={handleShareApp} 
              style={styles.socialBtn}
            >
              <Share2 color="#171717" size={20} />
            </Pressable>
            <Pressable 
              onPress={() => Linking.openURL('https://www.youtube.com/@Digitaltvtz-p5p')} 
              style={styles.socialBtn}
            >
              <Users color="#171717" size={20} />
            </Pressable>
          </View>

          <Text style={styles.versionLabel}>
            247 Digital TV TZ Media Network • v{CURRENT_APP_VERSION}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topHeader: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 2,
  },
  headerInfoBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 150,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#171717',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitleText: {
    textAlign: 'center',
    color: '#737373',
    marginTop: 8,
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  menuList: {
    gap: 12,
    marginBottom: 36,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#171717',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  menuDesc: {
    fontSize: 11,
    color: '#737373',
    marginTop: 3,
    fontWeight: '500',
  },
  socialSection: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  followText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    color: '#a3a3a3',
    marginBottom: 18,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  socialBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  versionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a3a3a3',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
