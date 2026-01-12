import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
type ThemeType = 'light' | 'dark';
interface ThemeState {
    theme: ThemeType;
    colors: typeof LIGHT_THEME;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
    hydrate: () => Promise<void>;
}
export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',
    colors: LIGHT_THEME,
    hydrate: async () => {
        const theme = await storage.getString(STORAGE_KEYS.THEME) as ThemeType;
        if (theme) {
            set({
                theme,
                colors: theme === 'dark' ? DARK_THEME : LIGHT_THEME
            });
        }
    },
    setTheme: (newTheme) => {
        set({
            theme: newTheme,
            colors: newTheme === 'dark' ? DARK_THEME : LIGHT_THEME
        });
        storage.set(STORAGE_KEYS.THEME, newTheme);
    },
    toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
    }
}));
