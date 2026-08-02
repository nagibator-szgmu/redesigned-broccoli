/**
 * Barrel export for all cases by department.
 * Emergency cases are split by specialty.
 * Outpatient and stationary cases are separate modules.
 */
import { CARDIAC_CASES } from './emergency/cardiac.js';
import { NEURO_CASES } from './emergency/neuro.js';
import { RESPIRATORY_CASES } from './emergency/respiratory.js';
import { INFECTIOUS_CASES } from './emergency/infectious.js';
import { ENDOCRINE_CASES } from './emergency/endocrine.js';
import { TOXICOLOGY_CASES } from './emergency/toxicology.js';
import { ABDOMINAL_CASES } from './emergency/abdominal.js';
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
  ...ABDOMINAL_CASES,
];

/** ICU cases (department === "icu") */
export const ICU_CASES = EMERGENCY_CASES.filter(c => c.department === "icu");

/** Admission cases (department === "admission") */
export const ADMISSION_CASES = EMERGENCY_CASES.filter(c => c.department === "admission");

/** All cases across all departments */
export const CASES = [
  ...EMERGENCY_CASES,
  ...OUTPATIENT_CASES,
  ...STATIONARY_CASES,
];

/** Cases grouped by department */
export const CASES_BY_DEPARTMENT = {
  icu: ICU_CASES,
  admission: ADMISSION_CASES,
  outpatient: OUTPATIENT_CASES,
  stationary: STATIONARY_CASES,
};

/** Cases grouped by specialty within emergency */
export const CASES_BY_SPECIALTY = {
  cardiac: CARDIAC_CASES,
  neuro: NEURO_CASES,
  respiratory: RESPIRATORY_CASES,
  infectious: INFECTIOUS_CASES,
  endocrine: ENDOCRINE_CASES,
  toxicology: TOXICOLOGY_CASES,
  abdominal: ABDOMINAL_CASES,
};

export default CASES;
