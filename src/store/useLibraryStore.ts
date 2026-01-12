import { create } from 'zustand';
import { Song, Playlist } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
interface LibraryState {
    favorites: Song[];
    playlists: Playlist[];
    history: Song[];
    toggleFavorite: (song: Song) => void;
    isFavorite: (songId: string) => boolean;
    createPlaylist: (name: string) => void;
    deletePlaylist: (playlistId: string) => void;
    addToPlaylist: (playlistId: string, song: Song) => void;
    removeFromPlaylist: (playlistId: string, songId: string) => void;
    addToHistory: (song: Song) => void;
    clearHistory: () => void;
    hydrate: () => Promise<void>;
}
export const useLibraryStore = create<LibraryState>((set, get) => ({
    favorites: [],
    playlists: [],
    history: [],
    toggleFavorite: (song) => {
        const { favorites } = get();
        const exists = favorites.some(f => f.id === song.id);
        let newFavorites;
        if (exists) {
            newFavorites = favorites.filter(f => f.id !== song.id);
        } else {
            newFavorites = [...favorites, song];
        }
        set({ favorites: newFavorites });
        storage.set(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    },
    isFavorite: (songId) => {
        const { favorites } = get();
        return favorites.some(f => f.id === songId);
    },
    createPlaylist: (name) => {
        const { playlists } = get();
        const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name,
            songs: [],
            createdAt: Date.now(),
        };
        const newPlaylists = [...playlists, newPlaylist];
        set({ playlists: newPlaylists });
        storage.set(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    },
    deletePlaylist: (playlistId) => {
        const { playlists } = get();
        const newPlaylists = playlists.filter(p => p.id !== playlistId);
        set({ playlists: newPlaylists });
        storage.set(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    },
    addToPlaylist: (playlistId, song) => {
        const { playlists } = get();
        const newPlaylists = playlists.map(p => {
            if (p.id === playlistId) {
                if (p.songs.some(s => s.id === song.id)) return p;
                return { ...p, songs: [...p.songs, song] };
            }
            return p;
        });
        set({ playlists: newPlaylists });
        storage.set(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    },
    removeFromPlaylist: (playlistId, songId) => {
        const { playlists } = get();
        const newPlaylists = playlists.map(p => {
            if (p.id === playlistId) {
                return { ...p, songs: p.songs.filter(s => s.id !== songId) };
            }
            return p;
        });
        set({ playlists: newPlaylists });
        storage.set(STORAGE_KEYS.PLAYLISTS, JSON.stringify(newPlaylists));
    },
    addToHistory: (song) => {
        const { history } = get();
        const filtered = history.filter(s => s.id !== song.id);
        const newHistory = [song, ...filtered].slice(0, 20);  
        set({ history: newHistory });
        storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    },
    clearHistory: () => {
        set({ history: [] });
        storage.remove(STORAGE_KEYS.HISTORY);
    },
    hydrate: async () => {
        const favStr = await storage.getString(STORAGE_KEYS.FAVORITES);
        const playStr = await storage.getString(STORAGE_KEYS.PLAYLISTS);
        const histStr = await storage.getString(STORAGE_KEYS.HISTORY);
        if (favStr) {
            try {
                set({ favorites: JSON.parse(favStr) });
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
        if (playStr) {
            try {
                set({ playlists: JSON.parse(playStr) });
            } catch (e) {
                console.error("Failed to parse playlists", e);
            }
        }
        if (histStr) {
            try {
                set({ history: JSON.parse(histStr) });
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }
}));
