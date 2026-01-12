import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
export default function PlaceholderTab({ route }: any) {
    return (
        <View style={styles.container}>
            <Text>{route.name} Tab</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }
});
