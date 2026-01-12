export interface Song {
    id: string;
    name: string;
    type: string;
    album: {
        id: string;
        name: string;
        url: string;
    };
    year: string;
    duration: string;
    label: string;
    primaryArtists: string;  
    primary_artists?: string;  
    artists?: {
        primary?: { id: string; name: string; role: string; type: string; url: string; }[];
    };
    image: { url: string; quality: string }[];
    downloadUrl?: { url: string; quality: string }[];
}
export interface Playlist {
    id: string;
    name: string;
    songs: Song[];
    createdAt: number;
}
export interface SearchResponse {
    status: string;
    data: {
        results: Song[];
        total: number;
        start: number;
    };
}
export type RootStackParamList = {
    Tabs: undefined;
    Search: undefined;
    Player: undefined;
    Details: { id: string; type: 'album' | 'artist' | 'playlist' };
    AddToPlaylist: { song: Song };
    Settings: undefined;
};
