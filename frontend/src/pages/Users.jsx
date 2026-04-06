import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Select from "../components/Select";
import { useToast } from "../context/ToastContext";

const Users = () => {
  const { push } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data?.data || []);
    } catch (error) {
      push("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      push("Role updated", "success");
      fetchUsers();
    } catch (error) {
      push("Failed to update role", "error");
    }
  };

  const updateStatus = async (id, isActive) => {
    try {
      await api.patch(`/users/${id}/status`, { isActive });
      push("Status updated", "success");
      fetchUsers();
    } catch (error) {
      push("Failed to update status", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Users</h2>
        <p className="text-sm text-slate-500">Admin-only user management.</p>
      </div>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="py-2 font-medium text-ink">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Select value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="VIEWER">VIEWER</option>
                      </Select>
                    </td>
                    <td>
                      <Button
                        variant={user.isActive ? "outline" : "primary"}
                        onClick={() => updateStatus(user.id, !user.isActive)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;
