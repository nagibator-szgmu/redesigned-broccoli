# MEDSIM V2.5 — PROFESSOR DEMONSTRATION GUIDE (10–15 MINUTE SCRIPT)

**Target Audience:** Medical University Professor / Department Head / Academic Curriculum Committee  
**Presenter Role:** Lead Medical Educational Software Architect & Clinical Presenter  
**Total Duration:** 12–15 Minutes  
**Prerequisites:** MEDSIM V2.5 running locally on `http://localhost:3000` in Google Chrome (1440×900 resolution recommended, Dark Theme active).

---

## ⏱️ Executive Presentation Timeline

```
[00:00 - 02:00] 1. Architecture, Educational Vision & Scope (Menu Hub)
[02:00 - 05:00] 2. Bedside Workstation & ABCDE Assessment (Case #1: STEMI)
[05:00 - 08:00] 3. Diagnostic Ordering, Lab Feedback & Treatment (Interactive Loop)
[08:00 - 10:30] 4. Deterioration, Reassessment Modal & Emergency Response
[10:30 - 13:00] 5. Diagnostic Conclusion & 11-Point Closed-Loop Debrief
[13:00 - 15:00] 6. Theory Synopses, Quiz Assessment & Academic Q&A
```

---

## 🎬 Step-by-Step Presentation Script

---

### STEP 1: Main Menu Hub & Educational Scope [00:00 – 02:00]

* **Action (What to click):**
  1. Open `http://localhost:3000/app` in browser.
  2. Click through the department filter chips: **ОРИТ (ICU)** $\to$ **Приёмное (Admission)** $\to$ **Поликлиника (Outpatient)** $\to$ **Стационар (Inpatient)**.
* **What the Professor Sees:**
  * Clean, hospital workstation cockpit layout (Dark `#0b0f19` / Light theme).
  * 67 structured clinical cases categorized by 4 clinical departments and 7 specialties (Кардиология, Неврология, Пульмонология, Инфекции, Эндокринология, Токсикология, Хирургия).
  * Triage badges (КРИТИЧЕСКИЙ / СРОЧНЫЙ / СТАБИЛЬНЫЙ), difficulty stars, estimated time limits, and official Ministry of Health guideline citations (`cr.minzdrav.gov.ru`).
* **Educational Value Demonstrated:**
  * Shows comprehensive clinical breadth covering both high-acuity resuscitation and ambulatory primary care triage.
* **Presenter Script (Verbal Cue):**
  > *"Здравствуйте, глубокоуважаемый профессор! Перед вами MEDSIM V2.5 — отечественный клинический интерактивный симулятор для студентов 4–6 курсов и ординаторов. В отличие от простых тестовых сборников, здесь смоделированы 67 клинических сценариев в 4 отделениях: реанимация, приёмный покой, поликлиника и стационар. Каждый кейс основан на действующих клинических рекомендациях Минздрава России."*

---

### STEP 2: Clinical Workstation & ABCDE Bedside Flow [02:00 – 05:00]

* **Action (What to click):**
  1. Select **ОРИТ (ICU)** filter.
  2. Click on **Case #1: Мельников С.П., 61 год (Острый коронарный синдром / Инфаркт миокарда)**.
  3. Workstation opens in 2-column layout.
* **What the Professor Sees:**
  * **Top Sticky Vitals HUD:** Live hemodynamic telemetry with animated pulse rhythm: HR 115 bpm (tachycardia alert), BP 80/55 (hypotension/shock alert), SpO2 90% (hypoxemia alert), RR 28/min, Temp 36.8°C, GCS 14/15, Pain 9/10.
  * **Left Column:** Patient ID, Chief Complaint (*"Давящая боль за грудиной 2 часа, одышка, холодный пот"*), structured Anamnesis (Disease history vs Life history), Physical Examination findings.
  * **Right Column:** Action Command Center with tabs for **Исследования (Diagnostics)**, **Назначения (Treatments)**, **Диагноз (Diagnosis & Routing)**, and **Консультация (Consult)**.
