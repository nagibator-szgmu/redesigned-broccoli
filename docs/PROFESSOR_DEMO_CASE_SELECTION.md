# MEDSIM V2.5 — BEST DEMONSTRATION CASES SELECTION

**Document Purpose:** Strategic Selection of Optimal Cases for Faculty Demonstration & Academic Evaluation  
**Audience:** Medical University Faculty, Department Heads, Examiners  
**Total Case Registry Pool:** 67 Clinical Cases (32 ICU, 24 Admission, 6 Outpatient, 5 Stationary)

---

## 🏆 Summary of Selected Showcase Cases

| Category | Case ID | Patient Profile | Diagnosis | Specialty | Key Educational Feature |
|:---|:---:|:---|:---|:---|:---|
| **1. Best Emergency Resuscitation** | **Case #1** | Мельников С.П., 61 л | ОКС с подъемом ST (Нижний ОИМ, кардиогенный шок) | `cardiac` (ICU) | ABCDE prioritization, emergency telemetry, antiplatelet/PCI protocol |
| **2. Best Diagnostic Reasoning** | **Case #10** | Соколова Е.В., 58 л | Ишемический инсульт (в окне тромболизиса 4.5 ч) | `neuro` (ICU) | Discrimination of stroke vs hemorrhage vs hypoglycemia mimic (Brain CT, Glucose) |
| **3. Best Pharmacology & Safety** | **Case #25** | Федоров Н.А., 68 л | Септический шок (Уросепсис) | `infectious` (ICU) | Surviving Sepsis Hour-1 bundle, crystalloids + norepinephrine titration, vasodilators strictly contraindicated |
| **4. Best Closed-Loop Reassessment** | **Case #2** | Кузнецов В.А., 64 л | Острая левожелудочковая недостаточность (Отек легких) | `cardiac` (ICU) | Severe hypoxemia (SpO2 82%) $\to$ CPAP + Furosemide + Nitrates $\to$ dynamic titration |
| **5. Best Ambulatory & Triage** | **Case outp_1** | Лебедев А.И., 52 г | Стабильная стенокардия напряжения II ФК | `cardiac` (Outpatient) | Primary care workup, outpatient risk stratification, cardiology routing |

---

## 🔍 Detailed Analysis of Selected Demonstration Cases

---

### 1. BEST EMERGENCY CASE: Case #1 (ОКС с подъемом ST / Острый инфаркт миокарда)

* **Department:** `icu` | **Specialty:** `cardiac` | **Severity:** `critical`
* **Patient Demographics:** Мельников Сергей Павлович, 61 год, мужчина.
* **Why Chosen:**
  * Demonstrates the highest-acuity emergency workflow under intense time pressure (12-minute countdown).
  * Clear vital instability: Heart rate 115 bpm, Blood pressure 80/55 (MAP 63 mm Hg), SpO2 90%, Pain 9/10.
* **System Capabilities Demonstrated:**
  * Sticky Vitals HUD with live cardiac rhythm telemetry.
  * Rapid diagnostic ordering (ECG 12-lead + high-sensitivity Troponin).
  * Dual antiplatelet/anticoagulant initiation (Aspirin + Heparin) and cath lab activation (PCI).
* **Expected Pathway:**
  1. *Assessment (ABCDE):* Identify hypoxemia (SpO2 90%) and hypotension (80/55).
  2. *Immediate Action:* Administer Oxygen via mask.
  3. *Diagnostics:* Order 12-lead ECG (shows ST elevation in II, III, aVF) + Troponin (elevated at 4.8 ng/mL).
  4. *Therapeutics:* Prescribe Aspirin 325 mg + Heparin IV + Emergency PCI.
  5. *Safety Filter:* Avoid Nitroglycerin and Beta-blockers due to hypotension and inferior wall RV involvement.
