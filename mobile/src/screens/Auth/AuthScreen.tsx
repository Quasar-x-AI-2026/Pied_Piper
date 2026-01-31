import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Input } from '../../components/ui';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { RootStackParamList } from '../../navigation/AppNavigator';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

interface AuthScreenProps {
    navigation: AuthScreenNavigationProp;
}

export function AuthScreen({ navigation }: AuthScreenProps) {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleAuth = () => {
        // TODO: Implement authentication logic
        navigation.navigate('MainApp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {isSignIn ? 'Welcome Back' : 'Create Account'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isSignIn
                            ? 'Sign in to continue to FinGuard'
                            : 'Join FinGuard to manage your finances'}
                    </Text>

                    <View style={styles.form}>
                        {!isSignIn && (
                            <Input
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                autoCapitalize="words"
                            />
                        )}
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry={true}
                        />

                        <Button
                            onPress={handleAuth}
                            variant="primary"
                            size="lg"
                            style={styles.authButton}
                        >
                            {isSignIn ? 'Sign In' : 'Sign Up'}
                        </Button>

                        <Button
                            onPress={() => setIsSignIn(!isSignIn)}
                            variant="secondary"
                            size="md"
                            style={styles.toggleButton}
                        >
                            {isSignIn
                                ? "Don't have an account? Sign Up"
                                : 'Already have an account? Sign In'}
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[12],
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.foreground,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.mutedForeground,
        textAlign: 'center',
        marginTop: spacing[2],
    },
    form: {
        marginTop: spacing[8],
    },
    authButton: {
        marginTop: spacing[4],
    },
    toggleButton: {
        marginTop: spacing[4],
    },
});
