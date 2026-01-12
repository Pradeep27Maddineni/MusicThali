import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { SearchScreen } from '../screens/SearchScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { AddToPlaylistScreen } from '../screens/AddToPlaylistScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RootStackParamList } from '../types';
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs" component={TabNavigator} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen
                    name="Player"
                    component={PlayerScreen}
                    options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen
                    name="AddToPlaylist"
                    component={AddToPlaylistScreen}
                    options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