* **Educational Value Demonstrated:**
  * 2-column layout eliminates cognitive clutter and replicates real emergency room ergonomics (monitored patient chart on the left, order entry on the right).
* **Presenter Script (Verbal Cue):**
  > *"Мы открыли случай острого инфаркта миокарда. Обратите внимание на верхнюю панель телеметрии: пациент нестабилен — гипотония 80/55, тахикардия, сатурация 90%. Слева — полная медицинская карта с разделением анамнеза заболевания и жизни, справа — пульт принятия решений. Студент не просто читает текст, он оценивает пациента по стандарту ABCDE."*

---

### STEP 3: Diagnostic Ordering, Lab Results & Differential Reasoning [05:00 – 08:00]

* **Action (What to click):**
  1. Click **Исследования (Diagnostics)** tab.
  2. In search bar, type `ЭКГ` $\to$ click checkbox for **ЭКГ в 12 отведениях**.
  3. Type `Тропонин` $\to$ click checkbox for **Тропонин I/T**.
  4. Click button **В ЛАБОРАТОРИЮ (Назначить)**.
  5. Wait 3 seconds for results to resolve $\to$ click revealed results in patient timeline.
* **What the Professor Sees:**
  * Instant search filter isolates needed tests from 29 modalities.
  * Lab turnaround feedback: ECG reveals *"Элевация ST во II, III, aVF на 3 мм — острый нижний инфаркт миокарда"*; Troponin reveals *"🔴 4.8 нг/мл (норма <0.04)"*.
  * Active Problem List automatically flags *"Синдром острой миокардиальной ишемии"* and *"Кардиогенный шок I стадии"*.
* **Educational Value Demonstrated:**
  * Demonstrates evidence-based diagnostic verification and rapid data interpretation under time constraints.
* **Presenter Script (Verbal Cue):**
  > *"Студент назначает ЭКГ и тропонин. Через несколько секунд лаборатория возвращает реальные клинические данные: элевация ST в нижних отведениях и положительный тропонин. Система сразу обновляет список проблем пациента, обучая синдромальному мышлению."*

---

### STEP 4: Therapeutic Intervention, Safety Engine & Reassessment Loop [08:00 – 10:30]

* **Action (What to click):**
  1. Click **Назначения (Treatments)** tab.
  2. Prescribe **Оксигенотерапия (oxygen)** $\to$ SpO2 begins rising.
  3. Prescribe **Аспирин 325 мг (aspirin)** and **Гепарин в/в (heparin)**.
  4. Prescribe **Экстренное ЧКВ (pci)**.
  5. *(Optional Safety Demo)*: Explain why **Нитроглицерин (nitroglycerin)** and **Метопролол (metoprolol)** are NOT prescribed (due to SBP 80 mm Hg / inferior STEMI shock risk).
  6. Click **🔄 Оценить динамику (Reassessment)** button.
* **What the Professor Sees:**
  * Dynamic physiological onset: SpO2 rises to 96%, pain decreases from 9 to 4.
  * Reassessment Modal opens: Displays trajectory status, hemodynamic response, and decision options (`ПРОДОЛЖИТЬ ТЕРАПИЮ`, `ЭСКАЛИРОВАТЬ`, `ИЗМЕНИТЬ ПЛАН`, `ЗАВЕРШИТЬ`).
* **Educational Value Demonstrated:**
  * Enforces closed-loop clinical practice: **Assess $\to$ Treat $\to$ Reassess $\to$ Adapt**. Demonstrates pharmacology contraindication safety engine.
* **Presenter Script (Verbal Cue):**
  > *"Мы даём кислород, двойную антитромботическую терапию и направляем на ЧКВ. Обратите внимание: симулятор учитывает фармакодинамику — нитроглицерин и бета-блокаторы здесь противопоказаны из-за гипотонии и риска усугубления шока при нижнем инфаркте. Кнопка 'Оценить динамику' активирует цикл повторной оценки: студент видит, как пациент реагирует на лечение."*

