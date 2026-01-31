import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Modal,
    StatusBar,
    Dimensions
} from 'react-native';
import { 
    TrendingUp, 
    TrendingDown, 
    PiggyBank, 
    Plus, 
    ChevronLeft, 
    ChevronRight, 
    Lightbulb,
    Utensils,
    Home,
    Car,
    GraduationCap,
    Heart,
    Briefcase,
    MoreHorizontal,
    X,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

type TransactionCategory = 'food' | 'rent' | 'travel' | 'education' | 'health' | 'salary' | 'investment' | 'other';

interface Transaction {
    id: string;
    amount: number;
    category: TransactionCategory;
    type: 'income' | 'expense';
    date: Date;
}

const CATEGORY_CONFIG: Record<TransactionCategory, { label: string; icon: any; color: string; bgColor: string }> = {
    food: { label: 'Food', icon: Utensils, color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
    rent: { label: 'Rent', icon: Home, color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
    travel: { label: 'Travel', icon: Car, color: '#A855F7', bgColor: 'rgba(168, 85, 247, 0.15)' },
    education: { label: 'Education', icon: GraduationCap, color: '#EAB308', bgColor: 'rgba(234, 179, 8, 0.15)' },
    health: { label: 'Health', icon: Heart, color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
    salary: { label: 'Salary', icon: Briefcase, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
    investment: { label: 'Invest', icon: TrendingUp, color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.15)' },
    other: { label: 'Other', icon: MoreHorizontal, color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.15)' },
};

export function BudgetScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', amount: 8500, category: 'food', type: 'expense', date: new Date() },
        { id: '2', amount: 50000, category: 'salary', type: 'income', date: new Date() },
    ]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showForm, setShowForm] = useState(false);

    const [newAmount, setNewAmount] = useState('');
    const [newType, setNewType] = useState<'income' | 'expense'>('expense');
    const [newCategory, setNewCategory] = useState<TransactionCategory>('food');

    const stats = useMemo(() => {
        const filtered = transactions.filter(t => 
            t.date.getMonth() === selectedDate.getMonth() && 
            t.date.getFullYear() === selectedDate.getFullYear()
        );
        const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expense, savings: income - expense, filtered };
    }, [transactions, selectedDate]);

    const handleSave = () => {
        if (!newAmount) return;
        const entry: Transaction = {
            id: Date.now().toString(),
            amount: parseFloat(newAmount),
            type: newType,
            category: newType === 'income' ? 'salary' : newCategory,
            date: new Date(selectedDate), 
        };
        setTransactions([entry, ...transactions]);
        setNewAmount('');
        setShowForm(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* 1. Header Navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    const d = new Date(selectedDate);
                    d.setMonth(d.getMonth() - 1);
                    setSelectedDate(d);
                }}><ChevronLeft color="#666" /></TouchableOpacity>
                <Text style={styles.monthText}>
                    {selectedDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => {
                    const d = new Date(selectedDate);
                    d.setMonth(d.getMonth() + 1);
                    setSelectedDate(d);
                }}><ChevronRight color="#666" /></TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
                
                {/* 2. BIG CENTRAL PIE CHART AREA */}
                <View style={styles.chartSection}>
                    <View style={styles.pieContainer}>
                        {/* Outer Visualization Rings */}
                        <View style={[styles.ringBase, { borderColor: '#10B981', opacity: 0.1, borderWidth: 20 }]} />
                        <View style={[styles.ringBase, { borderColor: '#EF4444', opacity: 0.3, borderWidth: 10, width: 180, height: 180, borderRadius: 90 }]} />
                        
                        {/* Central Data Display */}
                        <View style={styles.centerTextContainer}>
                            <View style={styles.dataRow}><TrendingUp size={14} color="#10B981" /><Text style={styles.incomeVal}>₹{stats.income.toLocaleString()}</Text></View>
                            <View style={styles.dataRow}><TrendingDown size={14} color="#EF4444" /><Text style={styles.spentVal}>₹{stats.expense.toLocaleString()}</Text></View>
                            <View style={styles.divider} />
                            <Text style={styles.savingsVal}>₹{stats.savings.toLocaleString()}</Text>
                            <Text style={styles.savingsLabel}>SAVED</Text>
                        </View>
                    </View>
                </View>

                {/* 3. AI INSIGHT CARD */}
                <View style={styles.insightCard}>
                    <Lightbulb size={20} color="#EAB308" />
                    <Text style={styles.insightText}>
                        Your savings rate is {stats.income > 0 ? Math.round((stats.savings/stats.income)*100) : 0}%. 
                        {stats.savings > 0 ? " Excellent job staying under budget!" : " Try reducing food expenses."}
                    </Text>
                </View>

                {/* 4. TRANSACTION HISTORY */}
                <Text style={styles.sectionHeader}>History</Text>
                {stats.filtered.map(item => (
                    <View key={item.id} style={styles.transCard}>
                        <View style={[styles.iconCircle, { backgroundColor: CATEGORY_CONFIG[item.category].bgColor }]}>
                            {React.createElement(CATEGORY_CONFIG[item.category].icon, { size: 20, color: CATEGORY_CONFIG[item.category].color })}
                        </View>
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={styles.transTitle}>{CATEGORY_CONFIG[item.category].label}</Text>
                            <Text style={styles.transDate}>{item.date.toDateString()}</Text>
                        </View>
                        <Text style={[styles.transAmt, { color: item.type === 'income' ? '#10B981' : '#FFF' }]}>
                            {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}><Plus color="#000" size={32} /></TouchableOpacity>

            {/* 5. ADD TRANSACTION MODAL */}
            <Modal visible={showForm} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Entry</Text>
                            <TouchableOpacity onPress={() => setShowForm(false)} style={styles.closeBtn}><X color="#FFF" /></TouchableOpacity>
                        </View>

                        <TextInput 
                            style={styles.amountInput} 
                            placeholder="₹0" 
                            placeholderTextColor="#333" 
                            keyboardType="numeric" 
                            value={newAmount} 
                            onChangeText={setNewAmount} 
                            autoFocus
                        />

                        <View style={styles.typeTabs}>
                            <TouchableOpacity onPress={() => setNewType('expense')} style={[styles.tab, newType === 'expense' && styles.tabActiveExp]}><Text style={styles.tabText}>Expense</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setNewType('income')} style={[styles.tab, newType === 'income' && styles.tabActiveInc]}><Text style={styles.tabText}>Income</Text></TouchableOpacity>
                        </View>

                        {newType === 'expense' && (
                            <View style={styles.categoryGrid}>
                                {(Object.keys(CATEGORY_CONFIG) as TransactionCategory[]).map(c => {
                                    const Icon = CATEGORY_CONFIG[c].icon;
                                    const isSelected = newCategory === c;
                                    return (
                                        <TouchableOpacity key={c} onPress={() => setNewCategory(c)} style={[styles.catBtn, isSelected && { borderColor: CATEGORY_CONFIG[c].color, backgroundColor: CATEGORY_CONFIG[c].bgColor }]}>
                                            <Icon size={20} color={isSelected ? CATEGORY_CONFIG[c].color : '#666'} />
                                            <Text style={[styles.catLabel, isSelected && { color: CATEGORY_CONFIG[c].color }]}>{CATEGORY_CONFIG[c].label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Save Transaction</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    monthText: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    scrollBody: { paddingBottom: 100 },

    // Pie Chart Styling
    chartSection: { alignItems: 'center', marginVertical: 30 },
    pieContainer: { width: 240, height: 240, justifyContent: 'center', alignItems: 'center' },
    ringBase: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 15 },
    centerTextContainer: { alignItems: 'center' },
    dataRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
    incomeVal: { color: '#10B981', fontWeight: 'bold', fontSize: 14 },
    spentVal: { color: '#EF4444', fontWeight: 'bold', fontSize: 14 },
    divider: { height: 1, width: 60, backgroundColor: '#222', marginVertical: 10 },
    savingsVal: { color: '#FFF', fontSize: 28, fontWeight: '900' },
    savingsLabel: { color: '#666', fontSize: 10, letterSpacing: 2, fontWeight: 'bold' },

    insightCard: { flexDirection: 'row', backgroundColor: '#111', margin: 16, padding: 16, borderRadius: 20, alignItems: 'center', gap: 15, borderWidth: 1, borderColor: '#222' },
    insightText: { color: '#AAA', fontSize: 13, flex: 1, lineHeight: 18 },

    sectionHeader: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 20, marginBottom: 15 },
    transCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#0A0A0A', marginHorizontal: 16, borderRadius: 24, marginBottom: 10, borderWidth: 1, borderColor: '#161616' },
    iconCircle: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    transTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    transDate: { color: '#444', fontSize: 11, marginTop: 2 },
    transAmt: { fontSize: 17, fontWeight: 'bold' },

    fab: { position: 'absolute', bottom: 30, right: 25, backgroundColor: '#EAB308', width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', elevation: 10 },

    // Modal UI
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.96)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#000', padding: 24, borderTopLeftRadius: 40, borderTopRightRadius: 40, minHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    closeBtn: { padding: 8, backgroundColor: '#111', borderRadius: 12 },
    amountInput: { color: '#FFF', fontSize: 64, fontWeight: 'bold', textAlign: 'center', marginVertical: 30 },
    typeTabs: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 16, padding: 4, marginBottom: 25 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    tabActiveExp: { backgroundColor: '#EF4444' },
    tabActiveInc: { backgroundColor: '#10B981' },
    tabText: { color: '#FFF', fontWeight: 'bold' },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    catBtn: { width: (width - 80) / 3, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#222', alignItems: 'center', gap: 8 },
    catLabel: { color: '#666', fontSize: 11, fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#EAB308', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 30 },
    saveBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});