import { createContext, useCallback, useMemo, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  const raw = localStorage.getItem("fd_user");
  return raw ? JSON.parse(raw) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem("fd_token"));

  const login = useCallback(async (payload) => {
    const response = await api.post("/auth/login", payload);
    const authData = response.data?.data;

    if (!authData?.token) {
      throw new Error("Token not found");
    }

    localStorage.setItem("fd_token", authData.token);
    localStorage.setItem("fd_user", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);

    return authData.user;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await api.post("/auth/register", payload);
    const authData = response.data?.data;

    if (!authData?.token) {
      throw new Error("Token not found");
    }

    localStorage.setItem("fd_token", authData.token);
    localStorage.setItem("fd_user", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);

    return authData.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("fd_token");
    localStorage.removeItem("fd_user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
