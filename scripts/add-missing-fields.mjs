#!/usr/bin/env node
/**
 * Adds missing required fields to outpatient and stationary cases:
 * - Outpatient: correctRoute, routeOptions (FR-3.4.3, TZ §4.2)
 * - Stationary: dayByDayPlan, dischargeCriteria (FR-3.5, TZ §4.2)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPATIENT_PATH = join(ROOT, 'src', 'data', 'cases', 'outpatient.js');
const STATIONARY_PATH = join(ROOT, 'src', 'data', 'cases', 'stationary.js');

/** FR-3.4.3: Route options for outpatient cases */
const ROUTE_OPTIONS = [
  { id: 'treat_outpatient', label: 'Лечить амбулаторно' },
  { id: 'refer_specialist', label: 'Направить к специалисту' },
  { id: 'refer_hospitalization', label: 'Направить на плановую госпитализацию' },
  { id: 'call_ems', label: 'Вызвать СМП немедленно' },
];

/** Correct routes per outpatient case */
const CORRECT_ROUTES = {
  outp_1: 'treat_outpatient',    // ГБ криз — амбулаторное лечение (мониторинг + коррекция терапии)
  outp_2: 'refer_specialist',    // ЖКБ — направление к хирургу для плановой холецистэктомии
  outp_3: 'treat_outpatient',    // Гипотиреоз — амбулаторная заместительная терапия
  outp_4: 'refer_hospitalization', // ХСН II ФК — госпитализация для титрования терапии
  outp_5: 'treat_outpatient',    // Болезнь Грейвса — амбулаторная терапия тиамазолом
  outp_6: 'treat_outpatient',    // Пиелонефрит — амбулаторная АБТ
};

/** Stationary day-by-day plans */
const DAY_BY_DAY_PLANS = {
  stat_1: {
    maxDays: 7,
    days: [
      { day: 1, morning: 'Состояние тяжёлое. Лихорадка 38.8°C. SpO2 88% на маске.', plan: 'Расширение АБТ: меропенем + ванкомицин. КТ грудной клетки для исключения эмпиемы.' },
      { day: 2, morning: 'Температура 38.2°C. SpO2 90%. Лейкоциты 14.2.', plan: 'Продолжение АБТ. Контроль КТ. При положительной динамике — отмена ванкомицина.' },
      { day: 3, morning: 'Температура 37.4°C. SpO2 93%. Лейкоциты 10.8.', plan: 'Перевод на пероральные АБТ при сохранении положительной динамики.' },
      { day: 4, morning: 'Апирексия. SpO2 95%. Лейкоциты 8.4.', plan: 'Диуретики при сохраняющемся отёке. Дыхательная гимнастика.' },
      { day: 5, morning: 'Стабильно. SpO2 96%. Лейкоциты 7.2.', plan: 'Подготовка к выписке. Назначение пероральных АБТ на 5 дней.' },
    ],
  },
  stat_2: {
    maxDays: 5,
    days: [
      { day: 1, morning: 'Септический шок. АД 85/50 на норадреналине. Лактат 6.2.', plan: 'Меропенем 1г в/в каждые 8ч. Инфузия кристаллоидов. Контроль лактата каждые 4ч.' },
      { day: 2, morning: 'АД 95/60 на норадреналине 0.1 мкг/кг/мин. Лактат 4.8.', plan: 'Снижение дозы вазопрессора. Контроль коагулограммы. Тромбоциты 48.' },
      { day: 3, morning: 'АД 105/65 без вазопрессоров. Лактат 3.2. Тромбоциты 62.', plan: 'Отмена вазопрессоров. Контроль ДВС-синдрома. Свежезамороженная плазма при МНО >2.0.' },
      { day: 4, morning: 'Стабильно. Лактат 2.1. Тромбоциты 98.', plan: 'Перевод из ОРИТ при стабилизации. Коррекция АБТ по чувствительности.' },
    ],
  },
  stat_3: {
    maxDays: 4,
    days: [
      { day: 1, morning: 'Астматический статус. SpO2 86%. PaCO2 42.', plan: 'ИВЛ. Системные стероиды (метилпреднизолон 120 мг). Небулайзеры каждые 4ч.' },
      { day: 2, morning: 'SpO2 92% на FiO2 0.5. PaCO2 38. Сознание ясное.', plan: 'Снижение FiO2. Продолжение стероидов. Контроль калия.' },
      { day: 3, morning: 'SpO2 95% на воздухе. Пикфлоуметрия 280 л/мин.', plan: 'Экстубация. Перевод на пероральные стероиды. Пикфлоуметрия каждые 4ч.' },
      { day: 4, morning: 'Стабильно. Пикфлоуметрия 320 л/мин.', plan: 'Подготовка к выписке. Назначение ингаляционных стероидов + бета2-агонистов.' },
    ],
  },
  stat_4: {
    maxDays: 7,
    days: [
      { day: 1, morning: 'Ишемический инсульт. GCS 12. Правосторонняя гемиплегия.', plan: 'Инфузионная терапия (изотонический р-р). Контроль АД (цель 140-160/90). Тромбопрофилактика.' },
      { day: 2, morning: 'GCS 13. Гемиплегия сохраняется. АД 155/90.', plan: 'Продолжение терапии. ЛФК (пассивная гимнастика). Логопед.' },
      { day: 3, morning: 'GCS 14. Движения в правой руке 2/5. АД 148/85.', plan: 'Усиление ЛФК. Логопедическая коррекция. Контроль КТ через 5 дней.' },
      { day: 4, morning: 'GCS 15. Движения в правой руке 3/5. АД 140/82.', plan: 'Активная ЛФК. Коррекция дозы антигипертензивных.' },
      { day: 5, morning: 'Стабильно. Движения улучшаются. АД 138/80.', plan: 'Подготовка к выписке в реабилитационный центр.' },
    ],
  },
  stat_5: {
    maxDays: 7,
    days: [
      { day: 1, morning: 'Септический шок. АД 75/45 на норадреналине 0.3 мкг/кг/мин. Лактат 7.2.', plan: 'Меропенем 2г в/в каждые 8ч + ванкомицин. Повторная хирургическая санация.' },
      { day: 2, morning: 'АД 80/50 на норадреналине 0.2. Лактат 6.8. Тромбоциты 48.', plan: 'Контроль ДВС. Свежезамороженная плазма. Тромбоциты при <20.' },
      { day: 3, morning: 'АД 90/55 на норадреналине 0.1. Лактат 5.2. Тромбоциты 55.', plan: 'Снижение дозы вазопрессора. Контроль лактата каждые 6ч.' },
      { day: 4, morning: 'АД 100/60 без вазопрессоров. Лактат 3.8. Тромбоциты 72.', plan: 'Отмена вазопрессоров. Коррекция АБТ по чувствительности.' },
      { day: 5, morning: 'Стабильно. Лактат 2.4. Тромбоциты 98.', plan: 'Перевод из ОРИТ. Пероральные АБТ при возможности.' },
    ],
  },
};

