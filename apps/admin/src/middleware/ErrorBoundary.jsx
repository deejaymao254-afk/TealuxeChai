import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: "#bebebe" }}>
          <h2>Something went wrong</h2>
          <p>The page crashed, but the app is still running.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}