import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Records from "./pages/Records";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import AuditLogs from "./pages/AuditLogs";
import Budgets from "./pages/Budgets";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGate from "./components/RoleGate";
import { useAuth } from "./hooks/useAuth";

const AppLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-mist text-ink selection:bg-ocean/20 selection:text-ocean">
      {/* Premium ambient background mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-sea/10 blur-[100px]" />
        <div className="absolute -right-[5%] top-[20%] h-[30%] w-[30%] rounded-full bg-leaf/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <div className="flex w-full flex-col lg:pl-0">
          <Topbar />
          <main className="flex-1 animate-fade-in px-4 py-6 md:px-8 lg:px-12">{children}</main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Records />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleGate allowed={["ADMIN"]}>
              <AppLayout>
                <Users />
              </AppLayout>
            </RoleGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <RoleGate allowed={["ADMIN", "ANALYST"]}>
              <AppLayout>
                <Budgets />
              </AppLayout>
            </RoleGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute>
            <RoleGate allowed={["ADMIN"]}>
              <AppLayout>
                <AuditLogs />
              </AppLayout>
            </RoleGate>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
