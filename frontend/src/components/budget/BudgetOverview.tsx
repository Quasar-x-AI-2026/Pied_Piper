import { Transaction } from "@/types";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface BudgetOverviewProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export function BudgetOverview({
  transactions,
  selectedMonth,
}: BudgetOverviewProps) {
  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const month = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    return month === selectedMonth;
  });

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;

  const savingsPercentage =
    totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const [year, month] = selectedMonth.split("-");
  const monthLabel = new Date(+year, +month - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Monthly Overview
        </h2>
        <span className="text-sm text-muted-foreground">
          {monthLabel}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* INCOME */}
        <div className="
          rounded-2xl
          p-5
          bg-gradient-to-br from-emerald-500/10 to-transparent
          border border-emerald-500/20
          shadow-[0_8px_30px_rgba(16,185,129,0.15)]
        ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-400 uppercase">
                Total Income
              </p>
              <p className="text-2xl font-bold text-emerald-300">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* EXPENSE */}
        <div className="
          rounded-2xl
          p-5
          bg-gradient-to-br from-rose-500/10 to-transparent
          border border-rose-500/20
          shadow-[0_8px_30px_rgba(244,63,94,0.15)]
        ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-400 uppercase">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-rose-300">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <TrendingDown className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        {/* SAVINGS */}
        <div className="
          rounded-2xl
          p-5
          bg-gradient-to-br from-primary/15 to-transparent
          border border-primary/25
          shadow-[0_8px_30px_rgba(99,102,241,0.2)]
        ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-primary/80 uppercase">
                Savings
              </p>
              <p
                className={`text-2xl font-bold ${
                  savings >= 0
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {formatCurrency(savings)}
              </p>
            </div>
            <PiggyBank className="w-6 h-6 text-primary" />
          </div>

          {totalIncome > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Savings rate
                </span>
                <span className="font-medium">
                  {savingsPercentage}%
                </span>
              </div>

              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, savingsPercentage)
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
