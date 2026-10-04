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
import { ASTHMA_CASES } from './emergency/asthmaCases.js';
import { HYPERTENSION_CASES } from './emergency/hypertensionCases.js';
import { HEART_FAILURE_CASES } from './emergency/heartFailureCases.js';
import { PYELONEPHRITIS_CASES } from './emergency/pyelonephritisCases.js';
import { MYXEDEMA_CASES } from './emergency/myxedemaCases.js';

export {
  ASTHMA_CASES,
  HYPERTENSION_CASES,
  HEART_FAILURE_CASES,
  PYELONEPHRITIS_CASES,
  MYXEDEMA_CASES,
};

/** All emergency cases combined */
export const EMERGENCY_CASES = [
  ...CARDIAC_CASES,
  ...HYPERTENSION_CASES,
  ...HEART_FAILURE_CASES,
  ...NEURO_CASES,
  ...RESPIRATORY_CASES,
  ...ASTHMA_CASES,
  ...INFECTIOUS_CASES,
  ...PYELONEPHRITIS_CASES,
  ...ENDOCRINE_CASES,
  ...MYXEDEMA_CASES,
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
  cardiac: [
    ...CARDIAC_CASES,
    ...HYPERTENSION_CASES,
    ...HEART_FAILURE_CASES,
    ...OUTPATIENT_CASES.filter(c => c.category === "cardiac"),
    ...STATIONARY_CASES.filter(c => c.category === "cardiac"),
  ],
  neuro: [
    ...NEURO_CASES,
    ...OUTPATIENT_CASES.filter(c => c.category === "neuro"),
    ...STATIONARY_CASES.filter(c => c.category === "neuro"),
  ],
  respiratory: [
    ...RESPIRATORY_CASES,
    ...ASTHMA_CASES,
    ...OUTPATIENT_CASES.filter(c => c.category === "respiratory"),
    ...STATIONARY_CASES.filter(c => c.category === "respiratory"),
  ],
  infectious: [
    ...INFECTIOUS_CASES,
    ...PYELONEPHRITIS_CASES,
    ...OUTPATIENT_CASES.filter(c => c.category === "infectious"),
    ...STATIONARY_CASES.filter(c => c.category === "infectious"),
  ],
  endocrine: [
    ...ENDOCRINE_CASES,
    ...MYXEDEMA_CASES,
    ...OUTPATIENT_CASES.filter(c => c.category === "endocrine"),
    ...STATIONARY_CASES.filter(c => c.category === "endocrine"),
  ],
  toxicology: [
    ...TOXICOLOGY_CASES,
    ...OUTPATIENT_CASES.filter(c => c.category === "toxicology"),
    ...STATIONARY_CASES.filter(c => c.category === "toxicology"),
  ],
  gastro: GASTRO_CASES,
};

export default CASES;
