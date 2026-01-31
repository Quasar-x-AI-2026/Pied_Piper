import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    containerStyle,
    style,
    ...props
}: InputProps) {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError, style]}
                placeholderTextColor={colors.mutedForeground}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing[4],
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.foreground,
        marginBottom: spacing[2],
    },
    input: {
        width: '100%',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        fontSize: typography.fontSize.base,
        color: colors.foreground,
    },
    inputError: {
        borderColor: colors.destructive,
    },
    error: {
        fontSize: typography.fontSize.sm,
        color: colors.destructive,
        marginTop: spacing[1],
    },
});
