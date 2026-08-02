/**
 * scormUtils.js
 * Helper utilities for SCORM API discovery, frame searching, and time formatting.
 */

export function findAPI(win, apiName) {
  let currentWin = win;
  let attempts = 0;
  const maxAttempts = 50;

  while (currentWin && attempts < maxAttempts) {
    try {
      if (currentWin[apiName]) {
        return currentWin[apiName];
      }
    } catch {
      break;
    }

    try {
      if (currentWin.parent && currentWin.parent !== currentWin) {
        currentWin = currentWin.parent;
      } else {
        break;
      }
    } catch {
      break;
    }
    attempts++;
  }
  return null;
}

export function detectAPI() {
  const versions = [
    { name: "API_1484_11", code: "2004" },
    { name: "API", code: "1.2" }
  ];

  for (const v of versions) {
    let api = findAPI(window, v.name);
    if (api) return { api, version: v.code };

    if (window.opener) {
      api = findAPI(window.opener, v.name);
      if (api) return { api, version: v.code };
    }

    if (window.top && window.top.opener) {
      api = findAPI(window.top.opener, v.name);
      if (api) return { api, version: v.code };
    }
  }

  return { api: null, version: null };
}

export function formatTimeSCORM12(totalSeconds) {
  const secs = Math.max(0, totalSeconds);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const hh = Math.floor((secs % 1) * 100);

  const pad = (num, size = 2) => String(num).padStart(size, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(hh)}`;
}

export function formatTimeSCORM2004(totalSeconds) {
  let secs = Math.max(0, totalSeconds);
  const h = Math.floor(secs / 3600);
  secs %= 3600;
  const m = Math.floor(secs / 60);
  const s = secs % 60;

  let result = "PT";
  if (h > 0) result += `${h}H`;
  if (m > 0) result += `${m}M`;
  if (s > 0 || (h === 0 && m === 0)) {
    const roundedS = Math.round(s * 100) / 100;
    result += `${roundedS}S`;
  }
  return result;
}

export function getLastErrorMsg(api, version) {
  if (!api) return "No API detected";
  try {
    let code = "0";
    let desc = "";
    if (version === "2004") {
      code = api.GetLastError();
      desc = api.GetErrorString(code);
    } else {
      code = api.LMSGetLastError();
      desc = api.LMSGetErrorString(code);
    }
    return `Код: ${code}, Описание: ${desc}`;
  } catch (e) {
    return `Не удалось прочитать ошибку: ${e.message}`;
  }
}
