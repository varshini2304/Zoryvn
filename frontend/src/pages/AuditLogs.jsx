import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    action: "",
    entity: ""
  });

  const fetchLogs = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/audit-logs", {
        params: {
          page: currentPage,
          limit: 10,
          ...(filters.action && { action: filters.action }),
          ...(filters.entity && { entity: filters.entity })
        }
      });
      setLogs(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page, filters]);

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE": return "text-emerald-600 bg-emerald-50";
      case "UPDATE": return "text-blue-600 bg-blue-50";
      case "DELETE": return "text-red-600 bg-red-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Audit Logs</h2>
        <p className="text-sm text-slate-500">Track system activities and data changes.</p>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          className="rounded-lg border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-ocean focus:ring-ocean"
          value={filters.action}
          onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-500">Timestamp</th>
              <th className="px-4 py-3 font-medium text-slate-500">User ID</th>
              <th className="px-4 py-3 font-medium text-slate-500">Action</th>
              <th className="px-4 py-3 font-medium text-slate-500">Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">Loading logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No logs found.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{log.userId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.entity} <span className="text-xs text-slate-400">({log.entityId})</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-center">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
