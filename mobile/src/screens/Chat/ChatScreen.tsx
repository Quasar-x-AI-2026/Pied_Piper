import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Modal,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
    MessageCircle, 
    Send, 
    ChevronDown, 
    ShieldCheck, 
    Wallet, 
    ArrowRightLeft, 
    Sparkles,
    Check
} from 'lucide-react-native';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

const MODELS = [
    { id: 'scam-detection', name: 'Scam Detection', icon: ShieldCheck, desc: 'Analyze links for fraud' },
    { id: 'financial-query', name: 'Financial Assistant', icon: Wallet, desc: 'General help with schemes' },
    { id: 'transaction-guide', name: 'Transaction Guide', icon: ArrowRightLeft, desc: 'Banking & UPI help' },
];

export function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [selectedModel, setSelectedModel] = useState(MODELS[1]);
    const [showModelPicker, setShowModelPicker] = useState(false);

    const handleSend = (text?: string) => {
        const messageText = text || inputText;
        if (!messageText.trim()) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            time: timestamp
        };

        setMessages((prev) => [newUserMsg, ...prev]);
        setInputText('');

        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `I'm using the ${selectedModel.name} tools to process your request about "${messageText}".`,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [aiMsg, ...prev]);
        }, 1000);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
                <MessageCircle color="#EAB308" size={36} />
            </View>
            <Text style={styles.mainTitle}>How can I help you today?</Text>
            
            <View style={styles.quickPromptContainer}>
                <View style={styles.promptHeader}>
                    <Sparkles size={16} color="#EAB308" />
                    <Text style={styles.promptHeaderText}>Quick prompts</Text>
                </View>
                <View style={styles.chipRow}>
                    <TouchableOpacity style={styles.chip} onPress={() => handleSend("Am I eligible for PMAY?")}>
                        <Text style={styles.chipText}>Am I eligible for PMAY?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.chip} onPress={() => handleSend("Student schemes in 2025")}>
                        <Text style={styles.chipText}>Student schemes 2025</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <TouchableOpacity style={styles.modelPill} onPress={() => setShowModelPicker(true)}>
                    <selectedModel.icon size={16} color="#EAB308" />
                    <Text style={styles.modelPillText}>{selectedModel.name}</Text>
                    <ChevronDown size={16} color="#666" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {messages.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        inverted
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={[styles.msgWrapper, item.sender === 'user' ? styles.userAlign : styles.aiAlign]}>
                                <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                                    <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
                                    <Text style={styles.timeText}>{item.time}</Text>
                                </View>
                            </View>
                        )}
                    />
                )}

                <View style={styles.inputSection}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask about schemes..."
                            placeholderTextColor="#666"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity 
                            style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
                            onPress={() => handleSend()}
                        >
                            <Send size={20} color="#000" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <Modal visible={showModelPicker} transparent animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowModelPicker(false)} />
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>Switch AI Assistant</Text>
                    {MODELS.map((m) => (
                        <TouchableOpacity 
                            key={m.id} 
                            style={styles.modelOption}
                            onPress={() => { setSelectedModel(m); setShowModelPicker(false); }}
                        >
                            <View style={styles.optionIconBox}><m.icon size={20} color="#EAB308" /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.optionText}>{m.name}</Text>
                                <Text style={styles.optionDesc}>{m.desc}</Text>
                            </View>
                            {selectedModel.id === m.id && <Check size={20} color="#EAB308" />}
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { 
        paddingVertical: 15, 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderBottomColor: '#1A1A1A' 
    },
    modelPill: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#161616', 
        paddingHorizontal: 14, 
        paddingVertical: 8, 
        borderRadius: 25, 
        gap: 8, 
        borderWidth: 1, 
        borderColor: '#333' 
    },
    modelPillText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    
    emptyContainer: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 30 
    },
    iconCircle: { 
        width: 72, 
        height: 72, 
        borderRadius: 24, 
        backgroundColor: '#161616', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 24, 
        borderWidth: 1, 
        borderColor: '#333' 
    },
    mainTitle: { 
        color: '#FFF', 
        fontSize: 26, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        textAlign: 'center' 
    },
    
    quickPromptContainer: { 
        width: '100%', 
        marginTop: 40 
    },
    promptHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 16 
    },
    promptHeaderText: { color: '#888', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { 
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        borderRadius: 15, 
        backgroundColor: '#161616', 
        borderWidth: 1, 
        borderColor: '#333' 
    },
    chipText: { color: '#EEE', fontSize: 14 },

    listContent: { padding: 16, paddingBottom: 20 },
    msgWrapper: { marginBottom: 20, width: '100%' },
    userAlign: { alignItems: 'flex-end' },
    aiAlign: { alignItems: 'flex-start' },
    bubble: { padding: 14, borderRadius: 20, maxWidth: '85%' },
    userBubble: { backgroundColor: '#EAB308', borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: '#1A1A1A', borderBottomLeftRadius: 4 },
    userText: { color: '#000', fontWeight: '600', fontSize: 15 },
    aiText: { color: '#F0F0F0', fontSize: 15, lineHeight: 22 },
    timeText: { fontSize: 10, color: '#666', marginTop: 6, alignSelf: 'flex-end' },

    inputSection: { 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        backgroundColor: '#000', 
        borderTopWidth: 1, 
        borderTopColor: '#1A1A1A' 
    },
    inputRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#161616', 
        borderRadius: 30, 
        padding: 6, 
        borderWidth: 1, 
        borderColor: '#333' 
    },
    textInput: { 
        flex: 1, 
        color: '#FFF', 
        paddingHorizontal: 16, 
        fontSize: 16, 
        maxHeight: 120 
    },
    sendButton: { 
        backgroundColor: '#EAB308', 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)' },
    modalContent: { 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        backgroundColor: '#161616', 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 24 
    },
    modalHandle: { 
        width: 40, 
        height: 4, 
        backgroundColor: '#333', 
        borderRadius: 2, 
        alignSelf: 'center', 
        marginBottom: 20 
    },
    modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 24 },
    modelOption: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 16, 
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    optionIconBox: { 
        width: 44, 
        height: 44, 
        borderRadius: 12, 
        backgroundColor: '#000', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    optionText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    optionDesc: { color: '#666', fontSize: 13, marginTop: 2 },
});