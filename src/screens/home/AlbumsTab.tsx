import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchAlbums } from '../../api/jiosaavn';
import { FONT_SIZE, SPACING } from '../../constants/theme';
import { useThemeStore } from '../../store/useThemeStore';
export default function AlbumsTab() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    useEffect(() => {
        loadAlbums(1);
    }, []);
    const loadAlbums = async (pageNo: number) => {
        if (pageNo === 1) setLoading(true);
        else setLoadingMore(true);
        try {
            const data = await searchAlbums('Love', pageNo, 50);
            let newAlbums: any[] = [];
            if (data?.data?.results) {
                newAlbums = data.data.results;
            }
            if (pageNo === 1) {
                setAlbums(newAlbums);
            } else {
                setAlbums(prev => [...prev, ...newAlbums]);
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
            loadAlbums(nextPage);
        }
    };
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Details', { id: item.id, type: 'album' })}
        >
            <Image
                source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }}
                style={styles.artwork}
            />
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>{item.artist || 'Various Artists'}</Text>
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
                data={albums}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.list}
                numColumns={2}
                key={2}
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
        flex: 1 / 2,
        margin: SPACING.xs,
        marginBottom: SPACING.md,
        borderRadius: 12,
        padding: SPACING.sm,
    },
    artwork: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginBottom: SPACING.sm
    },
    info: {},
    name: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
    },
    artist: {
        fontSize: FONT_SIZE.sm,
    },
});
