import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Records", to: "/records" }
  ];

  if (user?.role === "ADMIN" || user?.role === "ANALYST") {
    navItems.push({ label: "Budgets", to: "/budgets" });
  }

  if (user?.role === "ADMIN") {
    navItems.push({ label: "Users", to: "/users" });
    navItems.push({ label: "Audit Logs", to: "/audit-logs" });
  }

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
      <div className="mb-8">
        <p className="nav-title text-lg font-semibold">Finance Dashboard</p>
        <p className="text-xs text-slate-500">Role-based analytics</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white">
        <p className="text-sm font-semibold">Logged in</p>
        <p className="text-xs text-slate-300">{user?.email}</p>
        <p className="mt-2 inline-flex rounded-full bg-white/20 px-2 py-1 text-xs uppercase tracking-wide">
          {user?.role}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
