# MEDSIM V2.5 — ACADEMIC & DIDACTIC METHODOLOGY

**Document Classification:** Pedagogical & Curricular Framework  
**Standard Compliance:** Federal State Educational Standard of Higher Education (ФГОС ВО 3++) — 31.05.01 «Лечебное дело», 31.05.02 «Педиатрия», 31.08.02 «Анестезиология-реаниматология»  
**Academic Version:** V2.5 Professional Edition  

---

## 1. Educational Objectives

MEDSIM V2.5 is designed to cultivate structured, evidence-based clinical decision-making in acute and ambulatory medical settings. The primary didactic goals are:
* Transitioning students from passive memorization of clinical criteria to active bedside clinical problem-solving.
* Instilling immediate life-threat recognition and prioritization protocols (ABCDE).
* Developing evidence-based diagnostic search strategies without excessive or redundant testing.
* Training pharmacotherapeutic safety and contraindication awareness.
* Establishing the habit of continuous iterative reassessment (Closed-Loop Management).

---

## 2. Target Learners

* **Medical Students (Years 4–6):** Internal Medicine, Faculty Therapy, Emergency Medicine, Anesthesiology and Intensive Care rotations.
* **Clinical Residents (Years 1–2):** General Practice / Therapy, Emergency Medicine (СМП), Anesthesiology-Reanimatology, Cardiology.
* **Physicians in Continuing Medical Education (НМО / Аккредитация):** Preparation for practical station exams (Первичная специализированная аккредитация).

---

## 3. Competencies Trained (ФГОС ВО 3++)

| Competency Code | Description | Simulation Manifestation |
|:---|:---|:---|
| **ОПК-4** | Ability to evaluate morphological and functional conditions in pathological processes | Analysis of live vitals HUD, interpretation of ECG, CT, Echo, and biomarkers |
| **ОПК-6** | Ability to determine management tactics and prescribe evidence-based therapy | Ordering pharmacotherapy from 44 interventions with dosing and route awareness |
| **ПК-1** | Recognition of emergency conditions and implementation of urgent resuscitation | Application of BLS, ACLS, and Surviving Sepsis protocols under time countdown |
| **ПК-2** | Diagnostic search and formulation of clinical diagnosis | Free-text diagnosis entry with medical term normalization and differential ranking |
| **ПК-3** | Evaluation of clinical effectiveness and safety of medical interventions | Iterative reassessment loop with de-escalation/escalation decisions |

---

## 4. Clinical Reasoning Model

MEDSIM implements an active cognitive model of clinical reasoning based on dual-process theory (Kahneman System 1 intuitive pattern recognition + System 2 analytic hypothetico-deductive reasoning):
$$\text{Chief Complaint} \xrightarrow{\text{System 1}} \text{Syndrome Recognition} \xrightarrow{\text{System 2}} \text{Differential Ranking} \xrightarrow{\text{Testing}} \text{Confirmed Diagnosis} \xrightarrow{\text{Action}} \text{Target Therapy}$$

---

## 5. ABCDE Bedside Methodology

Every emergency scenario enforces the internationally accepted ABCDE resuscitation hierarchy:
* **A (Airway):** Verification of patency, stridor/obstruction detection, airway positioning, endotracheal intubation.
* **B (Breathing):** Evaluation of respiratory rate, bilateral breath sounds, pulse oximetry, supplemental oxygen therapy / mechanical ventilation.
* **C (Circulation):** Continuous hemodynamic monitoring (HR, BP, shock index, MAP), ECG rhythm analysis, IV access, fluid resuscitation, vasopressors/inotropes, CPR/defibrillation.
* **D (Disability):** Glasgow Coma Scale (GCS) assessment, pupil reactivity, rapid blood glucose evaluation.
* **E (Exposure):** Body temperature monitoring, trauma inspection, skin rash/petechiae evaluation, hypothermia prevention.

---

## 6. Differential Diagnosis Framework

Rather than static multiple-choice options, MEDSIM calculates real-time probabilistic shifts across diagnostic hypotheses using `differentialEngine.js`:
* Every clinical case defines 3–4 plausible competing differential diagnoses (e.g. STEMI vs Aortic Dissection vs Pulmonary Embolism vs Pericarditis for acute chest pain).
* Findings act as positive or negative likelihood modifiers.
* Students in Learning Mode observe how diagnostic tests actively rule in or rule out differential candidates.

---

## 7. Diagnostic Decision-Making

* **Diagnostic Battery:** 29 curated modalities covering point-of-care laboratory tests (Trop, D-dimer, ABG, CBC, BMP, Coag), electrophysiology (12-lead ECG, telemetry), and advanced imaging (POCUS Echo, eFAST, Brain CT, Chest CT-angiography, Abdominal Ultrasound).
* **Cognitive Load & Turnaround Time:** Tests simulate turnaround delays ($3\text{--}180\text{ seconds}$), training students to initiate life-saving empiric therapy before full laboratory return.

---

## 8. Therapeutic Decision-Making

