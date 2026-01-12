import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { X, Trash2, ArrowUp, ArrowDown } from 'lucide-react-native';
import { getArtistName } from '../utils/format';
interface QueueScreenProps {
    onClose: () => void;
}
export const QueueScreen = ({ onClose }: QueueScreenProps) => {
    const { colors } = useThemeStore();
    const { queue, currentTrackIndex, playTrack, removeFromQueue, clearQueue, reorderQueue } = usePlayerStore();
    const handleRemove = (id: string, e: any) => {
        e.stopPropagation();
        removeFromQueue(id);
    };
    const handleMoveUp = (index: number, e: any) => {
        e.stopPropagation();
        if (index > 0) reorderQueue(index, index - 1);
    };
    const handleMoveDown = (index: number, e: any) => {
        e.stopPropagation();
        if (index < queue.length - 1) reorderQueue(index, index + 1);
    };
    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const isCurrent = index === currentTrackIndex;
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    isCurrent && { backgroundColor: colors.card }
                ]}
                onPress={() => playTrack(index)}
            >
                <Image source={{ uri: item.image?.[0]?.url }} style={styles.img} />
                <View style={styles.info}>
                    <Text style={[styles.name, { color: isCurrent ? colors.primary : colors.text }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                        {getArtistName(item)}
                    </Text>
                </View>
                { }
                <View style={styles.actions}>
                    { }
                    <TouchableOpacity onPress={(e) => handleMoveUp(index, e)} style={styles.actionBtn}>
                        <ArrowUp size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(e) => handleMoveDown(index, e)} style={styles.actionBtn}>
                        <ArrowDown size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(e) => handleRemove(item.id, e)} style={styles.actionBtn}>
                        <X size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Queue ({queue.length})</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    {queue.length > 0 && (
                        <TouchableOpacity onPress={clearQueue}>
                            <Trash2 color={colors.error || '#ff4444'} size={20} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ color: colors.primary, fontSize: FONT_SIZE.md, fontWeight: '600' }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={queue}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id + '_' + index}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: FONT_SIZE.lg,
        fontWeight: 'bold',
    },
    list: {
        padding: SPACING.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        marginBottom: SPACING.sm,
        paddingHorizontal: SPACING.sm,
        borderRadius: 8,
    },
    img: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#333',
    },
    info: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    name: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
    },
    artist: {
        fontSize: FONT_SIZE.sm,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    actionBtn: {
        padding: 4
    }
});
