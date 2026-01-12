import { create } from 'zustand';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { Song } from '../types';
import { getLyrics } from '../api/jiosaavn';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { useLibraryStore } from './useLibraryStore';
interface PlayerState {
    queue: Song[];
    currentTrackIndex: number | null;
    currentTrack: Song | null;
    isPlaying: boolean;
    repeatMode: 'off' | 'track' | 'queue';
    isShuffle: boolean;
    soundObj: AudioPlayer | null;
    positionStr: string;
    durationStr: string;
    progress: number;  
    duration: number;  
    playbackSpeed: number;
    setQueue: (songs: Song[]) => void;
    addToQueue: (song: Song) => void;
    removeFromQueue: (id: string) => void;
    reorderQueue: (fromIndex: number, toIndex: number) => void;
    clearQueue: () => void;
    playTrack: (index: number) => Promise<void>;
    togglePlayback: () => Promise<void>;
    skipToNext: () => Promise<void>;
    skipToPrevious: () => Promise<void>;
    seekTo: (positionMillis: number) => Promise<void>;
    seekBy: (millis: number) => Promise<void>;
    closePlayer: () => Promise<void>;
    setRepeatMode: (mode: 'off' | 'track' | 'queue') => void;
    toggleShuffle: () => void;
    setPlaybackSpeed: (speed: number) => Promise<void>;
    hydrate: () => Promise<void>;
    init: () => Promise<void>;
}
let soundInstance: AudioPlayer | null = null;
export const usePlayerStore = create<PlayerState>((set, get) => ({
    queue: [],
    currentTrackIndex: null,
    currentTrack: null,
    isPlaying: false,
    repeatMode: 'off',
    isShuffle: false,
    soundObj: null,
    positionStr: '0:00',
    durationStr: '0:00',
    progress: 0,
    duration: 0,
    playbackSpeed: 1.0,
    setQueue: (songs) => {
        set({ queue: songs });
        storage.set(STORAGE_KEYS.QUEUE, JSON.stringify(songs));
    },
    reorderQueue: (fromIndex: number, toIndex: number) => {
        const { queue, currentTrackIndex } = get();
        if (fromIndex < 0 || fromIndex >= queue.length || toIndex < 0 || toIndex >= queue.length) return;
        const newQueue = [...queue];
        const [movedItem] = newQueue.splice(fromIndex, 1);
        newQueue.splice(toIndex, 0, movedItem);
        set({ queue: newQueue });
        let newCurrentIndex = currentTrackIndex;
        if (currentTrackIndex !== null) {
            if (fromIndex === currentTrackIndex) {
                newCurrentIndex = toIndex;
            } else if (fromIndex < currentTrackIndex && toIndex >= currentTrackIndex) {
                newCurrentIndex = currentTrackIndex - 1;
            } else if (fromIndex > currentTrackIndex && toIndex <= currentTrackIndex) {
                newCurrentIndex = currentTrackIndex + 1;
            }
            set({ currentTrackIndex: newCurrentIndex });
        }
        storage.set(STORAGE_KEYS.QUEUE, JSON.stringify(newQueue));
        if (newCurrentIndex !== null) storage.set(STORAGE_KEYS.LAST_PLAYED_INDEX, newCurrentIndex);
    },
    removeFromQueue: (id: string) => {
        const { queue, currentTrackIndex } = get();
        const songToRemoveIndex = queue.findIndex(s => s.id === id);
        if (songToRemoveIndex === -1) return;
        const newQueue = queue.filter(s => s.id !== id);
        set({ queue: newQueue });
        if (currentTrackIndex !== null) {
            if (songToRemoveIndex < currentTrackIndex) {
                set({ currentTrackIndex: currentTrackIndex - 1 });
            } else if (songToRemoveIndex === currentTrackIndex) {
                if (newQueue.length > 0) {
                    const newIndex = Math.min(currentTrackIndex, newQueue.length - 1);
                    const nextTrack = newQueue[Math.min(currentTrackIndex, newQueue.length - 1)];
                    set({ currentTrack: nextTrack, currentTrackIndex: Math.min(currentTrackIndex, newQueue.length - 1) });
                    get().playTrack(Math.min(currentTrackIndex, newQueue.length - 1));
                } else {
                    get().closePlayer();
                }
            }
        }
        storage.set(STORAGE_KEYS.QUEUE, JSON.stringify(newQueue));
    },
    clearQueue: () => {
        set({ queue: [], currentTrack: null, currentTrackIndex: null, isPlaying: false });
        if (soundInstance) {
            soundInstance.pause();  
            soundInstance = null;
        }
        storage.set(STORAGE_KEYS.QUEUE, JSON.stringify([]));
    },
    init: async () => {
        try {
            console.log("Player Store Initialized");
        } catch (e) {
            console.error("Failed to init audio session", e);
        }
    },
    addToQueue: (song) => {
        const { queue } = get();
        const newQueue = [...queue, song];
        set({ queue: newQueue });
        storage.set(STORAGE_KEYS.QUEUE, JSON.stringify(newQueue));
    },
    playTrack: async (index) => {
        const { queue } = get();
        if (index < 0 || index >= queue.length) return;
        const track = queue[index];
        useLibraryStore.getState().addToHistory(track);
        if (soundInstance) {
            soundInstance.pause();
            soundInstance = null;
        }
        set({ currentTrackIndex: index, currentTrack: track, isPlaying: true });
        storage.set(STORAGE_KEYS.LAST_PLAYED_INDEX, index);
        try {
            const { useDownloadStore } = require('./useDownloadStore');
            const localUri = useDownloadStore.getState().getLocalUri(track.id);
            let uri = localUri;
            if (!uri) {
                uri = track.downloadUrl?.[4]?.url || track.downloadUrl?.[3]?.url || track.downloadUrl?.[2]?.url || track.downloadUrl?.[0]?.url;
            }
            if (!uri) throw new Error("No download URL");
            console.log('Playing URI:', uri);  
            const player = createAudioPlayer(uri);
            soundInstance = player;
            if (typeof (player as any).setPlaybackRate === 'function') {
                (player as any).setPlaybackRate(get().playbackSpeed);
            } else if (typeof (player as any).setRate === 'function') {
                (player as any).setRate(get().playbackSpeed);
            } else {
                console.warn("Cannot set playback speed: setter not found/known");
            }
            player.play();
            const interval = setInterval(() => {
                if (soundInstance === player) {
                    set({
                        duration: player.duration,
                        progress: player.currentTime,
                        isPlaying: player.playing
                    });
                    if (player.currentTime >= player.duration && player.duration > 0) {
                        clearInterval(interval);
                        get().skipToNext();
                    }
                } else {
                    clearInterval(interval);
                }
            }, 500);
        } catch (e) {
            console.error("Error playing track", e);
        }
    },
    togglePlayback: async () => {
        if (soundInstance) {
            const { isPlaying } = get();
            if (isPlaying) {
                soundInstance.pause();
                set({ isPlaying: false });
            } else {
                soundInstance.play();
                set({ isPlaying: true });
            }
        } else {
            const { currentTrackIndex } = get();
            if (currentTrackIndex !== null) {
                get().playTrack(currentTrackIndex);
            }
        }
    },
    skipToNext: async () => {
        const { currentTrackIndex, queue } = get();
        if (currentTrackIndex === null) return;
        const nextIndex = currentTrackIndex + 1;
        if (nextIndex < queue.length) {
            get().playTrack(nextIndex);
        } else {
            const { repeatMode } = get();
            if (repeatMode === 'queue') {
                get().playTrack(0);
            } else {
                set({ isPlaying: false });
            }
        }
    },
    skipToPrevious: async () => {
        const { currentTrackIndex } = get();
        if (currentTrackIndex === null) return;
        const prevIndex = currentTrackIndex - 1;
        if (prevIndex >= 0) {
            get().playTrack(prevIndex);
        } else {
            get().playTrack(0);
        }
    },
    seekTo: async (millis) => {
        if (soundInstance) {
            soundInstance.seekTo(millis / 1000);
        }
    },
    seekBy: async (millis) => {
        if (soundInstance) {
            const newPos = soundInstance.currentTime + (millis / 1000);
            soundInstance.seekTo(newPos);
        }
    },
    closePlayer: async () => {
        set({ currentTrack: null, isPlaying: false, currentTrackIndex: null });
        if (soundInstance) {
            soundInstance.pause();
            soundInstance = null;
        }
    },
    setRepeatMode: (mode) => {
        set({ repeatMode: mode });
        storage.set(STORAGE_KEYS.REPEAT_MODE, mode);
    },
    toggleShuffle: () => {
        const newVal = !get().isShuffle;
        set({ isShuffle: newVal });
        storage.set(STORAGE_KEYS.SHUFFLE_ON, newVal);
    },
    setPlaybackSpeed: async (speed) => {
        set({ playbackSpeed: speed });
        if (soundInstance) {
            if (typeof (soundInstance as any).setPlaybackRate === 'function') {
                (soundInstance as any).setPlaybackRate(speed);
            } else if (typeof (soundInstance as any).setRate === 'function') {
                (soundInstance as any).setRate(speed);
            }
        }
    },
    hydrate: async () => {
        const queueStr = await storage.getString(STORAGE_KEYS.QUEUE);
        const lastIdx = await storage.getNumber(STORAGE_KEYS.LAST_PLAYED_INDEX);
        if (queueStr) {
            const queue = JSON.parse(queueStr);
            set({ queue });
            if (lastIdx !== undefined && lastIdx >= 0 && lastIdx < queue.length) {
                set({ currentTrackIndex: lastIdx, currentTrack: queue[lastIdx] });
            }
        }
    }
}));
