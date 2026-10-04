/**
 * check-no-emojis.mjs
 * Automated validation script enforcing zero decorative emojis in UI & Engine code.
 * Excludes Mikhail's zone (src/components/game/chat, src/engine/dialogue, llm) and frozen data.
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SCAN_DIRS = [
  "src/screens",
  "src/components",
  "src/ui",
  "src/locale",
  "src/engine",
];

const EXCLUDE_PATHS = [
  "src/components/game/chat",
  "src/engine/dialogue",
  "src/engine/llmService.js",
  "src/engine/llmPrompts.js",
  "src/engine/localPatientResponse.js",
];

// Matches emoji characters: pictographs, dingbats, miscellaneous symbols
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

async function getFiles(dir) {
  const fullPath = path.join(ROOT, dir);
  let results = [];
  try {
    const list = await fs.readdir(fullPath, { withFileTypes: true });
    for (const item of list) {
      const itemRel = path.relative(ROOT, path.join(fullPath, item.name)).replace(/\\/g, "/");
      if (EXCLUDE_PATHS.some((ex) => itemRel.startsWith(ex))) continue;

      if (item.isDirectory()) {
        const sub = await getFiles(itemRel);
        results = results.concat(sub);
      } else if (item.name.endsWith(".js") || item.name.endsWith(".jsx")) {
        results.push(itemRel);
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  return results;
}

async function checkFile(relPath) {
  const fullPath = path.join(ROOT, relPath);
  const content = await fs.readFile(fullPath, "utf8");
  const lines = content.split("\n");
  const violations = [];

  lines.forEach((line, idx) => {
    // Whitelist parsing/stripping of triage prefixes from frozen data files
    const cleanLine = line
      .replace(/\.(startsWith|includes|indexOf|replace)\s*\(\s*["'`]🔴[^"'`]*["'`]\s*(,\s*["'`][^"'`]*["'`]\s*)?\)/g, "")
      .replace(/replace\s*\(\s*\/[\^]?🔴\\s\*\/\s*,\s*["'`][^"'`]*["'`]\s*\)/g, "");

    const matches = cleanLine.match(EMOJI_REGEX);
    if (matches) {
      violations.push({
        line: idx + 1,
        emojis: matches,
        preview: line.trim(),
      });
    }
  });

  return violations;
}

async function main() {
  console.log("Checking UI and Engine code for forbidden emojis...\n");
  let totalViolations = 0;
  let filesChecked = 0;

  for (const dir of SCAN_DIRS) {
    const files = await getFiles(dir);
    for (const file of files) {
      filesChecked++;
      const v = await checkFile(file);
      if (v.length > 0) {
        console.error(`❌ ${file}`);
        v.forEach((item) => {
          console.error(`   L${item.line}: found [${item.emojis.join(" ")}] -> "${item.preview}"`);
          totalViolations += item.emojis.length;
        });
      }
    }
  }

  console.log(`\nChecked ${filesChecked} files.`);
  if (totalViolations > 0) {
    console.error(`\n🚨 FAILED: Found ${totalViolations} forbidden emoji(s). Replace with SVG icons from src/ui/icons.\n`);
    process.exit(1);
  } else {
    console.log("✅ PASSED: 0 emojis found in UI and Engine code.\n");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Execution error:", err);
  process.exit(1);
});
