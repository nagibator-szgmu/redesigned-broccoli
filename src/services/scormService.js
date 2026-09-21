/**
 * scormService.js
 * Сервис интеграции MedSim с системами дистанционного обучения (LMS, Moodle)
 * по стандартам SCORM 1.2 и SCORM 2004.
 */
import { detectAPI, getLastErrorMsg } from "./scormUtils";
import { scormSetValue, scormGetValue, scormCommit, scormTerminate } from "./scormCore";
import {
  writeScormScore,
  writeScormStatus,
  writeScormSessionTime,
  writeScormSuspendData,
  readScormSuspendData,
  readScormMasteryScore,
} from "./scormData";

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
    return scormSetValue(this.api, this.version, element12, element2004, value, this);
  }

  _get(element12, element2004) {
    if (!this.isConnected()) return "";
    return scormGetValue(this.api, this.version, element12, element2004, this);
  }

  setScore(rawScore, maxScore = 100, minScore = 0) {
    writeScormScore(this._set.bind(this), this.version, rawScore, maxScore, minScore);
  }

  setStatus(status) {
    writeScormStatus(this._set.bind(this), this.version, status);
  }

  setSessionTime(elapsedSeconds) {
    writeScormSessionTime(this._set.bind(this), this.version, elapsedSeconds);
  }

  saveSuspendData(data) {
    return writeScormSuspendData(this._set.bind(this), this.version, data, this);
  }

  loadSuspendData() {
    return readScormSuspendData(this._get.bind(this), this);
  }

  getMasteryScore() {
    return readScormMasteryScore(this._get.bind(this), this.version);
  }

  commit() {
    if (!this.isConnected()) return false;
    return scormCommit(this.api, this.version, this);
  }

  terminate() {
    if (!this.isConnected()) return;
    try {
      const status = this.version === "2004" ? this._get(null, "cmi.completion_status") : this._get("cmi.core.lesson_status", null);
      if (status === "incomplete" || !status) {
        this._set("cmi.core.exit", "cmi.exit", "suspend");
      }
      this.commit();
      const res = scormTerminate(this.api, this.version, this);
      if (res) this.initialized = false;
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
      const res = scormTerminate(this.api, this.version, this);
      if (res) {
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