* **Expected Physiological Response:**
  * SpO2 increases from 90% to 96%.
  * Pain drops from 9 to 4.
  * Hemodynamics stabilize after reperfusion (SBP rises toward 110 mm Hg).
* **Anticipated Professor Questions:**
  * *Q: "Почему система снизит балл, если студент даст Нитроглицерин?"*  
    *A: "При исходном АД 80/55 мм рт.ст. и нижнем инфаркте нитраты вызовут резкое падение преднагрузки правого желудочка и усугубление кардиогенного шока. Симулятор начислит штраф −15 баллов за опасное действие."*

---

### 2. BEST DIAGNOSTIC REASONING CASE: Case #10 (Ишемический инсульт в терапевтическом окне)

* **Department:** `icu` | **Specialty:** `neuro` | **Severity:** `critical`
* **Patient Demographics:** Соколова Елена Викторовна, 58 лет, женщина.
* **Why Chosen:**
  * Demonstrates that diagnosis cannot be guessed; it must be proven by discriminating evidence.
  * Patient presents with acute neurological deficit: FAST positive (facial droop, left hemiplegia, speech impairment), onset 2.5 hours ago (within 4.5h rtPA window).
* **System Capabilities Demonstrated:**
  * Differential Diagnostic Engine (`differentialEngine.js`): Ranks Ischemic Stroke vs Hemorrhagic Stroke vs Hypoglycemia vs Todd's Paresis.
  * Brain CT (non-contrast) excludes intracranial hemorrhage.
  * Blood glucose (6.2 mmol/L) excludes hypoglycemic stroke mimic.
* **Expected Pathway:**
  1. *Assessment:* Airway patent, GCS 13, BP 170/95.
  2. *Essential Diagnostics:* Order Brain CT + Blood Glucose + Coagulogram (INR).
  3. *Interpretation:* Brain CT shows no hemorrhage; early signs of MCA ischemia.
  4. *Therapeutic Action:* Systemic Thrombolysis (rtPA) prescribed within window.
  5. *Safety Filter:* Anticoagulants (Heparin) strictly withheld during the first 24 hours post-thrombolysis.
* **Anticipated Professor Questions:**
  * *Q: "Что произойдет, если студент назначит тромболизис без предварительного КТ головного мозга?"*  
    *A: "Назначение тромболизиса без исключения кровоизлияния на КТ расценивается системой как грубейшая ошибка. В дебрифинге будет указано на риск фатального геморрагического инсульта."*

---

### 3. BEST PHARMACOLOGY & SAFETY CASE: Case #25 (Септический шок / Уросепсис)

* **Department:** `icu` | **Specialty:** `infectious` | **Severity:** `critical`
* **Patient Demographics:** Федоров Николай Алексеевич, 68 лет, мужчина.
* **Why Chosen:**
  * Flawlessly demonstrates the *Surviving Sepsis Campaign Hour-1 Bundle* and pharmacology titration rules.
  * Initial vitals: Temp 39.1°C, BP 75/45 (MAP 55 mm Hg), HR 128 bpm, RR 26/min, Lactate 4.8 mmol/L.
* **System Capabilities Demonstrated:**
  * Multi-target pharmacology: Crystalloids (30 ml/kg) + Broad-spectrum IV Antibiotics + Norepinephrine infusion.
  * Vasopressor titration: SBP increases by +30 mm Hg upon norepinephrine administration.
  * Safety Engine: Vasodilators (Nitroglycerin, ACE-inhibitors) and Beta-blockers are flagged as dangerous.
* **Expected Pathway:**
  1. *Blood cultures + CBC + BMP + Lactate.*
  2. *Empiric broad-spectrum antibiotics within 1 hour.*
  3. *IV Crystalloids (fluids).*
  4. *Norepinephrine infusion to maintain MAP $\ge 65\text{ mm Hg}$.*
