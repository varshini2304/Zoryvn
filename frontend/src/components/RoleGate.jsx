import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleGate = ({ allowed, children }) => {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGate;
