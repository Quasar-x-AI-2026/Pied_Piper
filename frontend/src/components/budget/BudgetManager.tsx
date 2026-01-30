import { useState } from "react";
import { Transaction } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BudgetOverview } from "./BudgetOverview";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { BudgetAnalytics } from "./BudgetAnalytics";
import { Plus, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

export function BudgetManager() {
  const [transactions, setTransactions] =
    useLocalStorage<Transaction[]>("finguard-transactions", []);

  const [showForm, setShowForm] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const monthLabel = (() => {
    const [year, month] = selectedMonth.split("-");
    return new Date(+year, +month - 1).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  })();

  const getMonthKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const handleAddTransaction = (
    transaction: Omit<Transaction, "id" | "date">
  ) => {
    const [year, month] = selectedMonth.split("-").map(Number);

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date(year, month - 1, new Date().getDate()),
    };

    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTransaction = (
    id: string,
    updates: Partial<Transaction>
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const [year, month] = selectedMonth.split("-").map(Number);
    let newMonth = month + (direction === "next" ? 1 : -1);
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };
  const monthTransactions = transactions.filter(
    (t) => getMonthKey(new Date(t.date)) === selectedMonth
  );

  const income = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthTransactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  let insight: string | null = null;

  if (income > 0 && totalExpenses > income * 0.9) {
    insight =
      "Your expenses are close to your income. Consider reviewing non-essential spending.";
  } else if (income > 0 && totalExpenses < income * 0.5) {
    insight =
      "Great savings rate! You may be eligible for saving-linked government schemes.";
  } else {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((t) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (topCategory && topCategory[1] > totalExpenses * 0.4) {
      insight = `${topCategory[0][0].toUpperCase() +
        topCategory[0].slice(1)} accounts for ${Math.round(
        (topCategory[1] / totalExpenses) * 100
      )}% of your expenses this month.`;
    }
  }
  return (
    <div className="container-app py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold">{monthLabel}</h2>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <BudgetOverview
        transactions={transactions}
        selectedMonth={selectedMonth}
      />

      {insight && (
        <div className="flex gap-3 p-4 bg-secondary rounded-xl border">
          <Lightbulb className="w-5 h-5 text-accent mt-0.5" />
          <p className="text-sm">{insight}</p>
        </div>
      )}

      <BudgetAnalytics
        transactions={transactions}
        selectedMonth={selectedMonth}
      />

      {showForm ? (
        <TransactionForm
          onAdd={handleAddTransaction}
          onClose={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full">
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      )}

      <TransactionList
        transactions={transactions}
        selectedMonth={selectedMonth}
        onDelete={handleDeleteTransaction}
        onUpdate={handleUpdateTransaction}
      />

      <p className="text-center text-xs text-muted-foreground pt-4">
        All data is stored locally on your device.
      </p>
    </div>
  );
}