---

### STEP 5: Diagnosis Conclusion & 11-Point Closed-Loop Debrief [10:30 – 13:00]

* **Action (What to click):**
  1. Click **Диагноз+Лечение (Diagnosis)** tab.
  2. In text input, enter: `Острый инфаркт миокарда с подъемом ST`.
  3. Click **✓ ЗАВЕРШИТЬ СЛУЧАЙ**.
  4. The **ResultScreen & DebriefPanel** mounts.
* **What the Professor Sees:**
  * **Score Card:** 95–100% (Grade: **Отлично** / 5 звёзд), breakdown of diagnostic points (20/20), therapeutic points (20/20), clinical diagnosis (35/35), anamnesis (10/10), outcome (+20), and time bonus (+15).
  * **11-Section Closed-Loop Debrief:**
    1. Исход пациента (Стабилизирован).
    2. Итоговый балл и оценка.
    3. Оценка диагностического поиска (Выполнены все ключевые тесты).
    4. Оценка фармакотерапии (Аспирин, гепарин, кислород, ЧКВ).
    5. Противопоказания и опасные действия (Опасных действий не допущено).
    6. Качество динамической переоценки (Reassessment loop).
    7. Тайм-менеджмент и скорость реакции.
    8. Клиническая траектория гемодинамики (хронология витальных функций).
    9. Официальные клинические рекомендации (КР Минздрава РФ 2020).
    10. Рекомендованные темы для повторения теории.
    11. Ключевые образовательные выводы по случаю.
* **Educational Value Demonstrated:**
  * Comprehensive summative and formative feedback. Debrief is dynamically constructed from the student's actual trajectory, not static text.
* **Presenter Script (Verbal Cue):**
  > *"Случай завершён. Результат — 95 баллов, 'Отлично'. Но самое ценное для преподавателя — вот этот 11-пунктовый разбор. Он не статичен: если бы студент допустил ошибку, дал бета-блокатор или пропустил ЭКГ, дебрифинг точно указал бы на клинические последствия, списал баллы и дал ссылку на страницу КР Минздрава РФ."*

---

### STEP 6: Theory Synopses, Protocols, Quizzes & Conclusion [13:00 – 15:00]

* **Action (What to click):**
  1. Click **← В меню** $\to$ Click **Теория (Theory)** in header navigation.
  2. Open category **Кардиология** $\to$ Click topic **Острый коронарный синдром (ОКС)**.
  3. Briefly show the Clinical Protocol (ACLS algorithm) and click **Пройти тест (Quiz)**.
* **What the Professor Sees:**
  * Formatted medical textbook synopses with pathogenesis, diagnostic criteria, classification, treatment algorithms, and clinical pearls.
  * Interactive self-assessment quiz with immediate rationale feedback for correct and incorrect answer options.
* **Educational Value Demonstrated:**
  * Demonstrates end-to-end curriculum integration: Theory $\to$ Quiz $\to$ Case Simulation $\to$ Debrief $\to$ Certificate.
* **Presenter Script (Verbal Cue):**
  > *"В симулятор встроен полный теоретический курс: 35 иллюстрированных тем, алгоритмы ACLS/ATLS и 130 тестовых вопросов. Студент может изучить теорию, закрепить её тестом, отработать клинический кейс и получить сертификат. Система полностью готова к интеграции в учебный процесс вашей кафедры. Готов ответить на ваши вопросы!"*

---

## 🎯 Presentation Quick Tips for Presenter

1. **Keep Pace:** Do not linger more than 1 minute on pure reading; emphasize the dynamic telemetry changes and debrief sections.
2. **If Asked About Cheating:** Show how entering a diagnosis without treating yields a failing/unsatisfactory score.
3. **If Asked About Guidelines:** Point directly to the clickable citation linking to `cr.minzdrav.gov.ru` in the debrief panel.
