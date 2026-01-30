import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import { BudgetOverview } from "./BudgetOverview";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { BudgetAnalytics } from "./BudgetAnalytics";
import { Plus, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export function BudgetManager() {
  const { token } = useAuth();
  console.log("BudgetManager token:", token);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // --- 1. Load Data ---
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/v1/budget`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setBudgetError("Budget feature is not available (backend endpoint missing).");
            setTransactions([]);
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        let data;
        try {
          data = await res.json();
          console.log("Fetched budget data:", data.data.transactions);
        } catch (jsonErr) {
          setBudgetError("Received invalid response from server.");
          setTransactions([]);
          return;
        }

        // Transform backend data to transactions
        if (data && data.data.transactions) {
          console.log("Transforming backend budget data to transactions:", data.data.transactions);
          setTransactions(data.data.transactions);
        }
        setBudgetError(null);
      } catch (err) {
        console.error("Failed to fetch budget data:", err);
        setBudgetError("Failed to fetch budget data.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBudgetData();
  }, [token]);

  // --- Listen for budget updates from chat ---
  useEffect(() => {
    const handleBudgetUpdate = () => {
      console.log("Budget update event received, refreshing data...");
      // Refetch budget data
      const fetchBudgetData = async () => {
        try {
          const res = await fetch(`${API_URL}/api/v1/budget`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.transactions) {
              setTransactions(data.transactions);
            }
          }
        } catch (err) {
          console.error("Failed to refresh budget data:", err);
        }
      };

      if (token) fetchBudgetData();
    };

    window.addEventListener('budgetUpdated', handleBudgetUpdate);
    
    return () => {
      window.removeEventListener('budgetUpdated', handleBudgetUpdate);
    };
  }, [token]);

  // --- 2. Add Transaction ---
  const handleAddTransaction = async (transactionData: Omit<Transaction, "id" | "date">) => {
    try {
      const newTx = { 
        ...transactionData, 
        id: Date.now().toString(), 
        date: new Date() 
      };
      
      const updatedList = [...transactions, newTx];

      const res = await fetch(`${API_URL}/api/v1/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions: updatedList }),
      });

      if (res.ok) {
        setTransactions(updatedList);
        setShowForm(false);
      }
    } catch (err) {
      alert("Failed to sync with server.");
    }
  };

  // --- 3. Delete Transaction ---
  const handleDeleteTransaction = async (id: string) => {
    const updatedList = transactions.filter((t) => t.id !== id);
    try {
      const res = await fetch(`${API_URL}/api/v1/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions: updatedList }),
      });
      if (res.ok) setTransactions(updatedList);
    } catch (err) {
      console.error("Delete failed");
    }
  };

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
        <p className="text-muted-foreground">Syncing your finances...</p>
      </div>
    );
  }

  if (budgetError) {
    return (
      <div className="container-app py-6">
        <div className="card-elevated p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold">Budget Data Unavailable</h3>
          <p className="text-muted-foreground">{budgetError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-muted rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
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
    </div>
  );
}