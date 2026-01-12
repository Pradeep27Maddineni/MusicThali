import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, ScrollView, Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, X, Search as SearchIcon, Frown, PlayCircle } from 'lucide-react-native';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { useSearchStore } from '../store/useSearchStore';
import { searchSongs, searchArtists, searchAlbums, searchPlaylists } from '../api/jiosaavn';
import { Song } from '../types';
import { usePlayerStore } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';
import { getArtistName } from '../utils/format';
type SearchTab = 'Songs' | 'Artists' | 'Albums' | 'Playlists';
export const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<SearchTab>('Songs');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [page, setPage] = useState(1);
    const { history, addToHistory, removeFromHistory, clearHistory, hydrate } = useSearchStore();
    const { playTrack, setQueue, addToQueue } = usePlayerStore();
    useEffect(() => {
        hydrate();
    }, []);
    const handleSearch = async (pageNo = 1) => {
        if (!query.trim()) return;
        if (pageNo === 1) setLoading(true);
        else setLoadingMore(true);
        setHasSearched(true);
        if (pageNo === 1) addToHistory(query.trim());
        Keyboard.dismiss();
        try {
            let data;
            const PAGINATION_LIMIT = 40;
            if (activeTab === 'Songs') {
                const res = await searchSongs(query, pageNo, PAGINATION_LIMIT);
                data = (res as any).data?.results || (res as any).results || res.data?.results;
            } else if (activeTab === 'Artists') {
                const res = await searchArtists(query, pageNo, PAGINATION_LIMIT);
                data = (res as any).data?.results || (res as any).results || (res as any).results;
            } else if (activeTab === 'Albums') {
                const res = await searchAlbums(query, pageNo, PAGINATION_LIMIT);
                data = (res as any).data?.results || (res as any).results;
            } else if (activeTab === 'Playlists') {
                const res = await searchPlaylists(query, pageNo, PAGINATION_LIMIT);
                data = (res as any).data?.results || (res as any).results;
            }
            const newResults = data || [];
            if (pageNo === 1) {
                setResults(newResults);
            } else {
                setResults(prev => [...prev, ...newResults]);
            }
        } catch (e) {
            console.error(e);
            if (pageNo === 1) setResults([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    const handleLoadMore = () => {
        if (!loading && !loadingMore && results.length > 0) {
            const nextPage = page + 1;
            setPage(nextPage);
            handleSearch(nextPage);
        }
    };
    const onSearchSubmit = () => {
        setPage(1);
        handleSearch(1);
    };
    useEffect(() => {
        if (query.trim() && hasSearched) {
            setPage(1);
            handleSearch(1);
        }
    }, [activeTab]);
    const handleClearQuery = () => {
        setQuery('');
        setHasSearched(false);
        setResults([]);
        setPage(1);
    };
    const handlePlaySong = (song: Song) => {
        if (activeTab === 'Songs') {
            setQueue(results);
            const index = results.findIndex(s => s.id === song.id);
            playTrack(index !== -1 ? index : 0);
            navigation.navigate('Player');
        }
    };
    const renderHistoryItem = ({ item }: { item: string }) => (
        <TouchableOpacity style={styles.historyItem} onPress={() => { setQuery(item); setPage(1); handleSearch(1); }}>
            <Text style={[styles.historyText, { color: colors.textSecondary }]}>{item}</Text>
            <TouchableOpacity onPress={() => removeFromHistory(item)}>
                <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
    const renderSongItem = ({ item }: { item: Song }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => handlePlaySong(item)}>
            <Image source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }} style={styles.artwork} />
            <View style={styles.resultInfo}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(item)}</Text>
            </View>
            <PlayCircle color={colors.primary} size={24} />
        </TouchableOpacity>
    );
    const renderArtistItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('Details', { id: item.id, type: 'artist' })}>
            <Image source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }} style={[styles.artwork, styles.roundArtwork]} />
            <View style={styles.resultInfo}>
                <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Artist</Text>
            </View>
        </TouchableOpacity>
    );
    const renderAlbumItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('Details', { id: item.id, type: 'album' })}>
            <Image source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }} style={styles.artwork} />
            <View style={styles.resultInfo}>
                <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Album</Text>
            </View>
        </TouchableOpacity>
    );
    const renderPlaylistItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('Details', { id: item.id, type: 'playlist' })}>
            <Image source={{ uri: item.image?.[1]?.url || item.image?.[0]?.url }} style={styles.artwork} />
            <View style={styles.resultInfo}>
                <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Playlist</Text>
            </View>
        </TouchableOpacity>
    );
    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator style={{ padding: 10 }} color={colors.primary} />;
    };
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            { }
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
                    <SearchIcon color={colors.textSecondary} size={20} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Search songs, artists..."
                        placeholderTextColor={colors.textSecondary}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={onSearchSubmit}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={handleClearQuery}>
                            <X color={colors.text} size={20} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            { }
            {!hasSearched && query.length === 0 ? (
                <View style={styles.content}>
                    <View style={styles.historyHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Searches</Text>
                        {history.length > 0 && (
                            <TouchableOpacity onPress={clearHistory}>
                                <Text style={[styles.clearAll, { color: colors.primary }]}>Clear All</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <FlatList
                        data={history}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item) => item}
                    />
                </View>
            ) : (
                <View style={styles.content}>
                    { }
                    <View style={styles.tabs}>
                        {(['Songs', 'Artists', 'Albums', 'Playlists'] as SearchTab[]).map(tab => (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.tab,
                                    { borderColor: colors.primary },
                                    activeTab === tab && { backgroundColor: colors.primary }
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: colors.primary },
                                    activeTab === tab && styles.activeTabText
                                ]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                    ) : results.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Frown size={80} color={colors.primary} />
                            <Text style={[styles.emptyText, { color: colors.text }]}>Not Found</Text>
                            <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>Sorry, the keyword you entered cannot be found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(item, index) => item.id + index}
                            renderItem={
                                activeTab === 'Songs' ? renderSongItem :
                                    activeTab === 'Artists' ? renderArtistItem :
                                        activeTab === 'Albums' ? renderAlbumItem : renderPlaylistItem
                            }
                            contentContainerStyle={styles.listContent}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
                        />
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        gap: SPACING.sm,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: SPACING.sm,
        height: 48,
    },
    input: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZE.md,
    },
    content: { flex: 1 },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold' },
    clearAll: { fontWeight: '600' },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    historyText: { fontSize: FONT_SIZE.md },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    activeTab: {
    },
    tabText: { fontWeight: '600' },
    activeTabText: { color: '#FFF' },
    listContent: { padding: SPACING.md },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    artwork: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#eee' },
    roundArtwork: { borderRadius: 25 },
    resultInfo: { flex: 1, marginLeft: SPACING.md },
    title: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    subtitle: { fontSize: FONT_SIZE.sm, marginTop: 2 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
    emptyText: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', marginTop: SPACING.md },
    emptySubText: { textAlign: 'center', marginTop: SPACING.sm },
});
