/**
 * Утилиты извлечения метаданных элементов UI для Antigravity
 */

export function getReactFiber(node) {
  if (!node) return null;
  const key = Object.keys(node).find(
    (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
  );
  return key ? node[key] : null;
}

export function cleanSourcePath(rawPath) {
  if (!rawPath) return "";
  const srcIdx = rawPath.indexOf("/src/");
  if (srcIdx !== -1) return rawPath.slice(srcIdx + 1);
  const backslashIdx = rawPath.indexOf("\\src\\");
  if (backslashIdx !== -1) return rawPath.slice(backslashIdx + 1).replace(/\\/g, "/");
  return rawPath;
}

export function extractComponentInfo(node) {
  let fiber = getReactFiber(node);
  const chain = [];
  let source = null;
  let primaryComponent = "";

  while (fiber) {
    const isComponent = typeof fiber.type === "function" || typeof fiber.type === "object";
    const name = fiber.type?.displayName || fiber.type?.name || "";

    if (isComponent && name && !["Suspense", "ErrorBoundary", "ThemeProvider"].includes(name)) {
      if (!primaryComponent) primaryComponent = name;
      if (!chain.includes(name)) chain.push(name);
    }

    if (!source && fiber._debugSource) {
      source = {
        file: cleanSourcePath(fiber._debugSource.fileName),
        line: fiber._debugSource.lineNumber,
        col: fiber._debugSource.columnNumber,
      };
    }

    fiber = fiber.return;
  }

  return {
    componentName: primaryComponent || node.tagName.toLowerCase(),
    chain: chain.slice(0, 5),
    source: source ? `${source.file}:${source.line}` : null,
  };
}

export function getDomMeta(node) {
  if (!node) return null;
  const rect = node.getBoundingClientRect();
  const computed = window.getComputedStyle(node);
  const text = (node.innerText || node.textContent || "").trim().replace(/\s+/g, " ");

  const idPart = node.id ? `#${node.id}` : "";
  const classPart = node.className && typeof node.className === "string"
    ? `.${node.className.trim().split(/\s+/).slice(0, 2).join(".")}`
    : "";
  const selector = `${node.tagName.toLowerCase()}${idPart}${classPart}`;

  return {
    tagName: node.tagName.toLowerCase(),
    text: text.length > 60 ? `${text.slice(0, 57)}...` : text,
    selector,
    dimensions: `${Math.round(rect.width)} × ${Math.round(rect.height)} px`,
    styles: {
      display: computed.display,
      position: computed.position,
      padding: computed.padding,
      margin: computed.margin,
      color: computed.color,
      background: computed.backgroundColor,
      fontSize: computed.fontSize,
      overflow: computed.overflow,
    },
  };
}

export function buildMarkdownReport({ componentInfo, domMeta, userComment, context = {} }) {
  const lines = [
    "### 🎯 Отчёт об элементе UI (MedSim)",
    `- **Файл и строка:** ${componentInfo.source ? `\`${componentInfo.source}\`` : "Не определено в dev-сборке"}`,
    `- **Компонент:** \`<${componentInfo.componentName}>\``,
  ];

  if (componentInfo.chain.length > 1) {
    lines.push(`- **Иерархия:** \`${componentInfo.chain.join(" → ")}\``);
  }

  lines.push(
    `- **DOM-элемент:** \`<${domMeta.tagName}>\` ${domMeta.text ? `("${domMeta.text}")` : ""}`,
    `- **Селектор:** \`${domMeta.selector}\``,
    `- **Размеры:** \`${domMeta.dimensions}\` | \`display: ${domMeta.styles.display}\` | \`color: ${domMeta.styles.color}\``
  );

  if (context.phase) {
    lines.push(`- **Контекст экрана:** фаза \`${context.phase}\`${context.caseId ? `, случай #${context.caseId}` : ""}`);
  }

  lines.push(
    "",
    "**Что нужно исправить:**",
    `> ${userComment && userComment.trim() ? userComment.trim() : "Элемент выбран для визуальной или логической доработки."}`,
    ""
  );

  return lines.join("\n");
}
