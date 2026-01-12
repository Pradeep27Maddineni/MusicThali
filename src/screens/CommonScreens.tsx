import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const SearchScreen = () => (
    <View style={styles.container}><Text>Search Screen</Text></View>
);
export const PlayerScreen = () => (
    <View style={styles.container}><Text>Player Screen</Text></View>
);
export const DetailsScreen = () => (
    <View style={styles.container}><Text>Details Screen</Text></View>
);
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }
});
