import axios from "axios";

const TOKEN_KEY = "finance_dashboard_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getErrorMessage = (error) => {
  return error.response?.data?.message || "Something went wrong";
};

export const loginUser = async (payload) => {
  try {
    const response = await api.post("/auth/login", payload);
    const token = response.data?.data?.token;

    if (!token) {
      throw new Error("Token not found in response");
    }

    setToken(token);
    return token;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchDashboardSummary = async () => {
  try {
    const response = await api.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchCategoryBreakdown = async () => {
  try {
    const response = await api.get("/dashboard/categories");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchRecords = async () => {
  try {
    const response = await api.get("/records");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createRecord = async (payload) => {
  try {
    const response = await api.post("/records", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export default api;
