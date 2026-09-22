import { Component } from "react";
import { FONT } from "../../ui/theme";

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
            background: "#0E1015",
            color: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "#161920",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F43F5E", marginBottom: 12 }}>
              Произошла ошибка
            </h2>
            <p style={{ fontSize: 13, color: "#8A94A6", lineHeight: 1.6, marginBottom: 20 }}>
              {this.state.error?.message || "Неизвестная ошибка приложения"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                background: "#2563EB",
                border: "none",
                borderRadius: 10,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: "pointer",
                fontFamily: FONT,
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
