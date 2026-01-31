import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { User } from 'lucide-react-native';
import { Button, Card, Input } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';

export function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <User size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.name}>John Doe</Text>
                    <Text style={styles.email}>john.doe@example.com</Text>
                </View>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <Input
                        label="Full Name"
                        value="John Doe"
                        placeholder="Enter your name"
                    />
                    <Input
                        label="Email"
                        value="john.doe@example.com"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                    />
                    <Input
                        label="Phone"
                        value="+91 98765 43210"
                        placeholder="Enter your phone"
                        keyboardType="phone-pad"
                    />
                </Card>

                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>Financial Profile</Text>
                    <Input
                        label="Monthly Income"
                        value="₹50,000"
                        placeholder="Enter monthly income"
                        keyboardType="numeric"
                    />
                    <Input
                        label="Occupation"
                        value="Software Engineer"
                        placeholder="Enter occupation"
                    />
                </Card>

                <Button variant="primary" size="lg" onPress={() => { }}>
                    Save Changes
                </Button>

                <Button
                    variant="destructive"
                    size="md"
                    onPress={() => { }}
                    style={styles.logoutButton}
                >
                    Logout
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[6],
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing[8],
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[4],
    },
    name: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.foreground,
        marginBottom: spacing[1],
    },
    email: {
        fontSize: typography.fontSize.base,
        color: colors.mutedForeground,
    },
    section: {
        marginBottom: spacing[6],
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.foreground,
        marginBottom: spacing[4],
    },
    logoutButton: {
        marginTop: spacing[4],
    },
});
