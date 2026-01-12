import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../store/useThemeStore';
import { useDownloadStore } from '../../store/useDownloadStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { FONT_SIZE, SPACING } from '../../constants/theme';
import { Play } from 'lucide-react-native';
import { getArtistName } from '../../utils/format';
export default function FoldersTab() {
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    const { downloadedSongs } = useDownloadStore();
    const { playTrack, setQueue } = usePlayerStore();
    const songs = Object.values(downloadedSongs).map(item => item.song);
    const handlePlay = (index: number) => {
        setQueue(songs);
        playTrack(index);
    };
    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePlay(index)}>
            <Image
                source={{ uri: item.image?.[0]?.url || 'https://via.placeholder.com/50' }}
                style={styles.artwork}
            />
            <View style={styles.info}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(item)}</Text>
            </View>
            <TouchableOpacity onPress={() => handlePlay(index)} style={styles.playBtn}>
                <Play size={20} color={colors.primary} fill={colors.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>Local Downloads ({songs.length})</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={{ color: colors.textSecondary, marginTop: 20 }}>No downloaded songs yet.</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Download songs from the player to see them here.</Text>
                    </View>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    listContent: { padding: SPACING.md },
    header: { marginBottom: SPACING.md },
    headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: 'bold' },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        backgroundColor: 'transparent'
    },
    artwork: {
        width: 50,
        height: 50,
        borderRadius: 4,
        backgroundColor: '#333',
    },
    info: { flex: 1, marginLeft: SPACING.md },
    title: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    subtitle: { fontSize: FONT_SIZE.sm, marginTop: 4 },
    playBtn: { padding: 10 }
});
