import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-sm text-slate-500">Account information.</p>
      </div>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-400">Name</p>
            <p className="text-sm font-semibold text-ink">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Email</p>
            <p className="text-sm font-semibold text-ink">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Role</p>
            <p className="text-sm font-semibold text-ink">{user?.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Status</p>
            <p className="text-sm font-semibold text-ink">{user?.isActive ? "Active" : "Inactive"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
