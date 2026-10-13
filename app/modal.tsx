import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Info, X, Radio, Shield, Heart, Download, CheckCircle, RefreshCw } from 'lucide-react-native';
import { CURRENT_APP_VERSION, checkAppUpdate, openStoreForUpdate, UpdateStatus } from '../utils/updateChecker';

export default function ModalScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateStatus | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  const handleCheckUpdate = async () => {
    setChecking(true);
    try {
      const res = await checkAppUpdate();
      setUpdateInfo(res);
      setCheckedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0a0a0a] px-6 pt-8 pb-12 justify-between">
      <View>
        <View className="flex-row items-center justify-between pb-6 border-b border-white/10">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-2xl bg-primary-500/10 items-center justify-center border border-primary-500/20">
              <Info color="#f97316" size={20} />
            </View>
            <View>
              <Text className="text-lg font-black text-white uppercase">About 247 Media</Text>
              <Text className="text-[9px] font-black text-primary-500 uppercase tracking-widest">Version {CURRENT_APP_VERSION}</Text>
            </View>
          </View>
          <Pressable onPress={() => router.back()} className="w-9 h-9 rounded-xl bg-white/5 items-center justify-center">
            <X color="white" size={18} />
          </Pressable>
        </View>

        <View className="mt-6 gap-4">
          {/* Update Status Card */}
          <View className="p-5 rounded-3xl bg-white/5 border border-white/10 gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <Download color="#f97316" size={18} />
                <Text className="text-sm font-black text-white uppercase tracking-wider">App Updates</Text>
              </View>
              <View className="px-2.5 py-1 rounded-full bg-primary-500/20 border border-primary-500/30">
                <Text className="text-[9px] font-black text-primary-500 uppercase tracking-widest">v{CURRENT_APP_VERSION}</Text>
              </View>
            </View>

            {updateInfo?.hasUpdate ? (
              <View className="bg-primary-500/10 border border-primary-500/30 p-3 rounded-2xl gap-2 mt-1">
                <View className="flex-row items-center gap-2">
                  <Download color="#f97316" size={16} />
                  <Text className="text-xs font-black text-white uppercase">New Version v{updateInfo.latestVersion} Available!</Text>
                </View>
                <Text className="text-[10px] text-white/70 font-medium">{updateInfo.releaseNotes}</Text>
                <Pressable 
                  onPress={openStoreForUpdate} 
                  className="bg-primary-500 h-10 rounded-xl items-center justify-center mt-1"
                >
                  <Text className="text-white text-xs font-black uppercase tracking-wider">Update App Now</Text>
                </Pressable>
              </View>
            ) : updateInfo ? (
              <View className="flex-row items-center gap-2 py-1">
                <CheckCircle color="#22c55e" size={16} />
                <Text className="text-xs font-bold text-green-400">Your app is up to date! (Checked at {checkedAt})</Text>
              </View>
            ) : (
              <Text className="text-xs text-white/50">Check for client updates and feature releases.</Text>
            )}

            <Pressable 
              onPress={handleCheckUpdate} 
              disabled={checking}
              className="flex-row items-center justify-center gap-2 h-11 rounded-2xl bg-white/10 border border-white/10 active:scale-95 mt-1"
            >
              {checking ? (
                <ActivityIndicator color="#f97316" size="small" />
              ) : (
                <>
                  <RefreshCw color="white" size={14} />
                  <Text className="text-white text-xs font-black uppercase tracking-wider">Check For Updates</Text>
                </>
              )}
            </Pressable>
          </View>

          <View className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-row items-center gap-4">
            <Radio color="#f97316" size={20} />
            <View className="flex-1">
              <Text className="text-sm font-bold text-white uppercase">247 Swahili Radio</Text>
              <Text className="text-xs text-white/50">High-fidelity Swahili audio broadcast</Text>
            </View>
          </View>

          <View className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-row items-center gap-4">
            <Shield color="#3b82f6" size={20} />
            <View className="flex-1">
              <Text className="text-sm font-bold text-white uppercase">Privacy & Encryption</Text>
              <Text className="text-xs text-white/50">Secure local streams & push settings</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="items-center border-t border-white/10 pt-6">
        <View className="flex-row items-center gap-1.5 mb-2">
          <Text className="text-xs font-bold text-white/40">Crafted with</Text>
          <Heart color="#ef4444" size={12} fill="#ef4444" />
          <Text className="text-xs font-bold text-white/40">for Tanzania</Text>
        </View>
        <Text className="text-[10px] font-bold text-white/20 uppercase tracking-[2px]">
          Digital TV TZ Media Network • v{CURRENT_APP_VERSION}
        </Text>
      </View>
    </View>
  );
}
