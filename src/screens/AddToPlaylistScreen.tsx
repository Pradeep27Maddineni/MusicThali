import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Plus, X, Check } from 'lucide-react-native';
import { useLibraryStore } from '../store/useLibraryStore';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { Playlist, Song } from '../types';
import { useThemeStore } from '../store/useThemeStore';
export const AddToPlaylistScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { colors } = useThemeStore();
    const { song } = route.params;
    const { playlists, createPlaylist, addToPlaylist } = useLibraryStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const handleCreate = () => {
        if (playlistName.trim()) {
            createPlaylist(playlistName.trim());
            setPlaylistName('');
            setModalVisible(false);
        }
    };
    const handleSelect = (playlist: Playlist) => {
        addToPlaylist(playlist.id, song);
        navigation.goBack();
    };
    const renderItem = ({ item }: { item: Playlist }) => {
        const isAdded = item.songs.some(s => s.id === song.id);
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
                disabled={isAdded}
            >
                <View style={[styles.artworkPlaceholder, isAdded && styles.disabledPlaceholder, { backgroundColor: '#EEE' }]}>
                    <Text style={styles.initial}>{item.name[0]}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text }, isAdded && { color: colors.textSecondary }]}>{item.name}</Text>
                    <Text style={[styles.count, { color: colors.textSecondary }]}>{item.songs.length} Songs</Text>
                </View>
                {isAdded && <Check color={colors.primary} size={20} />}
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Add to Playlist</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <X color={colors.text} size={24} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.createRow, { borderBottomColor: colors.border }]} onPress={() => setModalVisible(true)}>
                <View style={[styles.createIcon, { backgroundColor: colors.primary }]}>
                    <Plus color="#FFF" size={20} />
                </View>
                <Text style={[styles.createText, { color: colors.primary }]}>New Playlist</Text>
            </TouchableOpacity>
            <FlatList
                data={playlists}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
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
                                <Text style={styles.createTextBtn}>Create</Text>
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
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: SPACING.md, borderBottomWidth: 1
    },
    headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold' },
    list: { padding: SPACING.md },
    item: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    artworkPlaceholder: {
        width: 50, height: 50, borderRadius: 4,
        justifyContent: 'center', alignItems: 'center'
    },
    disabledPlaceholder: { opacity: 0.5 },
    initial: { fontSize: 20, fontWeight: 'bold', color: '#888' },
    info: { flex: 1, marginLeft: SPACING.md },
    name: { fontSize: FONT_SIZE.md, fontWeight: '600' },
    count: { fontSize: FONT_SIZE.sm },
    createRow: {
        flexDirection: 'row', alignItems: 'center', padding: SPACING.md,
        borderBottomWidth: 1
    },
    createIcon: {
        width: 50, height: 50, borderRadius: 4,
        justifyContent: 'center', alignItems: 'center'
    },
    createText: { marginLeft: SPACING.md, fontSize: FONT_SIZE.md, fontWeight: '600' },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: {
        width: '80%', padding: 20, borderRadius: 16, elevation: 5
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
    createTextBtn: { color: '#FFF', fontWeight: 'bold' }
});
