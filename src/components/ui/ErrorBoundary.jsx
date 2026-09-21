import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#070d18",
            color: "#e8f4ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "#0d1a2e",
              border: "1px solid #1a3050",
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#ff3d5a", marginBottom: 12 }}>
              Произошла ошибка
            </h2>
            <p style={{ fontSize: 13, color: "#a8c8e0", lineHeight: 1.6, marginBottom: 20 }}>
              {this.state.error?.message || "Неизвестная ошибка приложения"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                background: "#00e6c8",
                border: "none",
                borderRadius: 10,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                color: "#070d18",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
