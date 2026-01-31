// BudgetManager.tsx
import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types";
import { BudgetOverview } from "./BudgetOverview";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { BudgetAnalytics } from "./BudgetAnalytics";
import { Plus, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function BudgetManager() {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // --- 1. Load Data with Axios for better error handling ---
  const fetchBudgetData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/budget`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Based on your response: { success: true, data: { transactions: [...] } }
      if (res.data.success && res.data.data?.transactions) {
        setTransactions(res.data.data.transactions);
        setBudgetError(null);
      } else if (res.data.success && Array.isArray(res.data.data)) {
        // Fallback if data is a direct array
        setTransactions(res.data.data);
        setBudgetError(null);
      } else {
        setTransactions([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch budget data:", err);
      if (err.response?.status === 404) {
        setBudgetError("Finances endpoint not found on server.");
      } else {
        setBudgetError("Received invalid response from server.");
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // --- Listen for budget updates from chat ---
  useEffect(() => {
    const handleBudgetUpdate = () => {
      console.log("Budget update signal received...");
      fetchBudgetData();
    };
    window.addEventListener('budgetUpdated', handleBudgetUpdate);
    return () => window.removeEventListener('budgetUpdated', handleBudgetUpdate);
  }, [fetchBudgetData]);

  // --- 2. Add Transaction ---
  const handleAddTransaction = async (transactionData: Omit<Transaction, "id" | "date">) => {
    try {
      const newTx: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        date: new Date() // Ensure date is a Date object
      };

      const updatedList: Transaction[] = [...transactions, newTx];

      const res = await axios.post(`${API_URL}/api/v1/budget`,
        { transactions: updatedList },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setTransactions(updatedList);
        setShowForm(false);
      }
    } catch (err) {
      alert("Failed to sync new transaction with server.");
    }
  };

  // --- 3. Delete Transaction ---
  const handleDeleteTransaction = async (id: string) => {
    const updatedList = transactions.filter((t) => t.id !== id);
    try {
      const res = await axios.post(`${API_URL}/api/v1/budget`, 
        { transactions: updatedList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setTransactions(updatedList);
    } catch (err) {
      console.error("Delete failed on server");
    }
  };

  // Helper for navigating months
  const navigateMonth = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number);
    let newDate = new Date(year, month - 1 + (direction === "next" ? 1 : -1));
    setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = (() => {
    const [year, month] = selectedMonth.split("-");
    return new Date(+year, +month - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  })();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Fetching your latest data...</p>
      </div>
    );
  }

  return (
    <div className="container-app py-6 space-y-6">
      {budgetError ? (
        <div className="card-elevated p-6 text-center space-y-4 border-destructive/20">
          <RefreshCw className="w-6 h-6 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">Budget Sync Error</h3>
          <p className="text-muted-foreground">{budgetError}</p>
          <button onClick={fetchBudgetData} className="btn-primary">Retry Sync</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <h2 className="text-lg font-semibold">{monthLabel}</h2>
            <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-muted rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>

          <BudgetOverview transactions={transactions} selectedMonth={selectedMonth} />
          <BudgetAnalytics transactions={transactions} selectedMonth={selectedMonth} />

          {showForm ? (
            <TransactionForm onAdd={handleAddTransaction} onClose={() => setShowForm(false)} />
          ) : (
            <button onClick={() => setShowForm(true)} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Transaction
            </button>
          )}

          <TransactionList
            transactions={transactions}
            selectedMonth={selectedMonth}
            onDelete={handleDeleteTransaction}
            onUpdate={() => {}}
          />
        </>
      )}
    </div>
  );
}