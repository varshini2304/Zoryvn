const Navigation = ({ activePage, onNavigate, onLogout }) => {
  return (
    <header className="topbar">
      <div>
        <h1>Finance Dashboard</h1>
        <p>Minimal frontend for backend API integration</p>
      </div>

      <nav className="nav-actions">
        <button
          type="button"
          className={activePage === "dashboard" ? "nav-button active" : "nav-button"}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>
        <button
          type="button"
          className={activePage === "records" ? "nav-button active" : "nav-button"}
          onClick={() => onNavigate("records")}
        >
          Records
        </button>
        <button type="button" className="nav-button logout" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navigation;
