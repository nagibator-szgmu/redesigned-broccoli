import PropTypes from "prop-types";

export function ElementInfoCard({ componentInfo, domMeta }) {
  return (
    <div style={{ background: "#0E1015", borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 12, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ color: "#94A3B8" }}>Компонент:</span>
        <code style={{ background: "#1D212A", color: "#38BDF8", padding: "2px 6px", borderRadius: 4 }}>
          &lt;{componentInfo.componentName}&gt;
        </code>
      </div>
      {componentInfo.source && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ color: "#94A3B8" }}>Файл:</span>
          <code style={{ background: "#1D212A", color: "#7DD3FC", padding: "2px 6px", borderRadius: 4 }}>
            {componentInfo.source}
          </code>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#94A3B8" }}>Элемент:</span>
        <span style={{ color: "#E2E8F0" }}>
          &lt;{domMeta.tagName}&gt; {domMeta.text ? `"${domMeta.text}"` : ""} ({domMeta.dimensions})
        </span>
      </div>
    </div>
  );
}

ElementInfoCard.propTypes = {
  componentInfo: PropTypes.shape({
    componentName: PropTypes.string.isRequired,
    source: PropTypes.string,
  }).isRequired,
  domMeta: PropTypes.shape({
    tagName: PropTypes.string.isRequired,
    text: PropTypes.string,
    dimensions: PropTypes.string,
  }).isRequired,
};
