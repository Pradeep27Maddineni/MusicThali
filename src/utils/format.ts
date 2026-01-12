export const getArtistName = (item: any) => {
    if (!item) return 'Unknown Artist';
    if (item.primaryArtists && typeof item.primaryArtists === 'string') {
        return item.primaryArtists;
    }
    if (item.primary_artists && typeof item.primary_artists === 'string') {
        return item.primary_artists;
    }
    if (item.artists?.primary && Array.isArray(item.artists.primary)) {
        return item.artists.primary.map((a: any) => a.name).join(', ');
    }
    if (item.artist && typeof item.artist === 'string') {
        return item.artist;
    }
    if (item.subtitle) return item.subtitle;
    return 'Unknown Artist';
};
