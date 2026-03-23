import { useEffect, useState } from "react";
import "../App.css";

export default function Analytics() {
  const [sales, setSales] = useState([50, 65, 80, 70, 95, 100, 85]);
  
  useEffect(() => {
    // Animate small sales chart
    const interval = setInterval(() => {
      setSales(prev => [...prev.slice(1), Math.floor(Math.random() * 100 + 20)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="panel">
        <h3>Sales Overview (Last 7 Days)</h3>
        <div className="chart">
          {sales.map((val, idx) => (
            <div
              key={idx}
              style={{
                height: `${val}px`,
                width: '10%',
                background: 'var(--orange)',
                marginRight: '4px',
                display: 'inline-block',
                borderRadius: '4px',
                transition: 'height 0.5s ease'
              }}
            ></div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3>Network KPIs</h3>
        <div className="metric">Nodes Online <strong>98%</strong></div>
        <div className="metric">Fulfillment <strong>94%</strong></div>
        <div className="metric">Avg Delivery <strong>2.4h</strong></div>
      </section>
    </>
  );
}
