import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, MoreHorizontal, RotateCcw, RotateCw, SkipBack, SkipForward, Play, Pause, Timer, Mic2, Cast, Gauge, Heart, ListMusic, Download, Check } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { usePlayerStore } from '../store/usePlayerStore';
import { useNavigation } from '@react-navigation/native';
import { getLyrics } from '../api/jiosaavn';
import { useThemeStore } from '../store/useThemeStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { getArtistName } from '../utils/format';
import { QueueScreen } from './QueueScreen';
const { width } = Dimensions.get('window');
export const PlayerScreen = () => {
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    const {
        currentTrack,
        isPlaying,
        togglePlayback,
        skipToNext,
        skipToPrevious,
        seekTo,
        seekBy,
        progress,
        duration,
        playbackSpeed,
        setPlaybackSpeed
    } = usePlayerStore();
    const { toggleFavorite, isFavorite } = useLibraryStore();
    const [sliderValue, setSliderValue] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [showSpeedModal, setShowSpeedModal] = useState(false);
    const [showLyricsModal, setShowLyricsModal] = useState(false);
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [lyrics, setLyrics] = useState('');
    const [loadingLyrics, setLoadingLyrics] = useState(false);
    const { useDownloadStore } = require('../store/useDownloadStore');
    const { downloadSong, removeDownload, isDownloading, isDownloaded } = useDownloadStore();
    const isSongDownloading = isDownloading[currentTrack?.id || ''];
    const isSongDownloaded = isDownloaded(currentTrack?.id || '');
    const handleDownloadToggle = () => {
        if (!currentTrack) return;
        if (isSongDownloaded) {
            removeDownload(currentTrack.id);
        } else {
            downloadSong(currentTrack);
        }
    };
    useEffect(() => {
        if (showLyricsModal && currentTrack) {
            fetchLyrics();
        }
    }, [showLyricsModal, currentTrack]);
    const fetchLyrics = async () => {
        if (!currentTrack) return;
        setLoadingLyrics(true);
        try {
            const data = await getLyrics(currentTrack.id);
            setLyrics(data?.lyrics || '');
        } catch (e) {
            setLyrics('');
        } finally {
            setLoadingLyrics(false);
        }
    };
    useEffect(() => {
        if (!isSliding) {
            setSliderValue(progress);
        }
    }, [progress, isSliding]);
    const handleSlidingComplete = async (val: number) => {
        await seekTo(val * 1000);  
        setIsSliding(false);
    };
    const skipForward10 = async () => {
        await seekBy(10000);
    };
    const skipBackward10 = async () => {
        await seekBy(-10000);
    };
    const formatTime = (seconds: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    if (!currentTrack) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>No Track Playing</Text>
            </View>
        );
    }
    const artworkUrl = currentTrack.image?.[2]?.url || currentTrack.image?.[1]?.url || currentTrack.image?.[0]?.url;
    const isFav = isFavorite(currentTrack.id);
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            { }
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronDown color={colors.text} size={28} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Now Playing</Text>
                <TouchableOpacity onPress={() => currentTrack && navigation.navigate('AddToPlaylist', { song: currentTrack })}>
                    <MoreHorizontal color={colors.text} size={24} />
                </TouchableOpacity>
            </View>
            { }
            <View style={styles.artworkContainer}>
                <Image source={{ uri: artworkUrl }} style={styles.artwork} />
            </View>
            { }
            <View style={styles.trackInfo}>
                <View style={{ flex: 1, marginRight: SPACING.md }}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{currentTrack.name.replace(/&quot;/g, '"')}</Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>{getArtistName(currentTrack)}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleFavorite(currentTrack)}>
                    <Heart
                        color={isFav ? colors.primary : colors.text}
                        fill={isFav ? colors.primary : 'transparent'}
                        size={28}
                    />
                </TouchableOpacity>
            </View>
            { }
            <View style={styles.progressContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={sliderValue}
                    onSlidingStart={() => setIsSliding(true)}
                    onSlidingComplete={handleSlidingComplete}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                />
                <View style={styles.timeRow}>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(progress)}</Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatTime(duration)}</Text>
                </View>
            </View>
            { }
            <View style={styles.controls}>
                <TouchableOpacity onPress={skipToPrevious}>
                    <SkipBack color={colors.text} size={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={skipBackward10}>
                    <RotateCcw color={colors.text} size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.primary }]} onPress={togglePlayback}>
                    {isPlaying ? (
                        <Pause color="#FFF" size={32} fill="#FFF" />
                    ) : (
                        <Play color="#FFF" size={32} fill="#FFF" />
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={skipForward10}>
                    <RotateCw color={colors.text} size={28} />
                </TouchableOpacity>
                <TouchableOpacity onPress={skipToNext}>
                    <SkipForward color={colors.text} size={32} />
                </TouchableOpacity>
            </View>
            { }
            <View style={styles.bottomActions}>
                <TouchableOpacity onPress={() => setShowSpeedModal(true)}>
                    <Gauge color={colors.text} size={24} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Timer color={colors.text} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowLyricsModal(true)}>
                    <Mic2 color={colors.text} size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownloadToggle} disabled={isSongDownloading}>
                    {isSongDownloading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : isSongDownloaded ? (
                        <Check color={colors.primary} size={24} />
                    ) : (
                        <Download color={colors.text} size={24} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowQueueModal(true)}>
                    <ListMusic color={colors.text} size={24} />
                </TouchableOpacity>
            </View>
            { }
            <Modal
                transparent={true}
                visible={showSpeedModal}
                animationType="slide"
                onRequestClose={() => setShowSpeedModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSpeedModal(false)}
                >
                    <View style={[styles.speedModalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.speedTitle, { color: colors.text }]}>Playback Speed</Text>
                        {[0.5, 0.8, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                            <TouchableOpacity
                                key={speed}
                                style={[styles.speedOption, playbackSpeed === speed && { backgroundColor: colors.primary + '20' }]}
                                onPress={() => {
                                    setPlaybackSpeed(speed);
                                    setShowSpeedModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.speedText,
                                    { color: colors.text },
                                    playbackSpeed === speed && { color: colors.primary, fontWeight: 'bold' }
                                ]}>
                                    {speed}x
                                </Text>
                                {playbackSpeed === speed && <Text style={{ color: colors.primary }}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
            { }
            <Modal
                visible={showLyricsModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowLyricsModal(false)}
            >
                <View style={[styles.lyricsContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.lyricsHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.lyricsTitle, { color: colors.text }]}>Lyrics</Text>
                        <TouchableOpacity onPress={() => setShowLyricsModal(false)}>
                            <Text style={[styles.closeText, { color: colors.primary }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.lyricsContent}>
                        {loadingLyrics ? (
                            <Text style={[styles.lyricsText, { color: colors.textSecondary }]}>Loading lyrics...</Text>
                        ) : lyrics ? (
                            <Text style={[styles.lyricsText, { color: colors.text }]}>{lyrics.replace(/<br\s*\/?>/gi, '\n')}</Text>
                        ) : (
                            <Text style={[styles.lyricsText, { color: colors.textSecondary }]}>No lyrics available.</Text>
                        )}
                    </ScrollView>
                </View>
            </Modal>
            { }
            <Modal
                visible={showQueueModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowQueueModal(false)}
            >
                <QueueScreen onClose={() => setShowQueueModal(false)} />
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
    },
    artworkContainer: {
        alignItems: 'center',
        marginTop: SPACING.md,  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    artwork: {
        width: width - 120,  
        height: width - 120,
        borderRadius: 20,
    },
    trackInfo: {
        marginTop: SPACING.lg,  
        paddingHorizontal: SPACING.xl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        marginBottom: 4,  
    },
    artist: {
        fontSize: FONT_SIZE.lg,
    },
    progressContainer: {
        marginTop: SPACING.lg,  
        paddingHorizontal: SPACING.lg,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -10,
    },
    timeText: {
        fontSize: FONT_SIZE.sm,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.lg,
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: SPACING.xl,
        paddingHorizontal: SPACING.xl,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    speedModalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    speedTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    speedOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    speedText: {
        fontSize: FONT_SIZE.md,
    },
    lyricsContainer: {
        flex: 1,
    },
    lyricsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    lyricsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    lyricsContent: {
        padding: 20,
        paddingBottom: 50,
    },
    lyricsText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
});