* **Formulary:** 44 distinct interventions categorized into Vasopressors/Inotropes, Antiarrhythmics, Analgesics, Antidotes, Bronchodilators, Anticoagulants/Antiplatelets, and Resuscitation Procedures.
* **Physiological Modeling (`TREAT_FX`):** Each intervention has defined onset latencies and continuous physiological transfer functions impacting HR, SBP, SpO2, RR, and GCS.

---

## 9. Iterative Reassessment (`ReassessmentModal`)

Medical errors frequently arise from failure to reassess a patient after an intervention. MEDSIM embeds a mandatory reassessment loop:
* Following an intervention, the student receives updated hemodynamic telemetry.
* The student selects an explicit clinical management strategy:
  1. `CONTINUE` — Current therapy is effective; maintain dose.
  2. `ESCALATE` — Suboptimal response; increase dosage / add second-line agent.
  3. `MODIFY` — Refractory condition or adverse reaction; change therapeutic target.
  4. `STOP / STABILIZED` — Target physiological goals achieved.

---

## 10. Patient Deterioration Dynamics

* **Time-Dependent Deterioration (`tickDeterioration`):** If life-saving therapy is omitted, patient vitals decline in 30-second cycles.
* **Death Thresholds (`deathThresholds`):** Physiological boundaries (e.g. $\text{SBP} \le 48\text{ mm Hg}$, $\text{SpO2} \le 65\%$, $\text{HR} \ge 195\text{ bpm}$, $\text{GCS} \le 4$) trigger clinical death with associated debriefing analysis.

---

## 11. Closed-Loop Learning & Formative Feedback

Formative feedback is delivered continuously:
* **Active Problem List (`ProblemListPanel`):** Visualizes syndromic evolution in real time.
* **Interactive Theory Integration:** One-click navigation to relevant pathology synopses and treatment algorithms.

---

## 12. Formative vs. 13. Summative Assessment

* **Learning Mode (Formative):** Open mentor hints, active differential hypothesis ranking, unrestricted time limits, and real-time guidance.
* **Assessment / Exam Mode (Summative):** Strict exam conditions, hidden differential ranking, enforced time limits, zero hints, and standardized 0–100 numerical scoring with grade mapping.

---

## 14. 11-Point Closed-Loop Debrief Methodology

At the conclusion of each case, students receive an automated, personalized 11-section debrief (`DebriefPanel.jsx`):
1. Final Patient Outcome & Clinical State
2. Quantitative Score & Grade Distribution
3. Diagnostic Search Evaluation (Missing vs Essential tests)
4. Pharmacotherapeutic Evaluation (Indicated vs Redundant drugs)
5. Contraindications & Adverse Safety Violations
6. Dynamic Reassessment Quality
7. Time Management & Speed Index
8. Complete Hemodynamic Trajectory Log
9. Official Guidelines Citation (`cr.minzdrav.gov.ru`)
10. Recommended Theoretical Synopses
11. Case Clinical Pearls & Take-Home Messages

---

## 15. Scoring Methodology & Anti-Gaming

$$\text{Final Score} = \min\left(100, \text{Diagnosis (35)} + \text{Diagnostics (20)} + \text{Therapy (20)} + \text{History (10)} + \text{Outcome (20)} + \text{Speed Bonus (15)} - \text{Safety Penalties}\right)$$

* **Anti-Gaming:** Guessing the diagnosis without treating fails the student ($< 50$ pts). Blindly treating without diagnosing caps the grade at *Satisfactory* ($\le 65$ pts). Contraindicated therapy inflicts a severe −15 pt penalty per dangerous action.

---

## 16. Patient Safety & Error Penalties

* **Safety Engine (`safetyEngine.js`):** Intercepts dangerous actions and triggers both physiological deterioration and academic penalties.
* **Psychological Safety:** Provides a risk-free environment where students can witness the dangerous consequences of clinical errors without endangering real patients.

---

## 17. Methodological Limitations

> [!NOTE]
> **Academic Disclosure:**  
> The educational framework of MEDSIM V2.5 is theoretically structured and technically implemented; formal prospective randomized educational effectiveness studies with student cohorts have not yet been completed and are scheduled for the upcoming academic semester.

Specific current simulation boundaries:
* Evaluates cognitive and diagnostic-therapeutic decision-making; does not assess psychomotor/manual technical skills (e.g. needle insertion angle, auscultation audio acuity).
* Physiological models represent deterministic mathematical transfer vectors rather than full organ-level biochemical simulations.

---

## 18. Faculty Integration Recommendations

1. **Pre-Class Preparation:** Students complete Theory topics and Quizzes as self-study prerequisites.
2. **Interactive Classroom Simulation:** The instructor projects a complex emergency case onto an interactive board, guiding group differential discussion.
3. **Independent Computer Lab Practice:** Students independently complete randomized case sets.
4. **Post-Simulation Group Debrief:** The instructor reviews error heatmaps on the `TeacherDashboardScreen` to address common misconceptions.
5. **End-of-Semester Examination:** Summative assessment using Assessment Mode with LMS gradebook synchronization.
