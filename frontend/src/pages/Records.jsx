import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Select from "../components/Select";
import api from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import { downloadCsv } from "../utils/download";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const emptyForm = {
  amount: "",
  type: "INCOME",
  category: "",
  date: "",
  notes: ""
};

const Records = () => {
  const { user } = useAuth();
  const { push } = useToast();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [filters, setFilters] = useState({ type: "", category: "", startDate: "", endDate: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const canWrite = user?.role === "ADMIN" || user?.role === "ANALYST";

  const fetchRecords = async (pageOverride = pagination.page) => {
    setLoading(true);
    try {
      const params = {
        page: pageOverride,
        limit: pagination.limit,
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        search: filters.search || undefined
      };
      const response = await api.get("/records", { params });
      setRecords(response.data?.data || []);
      setPagination(response.data?.pagination || { page: 1, limit: 10, totalPages: 1 });
    } catch (error) {
      push("Failed to load records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(1);
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = () => {
    fetchRecords(1);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setForm({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date ? record.date.slice(0, 10) : "",
      notes: record.notes || ""
    });
    setEditingId(record.id);
    setModalOpen(true);
  };

  const saveRecord = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount)
    };

    try {
      if (editingId) {
        await api.put(`/records/${editingId}`, payload);
        push("Record updated", "success");
      } else {
        await api.post("/records", payload);
        push("Record created", "success");
      }

      setModalOpen(false);
      fetchRecords();
    } catch (error) {
      push(error.response?.data?.message || "Failed to save record", "error");
    }
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/records/${id}`);
      push("Record deleted", "success");
      fetchRecords();
    } catch (error) {
      push("Failed to delete record", "error");
    }
  };

  const restoreRecord = async (id) => {
    try {
      await api.patch(`/records/${id}/restore`);
      push("Record restored", "success");
      fetchRecords();
    } catch (error) {
      push("Failed to restore record", "error");
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const params = {
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      };
      const response = await api.get("/records/export", { params, responseType: "text" });
      downloadCsv(response.data, "records.csv");
      push("CSV exported", "success");
    } catch (error) {
      push("Failed to export CSV", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Records</h2>
          <p className="text-sm text-slate-500">Manage income and expense entries.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={exporting}>
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
          {canWrite ? <Button onClick={openCreate}>Add Record</Button> : null}
        </div>
      </div>

      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          <Select label="Type" name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </Select>
          <Input label="Category" name="category" value={filters.category} onChange={handleFilterChange} />
          <Input label="Start Date" type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          <Input label="End Date" type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
          <Input label="Search" name="search" value={filters.search} onChange={handleFilterChange} />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </Card>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-500">Loading records...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2">Category</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length ? (
                  records.map((record) => (
                    <tr key={record.id} className="border-t border-slate-100">
                      <td className="py-2 font-medium text-ink">{record.category}</td>
                      <td>{record.type}</td>
                      <td>{formatDate(record.date)}</td>
                      <td className="text-right font-semibold">{formatCurrency(record.amount)}</td>
                      <td className="text-right">
                        {canWrite ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => openEdit(record)}>
                              Edit
                            </Button>
                            <Button variant="ghost" onClick={() => deleteRecord(record.id)}>
                              Delete
                            </Button>
                            {record.isDeleted ? (
                              <Button variant="ghost" onClick={() => restoreRecord(record.id)}>
                                Restore
                              </Button>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Read only</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchRecords(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchRecords(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Record" : "New Record"}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={saveRecord}>
          <Input label="Amount" name="amount" type="number" step="0.01" value={form.amount} onChange={handleFormChange} required />
          <Select label="Type" name="type" value={form.type} onChange={handleFormChange}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </Select>
          <Input label="Category" name="category" value={form.category} onChange={handleFormChange} required />
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleFormChange} required />
          <Input label="Notes" name="notes" value={form.notes} onChange={handleFormChange} className="md:col-span-2" />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Records;
