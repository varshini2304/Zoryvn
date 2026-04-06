import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { cn } from "../utils/cn";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Budget Form
  const [category, setCategory] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/budgets");
      setBudgets(res.data.data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets", { category, monthlyLimit: Number(monthlyLimit) });
      setCategory("");
      setMonthlyLimit("");
      fetchBudgets();
    } catch (err) {
      console.error("Failed to create budget:", err);
      alert(err.response?.data?.message || "Failed to create budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget limit?")) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error("Failed to delete budget:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Budgets</h2>
        <p className="text-sm text-slate-500">Set monthly spending limits for categories.</p>
      </div>

      <Card className="mb-6 p-6">
        <h3 className="mb-4 text-lg font-medium">New Budget Limit</h3>
        <form onSubmit={handleCreate} className="flex items-end gap-4 flex-wrap">
          <div className="w-48">
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Groceries"
              required
            />
          </div>
          <div className="w-48">
            <label className="mb-1 block text-sm font-medium text-slate-700">Monthly Limit</label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="100.00"
              required
            />
          </div>
          <Button type="submit">Set Limit</Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p className="text-slate-500">No budgets set up yet.</p>
        ) : (
          budgets.map((b) => {
            const percentage = Math.min((b.amountUsed / b.monthlyLimit) * 100, 100);
            return (
              <Card key={b.id} className="p-6 transition-all hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display font-semibold text-lg text-ink">{b.category}</h3>
                  <button onClick={() => handleDelete(b.id)} className="text-rose text-sm font-medium hover:underline focus:outline-none">
                    Delete
                  </button>
                </div>
                <div className="text-sm font-medium text-slate-500 mb-2">
                  <span className={b.isOverspent ? "text-rose" : "text-ink"}>
                    ${Number(b.amountUsed).toFixed(2)}
                  </span>
                  {" "}used of ${Number(b.monthlyLimit).toFixed(2)}
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      b.isOverspent ? "bg-rose" : "bg-ocean"
                    )}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Budgets;
