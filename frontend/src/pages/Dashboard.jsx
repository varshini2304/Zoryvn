import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  RefreshCw
} from "lucide-react";
import api from "../services/api";
import Card from "../components/Card";
import SummaryCard from "../components/SummaryCard";
import { formatCurrency, formatDate } from "../utils/format";
import Button from "../components/Button";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";

const COLORS_INCOME = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
const COLORS_EXPENSE = ["#f97316", "#fb923c", "#fdba74", "#fed7aa"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, categoryRes, trendRes, recentRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/categories"),
        api.get("/dashboard/trends?period=monthly"),
        api.get("/dashboard/recent")
      ]);
      setSummary(summaryRes.data);
      setCategories(categoryRes.data || []);
      setTrends(trendRes.data || []);
      setRecent(recentRes.data || []);
    } catch (error) {
      push("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const categoryIncomeData = useMemo(
    () => categories.filter((item) => item.income > 0).map((item) => ({
      name: item.category,
      value: Number(item.income)
    })).sort((a,b) => b.value - a.value),
    [categories]
  );

  const categoryExpenseData = useMemo(
    () => categories.filter((item) => item.expense > 0).map((item) => ({
      name: item.category,
      value: Number(item.expense)
    })).sort((a,b) => b.value - a.value),
    [categories]
  );

  const trendData = useMemo(
    () =>
      trends.map((item) => ({
        name: formatDate(item.period),
        income: Number(item.income),
        expense: Number(item.expense)
      })),
    [trends]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold tracking-tight text-ink">Overview</h2>
          <p className="text-sm text-slate-500">Your financial activity at a glance.</p>
        </div>
        <Button variant="outline" onClick={fetchAll} disabled={loading} className="gap-2 shrink-0">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-[120px] animate-pulse rounded-2xl bg-white shadow-soft" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard 
            title="Total Income" 
            value={formatCurrency(summary?.totalIncome)} 
            icon={ArrowUpRight} 
            accentClass="text-leaf bg-leaf/10" 
            animateDelay=""
          />
          <SummaryCard 
            title="Total Expense" 
            value={formatCurrency(summary?.totalExpense)} 
            icon={ArrowDownRight} 
            accentClass="text-ember bg-ember/10" 
            animateDelay="animation-delay-100"
          />
          <SummaryCard 
            title="Net Balance" 
            value={formatCurrency(summary?.netBalance)} 
            icon={Wallet} 
            accentClass="text-ocean bg-ocean/10" 
            animateDelay="animation-delay-200"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card animate className="flex flex-col">
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">Income Distribution</h3>
            <p className="text-xs text-slate-500">Where your earnings come from.</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            {categoryIncomeData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryIncomeData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryIncomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperClassName="custom-tooltip" formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-500">No income data available.</p>
              </div>
            )}
          </div>
        </Card>

        <Card animate className="flex flex-col">
          <div className="mb-6">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">Expense Distribution</h3>
            <p className="text-xs text-slate-500">How your money is spent.</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            {categoryExpenseData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryExpenseData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={3}
                    stroke="none"
                  >
                    {categoryExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperClassName="custom-tooltip" formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-500">No expense data available.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card animate>
        <div className="mb-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">Cash Flow Trends</h3>
          <p className="text-xs text-slate-500">Income vs expense over time.</p>
        </div>
        <div className="h-[350px]">
          {trendData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip wrapperClassName="custom-tooltip" formatter={(value) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Income"
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expense"
                  stroke="#f97316" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-sm text-slate-500">No trend data available.</p>
            </div>
          )}
        </div>
      </Card>

      <Card animate>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Your latest financial activity.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="rounded-l-lg px-4 py-3 font-semibold text-slate-600">Category</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Type</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                <th className="rounded-r-lg px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.length ? (
                recent.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3.5 font-medium text-ink">{item.category}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                        item.type === "INCOME" ? "bg-leaf/10 text-leaf" : "bg-ember/10 text-ember"
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{formatDate(item.date)}</td>
                    <td className={cn("px-4 py-3.5 text-right font-semibold", item.type === "INCOME" ? "text-leaf" : "text-ink")}>
                      {item.type === "INCOME" ? "+" : "-"}{formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                    No recent transactions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
