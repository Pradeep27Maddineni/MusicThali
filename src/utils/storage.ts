import AsyncStorage from '@react-native-async-storage/async-storage';
export const storage = {
    getString: async (key: string) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.error('Error getting string', e);
            return null;
        }
    },
    getNumber: async (key: string) => {
        try {
            const val = await AsyncStorage.getItem(key);
            return val ? parseFloat(val) : undefined;
        } catch (e) {
            console.error('Error getting number', e);
            return undefined;
        }
    },
    set: async (key: string, value: string | number | boolean) => {
        try {
            await AsyncStorage.setItem(key, value.toString());
        } catch (e) {
            console.error('Error setting item', e);
        }
    },
    remove: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing item', e);
        }
    }
};
export const STORAGE_KEYS = {
    QUEUE: 'music_queue',
    LAST_PLAYED_INDEX: 'last_played_index',
    REPEAT_MODE: 'repeat_mode',
    SHUFFLE_ON: 'shuffle_on',
    THEME: 'app_theme',
    SEARCH_HISTORY: 'search_history',
    FAVORITES: 'favorites',
    PLAYLISTS: 'playlists',
    HISTORY: 'history',
};
