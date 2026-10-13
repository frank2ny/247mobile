import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Platform, PermissionsAndroid, AppState, AppStateStatus } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { Asset } from 'expo-asset';

export interface AudioState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTrack: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    url: string;
    type: 'radio' | 'podcast';
  } | null;
  volume: number;
}

interface PlayerContextType extends AudioState {
  play: (track?: AudioState['currentTrack']) => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const RADIO_STREAM_URL = 'https://a4.asurahosting.com:8330/radio.mp3';

const LOCAL_LOGO_URI = Asset.fromModule(require('../assets/images/favicon.png')).uri;
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800';

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioState['currentTrack']>({
    id: 'radio-live',
    title: '247 Digital Swahili Radio',
    artist: 'Live Streaming 24/7',
    cover: LOCAL_LOGO_URI,
    url: RADIO_STREAM_URL,
    type: 'radio'
  });
  
  const [volume, setVolumeState] = useState(1.0);
  const [shouldPlayOnLoad, setShouldPlayOnLoad] = useState(false);

  // Initialize the modern expo-audio player with keepAudioSessionActive to prevent iOS session deactivation
  const player = useAudioPlayer(currentTrack?.url, {
    keepAudioSessionActive: true,
  });
  const status = useAudioPlayerStatus(player);

  const lastConfiguredTrackKey = useRef<string | null>(null);

  // Configure audio mode for background playback & silent mode override
  const configureAudioMode = useCallback(async () => {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'doNotMix',
      });
    } catch (err) {
      console.warn('Failed to set audio mode:', err);
    }
  }, []);

  // Request Android 13+ POST_NOTIFICATIONS permission needed for foreground service media notification
  const requestAndroidNotificationPermission = useCallback(async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (!granted) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        }
      } catch (err) {
        console.warn('Notification permission check failed:', err);
      }
    }
  }, []);

  // Configure lock screen media controls and notification
  const configureLockScreen = useCallback((track: AudioState['currentTrack']) => {
    if (!player || !track) return;
    try {
      const isHttpCover = typeof track.cover === 'string' && track.cover.startsWith('http');
      const artwork = isHttpCover ? track.cover : FALLBACK_LOGO;

      player.setActiveForLockScreen(true, {
        title: track.title,
        artist: `${track.artist} • 247 Digital Swahili Radio`,
        albumTitle: '247 Digital Swahili Radio',
        artworkUrl: artwork,
      }, {
        showSeekForward: false,
        showSeekBackward: false,
      });

      lastConfiguredTrackKey.current = `${track.id}-${track.url}`;
    } catch (err) {
      console.warn('Failed to configure lock screen media controls:', err);
    }
  }, [player]);

  // Initial setup on mount
  useEffect(() => {
    configureAudioMode();
    requestAndroidNotificationPermission();
  }, [configureAudioMode, requestAndroidNotificationPermission]);

  // Re-verify audio mode when app state changes to prevent OS audio session dropping
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' || nextAppState === 'background') {
        configureAudioMode();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [configureAudioMode]);

  // Update lock screen controls ONLY when player instance or track changes
  // (Prevents destroying and recreating the MediaSession/ForegroundService on every playing status tick)
  useEffect(() => {
    if (player && currentTrack) {
      const trackKey = `${currentTrack.id}-${currentTrack.url}`;
      if (lastConfiguredTrackKey.current !== trackKey) {
        configureLockScreen(currentTrack);
      }
    }
  }, [player, currentTrack, configureLockScreen]);

  // Auto-reconnect live radio if connection drops in background while supposed to be playing
  useEffect(() => {
    if (
      currentTrack?.type === 'radio' &&
      status.didJustFinish &&
      !status.playing
    ) {
      console.log('Live radio stream ended unexpectedly, attempting reconnect...');
      const timer = setTimeout(() => {
        try {
          player.play();
        } catch (e) {
          console.warn('Failed to auto-reconnect live radio:', e);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTrack?.type, status.didJustFinish, status.playing, player]);

  useEffect(() => {
    if (player) {
      player.volume = volume;
    }
  }, [volume, player]);

  useEffect(() => {
    if (shouldPlayOnLoad && player) {
      configureAudioMode().then(() => {
        configureLockScreen(currentTrack);
        player.play();
        setShouldPlayOnLoad(false);
      });
    }
  }, [currentTrack, player, shouldPlayOnLoad, configureAudioMode, configureLockScreen]);

  const play = async (track?: AudioState['currentTrack']) => {
    await configureAudioMode();
    await requestAndroidNotificationPermission();

    if (track && track.url !== currentTrack?.url) {
      setCurrentTrack(track);
      setShouldPlayOnLoad(true);
    } else {
      configureLockScreen(currentTrack);
      player.play();
    }
  };

  const pause = () => {
    player.pause();
  };

  const toggle = async () => {
    if (status.playing) {
      player.pause();
    } else {
      await configureAudioMode();
      await requestAndroidNotificationPermission();
      configureLockScreen(currentTrack);
      player.play();
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
  };

  const isBuffering = Boolean(status.isBuffering || (status.playing && status.isLoaded === false));

  return (
    <PlayerContext.Provider value={{ 
      isPlaying: Boolean(status.playing), 
      isBuffering, 
      currentTrack, 
      volume, 
      play, 
      pause, 
      toggle, 
      setVolume 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
