import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import "../App.css";

export default function AppLayout({ user, onLogout }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Prevent scroll when sidebar is open (mobile UX)
  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* OVERLAY (mobile only) */}
      {sidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}

      {/* MAIN CONTENT */}
      <div className="app-content">

        <Header
          user={user}
          onLogout={onLogout}
          toggleSidebar={toggleSidebar}
        />

        <main className="main">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}