import { useLocation } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

const Topbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Format the current route name cleanly
  const pageName = location.pathname.split("/").pop() || "Dashboard";
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace("-", " ");

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/50 bg-mist/80 px-4 py-4 backdrop-blur-xl md:px-8 lg:px-12">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (visual only for now without full mobile nav context) */}
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 lg:hidden">
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Section</p>
          <h1 className="nav-title text-xl font-bold text-ink">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold text-ink">{user?.name || "Welcome"}</p>
          <p className="text-xs text-slate-500">{user?.role} Access</p>
        </div>
        
        {/* Responsive logout button. Icon only on mobile */}
        <Button variant="outline" className="hidden border-slate-200/50 sm:inline-flex" onClick={logout}>
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
        
        <button onClick={logout} className="rounded-lg p-2 text-slate-500 hover:bg-rose hover:text-white sm:hidden">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
