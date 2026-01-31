import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { AuthScreen } from '../screens/Auth/AuthScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { ChatScreen } from '../screens/Chat/ChatScreen'; // <--- ADD THIS
import { MainTabNavigator } from './MainTabNavigator';
import { colors, typography } from '../theme';

export type RootStackParamList = {
    Home: undefined;
    Auth: undefined;
    MainApp: undefined;
    Profile: undefined;
    Chat: undefined; // <--- ADD THIS
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    headerTintColor: colors.foreground,
                    headerTitleStyle: {
                        fontWeight: typography.fontWeight.semibold,
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Chat" 
                    component={ChatScreen} // <--- ADD THIS
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Auth"
                    component={AuthScreen}
                    options={{ title: 'Sign In' }}
                />
                <Stack.Screen
                    name="MainApp"
                    component={MainTabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}