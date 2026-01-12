import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Search, MoreHorizontal, Shuffle, Play, Pause, PlayCircle } from 'lucide-react-native';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { getAlbumDetails, getArtistDetails, getPlaylistDetails } from '../api/jiosaavn';
import { getArtistName } from '../utils/format';
import { Song } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { useThemeStore } from '../store/useThemeStore';
export const DetailsScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { colors } = useThemeStore();
    const { id, type } = route.params;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { playTrack, setQueue, currentTrack, isPlaying } = usePlayerStore();
    const { playlists } = useLibraryStore();
    useEffect(() => {
        loadData();
    }, [id, type, playlists]);  
    const loadData = async () => {
        setLoading(true);
        try {
            if (type === 'album') {
                const res = await getAlbumDetails(id);
                setData(res.data || res);
            } else if (type === 'artist') {
                const res = await getArtistDetails(id);
                setData(res);
            } else if (type === 'playlist') {
                const localPlaylist = playlists.find(p => p.id === id);
                if (localPlaylist) {
                    setData({
                        name: localPlaylist.name,
                        image: localPlaylist.songs.length > 0 ? localPlaylist.songs[0].image : [],
                        songs: localPlaylist.songs,
                        songCount: localPlaylist.songs.length
                    });
                } else {
                    const res = await getPlaylistDetails(id);
                    setData(res.data || res);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    const handleShufflePlay = () => {
        const songs = data?.songs || [];
        if (songs.length === 0) return;
        const shuffled = [...songs].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
        playTrack(0);
        navigation.navigate('Player');
    };
    const handlePlayAll = () => {
        const songs = data?.songs || [];
        if (songs.length === 0) return;
        setQueue(songs);
        playTrack(0);
        navigation.navigate('Player');
    };
    const renderHeader = () => (
        <View style={styles.headerContent}>
            <Image
                source={{ uri: data?.image?.[2]?.url || data?.image?.[1]?.url }}
                style={[styles.artwork, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.title, { color: colors.text }]}>{data?.name}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {type === 'album' ? `${data?.songCount || 0} Songs` : 'Artist'}
            </Text>
            <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.shuffleButton, { backgroundColor: colors.primary }]} onPress={handleShufflePlay}>
                    <Shuffle color="#FFF" size={20} />
                    <Text style={styles.shuffleText}>Shuffle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.card }]} onPress={handlePlayAll}>
                    <Play color={colors.primary} size={20} fill={colors.primary} />
                    <Text style={[styles.playText, { color: colors.primary }]}>Play</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.rowBetween}>
                <Text style={[styles.sectionHeader, { color: colors.text }]}>Songs</Text>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </View>
        </View>
    );
    const renderSongItem = ({ item, index }: { item: Song, index: number }) => {
        const isCurrent = currentTrack?.id === item.id;
        return (
            <TouchableOpacity style={styles.songItem} onPress={() => { setQueue(data.songs); playTrack(index); navigation.navigate('Player'); }}>
                <Image source={{ uri: item.image?.[0]?.url }} style={[styles.songImg, { backgroundColor: colors.border }]} />
                <View style={styles.songInfo}>
                    <Text style={[styles.songTitle, { color: isCurrent ? colors.primary : colors.text }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(item)}</Text>
                </View>
                <PlayCircle color={isCurrent ? colors.primary : colors.textSecondary} size={24} />
            </TouchableOpacity>
        );
    };
    if (loading) return (
        <View style={[styles.loading, { backgroundColor: colors.background }]}>
            <ActivityIndicator color={colors.primary} />
        </View>
    );
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <Search color={colors.text} size={24} style={{ marginRight: 16 }} />
                <MoreHorizontal color={colors.text} size={24} />
            </View>
            <FlatList
                data={data?.songs || []}
                ListHeaderComponent={renderHeader}
                renderItem={renderSongItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    navbar: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
    listContent: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
    headerContent: { alignItems: 'center', marginBottom: SPACING.lg },
    artwork: { width: 200, height: 200, borderRadius: 16, marginBottom: SPACING.md },
    title: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { fontSize: FONT_SIZE.md, marginTop: 4 },
    buttonsRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg, width: '100%', paddingHorizontal: SPACING.md },
    shuffleButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, borderRadius: 30, gap: 8
    },
    playButton: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 12, borderRadius: 30, gap: 8
    },
    shuffleText: { color: '#FFF', fontWeight: '600', fontSize: FONT_SIZE.md },
    playText: { fontWeight: '600', fontSize: FONT_SIZE.md },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: SPACING.xl, alignItems: 'center' },
    sectionHeader: { fontSize: FONT_SIZE.lg, fontWeight: 'bold' },
    seeAll: { fontWeight: '600' },
    songItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    songImg: { width: 48, height: 48, borderRadius: 8 },
    songInfo: { flex: 1, marginLeft: SPACING.md },
    songTitle: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    songArtist: { fontSize: FONT_SIZE.sm },
});
