import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "../services/api";
import Card from "../components/Card";
import SummaryCard from "../components/SummaryCard";
import { formatCurrency, formatDate } from "../utils/format";
import Button from "../components/Button";
import { useToast } from "../context/ToastContext";

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
      value: item.income
    })),
    [categories]
  );

  const categoryExpenseData = useMemo(
    () => categories.filter((item) => item.expense > 0).map((item) => ({
      name: item.category,
      value: item.expense
    })),
    [categories]
  );

  const trendData = useMemo(
    () =>
      trends.map((item) => ({
        name: formatDate(item.period),
        income: item.income,
        expense: item.expense
      })),
    [trends]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-slate-500">Summary of your finance activity.</p>
        </div>
        <Button variant="outline" onClick={fetchAll}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard title="Total Income" value={formatCurrency(summary?.totalIncome)} accent="bg-leaf" />
          <SummaryCard title="Total Expense" value={formatCurrency(summary?.totalExpense)} accent="bg-red-500" />
          <SummaryCard title="Net Balance" value={formatCurrency(summary?.netBalance)} accent="bg-sea" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Income by category</h3>
              <p className="text-xs text-slate-500">Distribution of income sources.</p>
            </div>
          </div>
          <div className="mt-4 h-64">
            {categoryIncomeData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryIncomeData} dataKey="value" nameKey="name" outerRadius={90} fill="#22c55e" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No income data yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Expense by category</h3>
              <p className="text-xs text-slate-500">Where the money is going.</p>
            </div>
          </div>
          <div className="mt-4 h-64">
            {categoryExpenseData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryExpenseData} dataKey="value" nameKey="name" outerRadius={90} fill="#f97316" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">No expense data yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Monthly trends</h3>
            <p className="text-xs text-slate-500">Income vs expense over time.</p>
          </div>
        </div>
        <div className="mt-4 h-72">
          {trendData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-500">No trend data yet.</p>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold">Recent transactions</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="py-2">Category</th>
                <th>Type</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.length ? (
                recent.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-2 font-medium text-ink">{item.category}</td>
                    <td>{item.type}</td>
                    <td>{formatDate(item.date)}</td>
                    <td className="text-right font-semibold">{formatCurrency(item.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
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
