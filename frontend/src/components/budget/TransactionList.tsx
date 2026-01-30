import { useState } from "react";
import { Transaction, TransactionCategory } from "@/types";
import {
  Trash2,
  Utensils,
  Home,
  Car,
  GraduationCap,
  Heart,
  Briefcase,
  TrendingUp,
  MoreHorizontal,
  Filter,
} from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  selectedMonth: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, transaction: Partial<Transaction>) => void;
}

const categoryIcons: Record<TransactionCategory, React.ElementType> = {
  food: Utensils,
  rent: Home,
  travel: Car,
  education: GraduationCap,
  health: Heart,
  salary: Briefcase,
  investment: TrendingUp,
  other: MoreHorizontal,
};

const categoryColors: Record<TransactionCategory, string> = {
  food: "bg-orange-100 text-orange-700",
  rent: "bg-blue-100 text-blue-700",
  travel: "bg-purple-100 text-purple-700",
  education: "bg-yellow-100 text-yellow-700",
  health: "bg-pink-100 text-pink-700",
  salary: "bg-emerald-100 text-emerald-700",
  investment: "bg-cyan-100 text-cyan-700",
  other: "bg-gray-100 text-gray-700",
};

const categoryLabels: Record<TransactionCategory, string> = {
  food: "Food & Dining",
  rent: "Rent & Utilities",
  travel: "Travel & Transport",
  education: "Education",
  health: "Health & Medical",
  salary: "Salary",
  investment: "Investment Returns",
  other: "Other",
};

export function TransactionList({
  transactions,
  selectedMonth,
  onDelete,
}: TransactionListProps) {
  const [filterCategory, setFilterCategory] =
    useState<TransactionCategory | "all">("all");
  const [filterType, setFilterType] =
    useState<"all" | "income" | "expense">("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = transactions
    .filter((t) => {
      const date = new Date(t.date);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (month !== selectedMonth) return false;
      if (filterCategory !== "all" && t.category !== filterCategory)
        return false;
      if (filterType !== "all" && t.type !== filterType) return false;

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const categories = Object.keys(
    categoryIcons
  ) as TransactionCategory[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transactions</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length}{" "}
            {filteredTransactions.length === 1
              ? "entry"
              : "entries"}
          </p>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="card-elevated p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(["all", "income", "expense"] as const).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      filterType === type
                        ? "bg-card shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(
                  e.target.value as TransactionCategory | "all"
                )
              }
              className="px-3 py-1 text-xs bg-muted rounded-lg"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>

          {(filterType !== "all" ||
            filterCategory !== "all") && (
            <div className="flex gap-4 pt-2 border-t">
              {totalIncome > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Income
                  </p>
                  <p className="text-sm font-semibold text-success">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
              )}
              {totalExpense > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Expenses
                  </p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(totalExpense)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground card-elevated">
          No transactions found
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((t) => {
            const Icon = categoryIcons[t.category];

            return (
              <div
                key={t.id}
                className="card-interactive p-3 flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[t.category]}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {categoryLabels[t.category]}
                  </p>
                  {t.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      {t.notes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(t.date)}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    t.type === "income"
                      ? "text-success"
                      : ""
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </p>

                <button
                  onClick={() => onDelete(t.id)}
                  className="p-2 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}