import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import { Song } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
interface DownloadedItem {
    path: string;
    song: Song;
}
interface DownloadState {
    downloadedSongs: Record<string, DownloadedItem>;  
    isDownloading: Record<string, boolean>;  
    downloadSong: (song: Song) => Promise<void>;
    removeDownload: (songId: string) => Promise<void>;
    isDownloaded: (songId: string) => boolean;
    getLocalUri: (songId: string) => string | null;
    hydrate: () => Promise<void>;
}
const SONGS_DIR = 'songs/';
const ensureDirExists = async () => {
    console.log('FileSystem keys:', Object.keys(FileSystem));
    const fs = FileSystem as any;
    const docDir = fs.documentDirectory || fs.cacheDirectory;
    if (!docDir) {
        console.warn('Downloads disabled: Native module not found. Use a Development Build.');
        return;
    }
    const dirInfo = await FileSystem.getInfoAsync(docDir + SONGS_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(docDir + SONGS_DIR, { intermediates: true });
    }
};
export const useDownloadStore = create<DownloadState>((set, get) => ({
    downloadedSongs: {},
    isDownloading: {},
    downloadSong: async (song: Song) => {
        const { downloadedSongs, isDownloading } = get();
        if (downloadedSongs[song.id] || isDownloading[song.id]) return;
        set({ isDownloading: { ...isDownloading, [song.id]: true } });
        try {
            await ensureDirExists();
            const url = song.downloadUrl?.[4]?.url || song.downloadUrl?.[3]?.url || song.downloadUrl?.[2]?.url || song.downloadUrl?.[0]?.url;
            if (!url) throw new Error('No download URL found');
            const filename = `${song.id}.m4a`;
            const relativePath = SONGS_DIR + filename;
            const fs = FileSystem as any;
            let fromPaths: string | null = null;
            if (fs.Paths) {
                try {
                    const docObj = fs.Paths.document || fs.Paths.documentDirectory;
                    if (docObj && docObj.uri) fromPaths = docObj.uri;
                    if (!fromPaths) {
                        const cacheObj = fs.Paths.cache || fs.Paths.cacheDirectory;
                        if (cacheObj && cacheObj.uri) fromPaths = cacheObj.uri;
                    }
                } catch (e) { }
            }
            const docDir = fs.documentDirectory || fs.cacheDirectory || fromPaths;
            if (!docDir) {
                console.warn('FileSystem not ready. Rebuild required.');
                set({ isDownloading: { ...get().isDownloading, [song.id]: false } });
                return;
            }
            const fileUri = docDir + relativePath;
            const downloadRes = await FileSystem.downloadAsync(url, fileUri);
            if (downloadRes.status === 200) {
                const newItem: DownloadedItem = { path: relativePath, song };
                const newDownloaded = { ...get().downloadedSongs, [song.id]: newItem };
                set({
                    downloadedSongs: newDownloaded,
                    isDownloading: { ...get().isDownloading, [song.id]: false }
                });
                storage.set('downloaded_songs_v2', JSON.stringify(newDownloaded));
            } else {
                throw new Error('Download failed status ' + downloadRes.status);
            }
        } catch (error) {
            console.error('Download error:', error);
            set({ isDownloading: { ...get().isDownloading, [song.id]: false } });
        }
    },
    removeDownload: async (songId: string) => {
        const { downloadedSongs } = get();
        const item = downloadedSongs[songId];
        if (!item) return;
        const relativePath = item.path;
        try {
            const fs = FileSystem as any;
            let fromPaths: string | null = null;
            if (fs.Paths) {
                try {
                    const docObj = fs.Paths.document || fs.Paths.documentDirectory;
                    if (docObj && docObj.uri) fromPaths = docObj.uri;
                    if (!fromPaths) {
                        const cacheObj = fs.Paths.cache || fs.Paths.cacheDirectory;
                        if (cacheObj && cacheObj.uri) fromPaths = cacheObj.uri;
                    }
                } catch (e) { }
            }
            const docDir = fs.documentDirectory || fs.cacheDirectory || fromPaths;
            if (!docDir) return;
            const fileUri = docDir + relativePath;
            await FileSystem.deleteAsync(fileUri, { idempotent: true });
            const newDownloaded = { ...downloadedSongs };
            delete newDownloaded[songId];
            set({ downloadedSongs: newDownloaded });
            storage.set('downloaded_songs_v2', JSON.stringify(newDownloaded));
        } catch (e) {
            console.error('Remove download error:', e);
        }
    },
    isDownloaded: (songId: string) => {
        return !!get().downloadedSongs[songId];
    },
    getLocalUri: (songId: string) => {
        const item = get().downloadedSongs[songId];
        const relativePath = item?.path;
        const fs = FileSystem as any;
        let fromPaths: any = null;
        if (fs.Paths) {
            try { fromPaths = fs.Paths.documentDirectory || fs.Paths.cacheDirectory; } catch (e) { }
        }
        const docDir = fs.documentDirectory || fs.cacheDirectory || fromPaths;
        if (relativePath && docDir) {
            return docDir + relativePath;
        }
        return null;
    },
    hydrate: async () => {
        const jsonV2 = await storage.getString('downloaded_songs_v2');
        if (jsonV2) {
            try {
                const parsed = JSON.parse(jsonV2);
                set({ downloadedSongs: parsed });
                return;
            } catch (e) { console.error(e); }
        }
        const jsonV1 = await storage.getString('downloaded_songs');
        if (jsonV1) {
            storage.remove('downloaded_songs');
        }
    }
}));
