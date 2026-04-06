import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
    <div className="min-h-screen bg-mist text-ink">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex w-full flex-col">
          <Topbar />
          <main className="flex-1 px-6 py-6 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
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
