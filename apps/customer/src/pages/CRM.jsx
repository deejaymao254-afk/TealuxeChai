export default function CRM() {
  const metrics = [
    { label: "Total Retailers", value: "124" },
    { label: "Credit Outstanding", value: "KES 342,000" },
    { label: "Region Coverage", value: "12 Counties" }
  ];

  return (
    <section className="panel">
      <h3>Customer Overview</h3>
      {metrics.map((m, idx) => (
        <div className="metric" key={idx}>
          {m.label} <strong>{m.value}</strong>
        </div>
      ))}
    </section>
  );
}
