/**
 * Реестр клинических кейсов по направлению «Гастроэнтерология».
 * Объединяет кейсы ОРИТ, Приёмного отделения, Стационара и Поликлиники.
 */

import { EMERGENCY_GASTRO_CASES } from "./emergencyCases.js";
import { BILIARY_GASTRO_CASES } from "./biliaryCases.js";
import { STATIONARY_GASTRO_CASES } from "./stationaryCases.js";
import { OUTPATIENT_GASTRO_CASES } from "./outpatientCases.js";

export const GASTRO_CASES = [
  ...EMERGENCY_GASTRO_CASES,
  ...BILIARY_GASTRO_CASES,
  ...STATIONARY_GASTRO_CASES,
  ...OUTPATIENT_GASTRO_CASES,
];

export default GASTRO_CASES;
