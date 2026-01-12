import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Music, Search, Bell } from 'lucide-react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../store/useThemeStore';
import { FONT_SIZE, SPACING } from '../constants/theme';
import SuggestedTab from './home/SuggestedTab';
import SongsTab from './home/SongsTab';  
import ArtistsTab from './home/ArtistsTab';  
import AlbumsTab from './home/AlbumsTab';  
import FoldersTab from './home/FoldersTab';  
const Tab = createMaterialTopTabNavigator();
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useThemeStore();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            { }
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={styles.logoContainer}>
                    <Music color={colors.primary} size={28} />
                    <Text style={[styles.logoText, { color: colors.text }]}>MusicThali</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Search color={colors.text} size={24} />
                    </TouchableOpacity>
                    { }
                </View>
            </View>
            { }
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: FONT_SIZE.sm, fontWeight: '600', textTransform: 'none' },
                    tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 3, borderRadius: 3 },  
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        backgroundColor: colors.background
                    },
                    tabBarItemStyle: { width: 'auto', paddingHorizontal: 12 }  
                }}
            >
                <Tab.Screen name="Suggested" component={SuggestedTab} options={{ title: 'For You' }} />
                <Tab.Screen name="Songs" component={SongsTab} />
                <Tab.Screen name="Artists" component={ArtistsTab} />
                <Tab.Screen name="Albums" component={AlbumsTab} />
                <Tab.Screen name="Folders" component={FoldersTab} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoText: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', marginLeft: SPACING.sm },
    headerIcons: { flexDirection: 'row', gap: SPACING.md },
});
