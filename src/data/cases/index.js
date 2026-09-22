/**
 * Barrel export for all cases by department and specialty.
 */
import { CARDIAC_CASES } from './emergency/cardiac.js';
import { NEURO_CASES } from './emergency/neuro.js';
import { RESPIRATORY_CASES } from './emergency/respiratory.js';
import { INFECTIOUS_CASES } from './emergency/infectious.js';
import { ENDOCRINE_CASES } from './emergency/endocrine.js';
import { TOXICOLOGY_CASES } from './emergency/toxicology.js';
import { GASTRO_CASES } from './gastroenterology/index.js';
import { OUTPATIENT_CASES } from './outpatient.js';
import { STATIONARY_CASES } from './stationary.js';

/** All emergency cases combined */
export const EMERGENCY_CASES = [
  ...CARDIAC_CASES,
  ...NEURO_CASES,
  ...RESPIRATORY_CASES,
  ...INFECTIOUS_CASES,
  ...ENDOCRINE_CASES,
  ...TOXICOLOGY_CASES,
  ...GASTRO_CASES.filter(c => c.department === "icu" || c.department === "admission"),
];

/** All cases across all departments */
export const CASES = [
  ...EMERGENCY_CASES,
  ...OUTPATIENT_CASES,
  ...STATIONARY_CASES,
  ...GASTRO_CASES.filter(c => c.department === "outpatient" || c.department === "stationary"),
];

/** ICU cases (department === "icu") */
export const ICU_CASES = CASES.filter(c => c.department === "icu");

/** Admission cases (department === "admission") */
export const ADMISSION_CASES = CASES.filter(c => c.department === "admission");

/** Cases grouped by department */
export const CASES_BY_DEPARTMENT = {
  icu: ICU_CASES,
  admission: ADMISSION_CASES,
  outpatient: CASES.filter(c => c.department === "outpatient"),
  stationary: CASES.filter(c => c.department === "stationary"),
};

/** Cases grouped by specialty */
export const CASES_BY_SPECIALTY = {
  cardiac: CARDIAC_CASES,
  neuro: NEURO_CASES,
  respiratory: RESPIRATORY_CASES,
  infectious: INFECTIOUS_CASES,
  endocrine: ENDOCRINE_CASES,
  toxicology: TOXICOLOGY_CASES,
  gastro: GASTRO_CASES,
};

export default CASES;
