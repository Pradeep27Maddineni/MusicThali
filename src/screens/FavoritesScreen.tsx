import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Heart } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';
import { getArtistName } from '../utils/format';
export const FavoritesScreen = () => {
    const { favorites, hydrate } = useLibraryStore();
    const { setQueue, playTrack, currentTrack } = usePlayerStore();
    const { colors } = useThemeStore();
    useFocusEffect(
        useCallback(() => {
        }, [])
    );
    const handlePlay = (song: Song, index: number) => {
        setQueue(favorites);
        playTrack(index);
    };
    const renderItem = ({ item, index }: { item: Song; index: number }) => {
        const isActive = currentTrack?.id === item.id;
        const imageUrl = item.image?.[2]?.url || item.image?.[1]?.url || item.image?.[0]?.url;
        return (
            <TouchableOpacity
                style={[styles.itemContainer, { borderBottomColor: colors.border }, isActive && { backgroundColor: colors.card }]}
                onPress={() => handlePlay(item, index)}
            >
                <Image source={{ uri: imageUrl }} style={[styles.artwork, { backgroundColor: colors.border }]} />
                <View style={styles.infoContainer}>
                    <Text style={[styles.title, { color: isActive ? colors.primary : colors.text }]} numberOfLines={1}>
                        {item.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&')}
                    </Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                        {getArtistName(item)}
                    </Text>
                </View>
                {isActive && (
                    <Activity size={20} color={colors.primary} />
                )}
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Favorites</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{favorites.length} Songs</Text>
            </View>
            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Heart size={64} color={colors.border} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No favorites yet</Text>
                    <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Like a song to see it here</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: FONT_SIZE.md,
        marginTop: 4,
    },
    listContent: {
        paddingBottom: 100,  
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
    },
    artwork: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
        marginLeft: SPACING.md,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        marginBottom: 4,
    },
    artist: {
        fontSize: FONT_SIZE.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: SPACING.lg,
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
    },
    emptySubtext: {
        marginTop: SPACING.sm,
        fontSize: FONT_SIZE.md,
    },
});
