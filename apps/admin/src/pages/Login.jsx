export default function Login() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Login Page (Placeholder)</h2>
      <p>Click login button to simulate user:</p>
      <button
        onClick={() => {
          localStorage.setItem(
            "duka2_current_user",
            JSON.stringify({ name: "Admin" })
          );
          localStorage.setItem("duka2_token", "dummy-token");
          window.location.href = "/";
        }}
      >
        Login
      </button>
    </div>
  );
}