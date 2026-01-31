import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    elevated?: boolean;
}

export function Card({ children, style, elevated = true }: CardProps) {
    return (
        <View style={[styles.card, elevated && styles.elevated, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[4],
    },
    elevated: {
        elevation: 3,
    },
});
