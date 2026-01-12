import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Settings, Edit2, Camera } from 'lucide-react-native';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useLibraryStore } from '../store/useLibraryStore';
import { useThemeStore } from '../store/useThemeStore';
import { SafeAreaView } from 'react-native-safe-area-context';
export const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { favorites, playlists } = useLibraryStore();
    const { colors } = useThemeStore();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { marginTop: 0 }]}>
                <View style={{ width: 24 }} />
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Settings color={colors.text} size={24} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://ui-avatars.com/api/?name=Music+User&background=orange&color=fff&size=200' }}
                            style={styles.avatar}
                        />
                        <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                            <Camera color="#FFF" size={14} />
                        </View>
                    </View>
                    <Text style={[styles.name, { color: colors.text }]}>Music User</Text>
                    <Text style={[styles.email, { color: colors.textSecondary }]}>user@example.com</Text>
                    <TouchableOpacity style={[styles.editBtn, { borderColor: colors.border }]}>
                        <Text style={[styles.editBtnText, { color: colors.text }]}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{favorites.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorites</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{playlists.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Playlists</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
    headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: 'bold' },
    content: { alignItems: 'center', paddingVertical: SPACING.xl },
    profileHeader: { alignItems: 'center', marginBottom: SPACING.xl },
    avatarContainer: { position: 'relative', marginBottom: SPACING.md },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editBadge: {
        position: 'absolute', bottom: 0, right: 0,
        width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
        borderWidth: 2
    },
    name: { fontSize: 22, fontWeight: 'bold' },
    email: { fontSize: FONT_SIZE.md, marginBottom: SPACING.md },
    editBtn: {
        borderWidth: 1, paddingHorizontal: 20, paddingVertical: 8,
        borderRadius: 20
    },
    editBtnText: { fontWeight: '600' },
    statsRow: {
        flexDirection: 'row', width: '90%', padding: SPACING.lg,
        borderRadius: 16, justifyContent: 'space-between', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    statLabel: { fontSize: 12, marginTop: 4 },
    divider: { width: 1 }
});
