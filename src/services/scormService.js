/**
 * scormService.js
 * Сервис интеграции MedSim с системами дистанционного обучения (LMS, Moodle)
 * по стандартам SCORM 1.2 и SCORM 2004.
 */
import { detectAPI, formatTimeSCORM12, formatTimeSCORM2004, getLastErrorMsg } from './scormUtils';

class ScormService {
  constructor() {
    this.api = null;
    this.version = null;
    this.initialized = false;
    this.startTime = null;
    this.debug = true;
  }

  log(...args) {
    if (this.debug) console.log("[SCORM Service]", ...args);
  }

  error(...args) {
    console.error("[SCORM Service Error]", ...args);
  }

  initialize() {
    if (this.initialized) return true;

    try {
      const { api, version } = detectAPI();
      if (!api) {
        this.log("SCORM API не обнаружен. Работа в автономном режиме (Standalone).");
        return false;
      }

      this.api = api;
      this.version = version;

      let result = "false";
      if (this.version === "2004") {
        result = this.api.Initialize("");
      } else if (this.version === "1.2") {
        result = this.api.LMSInitialize("");
      }

      if (result === "true") {
        this.initialized = true;
        this.startTime = Date.now();
        this.log(`Успешно подключено к LMS. Стандарт: SCORM ${this.version}`);
        this.setStatus("incomplete");
        this.commit();
      } else {
        this.error("Инициализация SCORM завершилась ошибкой:", getLastErrorMsg(this.api, this.version));
      }
    } catch (e) {
      this.error("Критическое исключение при инициализации SCORM:", e);
    }

    return this.initialized;
  }

  isConnected() {
    return this.initialized && this.api !== null;
  }

  _set(element12, element2004, value) {
    if (!this.isConnected()) return false;
    const element = this.version === "2004" ? element2004 : element12;
    if (!element) return false;

    try {
      let result = "false";
      if (this.version === "2004") {
        result = this.api.SetValue(element, String(value));
      } else {
        result = this.api.LMSSetValue(element, String(value));
      }

      if (result !== "true") {
        this.error(`Ошибка записи элемента ${element} = ${value}:`, getLastErrorMsg(this.api, this.version));
        return false;
      }
      this.log(`Установлено значение: ${element} = ${value}`);
      return true;
    } catch (e) {
      this.error(`Исключение при записи элемента ${element}:`, e);
      return false;
    }
  }

  _get(element12, element2004) {
    if (!this.isConnected()) return "";
    const element = this.version === "2004" ? element2004 : element12;
    if (!element) return "";

    try {
      if (this.version === "2004") {
        return this.api.GetValue(element);
      } else {
        return this.api.LMSGetValue(element);
      }
    } catch (e) {
      this.error(`Исключение при чтении элемента ${element}:`, e);
      return "";
    }
  }

  setScore(rawScore, maxScore = 100, minScore = 0) {
    this._set("cmi.core.score.raw", "cmi.score.raw", rawScore);
    this._set("cmi.core.score.max", "cmi.score.max", maxScore);
    this._set("cmi.core.score.min", "cmi.score.min", minScore);

    if (this.version === "2004") {
      const scaled = Math.max(0, Math.min(1, rawScore / (maxScore || 100)));
      this._set(null, "cmi.score.scaled", scaled.toFixed(2));
    }
  }

  setStatus(status) {
    if (this.version === "2004") {
      if (status === "passed" || status === "failed") {
        this._set(null, "cmi.success_status", status);
        this._set(null, "cmi.completion_status", "completed");
      } else if (status === "completed") {
        this._set(null, "cmi.completion_status", "completed");
      } else {
        this._set(null, "cmi.completion_status", "incomplete");
      }
    } else {
      this._set("cmi.core.lesson_status", null, status);
    }
  }

  setSessionTime(elapsedSeconds) {
    const formattedTime = this.version === "2004"
      ? formatTimeSCORM2004(elapsedSeconds)
      : formatTimeSCORM12(elapsedSeconds);
    this._set("cmi.core.session_time", "cmi.session_time", formattedTime);
  }

  saveSuspendData(data) {
    try {
      const serialized = JSON.stringify(data);
      const limit = this.version === "2004" ? 64000 : 4096;
      if (serialized.length > limit) {
        this.error(`Превышен лимит suspend_data (${serialized.length} > ${limit} символов)`);
        return false;
      }
      return this._set("cmi.suspend_data", "cmi.suspend_data", serialized);
    } catch (e) {
      this.error("Ошибка при сохранении suspend_data:", e);
      return false;
    }
  }

  loadSuspendData() {
    const raw = this._get("cmi.suspend_data", "cmi.suspend_data");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      this.error("Ошибка парсинга suspend_data:", e);
      return null;
    }
  }

  getMasteryScore() {
    if (this.version === "2004") {
      const val = this._get(null, "cmi.scaled_passing_score");
      if (val) return parseFloat(val) * 100;
    } else {
      const val = this._get("cmi.student_data.mastery_score", null);
      if (val) return parseFloat(val);
    }
    return null;
  }

  commit() {
    if (!this.isConnected()) return false;
    try {
      return (this.version === "2004" ? this.api.Commit("") : this.api.LMSCommit("")) === "true";
    } catch (e) {
      this.error("Ошибка при выполнении Commit:", e);
      return false;
    }
  }

  terminate() {
    if (!this.isConnected()) return;
    try {
      const status = this.version === "2004" ? this._get(null, "cmi.completion_status") : this._get("cmi.core.lesson_status", null);
      if (status === "incomplete" || !status) {
        this._set("cmi.core.exit", "cmi.exit", "suspend");
      }
      this.commit();
      const res = this.version === "2004" ? this.api.Terminate("") : this.api.LMSFinish("");
      if (res === "true") this.initialized = false;
    } catch (e) {
      this.error("Ошибка при выполнении terminate:", e);
    }
  }

  finish(score, status, elapsedSeconds) {
    if (!this.isConnected()) return;
    try {
      this.setScore(score);
      this.setStatus(status);
      let timeSec = elapsedSeconds;
      if (timeSec === undefined && this.startTime) {
        timeSec = (Date.now() - this.startTime) / 1000;
      }
      this.setSessionTime(timeSec || 0);
      this._set("cmi.core.exit", "cmi.exit", "normal");
      this.commit();
      const res = this.version === "2004" ? this.api.Terminate("") : this.api.LMSFinish("");
      if (res === "true") {
        this.initialized = false;
        this.log("SCORM сессия успешно закрыта.");
      }
    } catch (e) {
      this.error("Исключение при вызове finish:", e);
    }
  }
}

const scormService = new ScormService();
export default scormService;
