import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Info, Calendar, Mail, Phone, MessageSquare, ArrowRight, Globe, Users, Share2 } from 'lucide-react-native';

const MENU_ITEMS = [
  { icon: Calendar, title: 'UPCOMING EVENTS', desc: 'Tickets, concerts and festivals' },
  { icon: Mail, title: 'EMAIL SUPPORT', desc: 'Fast response via email' },
  { icon: Phone, title: 'CALL CENTER', desc: 'Talk to an agent directly' },
  { icon: MessageSquare, title: 'WHATSAPP CHAT', desc: 'Quick chat on WhatsApp' }
];

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Info color="white" size={32} />
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.titleText}>Need </Text>
            <Text style={[styles.titleText, { color: '#f97316' }]}>Help?</Text>
          </View>
          
          <Text style={styles.subtitleText}>
            Our dedicated support team is here to assist you 24/7 with any inquiries.
          </Text>
        </View>

        {/* Menu Items */}
        <View style={{ gap: 20, marginBottom: 48 }}>
          {MENU_ITEMS.map((item, idx) => (
            <Pressable 
              key={idx} 
              style={styles.menuItem}
            >
               <View style={styles.menuIconContainer}>
                  <item.icon color="#f97316" size={24} />
               </View>
               <View style={{ flex: 1 }}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
               </View>
               <ArrowRight color="#9ca3af" size={20} />
            </Pressable>
          ))}
        </View>

        {/* Social Follow */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={styles.followText}>Follow Us</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <Pressable style={styles.socialBtn}>
              <Globe color="#374151" size={24} />
            </Pressable>
            <Pressable style={styles.socialBtn}>
              <Share2 color="#374151" size={24} />
            </Pressable>
            <Pressable style={styles.socialBtn}>
              <Users color="#374151" size={24} />
            </Pressable>
          </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#171717',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitleText: {
    textAlign: 'center',
    color: '#737373',
    marginTop: 12,
    paddingHorizontal: 16,
    lineHeight: 24,
    fontSize: 13,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(249,115,22,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#171717',
    textTransform: 'uppercase',
  },
  menuDesc: {
    fontSize: 11,
    color: '#737373',
    marginTop: 4,
    fontWeight: '500',
  },
  followText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#737373',
    marginBottom: 24,
  },
  socialBtn: {
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  }
});
