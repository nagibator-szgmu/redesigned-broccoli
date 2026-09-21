import { getLastErrorMsg } from "./scormUtils";

export function scormSetValue(api, version, el12, el2004, value, logger) {
  if (!api) return false;
  const element = version === "2004" ? el2004 : el12;
  if (!element) return false;

  try {
    let result = "false";
    if (version === "2004") {
      result = api.SetValue(element, String(value));
    } else {
      result = api.LMSSetValue(element, String(value));
    }

    if (result !== "true") {
      logger?.error(
        `Ошибка записи элемента ${element} = ${value}:`,
        getLastErrorMsg(api, version)
      );
      return false;
    }
    logger?.log(`Установлено значение: ${element} = ${value}`);
    return true;
  } catch (e) {
    logger?.error(`Исключение при записи элемента ${element}:`, e);
    return false;
  }
}

export function scormGetValue(api, version, el12, el2004, logger) {
  if (!api) return "";
  const element = version === "2004" ? el2004 : el12;
  if (!element) return "";

  try {
    if (version === "2004") {
      return api.GetValue(element);
    } else {
      return api.LMSGetValue(element);
    }
  } catch (e) {
    logger?.error(`Исключение при чтении элемента ${element}:`, e);
    return "";
  }
}

export function scormCommit(api, version, logger) {
  if (!api) return false;
  try {
    return (version === "2004" ? api.Commit("") : api.LMSCommit("")) === "true";
  } catch (e) {
    logger?.error("Ошибка при выполнении Commit:", e);
    return false;
  }
}

export function scormTerminate(api, version, logger) {
  if (!api) return false;
  try {
    return (version === "2004" ? api.Terminate("") : api.LMSFinish("")) === "true";
  } catch (e) {
    logger?.error("Ошибка при выполнении terminate:", e);
    return false;
  }
}
