import { useEffect, useState } from "react";
import { createRecord, fetchRecords } from "../services/api";

const initialForm = {
  amount: "",
  type: "INCOME",
  category: "",
  date: ""
};

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchRecords();
      setRecords(response.data || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await createRecord({
        ...form,
        amount: Number(form.amount)
      });

      setForm(initialForm);
      setSuccessMessage("Record added successfully.");
      await loadRecords();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-grid">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Add Record</h2>

        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Type</span>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="INCOME">INCOME</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </label>

        <label className="field">
          <span>Category</span>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {successMessage ? <p className="success-text">{successMessage}</p> : null}

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? "Saving..." : "Add Record"}
        </button>
      </form>

      <div className="card">
        <h2>Records</h2>
        {loading ? <p>Loading records...</p> : null}
        {!loading && records.length === 0 ? <p>No records found.</p> : null}

        <ul className="list">
          {records.map((record) => (
            <li key={record.id} className="list-row">
              <div>
                <strong>{record.category}</strong>
                <p>
                  {record.type} | {new Date(record.date).toLocaleDateString()}
                </p>
              </div>
              <span>{formatCurrency(record.amount)}</span>
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

export default RecordsPage;
