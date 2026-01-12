import axios from 'axios';
const BASE_URL = 'https://saavn.sumit.co/api';
const api = axios.create({
    baseURL: BASE_URL,
});
api.interceptors.request.use(request => {
    return request;
});
api.interceptors.response.use(response => {
    return response;
});
import { Song, SearchResponse } from '../types';
export const searchSongs = async (query: string, page = 1, limit = 40) => {
    try {
        const response = await api.get<SearchResponse>(`/search/songs`, {
            params: { query, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('API Search Error:', error);
        throw error;
    }
};
export const searchArtists = async (query: string, page = 1, limit = 40) => {
    try {
        const response = await api.get(`/search/artists`, {
            params: { query, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('API Search Artists Error:', error);
        throw error;
    }
};
export const searchAlbums = async (query: string, page = 1, limit = 40) => {
    try {
        const response = await api.get(`/search/albums`, {
            params: { query, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('API Search Albums Error:', error);
        throw error;
    }
};
export const searchPlaylists = async (query: string, page = 1, limit = 40) => {
    try {
        const response = await api.get(`/search/playlists`, {
            params: { query, page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('API Search Playlists Error:', error);
        throw error;
    }
};
export const getTrendingSongs = async (page = 1, limit = 40) => {
    try {
        const response = await api.get(`/search/songs`, { params: { query: 'Trending', page, limit } });
        return response.data;
    } catch (error) {
        console.error('API Get Songs Error:', error);
        throw error;
    }
}
export const getAlbumDetails = async (id: string) => {
    try {
        const response = await api.get(`/albums`, { params: { id } });
        return response.data;
    } catch (error) {
        console.error('API Album Details Error:', error);
        throw error;
    }
};
export const getArtistDetails = async (id: string) => {
    try {
        const response = await api.get(`/artists`, { params: { id } });
        const songsRes = await api.get(`/artists/${id}/songs`);
        const artistData = response.data.data || response.data;
        let songs: any[] = [];
        const resData = songsRes.data as any;
        if (resData.data && Array.isArray(resData.data.songs)) {
            songs = resData.data.songs;
        } else if (resData.data && Array.isArray(resData.data)) {
            songs = resData.data;
        } else if (Array.isArray(resData.songs)) {
            songs = resData.songs;
        } else if (Array.isArray(resData)) {
            songs = resData;
        }
        return { ...artistData, songs };
    } catch (error) {
        console.error('API Artist Details Error:', error);
        throw error;
    }
};
export const getLyrics = async (id: string) => {
    try {
        const response = await api.get(`/lyrics`, { params: { id } });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('API Get Lyrics Error:', error);
        return null;  
    }
};
export const getPlaylistDetails = async (id: string, page = 1) => {
    try {
        const response = await api.get(`/playlists`, { params: { id, page } });
        return response.data;
    } catch (error) {
        console.error('API Playlist Details Error:', error);
        throw error;
    }
};
export const getSongDetails = async (id: string) => {
    try {
        const response = await api.get(`/songs`, { params: { id } });
        return response.data;
    } catch (error) {
        console.error('API Song Details Error:', error);
        throw error;
    }
};
export const getSongSuggestions = async (id: string, limit = 40) => {
    try {
        const response = await api.get(`/songs/${id}/suggestions`, { params: { limit } });
        return response.data;
    } catch (error) {
        console.error('API Song Suggestions Error:', error);
        return [];  
    }
};
export const getArtistAlbums = async (id: string, page = 1, limit = 40) => {
    try {
        const response = await api.get(`/artists/${id}/albums`, { params: { page, limit } });
        return response.data;
    } catch (error) {
        console.error('API Artist Albums Error:', error);
        throw error;
    }
};
export const getHomeModules = async () => {
    try {
        const response = await api.get(`/modules`);
        return response.data;
    } catch (error) {
        console.error('API Home Modules Error:', error);
        throw error;
    }
}
