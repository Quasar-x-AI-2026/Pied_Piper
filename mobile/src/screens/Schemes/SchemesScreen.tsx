import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    Pressable,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { Input, Card } from '../../components/ui';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface Scheme {
    id: string;
    name: string;
    description: string;
    eligibility: string;
}

const MOCK_SCHEMES: Scheme[] = [
    {
        id: '1',
        name: 'PM Kisan Samman Nidhi',
        description: 'Income support to farmers',
        eligibility: 'Small and marginal farmers',
    },
    {
        id: '2',
        name: 'Pradhan Mantri Awas Yojana',
        description: 'Housing for all',
        eligibility: 'Economically weaker sections',
    },
    {
        id: '3',
        name: 'Ayushman Bharat',
        description: 'Health insurance scheme',
        eligibility: 'Families below poverty line',
    },
];

export function SchemesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [schemes] = useState<Scheme[]>(MOCK_SCHEMES);

    const filteredSchemes = schemes.filter((scheme) =>
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderScheme = ({ item }: { item: Scheme }) => (
        <Card style={styles.schemeCard}>
            <Text style={styles.schemeName}>{item.name}</Text>
            <Text style={styles.schemeDescription}>{item.description}</Text>
            <View style={styles.eligibilityContainer}>
                <Text style={styles.eligibilityLabel}>Eligibility:</Text>
                <Text style={styles.eligibilityText}>{item.eligibility}</Text>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Government Schemes</Text>
                <View style={styles.searchContainer}>
                    <Search size={20} color={colors.mutedForeground} style={styles.searchIcon} />
                    <Input
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search schemes..."
                        containerStyle={styles.searchInputContainer}
                    />
                </View>
            </View>

            <FlatList
                data={filteredSchemes}
                renderItem={renderScheme}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No schemes found</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing[4],
        paddingTop: spacing[6],
        paddingBottom: spacing[4],
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.foreground,
        marginBottom: spacing[4],
    },
    searchContainer: {
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: spacing[4],
        top: spacing[3] + 2,
        zIndex: 1,
    },
    searchInputContainer: {
        marginBottom: 0,
    },
    list: {
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[6],
    },
    schemeCard: {
        marginBottom: spacing[4],
    },
    schemeName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.foreground,
        marginBottom: spacing[2],
    },
    schemeDescription: {
        fontSize: typography.fontSize.base,
        color: colors.mutedForeground,
        marginBottom: spacing[3],
    },
    eligibilityContainer: {
        flexDirection: 'row',
        gap: spacing[2],
    },
    eligibilityLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.primary,
    },
    eligibilityText: {
        flex: 1,
        fontSize: typography.fontSize.sm,
        color: colors.mutedForeground,
    },
    emptyText: {
        fontSize: typography.fontSize.base,
        color: colors.mutedForeground,
        textAlign: 'center',
        marginTop: spacing[8],
    },
});
