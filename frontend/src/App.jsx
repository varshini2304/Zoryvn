import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RecordsPage from "./pages/RecordsPage";
import Navigation from "./components/Navigation";
import { clearToken, getToken } from "./services/api";

const App = () => {
  const [token, setToken] = useState(() => getToken());
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    if (!token) {
      setActivePage("login");
      return;
    }

    setActivePage((currentPage) => (currentPage === "login" ? "dashboard" : currentPage));
  }, [token]);

  const handleLogin = (nextToken) => {
    setToken(nextToken);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    clearToken();
    setToken(null);
    setActivePage("login");
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Navigation activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />

      <main className="page-container">
        {activePage === "dashboard" ? <DashboardPage /> : null}
        {activePage === "records" ? <RecordsPage /> : null}
      </main>
    </div>
  );
};

export default App;
