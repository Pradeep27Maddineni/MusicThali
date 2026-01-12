import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Play, Pause, X } from 'lucide-react-native';
import { usePlayerStore } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';
import { FONT_SIZE, SPACING } from '../constants/theme';
export const MiniPlayer = () => {
    const navigation = useNavigation<any>();
    const { currentTrack, isPlaying, togglePlayback, closePlayer } = usePlayerStore();
    const { colors } = useThemeStore();
    if (!currentTrack) return null;
    const handlePress = () => {
        navigation.navigate('Player');
    };
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.content}>
                <Image
                    source={{ uri: currentTrack.image?.[0]?.url }}
                    style={styles.artwork}
                />
                <View style={styles.info}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{currentTrack.name}</Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>{currentTrack.primaryArtists}</Text>
                </View>
                <TouchableOpacity onPress={togglePlayback} style={styles.playBtn}>
                    {isPlaying ? (
                        <Pause color={colors.text} size={24} fill={colors.text} />
                    ) : (
                        <Play color={colors.text} size={24} fill={colors.text} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={closePlayer} style={styles.closeBtn}>
                    <X color={colors.text} size={24} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 2, backgroundColor: colors.border, width: '100%' }}>
                { }
                <View style={{ height: 2, backgroundColor: colors.primary, width: '30%' }} />
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        paddingBottom: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
    },
    artwork: {
        width: 40,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#eee',
    },
    info: {
        flex: 1,
        marginLeft: SPACING.md,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
    },
    artist: {
        fontSize: FONT_SIZE.sm,
    },
    playBtn: {
        padding: SPACING.sm,
    },
    closeBtn: {
        padding: SPACING.sm,
        marginLeft: SPACING.xs,
    },
});
