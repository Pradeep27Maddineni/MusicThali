import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTrendingSongs, searchArtists, searchPlaylists, getPlaylistDetails } from '../../api/jiosaavn';
import { Song, SearchResponse } from '../../types';
import { FONT_SIZE, SPACING } from '../../constants/theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { getArtistName } from '../../utils/format';
export default function SuggestedTab() {
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    const { playTrack, setQueue } = usePlayerStore();
    const { history } = useLibraryStore();
    const [songs, setSongs] = useState<Song[]>([]);
    const [artists, setArtists] = useState<any[]>([]);
    const [charts, setCharts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setLoading(true);
        try {
            const [paramsRes, chartDocs] = await Promise.all([
                searchPlaylists('Top 50 India'),
                searchPlaylists('Top Charts'),
            ]);
            if (paramsRes?.data?.results?.[0]?.id) {
                const playlistId = paramsRes.data.results[0].id;
                const playlistDetails = await getPlaylistDetails(playlistId);
                if (playlistDetails?.data?.songs) {
                    const trendingSongs = playlistDetails.data.songs;
                    setSongs(trendingSongs);
                    const uniqueArtists = new Map();
                    trendingSongs.forEach((song: any) => {
                        if (song.artists?.primary) {
                            song.artists.primary.forEach((artist: any) => {
                                if (!uniqueArtists.has(artist.id)) {
                                    uniqueArtists.set(artist.id, artist);
                                }
                            });
                        } else if (song.primaryArtists && typeof song.primaryArtists === 'string') {
                        }
                    });
                    setArtists(Array.from(uniqueArtists.values()).slice(0, 15));  
                }
            } else {
                const trend = await getTrendingSongs();
                if (trend?.data?.results) setSongs(trend.data.results);
            }
            if (chartDocs?.data?.results) {
                setCharts(chartDocs.data.results);
            }
        } catch (error) {
            console.error('Home Data Error:', error);
        } finally {
            setLoading(false);
        }
    };
    const cleanChartName = (name: string) => {
        return name
            .replace('New Saavn Charts - Editorial - ', '')
            .replace('New Saavn Charts - ', '')
            .replace(' - Top Songs', '')
            .replace(' - Editorial', '')
            .trim();
    };
    const handlePlay = (index: number, source: Song[]) => {
        setQueue(source);
        playTrack(index);
        navigation.navigate('Player');
    };
    if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 100 }}>
            { }
            {history.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently Played</Text>
                    <FlatList
                        data={history}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => item.id + 'history' + index}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={styles.card} onPress={() => handlePlay(index, history)}>
                                <Image source={{ uri: item.image?.[2]?.url || item.image?.[0]?.url }} style={styles.cardImage} />
                                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(item)}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
                <FlatList
                    data={songs}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity style={styles.card} onPress={() => handlePlay(index, songs)}>
                            <Image source={{ uri: item.image?.[2]?.url || item.image?.[0]?.url }} style={styles.cardImage} />
                            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(item)}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Artists</Text>
                <FlatList
                    data={artists}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.artistCard, { backgroundColor: colors.card }]} onPress={() => navigation.navigate('Details', { id: item.id, type: 'artist' })}>
                            <Image source={{ uri: item.image?.[2]?.url || item.image?.[0]?.url }} style={styles.artistImage} />
                            <Text style={[styles.artistName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            { }
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Charts</Text>
                <FlatList
                    data={charts}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Details', { id: item.id, type: 'playlist' })}>
                            <Image source={{ uri: item.image?.[2]?.url || item.image?.[0]?.url }} style={styles.cardImage} />
                            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{cleanChartName(item.name)}</Text>
                            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{item.language || ''} Charts</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1 },
    section: { marginBottom: SPACING.xl, paddingHorizontal: SPACING.md },
    sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', marginBottom: SPACING.md },
    card: { width: 140, marginRight: SPACING.md },
    cardImage: { width: 140, height: 140, borderRadius: 12, marginBottom: SPACING.sm, backgroundColor: '#333' },
    cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    cardSubtitle: { fontSize: FONT_SIZE.sm, marginTop: 2 },
    artistCard: { alignItems: 'center', marginRight: SPACING.md, padding: SPACING.sm, borderRadius: 12, width: 110 },
    artistImage: { width: 80, height: 80, borderRadius: 40, marginBottom: SPACING.sm },
    artistName: { fontSize: FONT_SIZE.md, fontWeight: '600', textAlign: 'center' },
    placeholderBox: { height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    emptyText: { textAlign: 'center', marginTop: SPACING.md }
});
