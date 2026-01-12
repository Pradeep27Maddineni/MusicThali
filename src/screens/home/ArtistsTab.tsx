import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTrendingSongs } from '../../api/jiosaavn';
import { FONT_SIZE, SPACING } from '../../constants/theme';
import { Keyboard } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
export default function ArtistsTab() {
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    useEffect(() => {
        loadArtists(1);
    }, []);
    const loadArtists = async (pageNo: number) => {
        if (pageNo === 1) setLoading(true);
        else setLoadingMore(true);
        try {
            const data = await getTrendingSongs(pageNo, 40);
            let newArtists: any[] = [];
            if (data?.data?.results) {
                const songs = data.data.results;
                const uniqueArtists = new Map();
                songs.forEach((song: any) => {
                    if (song.artists?.primary) {
                        song.artists.primary.forEach((artist: any) => {
                            if (!uniqueArtists.has(artist.id)) {
                                uniqueArtists.set(artist.id, artist);
                            }
                        });
                    }
                });
                newArtists = Array.from(uniqueArtists.values());
            }
            if (pageNo === 1) {
                setArtists(newArtists);
            } else {
                setArtists(prev => {
                    const existingIds = new Set(prev.map(a => a.id));
                    const filteredNew = newArtists.filter(a => !existingIds.has(a.id));
                    return [...prev, ...filteredNew];
                });
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
            loadArtists(nextPage);
        }
    };
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Details', { id: item.id, type: 'artist' })}
        >
            <Image
                source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }}
                style={styles.artwork}
            />
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.role, { color: colors.textSecondary }]}>{item.role || 'Artist'}</Text>
            </View>
        </TouchableOpacity>
    );
    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator style={{ padding: 10 }} color={colors.primary} />;
    };
    if (loading) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={artists}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.list}
                numColumns={3}
                key={3}  
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
    list: { padding: SPACING.sm },
    item: {
        flex: 1 / 3,
        alignItems: 'center',
        margin: SPACING.xs,
        marginBottom: SPACING.md,
        padding: SPACING.sm,
    },
    artwork: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eee',
        marginBottom: SPACING.sm
    },
    info: { alignItems: 'center' },
    name: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        textAlign: 'center'
    },
    role: {
        fontSize: FONT_SIZE.sm,
    },
});
