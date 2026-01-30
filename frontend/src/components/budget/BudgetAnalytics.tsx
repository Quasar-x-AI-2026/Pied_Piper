import { useState } from "react";
import { Transaction } from "@/types";
import { PieChart, BarChart3 } from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface BudgetAnalyticsProps {
  transactions: Transaction[];
  selectedMonth: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "#6366F1",
  rent: "#06B6D4",
  travel: "#A855F7",
  education: "#14B8A6",
  health: "#22C55E",
  salary: "#10B981",
  investment: "#F59E0B",
  other: "#64748B",
};

export function BudgetAnalytics({
  transactions,
  selectedMonth,
}: BudgetAnalyticsProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const monthExpenses = transactions.filter((t) => {
    const d = new Date(t.date);
    const monthKey = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;

    return monthKey === selectedMonth && t.type === "expense";
  });
  const categoryTotals: Record<string, number> = {};

  monthExpenses.forEach((t) => {
    categoryTotals[t.category] =
      (categoryTotals[t.category] || 0) + t.amount;
  });

  const categoryData = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: amount,
      color: CATEGORY_COLORS[category] || "#64748B",
    })
  );
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);

    const monthKey = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;

    const label = d.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    const total = transactions.reduce((sum, t) => {
      const td = new Date(t.date);
      const tKey = `${td.getFullYear()}-${String(
        td.getMonth() + 1
      ).padStart(2, "0")}`;

      if (tKey === monthKey && t.type === "expense") {
        return sum + t.amount;
      }
      return sum;
    }, 0);

    monthlyData.push({ name: label, amount: total });
  }
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-card p-3 rounded-lg border shadow">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-lg font-bold text-primary">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  };

  if (categoryData.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4">
          Expense Analytics
        </h3>
        <div className="text-center py-12 text-muted-foreground">
          No expense data available
        </div>
      </div>
    );
  }
  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Expense Analytics</h3>

        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setChartType("pie")}
            className={chartType === "pie" ? "bg-card shadow px-3 py-1.5 rounded" : "px-3 py-1.5"}
          >
            <PieChart className="w-4 h-4" />
          </button>

          <button
            onClick={() => setChartType("bar")}
            className={chartType === "bar" ? "bg-card shadow px-3 py-1.5 rounded" : "px-3 py-1.5"}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-[320px]">
        {chartType === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Pie data={categoryData} dataKey="value" outerRadius={100}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBar data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" />
            </RechartsBar>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}