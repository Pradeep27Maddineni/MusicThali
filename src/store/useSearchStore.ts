import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '../utils/storage';
interface SearchStore {
    history: string[];
    addToHistory: (query: string) => void;
    removeFromHistory: (query: string) => void;
    clearHistory: () => void;
    hydrate: () => Promise<void>;
}
export const useSearchStore = create<SearchStore>((set, get) => ({
    history: [],
    addToHistory: (query) => {
        const { history } = get();
        const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
        set({ history: newHistory });
        storage.set(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
    },
    removeFromHistory: (query) => {
        const { history } = get();
        const newHistory = history.filter(h => h !== query);
        set({ history: newHistory });
        storage.set(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
    },
    clearHistory: () => {
        set({ history: [] });
        storage.remove(STORAGE_KEYS.SEARCH_HISTORY);
    },
    hydrate: async () => {
        const historyStr = await storage.getString(STORAGE_KEYS.SEARCH_HISTORY);
        if (historyStr) {
            set({ history: JSON.parse(historyStr) });
        }
    }
}));
