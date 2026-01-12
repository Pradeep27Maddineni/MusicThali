import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MoreVertical } from 'lucide-react-native';
import { getTrendingSongs } from '../../api/jiosaavn';
import { Song } from '../../types';
import { FONT_SIZE, SPACING } from '../../constants/theme';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useThemeStore } from '../../store/useThemeStore';
import { getArtistName } from '../../utils/format';
export default function SongsTab() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const { playTrack, setQueue, currentTrack } = usePlayerStore();
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    useEffect(() => {
        loadSongs(1);
    }, []);
    const loadSongs = async (pageNo: number) => {
        if (pageNo === 1) setLoading(true);
        else setLoadingMore(true);
        try {
            const data = await getTrendingSongs(pageNo, 40);  
            let newSongs: Song[] = [];
            if (Array.isArray(data)) {
                newSongs = data;
            } else if (data?.data?.results) {
                newSongs = data.data.results;
            } else if (data?.data) {
                newSongs = data.data;
            }
            if (pageNo === 1) {
                setSongs(newSongs);
            } else {
                setSongs(prev => [...prev, ...newSongs]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    const handleLoadMore = () => {
        if (!loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadSongs(nextPage);
        }
    };
    const handlePlay = (index: number) => {
        setQueue(songs);
        playTrack(index);
        navigation.navigate('Player');
    };
    const renderItem = ({ item, index }: { item: Song, index: number }) => {
        const isCurrent = currentTrack?.id === item.id;
        return (
            <TouchableOpacity style={styles.item} onPress={() => handlePlay(index)}>
                <Image
                    source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }}
                    style={styles.artwork}
                />
                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.text }, isCurrent && { color: colors.primary }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                        {getArtistName(item)}
                    </Text>
                </View>
                <TouchableOpacity style={{ padding: 8 }}>
                    <MoreVertical color={colors.textSecondary} size={20} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };
    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator style={{ padding: 10 }} color={colors.primary} />;
    };
    if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.filterRow}>
                <Text style={[styles.count, { color: colors.text }]}>{songs.length} songs</Text>
                <Text style={[styles.sort, { color: colors.primary }]}>In Queue</Text>
            </View>
            <FlatList
                data={songs}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id + index}  
                contentContainerStyle={styles.list}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: SPACING.md },
    filterRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm
    },
    count: { fontSize: FONT_SIZE.md, fontWeight: 'bold' },
    sort: { fontWeight: '600' },
    item: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    artwork: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#eee' },
    info: { flex: 1, marginLeft: SPACING.md },
    title: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    artist: { fontSize: FONT_SIZE.sm, marginTop: 2 },
});
