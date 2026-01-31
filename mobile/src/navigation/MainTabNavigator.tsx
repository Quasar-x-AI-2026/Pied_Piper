import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessageCircle, Wallet, Search } from 'lucide-react-native';
import { ChatScreen } from '../screens/Chat/ChatScreen';
import { BudgetScreen } from '../screens/Budget/BudgetScreen';
import { SchemesScreen } from '../screens/Schemes/SchemesScreen';
import { colors, typography } from '../theme';

export type MainTabParamList = {
    Chat: undefined;
    Budget: undefined;
    Schemes: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.card,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                },
                headerTintColor: colors.foreground,
                headerTitleStyle: {
                    fontWeight: typography.fontWeight.semibold,
                },
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.mutedForeground,
                tabBarLabelStyle: {
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                },
            }}
        >
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    title: 'Chat Assistant',
                    tabBarIcon: ({ color, size }) => (
                        <MessageCircle size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Budget"
                component={BudgetScreen}
                options={{
                    title: 'Budget Manager',
                    tabBarIcon: ({ color, size }) => (
                        <Wallet size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Schemes"
                component={SchemesScreen}
                options={{
                    title: 'Scheme Lookup',
                    tabBarIcon: ({ color, size }) => (
                        <Search size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
