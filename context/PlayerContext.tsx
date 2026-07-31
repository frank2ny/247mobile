import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

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

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioState['currentTrack']>({
    id: 'radio-live',
    title: 'Digital TV Radio',
    artist: 'Live Streaming',
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400',
    url: RADIO_STREAM_URL,
    type: 'radio'
  });
  
  const [volume, setVolumeState] = useState(1.0);

  // Initialize the modern expo-audio player
  const player = useAudioPlayer(currentTrack?.url);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (player) {
      player.volume = volume;
    }
  }, [volume, player]);

  const play = (track?: AudioState['currentTrack']) => {
    if (track && track.url !== currentTrack?.url) {
      setCurrentTrack(track);
      // Wait for next render cycle to let the new URL load into the player
      setTimeout(() => player.play(), 500);
    } else {
      player.play();
    }
  };

  const pause = () => {
    player.pause();
  };

  const toggle = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
  };

  return (
    <PlayerContext.Provider value={{ 
      isPlaying: status.playing, 
      isBuffering: !status.isLoaded && status.playing, // Approximate buffering state
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
