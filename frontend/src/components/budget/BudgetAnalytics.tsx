import { useState } from "react";
import { Transaction } from "@/types";
import { PieChart, BarChart3, AlertCircle } from "lucide-react";
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
  transactions = [], // Default to empty array
  selectedMonth,
}: BudgetAnalyticsProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // 1. Filter expenses for the specific selected month
  const monthExpenses = Array.isArray(transactions) 
    ? transactions.filter((t) => {
        const d = new Date(t.date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return monthKey === selectedMonth && t.type === "expense";
      })
    : [];

  // 2. Aggregate category totals
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: CATEGORY_COLORS[category.toLowerCase()] || "#64748B",
  }));

  // 3. Prepare 6-month historical data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });

    const total = Array.isArray(transactions) 
      ? transactions.reduce((sum, t) => {
          const td = new Date(t.date);
          const tKey = `${td.getFullYear()}-${String(td.getMonth() + 1).padStart(2, "0")}`;
          return tKey === monthKey && t.type === "expense" ? sum + t.amount : sum;
        }, 0)
      : 0;

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
      <div className="bg-card p-3 rounded-lg border border-border shadow-xl backdrop-blur-md">
        <p className="text-xs font-medium text-muted-foreground mb-1">{payload[0].name}</p>
        <p className="text-sm font-bold text-primary">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  };

  // ERROR/EMPTY STATE UI
  if (!transactions || categoryData.length === 0) {
    return (
      <div className="card-elevated p-8 flex flex-col items-center justify-center min-h-[350px] text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Data for {selectedMonth}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mt-2">
          We couldn't find any expense transactions for this period. Try adding some expenses first!
        </p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Spending Analysis</h3>
          <p className="text-xs text-muted-foreground">Detailed breakdown of your outflows</p>
        </div>

        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl border border-border">
          <button
            onClick={() => setChartType("pie")}
            className={`p-2 rounded-lg transition-all ${chartType === "pie" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <PieChart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`p-2 rounded-lg transition-all ${chartType === "bar" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <RechartsPie>
              <Pie 
                data={categoryData} 
                dataKey="value" 
                innerRadius={60} 
                outerRadius={85} 
                paddingAngle={5}
                animationBegin={0}
                animationDuration={1000}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36}/>
            </RechartsPie>
          ) : (
            <RechartsBar data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip cursor={{ fill: "hsl(var(--muted)/0.3)" }} content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={32} />
            </RechartsBar>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}