import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./middleware/ErrorBoundary";



// GLOBAL STYLES
import "./index.css";
import "./App.css";



export default function SafeLayout({ children }) {
  return <div className="app-layout">{children}</div>;
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);