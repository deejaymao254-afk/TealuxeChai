import { useEffect, useState } from "react";
import "./transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // MOCK API (replace with backend later)
  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        {
          id: "TXN-001",
          customer: "John Doe",
          amount: 1200,
          method: "M-PESA",
          status: "completed",
          date: "2026-03-20",
        },
        {
          id: "TXN-002",
          customer: "Jane Smith",
          amount: 850,
          method: "Card",
          status: "pending",
          date: "2026-03-21",
        },
        {
          id: "TXN-003",
          customer: "Michael R",
          amount: 430,
          method: "Cash",
          status: "failed",
          date: "2026-03-22",
        },
      ];

      setTransactions(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // FILTER
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.customer.toLowerCase().includes(search.toLowerCase()) ||
      txn.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || txn.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="transactions-loading">Loading transactions...</div>;
  }

  return (
    <div className="transactions-page">

      {/* HEADER */}
      <div className="transactions-header">
        <h2>Transactions</h2>

        <div className="transactions-controls">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="transactions-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.id}</td>
                <td>{txn.customer}</td>
                <td>KES {txn.amount}</td>
                <td>{txn.method}</td>
                <td>
                  <span className={`status ${txn.status}`}>
                    {txn.status}
                  </span>
                </td>
                <td>{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}