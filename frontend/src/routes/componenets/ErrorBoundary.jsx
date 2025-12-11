// ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log to an external service here
    // Example: send to your logging endpoint
    // fetch("/api/log", { method: "POST", body: JSON.stringify({ error, info }) })
    this.setState({ info });
    console.error("ErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    // reset the error state to try rendering children again
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (this.state.hasError) {
      // Render any fallback UI you want
      return (
        <div className="p-6 bg-red-50 rounded">
          <h2 className="text-xl font-semibold">Something went wrong.</h2>
          <p className="mt-2 text-sm">We caught an error in this part of the app.</p>

          {/* Optional: show brief error for dev (avoid exposing to end users) */}
          <details style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>
            {this.state.error && this.state.error.toString()}
            {"\n"}
            {this.state.info && this.state.info.componentStack}
          </details>

          <div style={{ marginTop: 12 }}>
            <button onClick={this.handleRetry} style={{ marginRight: 8 }}>
              Retry
            </button>
            <button onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
