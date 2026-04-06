import { Outlet } from "react-router-dom";

export default function AppLayout({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <header>
        <h1>Tealuxe Admin</h1>
        <p>User: {user ? user.name || "Admin" : "Guest"}</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}