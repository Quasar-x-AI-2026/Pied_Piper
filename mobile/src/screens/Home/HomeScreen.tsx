import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Pressable, // Use Pressable to avoid TouchableOpacity errors
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

export function HomeScreen({ navigation }: any) {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = "AI financial assistant";
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let index = 0;
        // Slow and continuous typing
        const typingInterval = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(typingInterval);
                // Fade in button only after typing is done
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }).start();
            }
        }, 120); 

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                
                <View style={styles.heroSection}>
                    <Text style={styles.title}>
                        Meet your{'\n'}
                        <Text style={styles.titleHighlight}>{displayedText}</Text>
                        <Text style={styles.cursor}>|</Text>
                    </Text>
                </View>

                <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                    <Text style={styles.subtitle}>
                        Secure your future with real-time fraud detection and 
                        personalized guidance.
                    </Text>

                    <Pressable 
                        onPress={() => navigation.navigate('Auth')}
                        style={({ pressed }) => [
                            styles.ctaButton,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <ArrowRight size={22} color="#000" />
                    </Pressable>
                </Animated.View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', 
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    heroSection: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 120,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 46,
    },
    titleHighlight: {
        color: '#EAB308',
    },
    cursor: {
        color: '#EAB308',
        fontSize: 36,
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
    },
    subtitle: {
        fontSize: 16,
        color: '#A1A1AA',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    ctaButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#EAB308',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});