* **Anticipated Professor Questions:**
  * *Q: "Какой вазопрессор выбран в качестве первой линии и почему?"*  
    *A: "Норадреналин является препаратом выбора 1-й линии по клиническим рекомендациям Минздрава РФ и Surviving Sepsis Campaign, превосходя дофамин по снижению риска аритмий и летальности."*

---

### 4. BEST CLOSED-LOOP REASSESSMENT CASE: Case #2 (Острая левожелудочковая недостаточность / Отек легких)

* **Department:** `icu` | **Specialty:** `cardiac` | **Severity:** `critical`
* **Patient Demographics:** Кузнецов Виктор Андреевич, 64 года, мужчина.
* **Why Chosen:**
  * Demonstrates the iterative cycle: **Intervene $\to$ Measure $\to$ Reassess $\to$ De-escalate/Escalate**.
  * Patient presents in severe orthopnea: SpO2 82%, RR 34/min, BP 190/110 mm Hg, pink frothy sputum, bilateral moist crackles.
* **System Capabilities Demonstrated:**
  * Interactive `ReassessmentModal.jsx`: Evaluating dynamic change in dyspnea and blood pressure.
  * Simultaneous respiratory and pharmacological therapy: High-flow Oxygen/CPAP + IV Furosemide + Sublingual Nitroglycerin (indicated here due to severe hypertension 190/110).
* **Expected Pathway:**
  1. *Immediate Respiratory Support:* Oxygen (SpO2 recovers from 82% $\to$ 92%).
  2. *Preload/Afterload Reduction:* Furosemide IV + Nitroglycerin SL.
  3. *Reassessment:* Blood pressure decreases from 190/110 $\to$ 145/85; respiratory rate slows from 34 $\to$ 22.
* **Anticipated Professor Questions:**
  * *Q: "Почему здесь Нитроглицерин разрешен, а в Кейсе #1 был противопоказан?"*  
    *A: "Здесь у пациента гипертонический отек легких с АД 190/110 мм рт.ст. Вазодилатация нитратами снижает постнагрузку и разгружает левый желудочек. В Кейсе #1 была гипотония 80/55 при нижнем инфаркте, где нитраты смертельно опасны."*

---

### 5. BEST AMBULATORY & ROUTING CASE: Case `outp_1` (Стабильная стенокардия напряжения II ФК)

* **Department:** `outpatient` | **Specialty:** `cardiac` | **Severity:** `moderate`
* **Patient Demographics:** Лебедев Алексей Иванович, 52 года, мужчина.
* **Why Chosen:**
  * Proves MEDSIM is not solely an ICU simulator, but also covers primary ambulatory care, anamnesis taking, and outpatient routing.
* **System Capabilities Demonstrated:**
  * Detailed anamnesis of chest pain on exertion (stops within 3–5 min of rest).
  * Outpatient diagnostic battery: 12-lead ECG, Lipid panel, Fasting glucose, Stress ECG (Treadmill test).
  * Patient Routing: Outpatient Cardiology consultation and prescription of long-term cardioprotection (Aspirin, Statin, Beta-blocker).

---

## 📊 Summary Selection Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEMONSTRATION CASE SELECTION                       │
├──────────────┬──────────────────┬─────────────────┬─────────────────────────┤
│ Case ID      │ Clinical Focus   │ Primary Skill   │ Safety Lesson           │
├──────────────┼──────────────────┼─────────────────┼─────────────────────────┤
│ Case #1      │ STEMI & Shock    │ ABCDE & PCI     │ No nitrates in RV shock │
│ Case #10     │ Ischemic Stroke  │ CT Differential │ No tPA without CT brain │
│ Case #25     │ Septic Shock     │ Sepsis Hour-1   │ Fluids + Norepinephrine │
│ Case #2      │ Pulmonary Edema  │ Reassessment    │ Nitrates + CPAP in HTN  │
│ Case outp_1  │ Stable Angina    │ Outpatient Care │ Prevention & Routing    │
└──────────────┴──────────────────┴─────────────────┴─────────────────────────┘
```
