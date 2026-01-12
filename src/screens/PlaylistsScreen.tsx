import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Plus, ChevronRight, Music } from 'lucide-react-native';
import { useLibraryStore } from '../store/useLibraryStore';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { Playlist } from '../types';
import { useThemeStore } from '../store/useThemeStore';
export const PlaylistsScreen = () => {
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    const { playlists, createPlaylist } = useLibraryStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const handleCreate = () => {
        if (playlistName.trim()) {
            createPlaylist(playlistName.trim());
            setPlaylistName('');
            setModalVisible(false);
        }
    };
    const renderItem = ({ item }: { item: Playlist }) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Details', { id: item.id, type: 'playlist' })}
        >
            <View style={[styles.artworkPlaceholder, { backgroundColor: colors.primary }]}>
                {item.songs.length > 0 && item.songs[0].image?.[0]?.url ? (
                    <Image source={{ uri: item.songs[0].image[0].url }} style={styles.artwork} />
                ) : (
                    <Music color="#FFF" size={24} />
                )}
            </View>
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.count, { color: colors.textSecondary }]}>{item.songs.length} Songs</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
        </TouchableOpacity>
    );
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Playlists</Text>
            </View>
            <FlatList
                data={playlists}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No playlists yet.</Text>
                        <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Create one to start your collection.</Text>
                    </View>
                }
            />
            <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
                <Plus color="#FFF" size={24} />
            </TouchableOpacity>
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBg}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>New Playlist</Text>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Playlist Name"
                            placeholderTextColor={colors.textSecondary}
                            value={playlistName}
                            onChangeText={setPlaylistName}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCreate} style={[styles.createBtn, { backgroundColor: colors.primary }]}>
                                <Text style={styles.createText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: SPACING.md, borderBottomWidth: 1 },
    headerTitle: { fontSize: 28, fontWeight: 'bold' },
    list: { padding: SPACING.md, paddingBottom: 100 },
    item: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, padding: SPACING.sm, borderRadius: 12 },
    artworkPlaceholder: {
        width: 56, height: 56, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center'
    },
    artwork: { width: 56, height: 56, borderRadius: 8 },
    info: { flex: 1, marginLeft: SPACING.md },
    name: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    count: { fontSize: FONT_SIZE.sm },
    fab: {
        position: 'absolute', bottom: 90, right: 20,
        width: 56, height: 56, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }
    },
    empty: { alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: FONT_SIZE.lg, fontWeight: 'bold' },
    emptySub: { fontSize: FONT_SIZE.md, marginTop: 4 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: {
        width: '80%', padding: 20, borderRadius: 16,
        elevation: 5
    },
    modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold', marginBottom: 15 },
    input: {
        borderWidth: 1, borderRadius: 8, padding: 10,
        fontSize: FONT_SIZE.md, marginBottom: 20
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 15 },
    cancelBtn: { padding: 10 },
    cancelText: { fontWeight: '600' },
    createBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    createText: { color: '#FFF', fontWeight: 'bold' }
});
