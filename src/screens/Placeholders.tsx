import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const SettingsScreen = () => (
    <View style={styles.container}><Text>Settings Screen</Text></View>
);
export const FavoritesScreen = () => (
    <View style={styles.container}><Text>Favorites Screen</Text></View>
);
export const PlaylistsScreen = () => (
    <View style={styles.container}><Text>Playlists Screen</Text></View>
);
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }
});
