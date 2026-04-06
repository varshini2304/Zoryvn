import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:px-10">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
        <h1 className="text-xl font-semibold text-ink">{user?.name || "Dashboard"}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 md:inline-flex">
          {user?.email}
        </span>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
