import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export function Button({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
}: ButtonProps) {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`text_${variant}`],
        styles[`textSize_${size}`],
    ];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                ...buttonStyles,
                pressed && !disabled && styles.pressed,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? colors.primaryForeground : colors.foreground}
                />
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    destructive: {
        backgroundColor: colors.destructive,
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.9,
    },
    size_sm: {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
    },
    size_md: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    size_lg: {
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
    },
    text: {
        fontWeight: typography.fontWeight.semibold,
    },
    text_primary: {
        color: colors.primaryForeground,
    },
    text_secondary: {
        color: colors.foreground,
    },
    text_destructive: {
        color: '#ffffff',
    },
    textSize_sm: {
        fontSize: typography.fontSize.sm,
    },
    textSize_md: {
        fontSize: typography.fontSize.base,
    },
    textSize_lg: {
        fontSize: typography.fontSize.lg,
    },
});
