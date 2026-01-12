import { create } from 'zustand';
import { storage } from '../utils/storage';
const STORAGE_KEYS = {
    THEME: 'settings.theme',
    AUDIO_QUALITY: 'settings.audio_quality',
    NOTIFICATIONS: 'settings.notifications',
};
interface SettingsState {
    theme: 'light' | 'dark' | 'system';
    audioQuality: 'low' | 'medium' | 'high' | 'auto';
    notifications: boolean;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setAudioQuality: (quality: 'low' | 'medium' | 'high' | 'auto') => void;
    setNotifications: (enabled: boolean) => void;
    hydrate: () => Promise<void>;
}
export const useSettingsStore = create<SettingsState>((set) => ({
    theme: 'system',
    audioQuality: 'high',
    notifications: true,
    setTheme: (theme) => {
        set({ theme });
        storage.set(STORAGE_KEYS.THEME, theme);
    },
    setAudioQuality: (quality) => {
        set({ audioQuality: quality });
        storage.set(STORAGE_KEYS.AUDIO_QUALITY, quality);
    },
    setNotifications: (enabled) => {
        set({ notifications: enabled });
        storage.set(STORAGE_KEYS.NOTIFICATIONS, enabled);  
    },
    hydrate: async () => {
        try {
            const theme = await storage.getString(STORAGE_KEYS.THEME) as any;
            const audioQuality = await storage.getString(STORAGE_KEYS.AUDIO_QUALITY) as any;
            const notifications = await storage.getString(STORAGE_KEYS.NOTIFICATIONS);
            set({
                theme: theme || 'system',
                audioQuality: audioQuality || 'high',
                notifications: notifications === 'true',
            });
        } catch (e) {
            console.error('Failed to hydrate settings', e);
        }
    }
}));
