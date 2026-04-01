import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { fetchCategoryBreakdown, fetchDashboardSummary } from "../services/api";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [summaryData, categoryData] = await Promise.all([
          fetchDashboardSummary(),
          fetchCategoryBreakdown()
        ]);

        setSummary(summaryData);
        setCategories(categoryData);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="card">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="card error-text">{error}</div>;
  }

  return (
    <section className="page-grid">
      <div className="summary-grid">
        <SummaryCard label="Total Income" value={formatCurrency(summary?.totalIncome || 0)} />
        <SummaryCard label="Total Expense" value={formatCurrency(summary?.totalExpense || 0)} />
        <SummaryCard label="Net Balance" value={formatCurrency(summary?.netBalance || 0)} />
      </div>

      <div className="card">
        <h2>Category Breakdown</h2>
        {categories.length === 0 ? <p>No category data found.</p> : null}

        <ul className="list">
          {categories.map((category) => (
            <li key={category.category} className="list-row">
              <div>
                <strong>{category.category}</strong>
                <p>
                  Income: {formatCurrency(category.income)} | Expense:{" "}
                  {formatCurrency(category.expense)}
                </p>
              </div>
              <span>{formatCurrency(category.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
};

export default DashboardPage;
