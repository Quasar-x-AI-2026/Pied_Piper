import { Transaction } from "@/types";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface BudgetOverviewProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export function BudgetOverview({ transactions, selectedMonth }: BudgetOverviewProps) {
  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
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
  const monthLabel = new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Monthly Overview</h2>
        <span className="text-sm text-muted-foreground">{monthLabel}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card from-emerald-50 to-emerald-100/50 border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-700 uppercase">
                Total Income
              </p>
              <p className="text-2xl font-bold text-emerald-900">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="stat-card from-rose-50 to-rose-100/50 border border-rose-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-700 uppercase">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-rose-900">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <TrendingDown className="w-5 h-5 text-rose-600" />
          </div>
        </div>
        <div className="stat-card from-primary/5 to-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-primary uppercase">
                Savings
              </p>
              <p
                className={`text-2xl font-bold ${
                  savings >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {formatCurrency(savings)}
              </p>
            </div>
            <PiggyBank className="w-5 h-5 text-primary" />
          </div>

          {totalIncome > 0 && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Savings rate</span>
                <span className="font-medium">{savingsPercentage}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${Math.max(0, Math.min(100, savingsPercentage))}%`,
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