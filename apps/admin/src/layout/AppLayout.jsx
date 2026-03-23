import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        {children}
      </main>
    </div>
  );
}