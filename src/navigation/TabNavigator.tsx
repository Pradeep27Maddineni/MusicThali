import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PlaylistsScreen } from '../screens/PlaylistsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Home, Heart, ListMusic, User } from 'lucide-react-native';
import { useThemeStore } from '../store/useThemeStore';
import { MiniPlayer } from '../components/MiniPlayer';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
    const { colors } = useThemeStore();
    return (
        <Tab.Navigator
            tabBar={(props) => (
                <View>
                    <MiniPlayer />
                    <BottomTabBar {...props} />
                </View>
            )}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    tabBarLabel: 'Favorites',
                    tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Playlists"
                component={PlaylistsScreen}
                options={{
                    tabBarLabel: 'Playlists',
                    tabBarIcon: ({ color, size }) => <ListMusic color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}