/** Discharge criteria per stationary case */
const DISCHARGE_CRITERIA = {
  stat_1: ['Температура <37°C в течение 24ч', 'SpO2 >94% на воздухе', 'Лейкоциты <10×10⁹/л', 'Нет признаков дыхательной недостаточности'],
  stat_2: ['АД стабильное без вазопрессоров >24ч', 'Лактат <2 ммоль/л', 'Тромбоциты >100×10⁹/л', 'Нет признаков ДВС-синдрома'],
  stat_3: ['SpO2 >95% на воздухе', 'Пикфлоуметрия >300 л/мин', 'Нет признаков бронхоспазма', 'Стабильные витальные показатели >24ч'],
  stat_4: ['GCS 15', 'Стабильные витальные показатели >48ч', 'Нет неврологической деградации', 'АД контролируемое <140/90'],
  stat_5: ['АД стабильное без вазопрессоров >48ч', 'Лактат <2 ммоль/л', 'Тромбоциты >100×10⁹/л', 'Нет признаков сепсиса'],
};

// ── Update outpatient cases ──
const opRaw = readFileSync(OUTPATIENT_PATH, 'utf8');
const opMatch = opRaw.match(/export const OUTPATIENT_CASES = (\[[\s\S]*\]);/);
if (!opMatch) { console.error('Cannot parse OUTPATIENT_CASES'); process.exit(1); }

const OP_CASES = eval(opMatch[1]);
for (const c of OP_CASES) {
  c.correctRoute = CORRECT_ROUTES[c.id] || 'treat_outpatient';
  c.routeOptions = ROUTE_OPTIONS;
}
const opContent = opRaw.replace(
  /export const OUTPATIENT_CASES = \[[\s\S]*\];/,
  `export const OUTPATIENT_CASES = ${JSON.stringify(OP_CASES, null, 2)};`
);
writeFileSync(OUTPATIENT_PATH, opContent, 'utf8');
console.log(`outpatient.js: added correctRoute + routeOptions to ${OP_CASES.length} cases`);

// ── Update stationary cases ──
const stRaw = readFileSync(STATIONARY_PATH, 'utf8');
const stMatch = stRaw.match(/export const STATIONARY_CASES = (\[[\s\S]*\]);/);
if (!stMatch) { console.error('Cannot parse STATIONARY_CASES'); process.exit(1); }

const ST_CASES = eval(stMatch[1]);
for (const c of ST_CASES) {
  const plan = DAY_BY_DAY_PLANS[c.id];
  const criteria = DISCHARGE_CRITERIA[c.id];
  if (plan) {
    c.dayByDayPlan = plan.days;
    c.maxDays = plan.maxDays;
  }
  if (criteria) {
    c.dischargeCriteria = criteria;
  }
}
const stContent = stRaw.replace(
  /export const STATIONARY_CASES = \[[\s\S]*\];/,
  `export const STATIONARY_CASES = ${JSON.stringify(ST_CASES, null, 2)};`
);
writeFileSync(STATIONARY_PATH, stContent, 'utf8');
console.log(`stationary.js: added dayByDayPlan + dischargeCriteria to ${ST_CASES.length} cases`);
