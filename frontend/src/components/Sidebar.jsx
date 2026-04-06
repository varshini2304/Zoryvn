import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  UsersRound, 
  ShieldAlert, 
  LogOut,
  Landmark
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../utils/cn";

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Records", to: "/records", icon: Wallet }
  ];

  if (user?.role === "ADMIN" || user?.role === "ANALYST") {
    navItems.push({ label: "Budgets", to: "/budgets", icon: PieChart });
  }

  if (user?.role === "ADMIN") {
    navItems.push({ label: "Users", to: "/users", icon: UsersRound });
    navItems.push({ label: "Audit Logs", to: "/audit-logs", icon: ShieldAlert });
  }

  return (
    <aside className="glass-dark sticky top-0 hidden h-screen w-72 flex-col justify-between px-6 py-8 lg:flex">
      {/* Top brand section */}
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sea to-ocean shadow-soft-lg">
            <Landmark className="text-white" size={20} />
          </div>
          <div>
            <p className="nav-title text-xl font-bold tracking-tight text-white">Zorvyn</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Finance</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-ocean text-white shadow-soft" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                )
              }
            >
              <item.icon size={18} className="transition-transform group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom user section */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
            {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold text-white">{user?.name || "User"}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-700/50 pt-3">
          <span className="inline-flex rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {user?.role}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
