import PropTypes from "prop-types";

export function ElementInfoCard({ componentInfo, domMeta }) {
  return (
    <div style={{ background: "#08111d", borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ color: "#8aa2be" }}>Компонент:</span>
        <code style={{ background: "#132845", color: "#38bdf8", padding: "2px 6px", borderRadius: 4 }}>
          &lt;{componentInfo.componentName}&gt;
        </code>
      </div>
      {componentInfo.source && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ color: "#8aa2be" }}>Файл:</span>
          <code style={{ background: "#132845", color: "#a5f3fc", padding: "2px 6px", borderRadius: 4 }}>
            {componentInfo.source}
          </code>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#8aa2be" }}>Элемент:</span>
        <span style={{ color: "#e2e8f0" }}>
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
