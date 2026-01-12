import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Moon, Music, Bell, Shield, Info, ChevronRight, LogOut, Code } from 'lucide-react-native';
import { FONT_SIZE, SPACING } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';
import { SafeAreaView } from 'react-native-safe-area-context';
export const SettingsScreen = () => {
    const navigation = useNavigation<any>();
    const { theme, toggleTheme, colors } = useThemeStore();
    const sections = [
        {
            title: 'Appearance',
            items: [
                {
                    icon: <Moon color={colors.primary} size={20} />,
                    label: 'Dark Mode',
                    type: 'toggle',
                    value: theme === 'dark',
                    onPress: toggleTheme
                }
            ]
        },
        {
            title: 'Audio',
            items: [
                {
                    icon: <Music color={colors.primary} size={20} />,
                    label: 'Audio Quality',
                    value: 'High',
                    type: 'link',
                    onPress: () => Alert.alert('Coming Soon', 'Audio quality settings will be available soon.')
                }
            ]
        },
        {
            title: 'About',
            items: [
                {
                    icon: <Info color={colors.primary} size={20} />,
                    label: 'Version',
                    value: '1.0.0',
                    type: 'text'
                },
                {
                    icon: <Code color={colors.primary} size={20} />,
                    label: 'Developer',
                    value: 'MusicThali Team',
                    type: 'text'
                }
            ]
        }
    ];
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={{ padding: SPACING.md }}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
                        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            {section.items.map((item: any, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.item,
                                        idx !== section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                                    ]}
                                    onPress={item.onPress}
                                    disabled={item.type === 'text'}
                                >
                                    <View style={styles.itemLeft}>
                                        <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                                            {item.icon}
                                        </View>
                                        <Text style={[styles.optionLabel, { color: colors.text }]}>{item.label}</Text>
                                    </View>
                                    <View style={styles.itemRight}>
                                        {item.type === 'toggle' ? (
                                            <Switch
                                                value={item.value}
                                                onValueChange={item.onPress}
                                                trackColor={{ false: '#EEE', true: colors.primary }}
                                                thumbColor={'#fff'}
                                            />
                                        ) : item.type === 'link' ? (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {item.value && <Text style={[styles.optionValue, { color: colors.textSecondary, marginRight: 8 }]}>{item.value}</Text>}
                                                <ChevronRight color={colors.textSecondary} size={20} />
                                            </View>
                                        ) : (
                                            <Text style={[styles.optionValue, { color: colors.textSecondary }]}>{item.value}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>MusicThali v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: SPACING.xl, marginTop: SPACING.lg },
    section: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: FONT_SIZE.sm, fontWeight: '600', marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4 },
    card: { borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    itemRight: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
    optionLabel: { fontSize: FONT_SIZE.md, fontWeight: '500' },
    optionValue: { fontSize: FONT_SIZE.sm },
    footerText: { textAlign: 'center', marginTop: SPACING.lg, fontSize: 12 }
});
