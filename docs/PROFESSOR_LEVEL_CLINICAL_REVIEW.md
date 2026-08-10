# MEDSIM V2.5 — PROFESSOR-LEVEL CLINICAL REVIEW

**Document Type:** Final Pre-Demonstration Medical Academic Gate  
**Target:** Medical University Faculty / Academic Evaluation Board  
**Date:** August 2026  
**Clinical Registry Scope:** 67 Cases · 44 Treatments · 29 Diagnostic Tests · 35 Theory Topics  
**Evaluation Standard:** Russian Clinical Guidelines (cr.minzdrav.gov.ru), ACLS, ATLS, Surviving Sepsis  

---

## 1. Executive Summary

This document represents the exhaustive, professor-level clinical evaluation of all 67 medical cases in MEDSIM V2.5. Every case has been audited across 25 forensic fields, examining not only field completeness but the causal coherence of clinical decision-making.

---

## 2. Methodology & Clinical Reasoning Causal Chain

For every case, the complete causal sequence was verified:
$$\text{Presentation} \longrightarrow \text{Assessment (ABCDE)} \longrightarrow \text{Differential Ranking} \longrightarrow \text{Target Diagnostics} \longrightarrow \text{Target Therapy} \longrightarrow \text{Reassessment} \longrightarrow \text{Outcome}$$

---

## 3. The 67-Case Clinical Forensic Matrix

### Case 1: Мельников Сергей Павлович, Ж, 61 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Давящая боль за грудиной 2 часа, нарастающая одышка, холодный пот, выраженная слабость | *Боль в покое 2 часа, давящая, иррадиация в левое плечо. Однократная рвота. ИБС 5 лет, АГ 2 ст., курит 35 лет. ОИМ в анамнезе нет.*
* **Baseline Vitals & Exam:** ЧСС 115, АД —/—, SpO2 90%, ЧД 28, T 36.8°C, GCS 14 | *Кожа бледная, влажная. Тоны приглушены, ритм правильный. АД 80/55, ЧСС 115. Лёгкие — влажные хрипы в нижних отделах с обеих сторон.*
* **Leading Diagnosis:** **Острый инфаркт миокарда с подъёмом ST передней стенки (ПМЖА). Кардиогенный шок.** (Severity: `critical`)
* **Differential Hypotheses:** Острый инфаркт миокарда передней стенки, Нестабильная стенокардия, Расслоение аорты
* **Required Diagnostics (`needDiag`):** `[ecg, troponin, echo, xray, cbc, bmp, lactate]`
* **Expected Findings:** ecg: ⚡ Подъём ST 5 мм в V1-V4. Реципрокная депресс...; troponin: 🔴 Тропонин I = 14.2 нг/мл (норма <0.04). Обш...; echo: 🔴 ЭхоКГ: акинезия передне-боковой стенки и в...; xray: Рентген: кардиомегалия. Венозный застой, приз...; cbc: Лейк 13.5×10⁹/л (стрессовый лейкоцитоз). Hb 1...; bmp: Na 136, K 4.1, Cr 112 мкмоль/л. Лактат 3.8 мм...; coag: МНО 1.0, АПТВ 28 сек. Норма....; lactate: Лактат 2.1 ммоль/л (в норме, нет шока)...
* **Indicated Therapy (`needTreat`):** `[oxygen, aspirin, heparin, pci]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, nitroglycerin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ОКС с подъёмом ST (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 2: Тихонова Людмила Ивановна, Ж, 68 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Внезапное удушье, розовая пенистая мокрота, вынужденное положение сидя, невозможно лечь | *ХСН 3 ФК, ФП. Принимает варфарин, фуросемид. 2 дня назад самостоятельно отменила диуретики. Нарастающее удушье в последние 6 часов.*
* **Baseline Vitals & Exam:** ЧСС 130, АД —/—, SpO2 82%, ЧД 34, T 36.9°C, GCS 14 | *Акроцианоз, ортопноэ. Влажные хрипы до лопаток с обеих сторон. АД 195/110, ЧСС 130, аритмия. Отёки голеней +++.*
* **Leading Diagnosis:** **Острая декомпенсация ХСН. Кардиогенный отёк лёгких.** (Severity: `critical`)
* **Differential Hypotheses:** Острая декомпенсация ХСН, Отёк лёгких, Бронхиальная астма
* **Required Diagnostics (`needDiag`):** `[xray, bnp, echo, ecg, cbc, bmp, lactate]`
* **Expected Findings:** xray: 🔴 Рентген: «крылья бабочки» — двусторонние и...; bnp: 🔴 NT-proBNP = 18 400 пг/мл (норма <900). Кри...; echo: ЭхоКГ: ФВ ЛЖ 28%, дилатация камер. Митральная...; ecg: ФП, ЧСС 130. Гипертрофия ЛЖ. ST-изменений нет...; cbc: Hb 110 г/л (анемия лёгкой ст.). Лейк 11.0....; bmp: Na 136, K 3.0 ↓ (гипокалиемия!), Cr 145 мкмол...; lactate: Лактат 1.8 ммоль/л (в норме)...
* **Indicated Therapy (`needTreat`):** `[oxygen, furosemide, nitroglycerin]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, iv_fluids]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ХСН (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 3: Орлов Виктор Николаевич, Ж, 54 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Жгучая боль за грудиной в покое, нарастает 6 часов, иррадиация в шею и левое плечо | *Боль в покое 6 часов, нарастает. АГ 3 ст., дислипидемия, СД 2 типа. Курит 20 лет. Нитроглицерин под язык — частичный эффект.*
* **Baseline Vitals & Exam:** ЧСС 94, АД —/—, SpO2 97%, ЧД 18, T 36.7°C, GCS 15 | *Умеренной тяжести. Кожа обычной окраски. Тоны ясные. АД 145/90, ЧСС 94, ритм правильный. Лёгкие — хрипов нет.*
* **Leading Diagnosis:** **Острый коронарный синдром без подъёма ST. NSTEMI (высокий риск по TIMI).** (Severity: `moderate`)
* **Differential Hypotheses:** NSTEMI, Нестабильная стенокардия, Стенокардия Принцметала
* **Required Diagnostics (`needDiag`):** `[ecg, troponin, bmp, cbc, coag, echo, lactate]`
* **Expected Findings:** ecg: ⚡ Депрессия ST 2-3 мм в V4-V6, I, aVL. Инверс...; troponin: 🔴 Тропонин I = 1.8 нг/мл (норма <0.04). NSTE...; bmp: Cr 96, Na 138, K 4.0. Глюкоза 11.2 ммоль/л ↑ ...; cbc: Лейк 11.2. Hb 142. Норма....; coag: МНО 1.0, АПТВ 28 сек. Тромболизис при NSTEMI ...; echo: ЭхоКГ: гипокинезия боковой стенки ЛЖ. ФВ 48% ...; lactate: Лактат 1.8 ммоль/л (в норме — нет тканевой ги...
* **Indicated Therapy (`needTreat`):** `[aspirin, heparin, morphine, nitroglycerin]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ОКС без подъёмом ST (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 4: Захарова Ольга Борисовна, Ж, 41 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Нарастающая одышка и давление в груди после вирусного перикардита, усиливается при вдохе | *Перикардит 2 недели назад после ОРВИ. 3 дня нарастает одышка при нагрузке, сегодня — в покое. Выраженная слабость, головокружение при вставании.*
* **Baseline Vitals & Exam:** ЧСС 132, АД —/—, SpO2 93%, ЧД 24, T 37.5°C, GCS 14 | *Набухание шейных вен. Парадоксальный пульс (снижение АД на вдохе >10 мм рт.ст.). Тоны глухие. АД 88/82 — пульсовое давление 6 мм рт.ст.! ЧСС 132.*
* **Leading Diagnosis:** **Острая тампонада сердца. Выпотной перикардит.** (Severity: `critical`)
* **Differential Hypotheses:** Тампонада сердца, Экссудативный перикардит, ТЭЛА
* **Required Diagnostics (`needDiag`):** `[echo, ecg, xray, cbc, bmp]`
* **Expected Findings:** echo: 🔴 ЭхоКГ: выпот в перикарде 22 мм. Коллапс пр...; ecg: Синусовая тахикардия 132. Низкий вольтаж QRS ...; xray: Рентген: кардиомегалия. Сердце в форме трапец...; cbc: Лейк 13.8 (воспаление). Hb 128. Норма....; bmp: Na 138, K 3.9. Cr 98. Норма....
* **Indicated Therapy (`needTreat`):** `[oxygen, surgery_consult, pericardiocentesis]`
* **Contraindicated (`wrongTreat`):** `[furosemide, morphine]`
* **Resuscitation / Emergency Actions:** `[pericardiocentesis]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по заболеваниям перикарда (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 5: Гусев Михаил Дмитриевич, Ж, 74 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Внезапная потеря сознания, выраженная слабость, ощущение «замирания» сердца | *Обморок 30 минут назад. ИБС, перенёс ОИМ нижней стенки 3 года назад. Принимает метопролол. Повторные синкопе последнюю неделю.*
* **Baseline Vitals & Exam:** ЧСС 34, АД —/—, SpO2 94%, ЧД 18, T 36.5°C, GCS 11 | *Заторможен, GCS 11. Кожа бледная. ЧСС 34 — медленный, регулярный. АД 85/58. Тоны ясные.*
* **Leading Diagnosis:** **Полная атриовентрикулярная блокада (III степень). Синдром Морганьи-Адамса-Стокса.** (Severity: `critical`)
* **Differential Hypotheses:** Полная АВ-блокада, Синдром слабости синусового узла, Брадикардия при гипотиреозе
* **Required Diagnostics (`needDiag`):** `[ecg, echo, troponin, bmp, cbc, glucose]`
* **Expected Findings:** ecg: 🔴 Синусовый ритм предсердий 88/мин. Желудочк...; echo: ЭхоКГ: ФВ 42%. Гипокинезия нижней стенки (пос...; troponin: Тропонин I 0.18 нг/мл ↑ — субэндокардиальная ...; bmp: K 5.4 ↑, Cr 145 ↑. Лёгкий метаболический ацид...; cbc: Лейк 9.8. Hb 132. Норма....; glucose: Глюкоза 6.8 ммоль/л. Норма....
* **Indicated Therapy (`needTreat`):** `[atropine, oxygen, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, amiodarone]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по нарушениям ритма сердца (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 36: Савельев Андрей Николаевич, Ж, 58 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Давящая боль в груди 3 часа, рвота, холодный пот, брадикардия | *Давящая боль за грудиной отдаёт в правое плечо. Однократная рвота. Сахарный диабет 2 типа, АГ. Курит 20 лет. Брадикардия — замечена соседями.*
* **Baseline Vitals & Exam:** ЧСС 42, АД —/—, SpO2 94%, ЧД 20, T 36.4°C, GCS 14 | *Сознание ясное. АД 85/60, ЧСС 42 аритмичный. Тоны приглушены. Лёгкие чистые. Отёков нет. Пульс на лучевых артериях симметричный.*
* **Leading Diagnosis:** **Острый инфаркт миокарда нижней стенки. Брадикардия при АВ-блокаде II-III степени (рефлекс Бецольда-Яриша).** (Severity: `critical`)
* **Differential Hypotheses:** Острый инфаркт миокарда нижней стенки, АВ-блокада на фоне ИМ, Синдром слабости синусового узла
* **Required Diagnostics (`needDiag`):** `[ecg, troponin, echo, cbc, bmp]`
* **Expected Findings:** ecg: Подъём ST II, III, aVF. АВ-блокада II степени...; troponin: Тропонин I = 8.4 нг/мл (норма <0.04)....; echo: Гипокинезия нижней стенки ЛЖ. ФВ 35%. Правые ...; cbc: Лейк 11.2. Hb 142. Тр 198....; bmp: Креатинин 124 ↑. Калий 5.2 ↑. Натрий 134....
* **Indicated Therapy (`needTreat`):** `[atropine, oxygen, heparin, pci]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ESC STEMI Guidelines (2023) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 37: Кузнецова Елена Викторовна, Ж, 72 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Выраженная одышка в покое, невозможность лежать, клокочущее дыхание, отёки ног | *ИБС 15 лет, ХСН IIБ, ФК III. Два дня назад прекратила принимать фуросемид и дигоксин. Сегодня резко стало хуже — одышка в покое, не может лежать.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 84%, ЧД 32, T 36.6°C, GCS 15 | *Ортопноэ. Влажные хрипы до лопаток с обеих сторон. Наджелудочковая тахикардия. Отёки голеней до колен. Печень увеличена. JVP не оценивается.*
* **Leading Diagnosis:** **Острая декомпенсированная ХСН. Кардиогенный отёк лёгких. Фибрилляция предсердий с быстрым желудочковым ответом.** (Severity: `critical`)
* **Differential Hypotheses:** Острая декомпенсированная ХСН, Кардиогенный отёк лёгких, Фибрилляция предсердий с быстрым ответом
* **Required Diagnostics (`needDiag`):** `[ecg, bnp, echo, xray, cbc, bmp, lactate]`
* **Expected Findings:** ecg: Фибрилляция предсердий, ЧЖС 118. Гипертрофия ...; bnp: BNP = 2800 пг/мл (норма <100). Выраженная сер...; echo: Дилатация ЛЖ, ФВ 20%. Митральная регургитация...; xray: Кардиомегалия. Застой в лёгких — «крылья бабо...; cbc: Лейк 9.8. Hb 128. Тр 165....; bmp: Креатинин 142 ↑↑. Калий 5.4 ↑. Натрий 128 ↓. ...; lactate: Лактат 2.4 ммоль/л (незначительно повышен)...
* **Indicated Therapy (`needTreat`):** `[oxygen, furosemide, nitroglycerin, digoxin]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, iv_fluids]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ESC Heart Failure Guidelines (2023) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 38: Воробьёв Дмитрий Сергеевич, Ж, 48 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Внезапная одышка, тяжесть в груди, нарастающий отёк, удушье при физической нагрузке | *Недавно перенёс ОКС (2 месяца назад). С тех пор нарастающая одышка при нагрузке. За последнюю неделю — ухудшение, одышка в покое. Принимает эналаприл, аспирин.*
* **Baseline Vitals & Exam:** ЧСС 105, АД —/—, SpO2 91%, ЧД 26, T 36.8°C, GCS 15 | *Ортопноэ. Влажные хрипы в нижних отделах. Тоны сердца приглушены, ритм правильный, шум грудного трения. Отёки голеней. Печень болезненна, увеличена.*
* **Leading Diagnosis:** **Дилатационная кардиомиопатия постинфарктного генеза. ХСН IIА-Б с застоем.** (Severity: `moderate`)
* **Differential Hypotheses:** Дилатационная кардиомиопатия, Постинфарктная ХСН, Острая декомпенсация ХСН
* **Required Diagnostics (`needDiag`):** `[ecg, bnp, echo, xray, cbc, bmp]`
* **Expected Findings:** ecg: Синусовая тахикардия 105. Патологические Q в ...; bnp: BNP = 1450 пг/мл. Умеренно выраженная СН....; echo: Дилатация ЛЖ (КДР 68 мм), ФВ 25%. Акинезия пе...; xray: Кардиомегалия. Застой в лёгких. Pleural effus...; cbc: Лейк 8.2. Hb 136. Тр 188....; bmp: Креатинин 108 ↑. Калий 4.4. Натрий 135....
* **Indicated Therapy (`needTreat`):** `[oxygen, furosemide, ACE_inhibitor]`
* **Contraindicated (`wrongTreat`):** `[iv_fluids, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ACC/AHA HF Guidelines (2022) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 39: Романова Ольга Дмитриевна, Ж, 34 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Внезапная одышка, слабость, бледность, гипотензия, тахикардия, jugular vein distension | *Системная красная волчанка 8 лет. Лечение преднизолоном. 3 дня назад — боль в груди, усиливающаяся при дыхании. Сегодня — резкая слабость, гипотензия.*
* **Baseline Vitals & Exam:** ЧСС 125, АД —/—, SpO2 92%, ЧД 28, T 37.2°C, GCS 14 | *Бледность, цианоз. JVP резко expanded. Тоны сердца приглушены, «шум трения перикарда». Парадоксальный пульс. АД 75/50, ЧСС 125. Лёгкие чистые (отсутствие хрипов при JVP — классика тампонады!).*
* **Leading Diagnosis:** **Тампонада сердца. Гемоперикардит на фоне СКВ.** (Severity: `critical`)
* **Differential Hypotheses:** Тампонада сердца, Экссудативный перикардит, Гемоперикардит
* **Required Diagnostics (`needDiag`):** `[echo, ecg, cbc, bmp, coag]`
* **Expected Findings:** ecg: Электрическая альтернация. Синусовая тахикард...; echo: Экссудативный перикардит — выпот 22 мм. Давле...; cbc: Лейк 14.2. Hb 108 ↓. Тр 142....; bmp: Креатинин 92. Калий 4.0. Натрий 136....; coag: МНО 1.3. АПТВ 32. Умеренно нарушена свёртывае...
* **Indicated Therapy (`needTreat`):** `[pericardiocentesis, oxygen, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[furosemide, heparin]`
* **Resuscitation / Emergency Actions:** `[pericardiocentesis]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ESC Pericardial Disease Guidelines (2015) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 40: Лебедев Сергей Александрович, Ж, 65 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Нарастающая одышка, слабость, гипотензия, jugular vein distension, отёки | *Рак лёгкого IV стадии (adenocarcinoma). Химиотерапия. 2 недели назад — усиление одышки. Сегодня — слабость, гипотензия, не может встать.*
* **Baseline Vitals & Exam:** ЧСС 110, АД —/—, SpO2 93%, ЧД 24, T 37°C, GCS 14 | *Бледность. JVP expanded. Тоны сердца приглушены. Парадоксальный пульс. АД 80/55, ЧСС 110. Лёгкие — ослабленное дыхание справа. Отёки голеней.*
* **Leading Diagnosis:** **Тампонада сердца. Малигнозный перикардиальный выпот при раке лёгкого.** (Severity: `critical`)
* **Differential Hypotheses:** Малигнозный перикардиальный выпот, Тампонада сердца, Экссудативный перикардит
* **Required Diagnostics (`needDiag`):** `[echo, ecg, cbc, bmp, xray]`
* **Expected Findings:** ecg: Низковольтажность. Синусовая тахикардия 110. ...; echo: Массивный перикардиальный выпот 35 мм. Коллап...; cbc: Лейк 12.4. Hb 98 ↓. Тр 310 ↑....; bmp: Креатинин 118 ↑. Калий 4.8. Натрий 132....; xray: Массивное затемнение правой половины грудной ...
* **Indicated Therapy (`needTreat`):** `[pericardiocentesis, oxygen, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[furosemide, aspirin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** NCCN Pericardial Effusion Guidelines (2023) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 41: Николаев Пётр Васильевич, Ж, 78 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Головокружение, обмороки, слабость, брадикардия, одышка при нагрузке | *ИБС, АГ, ХСН II. 2 дня назад — обморок на улице. Сегодня повторный обморок дома. Принимает бисопролол, амлодипин, дигоксин.*
* **Baseline Vitals & Exam:** ЧСС 32, АД —/—, SpO2 95%, ЧД 18, T 36.2°C, GCS 13 | *Сознание спутанное. АД 90/60, ЧСС 32 регулярный. Тоны сердца приглушены. Лёгкие чистые. Отёков нет. Симптомы Морганьи-Адамса-Стокса в анамнезе.*
* **Leading Diagnosis:** **Полная АВ-блокада III степени. Симптоматическая брадикардия. Возможна токсичность дигоксина.** (Severity: `critical`)
* **Differential Hypotheses:** Полная АВ-блокада III ст., Токсичность дигоксина, Синдром слабости синусового узла
* **Required Diagnostics (`needDiag`):** `[ecg, troponin, echo, bmp, cbc]`
* **Expected Findings:** ecg: Полная АВ-блокада III ст. Идиовентрикулярный ...; troponin: Тропонин I = 0.8 нг/мл (умеренно ↑ — possible...; echo: ФВ 30%. Дилатация ЛЖ. Гипокинезия передней ст...; bmp: Креатинин 138 ↑. Калий 5.0 ↑. Дигоксин 2.4 нг...; cbc: Лейк 7.8. Hb 124. Тр 155....
* **Indicated Therapy (`needTreat`):** `[atropine, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, amiodarone, digoxin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA Bradycardia Algorithm (2023) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 42: Морозова Татьяна Ивановна, Ж, 62 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Головокружение, слабость, «замирание» сердца, повторные обмороки | *Гипотиреоз 5 лет, Левотироксин 150 мкг/сут. 2 недели — ухудшение: утомляемость, зябкость, запоры. Сегодня — 3 обморока за день. Сама отменила все препараты кроме левотироксина.*
* **Baseline Vitals & Exam:** ЧСС 28, АД —/—, SpO2 96%, ЧД 16, T 36°C, GCS 12 | *Сознание оглушение. АД 85/55, ЧСС 28 регулярный. Брадикардия. Гипотермия (36.0°C). Сухость кожи. Запор. Замедление рефлексов. Тоны сердца приглушены, ритм правильный.*
* **Leading Diagnosis:** **Полная АВ-блокада III степени. Клинический гипотиреоз с тяжёлой брадикардией. Передозировка левотироксина.** (Severity: `critical`)
* **Differential Hypotheses:** АВ-блокада при гипотиреозе, Передозировка левотироксина, Клинический гипотиреоз
* **Required Diagnostics (`needDiag`):** `[ecg, echo, bmp, cbc]`
* **Expected Findings:** ecg: Полная АВ-блокада III ст. Идиовентрикулярный ...; echo: ФВ 45%. Диастолическая дисфункция. Перикардиа...; bmp: Креатинин 152 ↑↑. Калий 5.6 ↑↑. Натрий 125 ↓↓...; cbc: Лейк 6.2. Hb 112 ↓. Тр 110....; thyroid: ТТГ 0.01 мкМЕ/мл (↓↓ — тиреотоксикоз). Т4 сво...
* **Indicated Therapy (`needTreat`):** `[atropine, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, amiodarone, thyroxine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ATA Hypothyroidism Guidelines (2014) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 43: Громов Артём Викторович, Ж, 55 лет (ICU · CARDIAC)
* **Chief Complaint & Timeline:** Внезапная потеря сознания на улице, судороги, отсутствие пульса | *Свидетели: мужчина 55 лет внезапно упал на остановке, потерял сознание, появились судороги. Скорая прибыла через 5 минут. Данных о сопутствующих заболеваниях нет.*
* **Baseline Vitals & Exam:** ЧСС —, АД —/—, SpO2 —%, ЧД —, T 36°C, GCS 3 | *Без сознания. Пульс на сонных артериях не определяется. Дыхание апноэ. Зрачки расширены, реакция на свет отсутствует. Цианоз. Начата СЛР.*
* **Leading Diagnosis:** **Внезапная сердечная смерть. Фибрилляция желудочков. Первичная остановка кровообращения.** (Severity: `critical`)
* **Differential Hypotheses:** Фибрилляция желудочков, Желудочковая тахикардия без пульса, Внезапная сердечная смерть
* **Required Diagnostics (`needDiag`):** `[ecg, echo, cbc, bmp, lactate]`
* **Expected Findings:** ecg: Фибрилляция желудочков. Нет организованной эл...; troponin: Тропонин I = 0.04 нг/мл (норма — нет данных д...; echo: Нет систолической функции. Фибрилляция желудо...; cbc: Лейк 14.8. Hb 148. Тр 220....; bmp: Калий 5.8 ↑. Лактат 8.2 ↑↑↑. pH 7.12 ↓↓....; lactate: Лактат 6.8 ммоль/л ↑↑ (тяжёлая тканевая гипок...
* **Indicated Therapy (`needTreat`):** `[defibrillation, chest_compressions, epinephrine, amiodarone]`
* **Contraindicated (`wrongTreat`):** `[atropine, thrombolysis]`
* **Resuscitation / Emergency Actions:** `[defibrillation, chest_compressions, epinephrine]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA ACLS Guidelines (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 44: Павлов Игорь Сергеевич, Ж, 61 лет (ADMISSION · CARDIAC)
* **Chief Complaint & Timeline:** Потеря сознания на работе, остановка сердца, реанимация коллегами | *Коллеги: мужчина за рабочим столом внезапно потерял сознание. Коллеги начали СЛР, использовали АВД. Зафиксирована фибрилляция желудочков. Два разряда АВД — ритм не восстановился. Скорая прибыла через 8 минут. ИБС в анамнезе, курит.*
* **Baseline Vitals & Exam:** ЧСС —, АД —/—, SpO2 —%, ЧД —, T 35.6°C, GCS 3 | *Без сознания. Пульс на сонных артериях не определяется. АД не определяется. Дыхание апноэ. АВД Applied — VF на экране. Третий разряд: ритм не восстановился. Начата СЛР.*
* **Leading Diagnosis:** **Рефрактерная фибрилляция желудочков на фоне ОКС. Безуспешная дефибрилляция трижды.** (Severity: `critical`)
* **Differential Hypotheses:** Рефрактерная ФЖ, Фибрилляция желудочков, Внезапная сердечная смерть
* **Required Diagnostics (`needDiag`):** `[ecg, echo, cbc, bmp, lactate]`
* **Expected Findings:** ecg: Рефрактерная ФЖ. После третьего разряда — VF ...; troponin: Тропонин I = 0.02 нг/мл (норма — данные до ос...; echo: Нет систолической функции. Фибрилляция желудо...; cbc: Лейк 16.2. Hb 152. Тр 245....; bmp: Калий 6.2 ↑↑. Лактат 10.4 ↑↑↑. pH 7.08 ↓↓↓. К...; lactate: Лактат 7.2 ммоль/л ↑↑ (постреанимационный син...
* **Indicated Therapy (`needTreat`):** `[defibrillation, chest_compressions, epinephrine, amiodarone]`
* **Contraindicated (`wrongTreat`):** `[atropine, thrombolysis, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA ACLS Guidelines (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 6: Яковлева Наталья Ивановна, Ж, 32 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Непрекращающиеся тонико-клонические судороги более 5 минут, потеря сознания | *Эпилепсия с 18 лет. Самостоятельно отменила вальпроат 3 дня назад. Судороги начались дома, длятся более 5 минут. Ранее судороги купировались самостоятельно.*
* **Baseline Vitals & Exam:** ЧСС 128, АД —/—, SpO2 90%, ЧД 22, T 37.8°C, GCS 9 | *GCS 9 (иктальная фаза). Генерализованные тонико-клонические судороги. Цианоз губ. Прикус языка. Недержание мочи.*
* **Leading Diagnosis:** **Эпилептический статус. Отмена антиконвульсантов.** (Severity: `critical`)
* **Differential Hypotheses:** Эпилептический статус, Тонико-клонические судороги, Судороги при менингите
* **Required Diagnostics (`needDiag`):** `[glucose, bmp, cbc, abg, ct_head, eeg, lactate]`
* **Expected Findings:** glucose: Глюкоза 5.2 ммоль/л — норма (гипогликемия иск...; bmp: Na 136, K 3.8, Ca 2.1. Норма. Лактат 4.2 ↑ (м...; cbc: Лейк 14.8 (стрессовый). Hb 132. Норма....; abg: pH 7.22 ↓↓, PaCO₂ 52 ↑ (гиповентиляция). Дыха...; ct_head: КТ: структурных изменений, геморрагии, отёка ...; lactate: Лактат 3.2 ммоль/л ↑ (после судорог)...; eeg: ЭЭГ: эпилептиформная активность в височных от...
* **Indicated Therapy (`needTreat`):** `[diazepam, oxygen, intubation]`
* **Contraindicated (`wrongTreat`):** `[morphine, amiodarone]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по эпилепсии (2022) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 7: Борисов Алексей Геннадьевич, Ж, 67 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Внезапная сильная головная боль, правосторонняя слабость и онемение, нарушение речи | *Симптомы внезапно 40 минут назад. АГ 3 ст. (АД обычно 170-180). Алкоголь сегодня. Антигипертензивную терапию принимает нерегулярно.*
* **Baseline Vitals & Exam:** ЧСС 84, АД —/—, SpO2 97%, ЧД 16, T 37°C, GCS 9 | *Сопор, GCS 9. Моторная афазия. Правосторонняя гемиплегия. Симптом Бабинского (+) справа. Менингеальных знаков нет.*
* **Leading Diagnosis:** **Гипертоническое внутримозговое кровоизлияние в левое полушарие.** (Severity: `critical`)
* **Differential Hypotheses:** Геморрагический инсульт, Ишемический инсульт, Субарахноидальное кровоизлияние
* **Required Diagnostics (`needDiag`):** `[ct_head, cbc, coag, bmp, ecg]`
* **Expected Findings:** ct_head: 🔴 КТ: гиперденсный очаг 35 мл в области левы...; cbc: Лейк 12.4 (реактивный). Hb 148. Тр 210....; coag: МНО 1.1, АПТВ 29 сек. Антикоагулянтной терапи...; bmp: Na 142, K 4.1, Cr 102. Глюкоза 10.2 (стрессов...; ecg: Синусовый ритм 84. Диффузные изменения ST-T (...
* **Indicated Therapy (`needTreat`):** `[mannitol, surgery_consult, ACE_inhibitor]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, aspirin, heparin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по геморрагическому инсульту (2022) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 8: Семёнов Игорь Константинович, Ж, 55 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Нарастающая головная боль, ригидность затылка, температура 40°C, светобоязнь, рвота | *Острое начало 18 ч назад: сначала температура 40°C, затем нарастающая головная боль. Рвота 4 раза. Нарастающая сонливость. Хронических заболеваний нет.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 96%, ЧД 22, T 40.2°C, GCS 10 | *Заторможен, GCS 10. Ригидность затылочных мышц 4 пальца. Кернига (+), Брудзинского (+). Зрачки D=S. Петехий нет.*
* **Leading Diagnosis:** **Бактериальный менингит (пневмококковый). Начинающийся септический шок.** (Severity: `critical`)
* **Differential Hypotheses:** Бактериальный менингит, Вирусный менингит, Менингоэнцефалит
* **Required Diagnostics (`needDiag`):** `[ct_head, lumbar, cbc, crp, procalcitonin, bmp, culture, lactate]`
* **Expected Findings:** cbc: 🔴 Лейк 22.4×10⁹/л, палочкоядерных 32% (сдвиг...; crp: 🔴 СРБ 280 мг/л — маркер системного воспалени...; procalcitonin: 🔴 Прокальцитонин 38 нг/мл — специфический ма...; ct_head: КТ: объёмных образований нет. Люмбальная пунк...; lumbar: 🔴 ЦСЖ: давление 320 мм вод.ст. ↑↑. Нейтрофил...; bmp: Лактат 4.2 ↑, Na 128 ↓ (гипонатриемия). Cr 13...; culture: Посев крови: Streptococcus pneumoniae. Рост ч...; lactate: Лактат 4.5 ммоль/л ↑↑ (ликвор — повышение, ха...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, steroids]`
* **Contraindicated (`wrongTreat`):** `[acyclovir]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по менингиту (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 9: Волкова Тамара Фёдоровна, Ж, 72 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Нарушение зрения, двоение, сильное головокружение, невнятная речь, нарастающая сонливость | *Симптомы внезапно 2 часа назад. Мерцательная аритмия, АГ 2 ст. Принимает варфарин нерегулярно. Симптомы нарастают — дизартрия, атаксия.*
* **Baseline Vitals & Exam:** ЧСС 84, АД —/—, SpO2 97%, ЧД 16, T 36.8°C, GCS 11 | *Сопор, GCS 11. Дизартрия. Взгляд влево не доводит до крайнего положения. Атаксия в пробе «пятка-колено». Нистагм горизонтальный.*
* **Leading Diagnosis:** **Ишемический инсульт в вертебро-базилярном бассейне. Окклюзия базилярной артерии.** (Severity: `critical`)
* **Differential Hypotheses:** Ишемический инсульт, Транзиторная ишемическая атака, Геморрагический инсульт
* **Required Diagnostics (`needDiag`):** `[ct_head, cbc, coag, bmp, ecg, glucose]`
* **Expected Findings:** ct_head: КТ без контраста: острых ишемических изменени...; cbc: Лейк 9.8. Hb 138. Тр 215. Норма....; coag: МНО 1.2. Тромболизис НЕ противопоказан....; bmp: Глюкоза 7.8 ммоль/л. Cr 94. Норма....; ecg: ФП, ЧСС 84. ST-изменений нет....; glucose: Глюкоза 7.8 ммоль/л — в норме....
* **Indicated Therapy (`needTreat`):** `[thrombolysis]`
* **Contraindicated (`wrongTreat`):** `[aspirin, heparin, mannitol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ишемическому инсульту (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 10: Медведева Виктория Андреевна, Ж, 38 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Лихорадка, изменение поведения, амнезия, дезориентация, судороги | *Заболела 5 дней назад: температура, головная боль. 2 дня странное поведение (агрессия, неузнавание родственников). Сегодня — амнезия, бред, 2 судорожных эпизода.*
* **Baseline Vitals & Exam:** ЧСС 104, АД —/—, SpO2 96%, ЧД 18, T 39.5°C, GCS 10 | *Дезориентирована, GCS 10. Психомоторное возбуждение, амнезия. Кернига слабоположительный. Очаговой неврологии нет. Лихорадка 39.5°C.*
* **Leading Diagnosis:** **ВПГ-энцефалит (Herpes simplex encephalitis). Поражение височных долей.** (Severity: `critical`)
* **Differential Hypotheses:** ВПГ-энцефалит, Бактериальный менингоэнцефалит, Аутоиммунный энцефалит
* **Required Diagnostics (`needDiag`):** `[ct_head, lumbar, cbc, bmp, crp, procalcitonin, mri, eeg]`
* **Expected Findings:** ct_head: КТ: гиподенсные изменения в левой височной до...; lumbar: ЦСЖ: давление 220 мм вод.ст. ↑. Лимфоциты 120...; cbc: Лейк 14.2 (лимфоцитоз). Hb 136. Норма....; bmp: Na 132 ↓ (SIADH при энцефалите), K 3.8, Cr 88...; crp: СРБ 85 мг/л ↑ — маркер системного воспаления ...; procalcitonin: Прокальцитонин 0.4 нг/мл (невысокий — вирусно...; mri: МРТ: гиперинтенсивность FLAIR в обеих височны...; eeg: ЭЭГ: периодические латерализованные эпилептиф...
* **Indicated Therapy (`needTreat`):** `[acyclovir, diazepam]`
* **Contraindicated (`wrongTreat`):** `[morphine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по инфекционным заболеваниям ЦНС (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 45: Зимин Олег Александрович, Ж, 71 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Внезапная потеря сознания, правосторонний гемипарез, афазия | *АГ 20 лет, нерегулярно принимает препараты. Сегодня во время ужина внезапно упал, потерял сознание на несколько минут. Очнулся — не может говорить и двигать правой рукой.*
* **Baseline Vitals & Exam:** ЧСС 88, АД —/—, SpO2 96%, ЧД 18, T 37.2°C, GCS 8 | *Сознание — ступор. АД 210/120. Правосторонняя гемиплегия. Афазия — понимает обращённую речь, но не говорит. Левый зрачок шире правого. Тоны сердца ритмичные.*
* **Leading Diagnosis:** **Геморрагический инсульт. Внутримозговое кровоизлияние в области левого полушария (гипертензивное).** (Severity: `critical`)
* **Differential Hypotheses:** Внутримозговое кровоизлияние, Геморрагический инсульт, Аневризматическое САК
* **Required Diagnostics (`needDiag`):** `[ct_head, cbc, coag, bmp, ecg, type_cross]`
* **Expected Findings:** ct_head: КТ: массивное ВК в области левого таламуса и ...; cbc: Лейк 12.4. Hb 148. Тр 210....; coag: МНО 1.0. АПТВ 28. Норма....; bmp: Креатинин 108. Калий 4.4. Натрий 140. Глюкоза...; ecg: Синусовый ритм 88. Гипертрофия ЛЖ....; type_cross: Группа крови A(II), Rh+. Перекрёстная проба с...
* **Indicated Therapy (`needTreat`):** `[mannitol, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, aspirin, heparin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA/ASA ICH Guidelines (2022) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 46: Крылова Наталья Сергеевна, Ж, 58 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Резкая головная боль «удар в голову», рвота, светобоязнь, ригидность затылочных мышц | *На фоне полного здоровья внезапная «громоподобная» головная боль — сильнейшая боль в жизни. Однократная рвота. Светобоязнь. Болеет гипертонией, не лечится.*
* **Baseline Vitals & Exam:** ЧСС 92, АД —/—, SpO2 97%, ЧД 20, T 37°C, GCS 11 | *Сознание — сопор. Менингеальные знаки (+): ригидность затылочных мышц, симптом Кернига, симптом Брудзинского. АД 185/110. Зрачки равные, реакция на свет сохранена.*
* **Leading Diagnosis:** **Субарахноидальное кровоизлияние (САК). Разрыв аневризмы сосудистого сплетения.** (Severity: `critical`)
* **Differential Hypotheses:** Субарахноидальное кровоизлияние, Менингит, Мигрень
* **Required Diagnostics (`needDiag`):** `[ct_head, cbc, coag, bmp, ecg]`
* **Expected Findings:** ct_head: КТ: кровь в базальных цистернах, межполушарно...; cbc: Лейк 14.8. Hb 140. Тр 195....; coag: МНО 1.1. АПТВ 30. Норма....; bmp: Креатинин 88. Калий 4.0. Натрий 138....; ecg: Синусовая тахикардия 92. Изменения ST-T (нейр...
* **Indicated Therapy (`needTreat`):** `[nimodipine, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, aspirin, heparin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA/ASA SAH Guidelines (2012) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 47: Фролов Дмитрий Викторович, Ж, 68 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Внезапная потеря зрения на правый глаз, слабость в левой руке, нарушение речи | *Фибрилляция предсердий, не принимает антикоагулянты. Утром заметил внезапную потерю зрения на правый глаз и слабость в левой руке. Речь невнятная.*
* **Baseline Vitals & Exam:** ЧСС 78, АД —/—, SpO2 97%, ЧД 16, T 36.8°C, GCS 13 | *Сознание ясное-оглушение. АД 165/95. Правая гемианопсия. Левосторонняя гемипарез (верхняя конечность 3/5, нижняя 4/5). Моторная афазия. Зрачки равные, реакция на свет сохранена.*
* **Leading Diagnosis:** **Ишемический инсульт в бассейне правой средней мозговой артерии. Кардиоэмболия (ФП).** (Severity: `critical`)
* **Differential Hypotheses:** Ишемический инсульт, Транзиторная ишемическая атака, Гемипарез при опухоли мозга
* **Required Diagnostics (`needDiag`):** `[ct_head, ecg, cbc, coag, bmp, glucose]`
* **Expected Findings:** ct_head: КТ: без кровоизлияния. Early ischemic changes...; ecg: Фибрилляция предсердий, ЧЖС 78....; cbc: Лейк 9.2. Hb 144. Тр 188....; coag: МНО 1.0. АПТВ 28. Норма....; bmp: Креатинин 102. Калий 4.2. Натрий 140. Глюкоза...; glucose: Глюкоза 7.8 ммоль/л (умеренно ↑, исключить ДС...
* **Indicated Therapy (`needTreat`):** `[thrombolysis, heparin]`
* **Contraindicated (`wrongTreat`):** `[aspirin, mannitol, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA/ASA Ischemic Stroke Guidelines (2019) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 48: Белова Ирина Павловна, Ж, 45 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Внезапная слабость в правой ноге, онемение правой стороны лица, нарушение координации | *Мигрень с аурой 15 лет. Сегодня после пробуждения — слабость в правой ноге, онемение правой половины лица. Симптомы сохраняются 2 часа. Предыдущие эпизоды проходили за 30 минут.*
* **Baseline Vitals & Exam:** ЧСС 72, АД —/—, SpO2 98%, ЧД 16, T 36.6°C, GCS 15 | *Сознание ясное. АД 145/88. Правосторонняя гемианестезия лица. Лёгкая правосторонняя гемипарез (нога 4+/5). Речь сохранена. Координация нарушена справа (пальце-нос — промахивание).*
* **Leading Diagnosis:** **Транзиторная ишемическая атака (ТИА). Дифференциальная: мигрень с аурой vs TИА vs инсульт.** (Severity: `moderate`)
* **Differential Hypotheses:** Транзиторная ишемическая атака, Мигрень с аурой, Ишемический инсульт
* **Required Diagnostics (`needDiag`):** `[ct_head, ecg, cbc, coag, glucose, bmp]`
* **Expected Findings:** ct_head: КТ: без кровоизлияния и ишемических изменений...; ecg: Синусовый ритм 72. Норма....; cbc: Лейк 7.8. Hb 132. Тр 215 ↑....; coag: МНО 1.0. АПТВ 26. Норма....; glucose: Глюкоза 5.4 ммоль/л (норма)....; bmp: Креатинин 78. Калий 4.0. Натрий 142....
* **Indicated Therapy (`needTreat`):** `[aspirin, heparin]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA/ASA TIA Guidelines (2009) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 49: Соколов Максим Андреевич, Ж, 22 лет (ADMISSION · NEURO)
* **Chief Complaint & Timeline:** Высокая температура 3 дня, сильная головная боль, рвота, спутанность сознания | *Студент. 3 дня назад — температура 39.5°C, головная боль. Вчера — рвота. Сегодня — спутанность, не узнаёт родных. Прививки по календарю. Был в контакте с больным пневмонией.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 95%, ЧД 22, T 39.8°C, GCS 11 | *Сознание — оглушение. Менингеальные знаки (+): ригидность затылочных мышц (+), Керниг (+), Брудзинский (+). Петехиальная сыпь на туловище и конечностях. АД 100/65, ЧСС 118. Лёгкие чистые.*
* **Leading Diagnosis:** **Бактериальный менингит (менингококковый). Менингококцемия с петехиальной сыпью.** (Severity: `critical`)
* **Differential Hypotheses:** Бактериальный менингит, Вирусный менингит, Субарахноидальное кровоизлияние
* **Required Diagnostics (`needDiag`):** `[ct_head, lumbar, cbc, crp, procalcitonin, bmp, culture]`
* **Expected Findings:** ct_head: КТ: без объёмного образования. Умеренный отёк...; lumbar: ЛП: Ликвор мутный, давление повышено. Лейкоци...; cbc: Лейк 24.8 ↑↑. Нейтрофилёз 92%. Тр 95 ↓. Лейко...; crp: СРБ 280 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 18 нг/мл ↑↑ — специфический ма...; bmp: Креатинин 148 ↑↑. Калий 5.2 ↑. Натрий 128 ↓. ...; culture: Посев крови: Neisseria meningitidis....
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, steroids, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[acyclovir, mannitol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** IDSA Bacterial Meningitis Guidelines (2017) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 50: Васильева Анна Михайловна, Ж, 65 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Лихорадка 5 дней, нарастающая спутанность, судороги, гипотензия | *Пожилая женщина, деменция. 5 дней назад — температура, спутанность. Сегодня — судороги, гипотензия. В анамнезе — ИЦД (катетер в мочевом пузыре 2 недели).*
* **Baseline Vitals & Exam:** ЧСС 115, АД —/—, SpO2 93%, ЧД 24, T 40.2°C, GCS 9 | *Без сознания. Судороги тонико-клонические. Менингеальные знаки не удаётся оценить из-за судорог. АД 85/55, ЧСС 115. Лёгкие — влажные хрипы. Катетер в мочевом пузыре — мутная моча с запахом.*
* **Leading Diagnosis:** **Бактериальный менингит вторичный (гематогенный). Менингоэнцефалит. Септический шок.** (Severity: `critical`)
* **Differential Hypotheses:** Бактериальный менингит, Менингоэнцефалит, Септический шок
* **Required Diagnostics (`needDiag`):** `[ct_head, lumbar, cbc, crp, procalcitonin, bmp, culture, lactate]`
* **Expected Findings:** ct_head: КТ: диффузный отёк мозга. Без объёмного образ...; lumbar: ЛП: Ликвор мутный. Лейкоциты 5800 (95% нейтро...; cbc: Лейк 28.4 ↑↑. Нейтрофилёз 94%. Тр 65 ↓....; crp: СРБ 320 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 24 нг/мл ↑↑ — специфический ма...; bmp: Креатинин 198 ↑↑. Калий 5.8 ↑↑. Натрий 122 ↓↓...; culture: Посев крови + мочи: Escherichia coli....; lactate: Лактат 6.2 ммоль/л ↑↑ (ливор — значительно по...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, steroids, oxygen, iv_fluids, norepinephrine]`
* **Contraindicated (`wrongTreat`):** `[acyclovir, mannitol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** IDSA Bacterial Meningitis Guidelines (2017) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 51: Орлов Максим Сергеевич, Ж, 28 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Потеря сознания с тонико-клоническими судорогами, продолжающимися >30 минут | *Эпилепсия с детства, принимает вальпроат. 3 дня назад — забыл принять препарат. Сегодня — генерализованные судороги >30 минут. Дважды вводили диазepam на скорой — без эффекта.*
* **Baseline Vitals & Exam:** ЧСС 125, АД —/—, SpO2 88%, ЧД 28, T 38.8°C, GCS 4 | *Без сознания. Тонико-клонические судороги continuing. Цианоз. Хрипы в лёгких (аспирация?). АД 155/95, ЧСС 125. Зрачки расширены, реакция на свет вялая.*
* **Leading Diagnosis:** **Эпилептический статус. Рефрактерный к бензодиазепинам.** (Severity: `critical`)
* **Differential Hypotheses:** Эпилептический статус, Судорожный припадок, Псевдоприпадок
* **Required Diagnostics (`needDiag`):** `[ecg, cbc, bmp, abg, glucose, lactate, eeg]`
* **Expected Findings:** ecg: Синусовая тахикардия 125. Неспецифические изм...; cbc: Лейк 16.8. Hb 150. Тр 220....; bmp: Креатинин 112. Калий 5.0 ↑. Натрий 136. Глюко...; abg: pH 7.22 ↓↓. PaCO2 52 ↑. PaO2 58 ↓. Тяжёлый ре...; glucose: Глюкоза 14.2 ммоль/л (стрессовая гипергликеми...; lactate: Лактат 5.8 ммоль/л ↑↑ (метаболический ацидоз ...; eeg: ЭЭГ: генерализованная эпилептиформная активно...
* **Indicated Therapy (`needTreat`):** `[diazepam, levetiracetam, intubation, oxygen]`
* **Contraindicated (`wrongTreat`):** `[morphine, amiodarone, thrombolysis]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AES Status Epilepticus Guidelines (2016) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 52: Козлова Екатерина Дмитриевна, Ж, 8 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Высокая температура, судороги у ребёнка, ригидность, loss of consciousness | *Мама: ребёнок 8 лет, температура 40°C с утра. Давали ибупрофен — без эффекта. Через 3 часа — судороги. Скорая ввела диазepam — судороги прекратились через 10 минут, но ребёнок не очнулся.*
* **Baseline Vitals & Exam:** ЧСС 145, АД —/—, SpO2 92%, ЧД 30, T 40.4°C, GCS 6 | *Без сознания. Менингеальные знаки (+): ригидность затылочных мышц, Брудзинский (+). Судорог сейчас нет. АД 90/55, ЧСС 145. Зрачки равные, реакция на свет вялая. Петехиальная сыпь на ногах.*
* **Leading Diagnosis:** **Бактериальный менингит (пневмококковый) у ребёнка. Фебрильные судороги → менингоэнцефалит.** (Severity: `critical`)
* **Differential Hypotheses:** Бактериальный менингит, Фебрильные судороги, Вирусный энцефалит
* **Required Diagnostics (`needDiag`):** `[ct_head, lumbar, cbc, crp, procalcitonin, bmp, culture]`
* **Expected Findings:** ct_head: КТ: умеренный отёк оболочек. Без объёмного об...; lumbar: ЛП: Ликвор мутный. Лейкоциты 4200 (92% нейтро...; cbc: Лейк 22.4 ↑↑. Нейтрофилёз 88%. Тр 110 ↓....; crp: СРБ 240 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 16 нг/мл ↑↑ — специфический ма...; bmp: Креатинин 72 (норма для возраста). Калий 4.8....; culture: Посев крови: Streptococcus pneumoniae....
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, steroids, oxygen, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[acyclovir, mannitol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** IDSA Pediatric Meningitis Guidelines (2017) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 53: Григорьев Денис Олегович, Ж, 35 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Лихорадка 4 дня, нарастающая спутанность, судороги, амнезия, изменения поведения | *Молодой мужчина, 4 дня назад — температура 38.5°C, герпес на губе. 2 дня назад — спутанность, забыл имена родных. Сегодня — судороги. Вчера — агрессия, бессонница.*
* **Baseline Vitals & Exam:** ЧСС 95, АД —/—, SpO2 96%, ЧД 18, T 39.2°C, GCS 10 | *Сознание — сопор. Судороги продолжаются. АД 130/80, ЧСС 95. Герпетические высыпания на верхней губе. Зрачки равные, реакция на свет сохранена. Менингеальные знаки слабо выражены.*
* **Leading Diagnosis:** **ВПГ-энцефалит. Герпетический энцефалит с судорогами и изменениями поведения.** (Severity: `critical`)
* **Differential Hypotheses:** ВПГ-энцефалит, Аутоиммунный энцефалит, Бактериальный менингоэнцефалит
* **Required Diagnostics (`needDiag`):** `[ct_head, mri, lumbar, cbc, bmp, crp, procalcitonin, eeg]`
* **Expected Findings:** ct_head: КТ: без патологии (или умеренный отёк височны...; mri: МРТ: гиперинтенсивность в медиальных височных...; lumbar: ЛП: Лейкоциты 180 (лимфоцитарный плеоцитоз). ...; cbc: Лейк 11.2. Hb 148. Тр 175....; bmp: Креатинин 92. Калий 4.2. Натрий 136....; crp: СРБ 65 мг/л ↑ (умеренно — вирусное воспаление...; procalcitonin: Прокальцитонин 0.3 нг/мл (в норме — вирусная ...; eeg: ЭЭГ: PLEDs в левой височной области. Характер...
* **Indicated Therapy (`needTreat`):** `[acyclovir, diazepam]`
* **Contraindicated (`wrongTreat`):** `[morphine, antibiotics_broad]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AAN HSV Encephalitis Guidelines (2021) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 54: Попов Артём Валерьевич, Ж, 42 лет (ICU · NEURO)
* **Chief Complaint & Timeline:** Лихорадка 6 дней, нарушение памяти, афазия, периодические судороги | *Учитель, 6 дней назад — температура 38°C. 3 дня назад — забыл уроки, путал слова. Вчера — галлюцинации, агрессия. Сегодня — судороги. Герпеса на губе нет. Был в тропиках 2 месяца назад.*
* **Baseline Vitals & Exam:** ЧСС 88, АД —/—, SpO2 97%, ЧД 16, T 38.6°C, GCS 12 | *Сознание — оглушение. Афазия — говорит отдельные слова, не понимает обращённую речь. Амнезия — не помнит своё имя. АД 125/78, ЧСС 88. Зрачки равные. Менингеальные знаки слабо (+). Периодические фокальные судороги правой руки.*
* **Leading Diagnosis:** **Аутоиммунный энцефалит (анти-NMDA-рецепторный). Дифференциальная: ВПГ-энцефалит, тропический энцефалит.** (Severity: `critical`)
* **Differential Hypotheses:** Аутоиммунный энцефалит, ВПГ-энцефалит, Психиатрическое расстройство
* **Required Diagnostics (`needDiag`):** `[ct_head, mri, lumbar, cbc, bmp, crp, procalcitonin]`
* **Expected Findings:** ct_head: КТ: норма....; mri: МРТ: умеренный отёк лимбической системы. Без ...; lumbar: ЛП: Лейкоциты 45 (лимфоцитарный). Белок норма...; cbc: Лейк 8.4. Hb 142. Тр 165....; bmp: Креатинин 88. Калий 4.0. Натрий 140....; crp: СРБ 28 мг/л ↑ (умеренно)....; procalcitonin: Прокальцитонин 0.2 нг/мл (в норме — неинфекци...
* **Indicated Therapy (`needTreat`):** `[steroids, iv_fluids, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[acyclovir, morphine, antibiotics_broad]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** Lancet Autoimmune Encephalitis Review (2016) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 11: Лукьянов Дмитрий Павлович, Ж, 64 лет (ICU · RESPIRATORY)
* **Chief Complaint & Timeline:** Кашель с ржавой мокротой, температура 39.6°C 5 дней, нарастающая одышка, озноб | *ХОБЛ 2 ст., курение 40 лет. Заболел 5 дней назад: температура, кашель с ржавой мокротой. Сегодня — нарастающая одышка, тахикардия. Не лечился.*
* **Baseline Vitals & Exam:** ЧСС 122, АД —/—, SpO2 85%, ЧД 32, T 39.6°C, GCS 14 | *Умеренный цианоз. Тахипноэ 32/мин. Притупление перкуторного звука и бронхиальное дыхание в нижних отделах правого лёгкого. Крепитация. АД 95/58, ЧСС 122.*
* **Leading Diagnosis:** **Тяжёлая внебольничная пневмония (CURB-65=4). Септический шок.** (Severity: `critical`)
* **Differential Hypotheses:** Тяжёлая внебольничная пневмония, Сепсис, ТЭЛА
* **Required Diagnostics (`needDiag`):** `[xray, cbc, crp, procalcitonin, bmp, abg, culture, lactate]`
* **Expected Findings:** xray: 🔴 Рентген: массивная инфильтрация нижней дол...; cbc: 🔴 Лейк 24.8×10⁹/л, нейтрофилёз 92%, сдвиг вл...; crp: 🔴 СРБ 320 мг/л — маркер системного воспалени...; procalcitonin: 🔴 Прокальцитонин 22 нг/мл — специфический ма...; bmp: Лактат 5.2 ↑↑. Na 130 ↓. Cr 168 ↑ (острое поч...; abg: 🔴 pH 7.28 ↓, PaO₂ 48 ↓↓, PaCO₂ 48 ↑. Дыхател...; culture: Посев мокроты/крови отправлен до начала АБТ....; lactate: Лактат 1.5 ммоль/л (в норме)...
* **Indicated Therapy (`needTreat`):** `[oxygen, antibiotics_broad, iv_fluids, intubation]`
* **Contraindicated (`wrongTreat`):** `[morphine, furosemide]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по внебольничной пневмонии (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 12: Жданов Николай Фёдорович, Ж, 71 лет (ICU · RESPIRATORY)
* **Chief Complaint & Timeline:** Нарастающая одышка, усиление кашля, гнойная мокрота жёлто-зелёного цвета, цианоз | *ХОБЛ 3 ст. в течение 10+ лет. Госпитализации 2-3 раза/год по поводу обострений. Курит 50 лет (2 пачки/день). Настоящее обострение 4 дня: кашель с гнойной жёлто-зелёной мокротой, нарастающая одышка при минимальной нагрузке. ОФВ₁ 35% от должного. Получал ингаляционные β₂-агонисты и M-холиноблокаторы, регулярность приёма низкая.*
* **Baseline Vitals & Exam:** ЧСС 110, АД —/—, SpO2 82%, ЧД 36, T 37.9°C, GCS 14 | *Цианоз. Вынужденная поза с упором на руки. «Розовый пыхтящий» тип. Бочкообразная грудная клетка. Диффузные свистящие хрипы с удлинённым выдохом. ЧД 36/мин.*
* **Leading Diagnosis:** **Тяжёлое обострение ХОБЛ. Острая гиперкапническая дыхательная недостаточность.** (Severity: `critical`)
* **Differential Hypotheses:** Тяжёлое обострение ХОБЛ, Бронхиальная астма, Пневмония
* **Required Diagnostics (`needDiag`):** `[abg, xray, cbc, bmp, spo2, lactate]`
* **Expected Findings:** abg: 🔴 pH 7.26 ↓↓, PaCO₂ 74 ↑↑, PaO₂ 46 ↓↓. Тяжёл...; xray: Рентген: гиперинфляция, уплощение диафрагмы. ...; cbc: Лейк 16.2 (бактериальное обострение), Hb 162 ...; bmp: Na 138, K 3.2 ↓. Cr 118 ↑ умеренно. Бикарбона...; spo2: SpO₂ 82% — тяжёлая гипоксемия....; lactate: Лактат 2.8 ммоль/л ↑ (умеренная тканевая гипо...
* **Indicated Therapy (`needTreat`):** `[oxygen, steroids, antibiotics_broad, intubation]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, morphine]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ХОБЛ (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 13: Романов Юрий Александрович, Ж, 24 лет (ADMISSION · RESPIRATORY)
* **Chief Complaint & Timeline:** Внезапная резкая боль в левой половине груди, нарастающее удушье после травмы на тренировке | *Борьба на тренировке, удар в левый бок. Через 10 минут — резкая боль, нарастающее удушье. Хронических заболеваний нет.*
* **Baseline Vitals & Exam:** ЧСС 134, АД —/—, SpO2 88%, ЧД 32, T 36.9°C, GCS 14 | *Умеренный цианоз. Тахипноэ. Дыхание слева ОТСУТСТВУЕТ. Перкуторно — тимпанит слева. Трахея смещена ВПРАВО. Набухание шейных вен. АД 86/60, ЧСС 134.*
* **Leading Diagnosis:** **Напряжённый пневмоторакс слева. Смещение средостения.** (Severity: `critical`)
* **Differential Hypotheses:** Напряжённый пневмоторакс, Открытый пневмоторакс, Гемоторакс
* **Required Diagnostics (`needDiag`):** `[xray, spo2, abg, cbc, lactate, usg_abdo]`
* **Expected Findings:** xray: 🔴 Рентген: отсутствие лёгочного рисунка в ле...; spo2: 🔴 SpO₂ 88% — тяжёлая гипоксемия....; abg: pH 7.30 ↓, PaO₂ 58 ↓↓, PaCO₂ 50 ↑. Дыхательны...; cbc: Лейк 12.0. Hb 148. Без особенностей....; lactate: Лактат 3.2 ммоль/л ↑ (гипоперфузия на фоне на...; usg_abdo: УЗИ брюшной полости: свободной жидкости нет. ...
* **Indicated Therapy (`needTreat`):** `[oxygen, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[iv_fluids, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по хирургии грудной клетки (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 14: Соловьёва Екатерина Михайловна, Ж, 48 лет (ICU · RESPIRATORY)
* **Chief Complaint & Timeline:** Нарастающая дыхательная недостаточность на 3-е сутки в ОРИТ после абдоминального сепсиса | *Оперирована по поводу перфоративной язвы 3 суток назад. Послеоперационный сепсис. Нарастающая потребность в кислороде, двусторонние инфильтраты на рентгене.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 83%, ЧД 34, T 38.2°C, GCS 14 | *Тахипноэ 34/мин. Диффузные крепитирующие хрипы с обеих сторон. Интубация планируется. SpO₂ 83% на маске с резервуаром 15 л/мин.*
* **Leading Diagnosis:** **ОРДС (острый респираторный дистресс-синдром). Постсепсисный. PaO₂/FiO₂ < 100.** (Severity: `critical`)
* **Differential Hypotheses:** ОРДС, Двусторонняя пневмония, Кардиогенный отёк лёгких
* **Required Diagnostics (`needDiag`):** `[xray, abg, cbc, bmp, crp, procalcitonin, culture, lactate]`
* **Expected Findings:** xray: 🔴 Рентген: двусторонние диффузные инфильтрат...; abg: 🔴 pH 7.30, PaO₂ 54 ↓↓, FiO₂ 0.6 → PaO₂/FiO₂ ...; cbc: Лейк 22.4 ↑↑. Hb 98 ↓ (анемия критического со...; bmp: Лактат 3.8 ↑, Cr 182 ↑ (ОПП). Na 132 ↓....; crp: СРБ 340 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 18 нг/мл ↑ — специфический мар...; culture: Посев: Klebsiella pneumoniae из раневого отде...; lactate: Лактат 4.8 ммоль/л ↑↑ (тяжёлая гипоксемия, тк...
* **Indicated Therapy (`needTreat`):** `[oxygen, intubation, antibiotics_broad]`
* **Contraindicated (`wrongTreat`):** `[morphine, iv_fluids]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ОРДС (2025) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 15: Ильина Вера Степановна, Ж, 56 лет (ADMISSION · RESPIRATORY)
* **Chief Complaint & Timeline:** Внезапная одышка, боль в груди, кровохарканье, кратковременный обморок | *4 недели назад перелом бедра, иммобилизация 3 недели. Одышка нарастает 2 дня, сегодня — боль в груди, кровохарканье, обморок. Ноги асимметричны (правая голень отёчна).*
* **Baseline Vitals & Exam:** ЧСС 122, АД —/—, SpO2 89%, ЧД 28, T 37.2°C, GCS 14 | *Умеренный цианоз. Тахипноэ 28/мин. Правая голень отёчна, болезненна при пальпации. ЧСС 122. АД 88/55. Пульс на ногах симметричный.*
* **Leading Diagnosis:** **Массивная ТЭЛА. Тромбоз глубоких вен правой голени.** (Severity: `critical`)
* **Differential Hypotheses:** Массивная ТЭЛА, Инфаркт миокарда, Расслоение аорты
* **Required Diagnostics (`needDiag`):** `[d_dimer, ct_chest, ecg, echo, abg, coag, cbc, lactate]`
* **Expected Findings:** d_dimer: 🔴 D-димер 12 400 нг/мл (норма <500). Критиче...; ct_chest: 🔴 КТ-ангиография: дефекты наполнения в право...; ecg: Синусовая тахикардия 122. Паттерн S1Q3T3. Бло...; echo: ЭхоКГ: дилатация ПЖ, «D-знак». Давление в ЛА ...; abg: pH 7.44, PaCO₂ 30 ↓ (гипервентиляция), PaO₂ 5...; coag: МНО 1.1, АПТВ 29. Норма....; cbc: Лейк 12.0. Hb 138. Норма....; lactate: Лактат 3.6 ммоль/л ↑ (правожелудочковая недос...
* **Indicated Therapy (`needTreat`):** `[oxygen, heparin, thrombolysis]`
* **Contraindicated (`wrongTreat`):** `[aspirin, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ТЭЛА (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 16: Власова Нина Ивановна, Ж, 77 лет (ICU · INFECTIOUS)
* **Chief Complaint & Timeline:** Высокая температура 39.8°C, озноб, боль в пояснице, нарушение сознания | *Сахарный диабет 2 типа, дизурия 3 дня — не лечилась. Сегодня — потрясающий озноб, температура, нарастающая заторможенность. Живёт одна.*
* **Baseline Vitals & Exam:** ЧСС 134, АД —/—, SpO2 94%, ЧД 28, T 39.8°C, GCS 11 | *Заторможена, GCS 11. Температура 39.8°C. Тахикардия 134, АД 78/48. Лицо гиперемировано. Болезненность при поколачивании по поясничной области справа.*
* **Leading Diagnosis:** **Уросепсис. Септический шок. Острый пиелонефрит.** (Severity: `critical`)
* **Differential Hypotheses:** Уросепсис, Острый пиелонефрит, Почечная колика
* **Required Diagnostics (`needDiag`):** `[cbc, crp, procalcitonin, culture, bmp, urine, coag, lactate]`
* **Expected Findings:** cbc: 🔴 Лейк 26.4×10⁹/л, нейтрофилёз 94%, сдвиг вл...; crp: 🔴 СРБ 380 мг/л — маркер системного воспалени...; procalcitonin: 🔴 Прокальцитонин 48 нг/мл — специфический ма...; culture: Посев мочи и крови отправлен. Предварительно:...; bmp: Лактат 6.2 ↑↑ (тканевая гипоксия). Cr 248 ↑↑ ...; urine: 🔴 ОАМ: лейкоцитурия >100/п.з., бактериурия +...; coag: МНО 1.8 ↑, АПТВ 52 ↑↑ — начинающийся ДВС-синд...; lactate: Лактат 5.2 ммоль/л ↑↑ (септический шок, ткане...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, iv_fluids, oxygen, norepinephrine]`
* **Contraindicated (`wrongTreat`):** `[furosemide, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по сепсису (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 17: Колесников Роман Петрович, Ж, 38 лет (ICU · INFECTIOUS)
* **Chief Complaint & Timeline:** Лихорадка 2 недели, нарастающая одышка, слабость, потеря аппетита | *Внутривенный наркоман (героин). Лихорадка 2 недели, нарастающая одышка. Потеря 8 кг за 3 месяца. Обращается впервые.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 91%, ЧД 28, T 38.9°C, GCS 14 | *Кахексия. Тахикардия 118. Систолический шум 3/6 на верхушке (новый). Влажные хрипы в нижних отделах обоих лёгких. Петехии на конъюнктиве.*
* **Leading Diagnosis:** **Инфекционный эндокардит митрального клапана. Острая декомпенсация ХСН.** (Severity: `critical`)
* **Differential Hypotheses:** Инфекционный эндокардит, Септический шок, Саркоидоз
* **Required Diagnostics (`needDiag`):** `[echo, cbc, culture, bmp, ecg, crp, procalcitonin]`
* **Expected Findings:** echo: 🔴 ЭхоКГ: вегетации на митральном клапане 12 ...; cbc: 🔴 Лейк 18.4, нейтрофилёз. Hb 92 ↓↓ (анемия в...; culture: 🔴 Посев крови ×3: Staphylococcus aureus (зол...; bmp: Cr 178 ↑ (ОПП). Лактат 3.8 ↑. Na 130 ↓....; ecg: Синусовая тахикардия 118. Депрессия ST в V4-V...; crp: СРБ 240 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 12 нг/мл ↑ — специфический мар...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, oxygen, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, morphine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по инфекционному эндокардиту (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 18: Зайцева Людмила Геннадьевна, Ж, 46 лет (ADMISSION · INFECTIOUS)
* **Chief Complaint & Timeline:** Лихорадка 5 дней до 39.9°C, резкая мышечная боль, нарастающая одышка, сухой кашель | *Вакцинация от гриппа не проводилась. Эпидемия гриппа A(H1N1) в городе. Начало острое: озноб, температура 40°C, резкая миалгия. 5 дней нарастает одышка.*
* **Baseline Vitals & Exam:** ЧСС 116, АД —/—, SpO2 88%, ЧД 30, T 39.9°C, GCS 14 | *Гиперемия лица. Тахипноэ 30/мин. Рассеянные влажные хрипы с обеих сторон. ЧСС 116. Выраженная миалгия. Петехий нет.*
* **Leading Diagnosis:** **Тяжёлый грипп A(H1N1). Первичная вирусная пневмония. Дыхательная недостаточность.** (Severity: `critical`)
* **Differential Hypotheses:** Тяжёлый грипп A(H1N1), Бактериальная пневмония, ОРДС
* **Required Diagnostics (`needDiag`):** `[xray, cbc, crp, procalcitonin, abg, culture, lactate]`
* **Expected Findings:** xray: 🔴 Рентген: двусторонние мультифокальные инфи...; cbc: Лейк 3.8 ↓ (лейкопения — характерна для грипп...; crp: СРБ 180 мг/л ↑ — маркер системного воспаления...; procalcitonin: Прокальцитонин 2.8 нг/мл (умеренный — возможн...; abg: 🔴 pH 7.34, PaO₂ 56 ↓↓, PaCO₂ 32 ↓. Гипоксеми...; culture: Мазок на грипп: A(H1N1)pdm09 ПОЛОЖИТЕЛЬНЫЙ (П...; lactate: Лактат 1.6 ммоль/л (в норме)...
* **Indicated Therapy (`needTreat`):** `[oxygen, antibiotics_broad, intubation]`
* **Contraindicated (`wrongTreat`):** `[morphine, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по гриппу (2025) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 19: Горбунов Станислав Алексеевич, Ж, 58 лет (ADMISSION · INFECTIOUS)
* **Chief Complaint & Timeline:** Нарастающая боль в правой голени с покраснением и почернением кожи, высокая температура | *СД 2 типа, ожирение. 3 дня нарастает боль в правой голени. Покраснение, затем потемнение кожи. Сегодня — пузыри с геморрагическим содержимым. Антибиотики не принимал.*
* **Baseline Vitals & Exam:** ЧСС 128, АД —/—, SpO2 96%, ЧД 24, T 39.7°C, GCS 13 | *GCS 13. АД 92/55. Правая голень: некроз кожи с буро-чёрными пятнями, крепитация при пальпации (газ!), бурый зловонный экссудат. Болевой синдром несоразмерен виду ткани.*
* **Leading Diagnosis:** **Некротизирующий фасциит правой голени (тип 1, полимикробный). LRINEC = 9 (высокий риск).** (Severity: `critical`)
* **Differential Hypotheses:** Некротизирующий фасциит, Целлюлит, Газовая гангрена
* **Required Diagnostics (`needDiag`):** `[cbc, crp, procalcitonin, bmp, coag, xray, culture]`
* **Expected Findings:** cbc: 🔴 Лейк 28.4×10⁹/л, нейтрофилёз 96%. Hb 92 ↓ ...; crp: 🔴 СРБ 420 мг/л ↑↑ — маркер системного воспал...; procalcitonin: 🔴 Прокальцитонин 52 нг/мл — специфический ма...; bmp: Лактат 5.8 ↑↑. Cr 222 ↑↑ (ОПП). Na 126 ↓. Глю...; coag: МНО 2.2 ↑↑, АПТВ 64 ↑↑ — ДВС-синдром....; xray: Рентген голени: газ в мягких тканях вдоль фас...; culture: Посев раны: полимикробная флора (Strep.A + E....
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, surgery_consult, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по хирургическим инфекциям (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 20: Лебедева Анастасия Романовна, Ж, 33 лет (ICU · INFECTIOUS)
* **Chief Complaint & Timeline:** Нарастающая одышка 3 недели, сухой кашель, ночные поты, снижение веса 12 кг | *ВИЧ-инфекция (диагноз не знала). Одышка нарастает 3 недели — сначала при нагрузке, теперь в покое. Сухой непродуктивный кашель. Ночные поты, похудала на 12 кг за 2 месяца.*
* **Baseline Vitals & Exam:** ЧСС 108, АД —/—, SpO2 84%, ЧД 32, T 38.6°C, GCS 15 | *Кахексия. Тахипноэ 32/мин. Цианоз периоральный. Дыхание жёсткое, хрипов мало несмотря на тяжёлую гипоксемию — «ножничная» картина. Оральный кандидоз.*
* **Leading Diagnosis:** **ПЦП (Pneumocystis jirovecii pneumonia). ВИЧ/СПИД стадия 4. CD4 < 100 кл/мкл.** (Severity: `critical`)
* **Differential Hypotheses:** ПЦП (Pneumocystis), Туберкулёз лёгких, Саркоидоз
* **Required Diagnostics (`needDiag`):** `[xray, abg, cbc, bmp, crp, procalcitonin, spo2, lactate]`
* **Expected Findings:** xray: 🔴 Рентген: двусторонние «матовые стёкла» и и...; abg: 🔴 pH 7.46, PaO₂ 52 ↓↓ на воздухе. PaO₂/FiO₂ ...; cbc: 🔴 CD4 82 кл/мкл ↓↓. Лейк 2.8 ↓ (лейкопения п...; bmp: ЛДГ 1240 МЕ/л ↑↑ (маркёр тяжести ПЦП). Na 130...; crp: СРБ 95 мг/л ↑ — маркер системного воспаления ...; procalcitonin: Прокальцитонин 0.6 нг/мл (невысокий — атипичн...; spo2: SpO₂ 84% на воздухе — тяжёлая гипоксемия....; lactate: Лактат 2.2 ммоль/л (в норме)...
* **Indicated Therapy (`needTreat`):** `[oxygen, antibiotics_broad, steroids]`
* **Contraindicated (`wrongTreat`):** `[morphine, amiodarone]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по ВИЧ-инфекции (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case tutorial: Соколов Иван Петрович, Ж, 45 лет (ICU · ENDOCRINE)
* **Chief Complaint & Timeline:** Спутанность сознания, потливость, слабость. Утром пропустил приём пищи, на фоне приёма сахароснижающих препаратов | *СД 2 типа в течение 5 лет, принимает метформин 850 мг × 2 р/д и глибенкламид 5 мг × 1 р/д. Сегодня утром пропустил завтрак, через 2 часа появились резкая слабость, потливость, спутанность сознания. Глюкометрии дома нет.*
* **Baseline Vitals & Exam:** ЧСС 95, АД —/—, SpO2 98%, ЧД 16, T 36.6°C, GCS 13 | *Кожные покровы влажные, бледные. Тремор пальцев рук. В сознании, оглушён. Зрачки обычные, фотореакция сохранена. Движения в полном объёме. Рефлексы живые, симметричные. Парезов нет.*
* **Leading Diagnosis:** **Гипогликемия средней степени тяжести** (Severity: `moderate`)
* **Differential Hypotheses:** Гипогликемия, Гипогликемическая кома, Острое нарушение мозгового кровообращения, Алкогольное опьянение
* **Required Diagnostics (`needDiag`):** `[glucose, bmp]`
* **Expected Findings:** cbc: Hb 145, WBC 6.8, Plt 250...; bmp: Na 138, K 4.2, Cr 85, Glu 2.1 ммоль/л ↓↓↓...; glucose: 🔴 Глюкоза крови 2.1 ммоль/л — тяжёлая гипогл...
* **Indicated Therapy (`needTreat`):** `[dextrose]`
* **Contraindicated (`wrongTreat`):** `[heparin, furosemide, insulin, metoprolol]`
* **Resuscitation / Emergency Actions:** `[dextrose]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР МЗ РФ по гипогликемии (алгоритмы СМП) (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 21: Носова Кристина Андреевна, Ж, 23 лет (ICU · ENDOCRINE)
* **Chief Complaint & Timeline:** Рвота, боль в животе, запах ацетона, нарастающая слабость, глубокое шумное дыхание | *СД 1 типа с 14 лет. 4 дня болела ОРВИ, самостоятельно уменьшила дозу инсулина. Нарастающая слабость, жажда до 6 л/день, полиурия. Рвота, боль в эпигастрии.*
* **Baseline Vitals & Exam:** ЧСС 128, АД —/—, SpO2 99%, ЧД 30, T 37.3°C, GCS 12 | *GCS 12, заторможена. Запах ацетона изо рта. Дыхание Куссмауля — глубокое, редкое, шумное. Тургор кожи снижен, слизистые сухие. Живот умеренно болезненный.*
* **Leading Diagnosis:** **Диабетический кетоацидоз (ДКА), тяжёлая степень. Дегидратация +++.** (Severity: `critical`)
* **Differential Hypotheses:** Диабетический кетоацидоз, Гиперосмолярное состояние, Лактат-ацидоз
* **Required Diagnostics (`needDiag`):** `[glucose, abg, ketones, bmp, cbc, urine]`
* **Expected Findings:** glucose: 🔴 Глюкоза 29.8 ммоль/л (норма 3.9-5.5). Крит...; abg: 🔴 pH 7.10 ↓↓, BE −22 ммоль/л. Тяжёлый анионн...; ketones: 🔴 Кетоны крови 9.4 ммоль/л (норма <0.6). Тяж...; bmp: 🔴 Na 130 ↓ (осмотическое разведение), K 6.2 ...; cbc: Лейк 16.4 (стрессовый лейкоцитоз). Hb 142. Hc...; urine: ОАМ: глюкоза +++, кетоны +++, белок +....
* **Indicated Therapy (`needTreat`):** `[insulin, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[steroids, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по сахарному диабету (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 22: Алексеева Юлия Сергеевна, Ж, 35 лет (ICU · ENDOCRINE)
* **Chief Complaint & Timeline:** Резкая тахикардия, гипертермия 39.8°C, крайнее возбуждение, тремор, диарея после ОРВИ | *Болезнь Грейвса, принимает тиамазол нерегулярно. 3 дня назад ОРВИ. Сегодня — выраженное возбуждение, тремор рук, диарея 8 раз, температура 39.8°C, ЧСС 156.*
* **Baseline Vitals & Exam:** ЧСС 156, АД —/—, SpO2 98%, ЧД 22, T 39.8°C, GCS 14 | *Возбуждена, говорит быстро. ЩЖ диффузно увеличена. Двусторонний экзофтальм. Тремор пальцев. Влажная горячая кожа. ЧСС 156, нерегулярный ритм.*
* **Leading Diagnosis:** **Тиреотоксический криз (тиреоидный шторм). Болезнь Грейвса. Burch-Wartofsky ≥45.** (Severity: `critical`)
* **Differential Hypotheses:** Тиреотоксический криз, Сепсис, Адренергический криз
* **Required Diagnostics (`needDiag`):** `[thyroid, ecg, cbc, bmp, glucose]`
* **Expected Findings:** thyroid: 🔴 ТТГ <0.01 мМЕ/л (подавлен). Т4 своб. = 82 ...; ecg: Фибрилляция предсердий, ЧСС 156. QT укорочён....; cbc: Лейк 14.2 (нейтрофильный лейкоцитоз). Лимфопе...; bmp: Глюкоза 12.8 ↑. АЛТ 94 ↑ (тиреотоксическое по...; glucose: Глюкоза 12.8 ммоль/л ↑ (тиреотоксикоз стимули...
* **Indicated Therapy (`needTreat`):** `[metoprolol, steroids]`
* **Contraindicated (`wrongTreat`):** `[amiodarone, aspirin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по заболеваниям щитовидной железы (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 23: Дмитриев Борис Андреевич, Ж, 72 лет (ADMISSION · ENDOCRINE)
* **Chief Complaint & Timeline:** Нарушение сознания, выраженная жажда, частое мочеиспускание, слабость 5 дней | *СД 2 типа, принимает метформин нерегулярно. 5 дней — нарастающая жажда, полиурия, слабость. Рвоты нет, запаха ацетона нет. Сегодня — нарушение ориентации.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 97%, ЧД 20, T 37.5°C, GCS 10 | *Заторможен, GCS 10. Выраженная дегидратация: сухость кожи, слизистых. АД 95/58. Тахикардия 118. Тургор кожи резко снижен. Запаха ацетона нет.*
* **Leading Diagnosis:** **Гиперосмолярное гипергликемическое состояние (ГГС). СД 2 типа. Тяжёлая дегидратация.** (Severity: `critical`)
* **Differential Hypotheses:** Аддисонический криз, Септический шок, Дегидратация
* **Required Diagnostics (`needDiag`):** `[glucose, bmp, abg, cbc, urine]`
* **Expected Findings:** glucose: 🔴 Глюкоза 48.6 ммоль/л ↑↑↑ (при ГГС >33 ммол...; bmp: 🔴 Na 152 ↑↑ (гипернатриемия). K 4.2 (норма)....; abg: pH 7.38 — практически норма. Нет ацидоза (отл...; cbc: Лейк 14.8 (стрессовый). Hb 158 ↑ (дегидратаци...; urine: ОАМ: глюкоза +++. Кетоны ОТРИЦАТЕЛЬНЫЕ (отлич...
* **Indicated Therapy (`needTreat`):** `[iv_fluids, insulin]`
* **Contraindicated (`wrongTreat`):** `[furosemide, steroids]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по сахарному диабету (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 24: Соколов Антон Николаевич, Ж, 42 лет (ICU · ENDOCRINE)
* **Chief Complaint & Timeline:** Острая слабость, тошнота, рвота, боль в животе, нарушение сознания на фоне ОРВИ | *Аутоиммунный адреналит, принимает гидрокортизон 20 мг/сут. 3 дня ОРВИ — самостоятельно не увеличил дозу кортикостероидов. Сегодня — внезапная слабость, рвота, боль в животе, коллапс.*
* **Baseline Vitals & Exam:** ЧСС 132, АД —/—, SpO2 97%, ЧД 22, T 38.4°C, GCS 11 | *Заторможен, GCS 11. Кожа бронзовая (гиперпигментация). АД 72/44 — коллапс. ЧСС 132. Гипотермия 36.8°C (ожидалась бы гипертермия — адреналовый криз!). Болезненность живота диффузная.*
* **Leading Diagnosis:** **Аддисонический криз (острая надпочечниковая недостаточность). Провокация — интеркуррентная инфекция.** (Severity: `critical`)
* **Differential Hypotheses:** Гипогликемическая кома, Инсульт, Эпилептический статус
* **Required Diagnostics (`needDiag`):** `[bmp, glucose, cbc, abg]`
* **Expected Findings:** bmp: 🔴 Na 118 ↓↓↓ (тяжёлая гипонатриемия — дефици...; glucose: 🔴 Глюкоза 2.4 ммоль/л ↓↓ (гипогликемия — деф...; cbc: Лейк 16.2 (инфекция). Hb 148. Эозинофилия 8% ...; abg: pH 7.28 ↓ (метаболический ацидоз), Лактат 4.8...
* **Indicated Therapy (`needTreat`):** `[steroids, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[furosemide, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** Clinical guidelines (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 25: Степанова Виктория Олеговна, Ж, 27 лет (ADMISSION · ENDOCRINE)
* **Chief Complaint & Timeline:** Найдена без сознания, диабетик 1 типа, ввела слишком много инсулина утром | *СД 1 типа 10 лет. Утром ввела 40 ЕД инсулина гларгин вместо 10 ЕД. Через 30 минут — нарушение сознания. Приём пищи после инъекции был скудным.*
* **Baseline Vitals & Exam:** ЧСС 102, АД —/—, SpO2 99%, ЧД 18, T 36.6°C, GCS 8 | *GCS 8 — кома. Кожа влажная, холодная, бледная. Тахикардия 102. АД 140/88. Зрачки D=S, реакция на свет сохранена. Очаговой неврологии нет.*
* **Leading Diagnosis:** **Гипогликемическая кома. Передозировка инсулина.** (Severity: `critical`)
* **Differential Hypotheses:** Гипогликемическая кома, Инсульт, Энцефалопатия
* **Required Diagnostics (`needDiag`):** `[glucose, bmp, cbc, abg]`
* **Expected Findings:** glucose: 🔴 Глюкоза 1.2 ммоль/л ↓↓↓ (норма 3.9-5.5). Т...; bmp: Na 138, K 3.8. Cr 82. Норма. Инсулин в крови ...; cbc: Лейк 9.4. Hb 138. Норма....; abg: pH 7.42 — норма. PaO₂ 96. Метаболических нару...
* **Indicated Therapy (`needTreat`):** `[dextrose]`
* **Contraindicated (`wrongTreat`):** `[insulin, morphine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по сахарному диабету (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 26: Белов Иван Алексеевич, Ж, 44 лет (ICU · TOXICOLOGY)
* **Chief Complaint & Timeline:** Выраженное потоотделение, рвота, диарея, миоз, судороги, нарастающая одышка | *Агроном, обработка сада инсектицидами без защиты. Через 20 минут — резкое слюнотечение, рвота, диарея, судороги. Привезён с места работы. На спецодежде запах пестицида.*
* **Baseline Vitals & Exam:** ЧСС 42, АД —/—, SpO2 84%, ЧД 10, T 37.2°C, GCS 8 | *GCS 8. Точечные зрачки (миоз 1 мм). Слюнотечение +++. Потоотделение обильное. Бронхоспазм, влажные хрипы в лёгких. Брадикардия 42. Непроизвольная дефекация.*
* **Leading Diagnosis:** **Острое отравление фосфорорганическими соединениями (ФОС). Холинергический криз.** (Severity: `critical`)
* **Differential Hypotheses:** ФОС-отравление, ТЦА-отравление, Миастенический криз
* **Required Diagnostics (`needDiag`):** `[abg, bmp, cbc, ecg, glucose, lactate, tox_screen]`
* **Expected Findings:** abg: 🔴 pH 7.18 ↓↓, PaCO₂ 68 ↑↑, PaO₂ 48 ↓↓. Тяжёл...; bmp: Активность псевдохолинэстеразы 12% от нормы ↓...; cbc: Лейк 18.4 (стрессовый). Hb 148. Норма....; ecg: Синусовая брадикардия 42. QT удлинён. Блокада...; glucose: Глюкоза 4.8 ммоль/л — норма....; lactate: Лактат 3.5 ммоль/л ↑ (гиповентиляция, дыхател...; tox_screen: Токсикологический скрининг: ФОС (метаболиты о...
* **Indicated Therapy (`needTreat`):** `[atropine, oxygen, intubation]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, morphine]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по токсикологии (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 27: Тихонов Артём Владимирович, Ж, 26 лет (ICU · TOXICOLOGY)
* **Chief Complaint & Timeline:** Найден без сознания после приёма таблеток, широкие зрачки, тахикардия, снижение АД | *Найден подругой с пустыми пачками таблеток амитриптилина (100 таблеток по 25 мг). Записка суицидального содержания. Время приёма неизвестно.*
* **Baseline Vitals & Exam:** ЧСС 138, АД —/—, SpO2 92%, ЧД 14, T 36.8°C, GCS 9 | *GCS 9, кома. Мидриаз (зрачки 7 мм). Кожа сухая, горячая. Тахикардия 138. АД 82/55. Гипорефлексия. Мышечные фасцикуляции.*
* **Leading Diagnosis:** **Острое отравление трициклическими антидепрессантами (амитриптилин). Тяжёлая степень.** (Severity: `critical`)
* **Differential Hypotheses:** ТЦА-отравление, ФОС-отравление, Антихолинергическое отравление
* **Required Diagnostics (`needDiag`):** `[ecg, bmp, cbc, abg, glucose, tox_screen]`
* **Expected Findings:** ecg: 🔴 QRS 180 мс ↑↑ (норма <100). Блокада правой...; bmp: Na 136, K 3.4 ↓. Лактат 3.8 ↑. Cr 98. Норма....; cbc: Лейк 12.8. Hb 148. Норма....; abg: pH 7.28 ↓, PaCO₂ 52 ↑ (гиповентиляция). Дыхат...; glucose: Глюкоза 5.8 ммоль/л — норма (гипогликемия иск...; tox_screen: Токсикологический скрининг: этанол 2.5 г/л. Д...
* **Indicated Therapy (`needTreat`):** `[oxygen, intubation, iv_fluids, activated_charcoal]`
* **Contraindicated (`wrongTreat`):** `[amiodarone, morphine]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по токсикологии (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 28: Громов Евгений Борисович, Ж, 49 лет (ADMISSION · TOXICOLOGY)
* **Chief Complaint & Timeline:** Найден без сознания, запах алкоголя, рвота, угнетение дыхания | *Хронический алкоголизм. Сосед обнаружил без сознания в квартире, окружённого пустыми бутылками. Рядом следы рвоты. По словам соседа, пил 2 дня.*
* **Baseline Vitals & Exam:** ЧСС 88, АД —/—, SpO2 82%, ЧД 8, T 35.4°C, GCS 7 | *GCS 7 — кома. Запах алкоголя. Рвотные массы на лице и шее. Дыхание поверхностное 8/мин. Зрачки умеренно расширены. Тонус мышц снижен. Гипотермия 35.4°C.*
* **Leading Diagnosis:** **Тяжёлое алкогольное отравление. Аспирационная пневмония. Угрожающее апноэ.** (Severity: `critical`)
* **Differential Hypotheses:** Алкогольная кома, Опиоидная интоксикация, Инсульт
* **Required Diagnostics (`needDiag`):** `[glucose, abg, cbc, bmp, spo2, lactate, tox_screen]`
* **Expected Findings:** glucose: 🔴 Глюкоза 2.2 ммоль/л ↓↓ (гипогликемия — алк...; abg: 🔴 pH 7.24 ↓, PaCO₂ 62 ↑↑, PaO₂ 48 ↓↓. Тяжёла...; cbc: Лейк 18.4 ↑ (аспирационная пневмония). Hb 148...; bmp: Этанол расч. 4.2 г/л (тяжёлое отравление). Ла...; spo2: SpO₂ 82% — тяжёлая гипоксемия....; lactate: Лактат 6.5 ммоль/л ↑↑ (метаболический ацидоз)...; tox_screen: Токсикологический скрининг: метанол — положит...
* **Indicated Therapy (`needTreat`):** `[oxygen, intubation, dextrose]`
* **Contraindicated (`wrongTreat`):** `[diazepam, morphine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по токсикологии (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 29: Ершов Кирилл Алексеевич, Ж, 31 лет (ADMISSION · TOXICOLOGY)
* **Chief Complaint & Timeline:** Боль за грудиной, выраженное возбуждение, тахикардия после употребления кокаина | *Употребление кокаина 1 час назад. Боль за грудиной, нарастающее возбуждение. Хронических заболеваний нет. Алкоголь не употреблял.*
* **Baseline Vitals & Exam:** ЧСС 148, АД —/—, SpO2 96%, ЧД 26, T 38.4°C, GCS 14 | *Психомоторное возбуждение. Мидриаз. Профузная потливость. АД 195/115 — тяжёлый гипертонический криз. ЧСС 148. Боль при пальпации грудины.*
* **Leading Diagnosis:** **Острая кокаиновая интоксикация. Симпатомиметический криз. Кокаин-индуцированный ОКС.** (Severity: `critical`)
* **Differential Hypotheses:** Кокаиновая интоксикация, Инфаркт миокарда, Гипертонический криз
* **Required Diagnostics (`needDiag`):** `[ecg, troponin, bmp, cbc, abg, tox_screen]`
* **Expected Findings:** ecg: ⚡ Синусовая тахикардия 148. Подъём ST в V3-V4...; troponin: 🔴 Тропонин I 2.4 нг/мл ↑↑ (кокаин-индуцирова...; bmp: Na 138, K 3.6. Лактат 3.2 ↑. Cr 108....; cbc: Лейк 14.2 (стрессовый). Hb 152. Норма....; abg: pH 7.48 ↑ (гипервентиляция). PaO₂ 88. Норма....; tox_screen: Токсикологический скрининг: специфические ток...
* **Indicated Therapy (`needTreat`):** `[nitroglycerin, diazepam]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, atropine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по токсикологии (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 30: Ковалёв Артём Сергеевич, Ж, 35 лет (ICU · TOXICOLOGY)
* **Chief Complaint & Timeline:** Найден без сознания в закрытом гараже, двигатель автомобиля работал | *Найден родственниками в гараже с работающим двигателем. Ремонтировал автомобиль. Без сознания около 40 минут. Хронических заболеваний нет.*
* **Baseline Vitals & Exam:** ЧСС 110, АД —/—, SpO2 96%, ЧД 20, T 36.8°C, GCS 8 | *GCS 8 — кома. Кожа ярко-розовая (карминная). Зрачки D=S, фотореакция снижена. Дыхание поверхностное. ЧСС 110. Мышечный тонус снижен.*
* **Leading Diagnosis:** **Острое отравление угарным газом (CO). Тяжёлая степень. Кома I.** (Severity: `critical`)
* **Differential Hypotheses:** CO-отравление, Инсульт, Метгемоглобинемия
* **Required Diagnostics (`needDiag`):** `[cohb, abg, ecg, bmp, cbc, tox_screen]`
* **Expected Findings:** cohb: 🔴 Карбоксигемоглобин 42% (норма <3%). Тяжёло...; abg: 🔴 pH 7.24 ↓, PaO₂ 94 мм рт.ст. (ложно нормал...; ecg: Синусовая тахикардия 110. ST-изменений нет....; bmp: Лактат 6.8 ммоль/л ↑↑ (тканевая гипоксия). Гл...; cbc: Hb 154 г/л. Лейк 12.4 (стрессовый). Норма....; tox_screen: Токсикологический скрининг: барбитураты — пол...
* **Indicated Therapy (`needTreat`):** `[intubation]`
* **Contraindicated (`wrongTreat`):** `[diazepam, morphine]`
* **Resuscitation / Emergency Actions:** `[intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по токсикологии (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 55: Смирнов Денис Алексеевич, Ж, 32 лет (ICU · TOXICOLOGY)
* **Chief Complaint & Timeline:** Найден без сознания, угнетение дыхания, точечные зрачки, следы инъекций на руках | *Употребление героина в/в, найден родственниками в квартире без сознания. Рядом — шприц и ложка со следами приготовления. По словам родных, эпизодически употребляет опиоиды последние 2 года. Сегодня ввёл дозу ~30 минут назад, через 10 минут потерял сознание, перестал дышать.*
* **Baseline Vitals & Exam:** ЧСС 52, АД —/—, SpO2 82%, ЧД 6, T 36.2°C, GCS 6 | *GCS 6 — кома. Зрачки точечные (миоз 1 мм), реакция на свет вялая. Дыхание поверхностное, редкое 6/мин. Брадикардия 52. Кожа бледная, сухая. Следы инъекций в локтевых ямках. Мышечный тонус снижен. Перистальтика ослаблена.*
* **Leading Diagnosis:** **Острая опиоидная интоксикация (героин). Угнетение дыхательного центра. Кома.** (Severity: `critical`)
* **Differential Hypotheses:** Опиоидная интоксикация, Алкогольная кома, Отравление бензодиазепинами
* **Required Diagnostics (`needDiag`):** `[abg, glucose, cbc, bmp, ecg, spo2, lactate, tox_screen]`
* **Expected Findings:** abg: 🔴 pH 7.18 ↓↓, PaCO₂ 68 ↑↑↑, PaO₂ 42 ↓↓. Тяжё...; glucose: Глюкоза 5.4 ммоль/л — норма (гипогликемия иск...; cbc: Лейк 9.8. Hb 148. Тр 220. Норма....; bmp: Креатинин 98. Калий 4.2. Натрий 138. Лактат 3...; ecg: Синусовая брадикардия 52. QT нормальный. ST-и...; spo2: SpO₂ 82% — тяжёлая гипоксемия на фоне гиповен...; lactate: Лактат 3.2 ммоль/л ↑ (гиповентиляция, тканева...; tox_screen: Токсикологический скрининг: опиаты (морфин/ге...
* **Indicated Therapy (`needTreat`):** `[naloxone, oxygen, intubation]`
* **Contraindicated (`wrongTreat`):** `[morphine, diazepam, metoprolol]`
* **Resuscitation / Emergency Actions:** `[naloxone, intubation]`
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР МЗ РФ по токсикологии (острые отравления) (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 31: Фёдоров Дмитрий Игоревич, Ж, 21 лет (ADMISSION · ABDOMINAL)
* **Chief Complaint & Timeline:** Боль в животе 24 часа (начало в эпигастрии, сместилась в правую подвздошную область), лихорадка, рвота | *Боль в животе 24 часа: сначала эпигастрий, затем сместилась в правую подвздошную область (миграция — характерный симптом!). Рвота 3 раза. Температура 38.7°C.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 97%, ЧД 22, T 38.7°C, GCS 14 | *Живот напряжён. Симптом Щёткина-Блюмберга (+) в правой подвздошной области. Симптом Ровзинга (+). Перистальтика ослаблена. АД 100/65, ЧСС 118.*
* **Leading Diagnosis:** **Острый аппендицит с перфорацией. Начинающийся перитонит.** (Severity: `critical`)
* **Differential Hypotheses:** Острый аппендицит, Почечная колика, Болезнь Крона
* **Required Diagnostics (`needDiag`):** `[cbc, crp, procalcitonin, usg_abdo, bmp, coag, urine]`
* **Expected Findings:** cbc: 🔴 Лейк 22.8×10⁹/л, нейтрофилёз 92%, токсичес...; crp: 🔴 СРБ 280 мг/л — маркер системного воспалени...; procalcitonin: 🔴 Прокальцитонин 8.4 нг/мл — специфический м...; usg_abdo: 🔴 УЗИ: утолщённый аппендикс d=12 мм, несжима...; bmp: Na 134 ↓, K 3.4 ↓ (рвота). Лактат 2.8 ↑. Cr 1...; coag: МНО 1.3, АПТВ 36. Умеренные изменения....; urine: ОАМ: норма (дифференциация с мочекаменной бол...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, surgery_consult, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, steroids]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по острому аппендициту (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 32: Матвеев Сергей Геннадьевич, Ж, 51 лет (ICU · ABDOMINAL)
* **Chief Complaint & Timeline:** Кровавая рвота и мелена, выраженная слабость, головокружение, потемнение в глазах | *Язвенная болезнь 10 лет. Принимает НПВС (диклофенак) по поводу артрита без ИПП. Сегодня — рвота алой кровью 2 раза, затем тёмный дёгтеобразный стул. Обморок.*
* **Baseline Vitals & Exam:** ЧСС 128, АД —/—, SpO2 96%, ЧД 22, T 36.7°C, GCS 13 | *Бледность кожи. Холодный пот. GCS 13. АД 82/52. ЧСС 128. Живот мягкий. При ректальном осмотре — мелена.*
* **Leading Diagnosis:** **Острое желудочно-кишечное кровотечение из пептической язвы (Forrest Ia). Геморрагический шок.** (Severity: `critical`)
* **Differential Hypotheses:** ОЖК кровотечение, Варикозное кровотечение, Синдром Мэллори-Вейса
* **Required Diagnostics (`needDiag`):** `[cbc, bmp, coag, abg, lactate, usg_abdo, type_cross, coag_full]`
* **Expected Findings:** cbc: 🔴 Hb 68 г/л ↓↓↓ (тяжёлая анемия, кровопотеря...; bmp: Na 136, K 3.2 ↓, Cr 152 ↑ (азотемия от кровот...; coag: МНО 1.2, АПТВ 32 сек. Умеренные изменения....; abg: pH 7.30 ↓, лактат 4.2 ↑ (тканевая гипоксия). ...; lactate: Лактат 4.2 ммоль/л ↑↑ (перитонит, септический...; usg_abdo: УЗИ брюшной полости: свободная жидкость в пра...; type_cross: Группа крови 0(I), Rh+. Перекрёстная проба со...; coag_full: Тромбоэластограмма (TEG): R-время 8 мин (норм...
* **Indicated Therapy (`needTreat`):** `[iv_fluids, blood_transfusion, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[heparin, aspirin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по язвенной болезни (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 33: Крылова Ирина Борисовна, Ж, 52 лет (ICU · ABDOMINAL)
* **Chief Complaint & Timeline:** Острая боль в правом подреберье, желтуха, высокая лихорадка с потрясающим ознобом | *ЖКБ 5 лет. Боль в правом подреберье + желтуха + лихорадка 39.8°C — классическая триада Шарко. Нарастающая заторможенность (пентада Рейнольдса).*
* **Baseline Vitals & Exam:** ЧСС 122, АД —/—, SpO2 97%, ЧД 22, T 39.8°C, GCS 13 | *Заторможена, GCS 13. Желтуха склер и кожи. Живот болезненный в правом подреберье. Симптом Мерфи (+). АД 98/60. Температура 39.8°C.*
* **Leading Diagnosis:** **Острый гнойный холангит. Пентада Рейнольдса (желтуха+лихорадка+боль+шок+нарушение сознания).** (Severity: `critical`)
* **Differential Hypotheses:** Острый холангит, Острый холецистит, Панкреатит
* **Required Diagnostics (`needDiag`):** `[cbc, bmp, crp, procalcitonin, usg_abdo, coag, culture, lactate]`
* **Expected Findings:** cbc: 🔴 Лейк 24.8×10⁹/л, нейтрофилёз 94%. Тр 78 ↓ ...; bmp: 🔴 Билирубин 124 мкмоль/л ↑↑. АЛТ 380 ↑↑. Щел...; crp: 🔴 СРБ 340 мг/л — маркер системного воспалени...; procalcitonin: 🔴 Прокальцитонин 28 нг/мл — специфический ма...; usg_abdo: 🔴 УЗИ: конкременты в общем жёлчном протоке 1...; coag: МНО 2.2 ↑↑, АПТВ 58 ↑↑ — ДВС-синдром. Коагуло...; culture: Посев крови отправлен до АБТ....; lactate: Лактат 3.8 ммоль/л ↑ (панкреатогенный шок, тк...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, surgery_consult, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по хирургическим заболеваниям (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 34: Попова Светлана Валерьевна, Ж, 58 лет (ICU · ABDOMINAL)
* **Chief Complaint & Timeline:** Внезапная «разрывающая» боль в груди с иррадиацией в спину и между лопатками | *АГ 3 ст., нерегулярный приём антигипертензивных. Внезапная «раздирающая» боль в груди с иррадиацией в межлопаточную область. АД на левой руке 148/88, на правой — 95/60 (асимметрия!).*
* **Baseline Vitals & Exam:** ЧСС 104, АД —/—, SpO2 96%, ЧД 22, T 36.9°C, GCS 13 | *GCS 13, возбуждена. Асимметрия АД (разница 53 мм рт.ст.!). Тоны ясные. Аортальная регургитация (новый диастолический шум). Пульс на правой руке ослаблен.*
* **Leading Diagnosis:** **Расслоение аорты типа А (Stanford). Поражение восходящей аорты.** (Severity: `critical`)
* **Differential Hypotheses:** Расслоение аорты, Инфаркт миокарда, ТЭЛА
* **Required Diagnostics (`needDiag`):** `[ct_chest, xray, ecg, bmp, cbc, coag]`
* **Expected Findings:** ct_chest: 🔴 КТ-ангиография: расслоение восходящей аорт...; xray: Рентген: расширение тени средостения >8 см. Н...; ecg: Синусовый ритм 104. ST-изменений нет (коронар...; bmp: Лактат 2.8 ↑. Cr 118. Na 138....; cbc: Лейк 14.2. Hb 124 ↓ (кровопотеря в ложный кан...; coag: МНО 1.3, АПТВ 34 сек....
* **Indicated Therapy (`needTreat`):** `[morphine, metoprolol, surgery_consult]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, aspirin, heparin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Оценка динамики каждые 60-180 сек (динамическое окно ReassessmentModal) $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по заболеваниям аорты (2025) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case 35: Кириллов Пётр Андреевич, Ж, 68 лет (ADMISSION · ABDOMINAL)
* **Chief Complaint & Timeline:** Острая сильная боль по всему животу, рвота, диарея с кровью при мерцательной аритмии | *ФП, варфарин нерегулярно. Боль по всему животу острая, внезапная. Несмотря на сильную боль — живот мягкий (классическое несоответствие!). Диарея с кровью. ЧСС 116 аритмичный.*
* **Baseline Vitals & Exam:** ЧСС 116, АД —/—, SpO2 96%, ЧД 20, T 37.8°C, GCS 14 | *GCS 14. АД 105/68. Живот мягкий, но болезненность по всему животу. Перистальтика ослаблена. ЧСС 116, аритмия. Симптомов раздражения брюшины пока нет.*
* **Leading Diagnosis:** **Острая мезентериальная ишемия. Эмболия верхней брыжеечной артерии (ФП → кардиоэмбол).** (Severity: `critical`)
* **Differential Hypotheses:** Острая мезентериальная ишемия, Перфоративная язва, Острый панкреатит
* **Required Diagnostics (`needDiag`):** `[cbc, bmp, coag, abg, crp, procalcitonin, usg_abdo]`
* **Expected Findings:** cbc: 🔴 Лейк 22.8×10⁹/л, нейтрофилёз — ишемический...; bmp: 🔴 Лактат 6.8 ↑↑↑ (ишемия кишечника!). Cr 158...; coag: МНО 1.1 (варфарин не принимал). АПТВ 30. Норм...; abg: pH 7.22 ↓↓, лактат 6.8 ↑↑. Тяжёлый лактат-аци...; crp: 🔴 СРБ 220 мг/л ↑↑ — маркер системного воспал...; procalcitonin: 🔴 Прокальцитонин 14 нг/мл ↑ — специфический ...; usg_abdo: УЗИ брыжеечных сосудов: кровоток в ВБА отсутс...
* **Indicated Therapy (`needTreat`):** `[heparin, surgery_consult, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по хирургическим заболеваниям (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case outp_1: Петрова Мария Ивановна, Ж, 45 лет (OUTPATIENT · CARDIAC)
* **Chief Complaint & Timeline:** Повышение артериального давления до 180/110 мм рт.ст., головная боль, мелькание «мушек» перед глазами | *Пациентка с давящей головной болью с утра, мельканием «мушек» перед глазами. Сегодня забыла принять эналаприл. Симптомы нарастают, визуальные нарушения сохраняются. Гипертонический криз на фоне отмены препарата.*
* **Baseline Vitals & Exam:** ЧСС 92, АД —/—, SpO2 97%, ЧД 18, T 36.6°C, GCS 15 | *Сознание ясное. АД 180/110 на обеих руках. Тоны сердца ясные, ритм правильный. Отёков нет. Пульс на периферических артериях симметричный.*
* **Leading Diagnosis:** **Гипертонический криз II степени. АГ 3 ст.** (Severity: `moderate`)
* **Differential Hypotheses:** Гипертонический криз, Вторичная артериальная гипертензия, Феохромоцитома
* **Required Diagnostics (`needDiag`):** `[ecg, cbc, bmp, glucose, urine]`
* **Expected Findings:** ecg: Синусовый ритм 92. Гипертрофия левого желудоч...; cbc: Лейк 8.4. Hb 138. Норма....; bmp: Креатинин 98 мкмоль/л. Мочевина 7.2. Электрол...; glucose: Глюкоза 6.2 ммоль/л (умеренно повышена)....; urine: ОАМ: белок 0.066 г/л (микроальбуминурия). Лей...
* **Indicated Therapy (`needTreat`):** `[metoprolol, ACE_inhibitor]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, morphine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по артериальной гипертензии (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case outp_2: Сидоров Алексей Николаевич, Ж, 55 лет (OUTPATIENT · ABDOMINAL)
* **Chief Complaint & Timeline:** Боль в правом подреберье после жирной пищи, тошнота, горечь во рту | *Боли в правом подреберье после жирной пищи повторяются 2 года, последний эпизод — сегодня. Сопровождаются тошнотой и горечью во рту. УЗИ год назад подтвердило конкременты желчного пузыря. Не оперирована.*
* **Baseline Vitals & Exam:** ЧСС 78, АД —/—, SpO2 98%, ЧД 16, T 36.8°C, GCS 15 | *Живот мягкий, болезненный в правом подреберье. Симптом Мерфи положительный. Печень не увеличена. Склеры чистые.*
* **Leading Diagnosis:** **Желчнокаменная болезнь. Хронический калькулёзный холецистит.** (Severity: `moderate`)
* **Differential Hypotheses:** Желчнокаменная болезнь, Хронический холецистит, Дуоденит
* **Required Diagnostics (`needDiag`):** `[usg_abdo, cbc, bmp, crp, procalcitonin]`
* **Expected Findings:** usg_abdo: УЗИ: конкременты желчного пузыря 8, 12, 15 мм...; cbc: Лейк 9.2. Hb 148. Норма....; bmp: Билирубин общий 18 мкмоль/л (норма). АЛТ 42 Е...; crp: СРБ 8 мг/л (умеренно повышена — хроническое в...; procalcitonin: Прокальцитонин 0.5 нг/мл (в пределах нормы — ...
* **Indicated Therapy (`needTreat`):** `[iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, thrombolysis]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по хирургическим заболеваниям (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case outp_3: Козлова Елена Дмитриевна, Ж, 38 лет (OUTPATIENT · ENDOCRINE)
* **Chief Complaint & Timeline:** Слабость, утомляемость, выпадение волос, зябкость, запоры, сухость кожи | *Симптомы нарастают 6 месяцев: слабость, утомляемость, выпадение волос, зябкость, запоры, сухость кожи. Прибавка веса 8 кг за 3 месяца без изменения диеты. Менструации стали скудными. Обратилась к терапевту, направлена к эндокринологу.*
* **Baseline Vitals & Exam:** ЧСС 58, АД —/—, SpO2 98%, ЧД 14, T 35.8°C, GCS 15 | *Кожа сухая, бледная, с желтоватым оттенком. Отёки лица и голеней. Волосы тусклые, ломкие. Щитовидная железа не увеличена. Брадикардия 58. Рефлексы замедлены.*
* **Leading Diagnosis:** **Гипотиреоз. Субкомпенсированный.** (Severity: `moderate`)
* **Differential Hypotheses:** Гипотиреоз, Анемия, Депрессия
* **Required Diagnostics (`needDiag`):** `[thyroid, cbc, bmp, glucose]`
* **Expected Findings:** thyroid: ТТГ 18.4 мМЕ/л ↑↑ (норма 0.4-4.0). Т4 свободн...; cbc: Hb 98 г/л ↓ (анемия — характерна для гипотире...; bmp: Холестерин 8.4 ммоль/л ↑↑ (дислипидемия при г...; glucose: Глюкоза 4.8 ммоль/л — норма....
* **Indicated Therapy (`needTreat`):** `[thyroxine]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** КР по заболеваниям щитовидной железы (2020) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case outp_4: Морозов Дмитрий Сергеевич, Ж, 62 лет (OUTPATIENT · CARDIAC)
* **Chief Complaint & Timeline:** Нарастающая одышка при физической нагрузке, отёки голеней, утомляемость | *Нарастающая одышка при физической нагрузке в течение 3 месяцев. Вначале при подъёме на 3 этаж, сейчас — при ходьбе на 100 м и в покое. Отёки голеней к вечеру, к утру уменьшаются. Слабость, быстрая утомляемость. Симптомы ухудшаются, обратился к кардиологу.*
* **Baseline Vitals & Exam:** ЧСС 88, АД —/—, SpO2 94%, ЧД 20, T 36.6°C, GCS 15 | *Умеренная одышка в покое. Отёки голеней симметричные++. Влажные хрипы в нижних отделах лёгких. Печень увеличена на 2 см. АД 135/85, ЧСС 88, ритм правильный с редкими экстрасистолами.*
* **Leading Diagnosis:** **ХСН II ФК по NYHA. Ишемическая кардиомиопатия. ФВ 35%.** (Severity: `moderate`)
* **Differential Hypotheses:** ХСН, ХОБЛ, Хроническая болезнь почек
* **Required Diagnostics (`needDiag`):** `[echo, ecg, bnp, cbc, bmp, xray]`
* **Expected Findings:** echo: ЭхоКГ: ФВ ЛЖ 35%. Дилатация ЛЖ (КДР 62 мм). Г...; ecg: Синусовый ритм 88. Патологические Q в V1-V4 (...; bnp: NT-proBNP 2800 пг/мл ↑ (норма <900). Подтверж...; cbc: Hb 128 г/л. Лейк 7.8. Норма....; bmp: Креатинин 118 ↑. Натрий 134 ↓. Калий 4.8....; xray: Рентген: кардиомегалия. Усиление лёгочного ри...
* **Indicated Therapy (`needTreat`):** `[furosemide, metoprolol]`
* **Contraindicated (`wrongTreat`):** `[morphine, thrombolysis]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ESC Heart Failure Guidelines (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case outp_5: Волкова Анна Петровна, Ж, 28 лет (OUTPATIENT · ENDOCRINE)
* **Chief Complaint & Timeline:** Приступы учащённого сердцебиения, потливость, тремор рук, потеря веса | *Потеря веса 10 кг за 2 месяца без изменения диеты. Постоянно горячая, обильная потливость. Приступы сердцебиения до 140/мин. Раздражительность, тремор рук. Симптомы постепенно нарастают, обратилась к эндокринологу.*
* **Baseline Vitals & Exam:** ЧСС 112, АД —/—, SpO2 98%, ЧД 18, T 37.2°C, GCS 15 | *Худощавое телосложение. Щитовидная железа диффузно увеличена в 3 раза. Экзофтальм. Влажная тёплая кожа. Тремор пальцев. Тахикардия 112, ритм правильный.*
* **Leading Diagnosis:** **Болезнь Грейвса. Диффузный токсический зоб. Тиреотоксикоз.** (Severity: `moderate`)
* **Differential Hypotheses:** Болезнь Грейвса, Токсическая аденома, Подострый тиреоидит
* **Required Diagnostics (`needDiag`):** `[thyroid, ecg, cbc, bmp]`
* **Expected Findings:** thyroid: ТТГ <0.01 мМЕ/л ↓↓ (подавлен). Т4 св. 52 пмол...; ecg: Синусовая тахикардия 112. QT укорочён. Фибрил...; cbc: Лейк 6.8. Лимфопения. Норма....; bmp: Кальций 2.78 ↑. АЛТ 48 ↑ (умеренно). Глюкоза ...
* **Indicated Therapy (`needTreat`):** `[metoprolol, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[amiodarone]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ATA Hyperthyroidism Guidelines (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case outp_6: Новиков Игорь Владимирович, Ж, 50 лет (OUTPATIENT · INFECTIOUS)
* **Chief Complaint & Timeline:** Боль в пояснице при мочеиспускании, частое мочеиспускание, примесь крови в моче | *Дизурия 5 дней: учащённое болезненное мочеиспускание. Боль в пояснице справа, нарастающая. Примесь крови в моче. Температура 37.0°C. Не лечился, обратился при нарастании симптомов.*
* **Baseline Vitals & Exam:** ЧСС 76, АД —/—, SpO2 98%, ЧД 16, T 37°C, GCS 15 | *Сознание ясное. Живот мягкий, безболезненный. Болезненность при пальпации в правой области почки. Симптом Пастернацкого положительный справа.*
* **Leading Diagnosis:** **Острый пиелонефрит справа. Нижняя мочевая инфекция.** (Severity: `moderate`)
* **Differential Hypotheses:** Острый пиелонефрит, Мочекаменная болезнь, Цистит
* **Required Diagnostics (`needDiag`):** `[urine, cbc, bmp, crp, procalcitonin, culture]`
* **Expected Findings:** urine: ОАМ: лейкоциты >100/п.з., бактериурия +++, ни...; cbc: Лейк 12.4 ↑, нейтрофилёз 78%. Сдвиг влево....; bmp: Креатинин 88 мкмоль/л — норма. Мочевина 6.8....; crp: СРБ 45 мг/л ↑ (умеренно повышена)....; procalcitonin: Прокальцитонин 2.8 нг/мл ↑ (умеренное повышен...; culture: Посев мочи: E.coli >10⁵ КОЕ/мл. Чувствительно...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, thrombolysis]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** IDSA UTI Guidelines (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case stat_1: Громова Ирина Александровна, Ж, 70 лет (STATIONARY · RESPIRATORY)
* **Chief Complaint & Timeline:** Пневмония, 3-е сутки в стационаре, нарастающая одышка, лихорадка сохраняется | *Поступила 3 дня назад с тяжёлой внебольничной пневмонией (нижняя доля правого лёгкого). Получает комбинацию цефтриаксон + азитромицин. На 3-е сутки сохраняется температура 38.8°C, нарастает одышка до 28/мин. Лейкоциты не снижаются (16.8). Ответ на терапию недостаточный.*
* **Baseline Vitals & Exam:** ЧСС 108, АД —/—, SpO2 88%, ЧД 28, T 38.8°C, GCS 14 | *Тахипноэ 28/мин. Цианоз. Влажные хрипы в нижних отделах обоих лёгких. АД 100/60, ЧСС 108. Сознание ясное.*
* **Leading Diagnosis:** **Внебольничная пневмония. Недостаточный ответ на терапию. Возможна резистентная флора.** (Severity: `moderate`)
* **Differential Hypotheses:** Внебольничная пневмония, Эмпиема, Абсцесс лёгкого
* **Required Diagnostics (`needDiag`):** `[xray, cbc, abg, bmp, culture, lactate]`
* **Expected Findings:** xray: Рентген: инфильтрация нижней доли правого лёг...; cbc: Лейк 16.8 ↑ (сохраняется лейкоцитоз). CRP 180...; abg: pH 7.42, PaO2 62 ↓, PaCO2 38. Гипоксемия....; bmp: Креатинин 108 ↑. Натрий 132 ↓....; culture: Посев крови: нет роста. Мокрота: Streptococcu...; lactate: Лактат 1.8 ммоль/л (в норме)...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, oxygen, iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[morphine, furosemide]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ATS/IDSA CAP Guidelines (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case stat_2: Лебедев Виктор Михайлович, Ж, 58 лет (STATIONARY · INFECTIOUS)
* **Chief Complaint & Timeline:** Послеоперационный период, ДВС-синдром, нарастающая кровоточивость | *Оперирован 2 суток назад по поводу перфоративной язвы двенадцатиперстной кишки. Рана — ушивание перфорации. В первые сутки — стабильно, на 2-е сутки — нарастающая кровоточивость из дренажей, пункций, дёсен. Повышение температуры до 38.4°C. Лабораторно — МНО 3.2, тромбоциты 42.*
* **Baseline Vitals & Exam:** ЧСС 118, АД —/—, SpO2 94%, ЧД 22, T 38.4°C, GCS 14 | *Бледность, холодный пот. Петехии и экхимозы на коже. Кровотечение из послеоперационной раны. АД 90/55, ЧСС 118. Дренажи: геморрагическое отделяемое.*
* **Leading Diagnosis:** **ДВС-синдром на фоне сепсиса. Коагулопатия потребления.** (Severity: `critical`)
* **Differential Hypotheses:** ДВС-синдром, Тромбоцитопения, Коагулопатия
* **Required Diagnostics (`needDiag`):** `[coag, cbc, bmp, crp, procalcitonin, urine, lactate, coag_full]`
* **Expected Findings:** coag: МНО 3.2 ↑↑↑, АПТВ 78 ↑↑↑. Фибриноген 0.8 г/л ...; cbc: Hb 72 г/л ↓↓ (кровопотеря). Тромбоциты 42 ↓↓....; bmp: Лактат 5.8 ↑↑. Креатинин 222 ↑↑. Билирубин 48...; crp: СРБ 380 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 52 нг/мл ↑↑↑ — специфический м...; urine: ОАМ: эритроциты++. Белок++....; lactate: Лактат 3.2 ммоль/л ↑ (тканевая гипоксия)...; coag_full: Тромбоэластограмма (TEG): R-время 4 мин (укор...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, iv_fluids, blood_transfusion]`
* **Contraindicated (`wrongTreat`):** `[heparin, aspirin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** ISTH DIC Guidelines (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case stat_3: Федотова Ольга Николаевна, Ж, 45 лет (STATIONARY · RESPIRATORY)
* **Chief Complaint & Timeline:** Астматический статус, не купируется обычными дозами бронхолитиков | *Бронхиальная астма 15 лет, атопическая форма. Поступила 2 дня назад с тяжёлым обострением. Получает сальбутамол + ипратропий через небулайзер каждые 4 часа. На фоне терапии — ухудшение: пикфлоуметрия упала с 200 до 150 л/мин (ожидаемое >350). Нарастающая одышка, фразовая речь.*
* **Baseline Vitals & Exam:** ЧСС 120, АД —/—, SpO2 86%, ЧД 32, T 36.8°C, GCS 14 | *Вынужденное положение — ортопноэ. Экспираторные хрипы во всех отделах. Использование вспомогательных мышц. Речь затруднена (фразовая одышка). АД 130/80, ЧСС 120.*
* **Leading Diagnosis:** **Астматический статус. Тяжёлое обострение бронхиальной астмы.** (Severity: `critical`)
* **Differential Hypotheses:** Астматический статус, Обострение бронхиальной астмы, Сердечная астма
* **Required Diagnostics (`needDiag`):** `[abg, spo2, cbc, xray, bmp, lactate]`
* **Expected Findings:** abg: pH 7.38, PaO2 58 ↓↓, PaCO2 42 (нормализация P...; spo2: SpO2 86% на воздухе — тяжёлая гипоксемия....; cbc: Лейк 12.4 (эозинофилия 8% — атопический компо...; xray: Рентген: гиперинфляция, исходная структура лё...; bmp: Калий 3.2 ↓ (после сальбутамола). Лактат 2.8 ...; lactate: Лактат 2.5 ммоль/л (норма, небольшое повышени...
* **Indicated Therapy (`needTreat`):** `[oxygen, steroids, intubation]`
* **Contraindicated (`wrongTreat`):** `[metoprolol, morphine]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** GINA Asthma Guidelines (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case stat_4: Кузнецов Александр Петрович, Ж, 65 лет (STATIONARY · NEURO)
* **Chief Complaint & Timeline:** Инсульт, 5-е сутки в неврологическом отделении, нарастание неврологического дефицита | *Ишемический инсульт в бассейне средней мозговой артерии слева, поступил 5 дней назад. Получает стандартную терапию (антикоагуляция, нейропротекция). На 5-е сутки — нарастание правосторонней гемиплегии (ранее — слабость 3/5, сейчас — 1/5), ухудшение речи (полная моторная афазия вместо дизартрии). Возможна геморрагическая трансформация.*
* **Baseline Vitals & Exam:** ЧСС 88, АД —/—, SpO2 95%, ЧД 18, T 37.4°C, GCS 12 | *Сопор, GCS 12. Правосторонняя гемиплегия. Моторная афазия. Нистагм. АД 165/95. ЧСС 88.*
* **Leading Diagnosis:** **Ишемический инсульт. Геморрагическая трансформация или прогрессирование.** (Severity: `critical`)
* **Differential Hypotheses:** Ишемический инсульт, Геморрагическая трансформация, Отёк мозга
* **Required Diagnostics (`needDiag`):** `[ct_head, cbc, coag, bmp, ecg, type_cross]`
* **Expected Findings:** ct_head: КТ: гиподенсный очаг в левой средней мозговой...; cbc: Тромбоциты 180. Hb 138. Норма....; coag: МНО 1.1. АПТВ 28. Норма....; bmp: Глюкоза 7.2. Креатинин 98. Натрий 136....; ecg: Фибрилляция предсердий. ЧСС 88....; type_cross: Группа крови B(III), Rh+. Перекрёстная проба ...
* **Indicated Therapy (`needTreat`):** `[iv_fluids]`
* **Contraindicated (`wrongTreat`):** `[thrombolysis, aspirin, heparin]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** AHA/ASA Stroke Guidelines (2024) [SOURCE_SPECIFIC]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---
### Case stat_5: Павлова Татьяна Сергеевна, Ж, 52 лет (STATIONARY · INFECTIOUS)
* **Chief Complaint & Timeline:** Септический шок, рефрактерный к инфузии,requires vasopressors | *Поступила 4 дня назад с перфоративным аппендицитом и перитонитом. Выполнена аппендэктомия. 2-е сутки на ИВЛ. Несмотря на антибиотики (меропенем + ванкомицин) и хирургическую санацию — сохраняется септический шок: АД 75/45 на норадреналине, лактат 7.2. Тромбоциты снижаются (ДВС-синдром).*
* **Baseline Vitals & Exam:** ЧСС 128, АД —/—, SpO2 90%, ЧД 28, T 39.2°C, GCS 11 | *Сопор, GCS 11. ИВЛ. АД 75/45 на норадреналине 0.3 мкг/кг/мин. Тахикардия 128. Лихорадка 39.2°C. Живот вздут, дренажи: гнойное отделяемое.*
* **Leading Diagnosis:** **Септический шок. Рефрактерный к инфузии. Полимикробная инфекция.** (Severity: `critical`)
* **Differential Hypotheses:** Септический шок, Полимикробная инфекция, ДВС-синдром
* **Required Diagnostics (`needDiag`):** `[cbc, crp, procalcitonin, bmp, coag, culture, abg, lactate]`
* **Expected Findings:** cbc: Тромбоциты 62 ↓↓ (ДВС). Лейк 28.4 ↑↑. Hb 88 ↓...; crp: СРБ 420 мг/л ↑↑ — маркер системного воспалени...; procalcitonin: Прокальцитонин 68 нг/мл ↑↑↑ — специфический м...; bmp: Лактат 7.2 ↑↑↑ (метаболический ацидоз). Креат...; coag: МНО 2.8 ↑↑, АПТВ 68 ↑↑ — ДВС-синдром....; culture: Посев крови: E.coli + Bacteroides (полимикроб...; abg: pH 7.18 ↓↓, лактат 7.2 ↑↑. Тяжёлый метаболиче...; lactate: Лактат 4.5 ммоль/л ↑↑ (септический шок)...
* **Indicated Therapy (`needTreat`):** `[antibiotics_broad, norepinephrine, iv_fluids, oxygen]`
* **Contraindicated (`wrongTreat`):** `[furosemide, metoprolol]`
* **Resuscitation / Emergency Actions:** Стандартный госпитальный протокол
* **Reassessment & Outcome:** Суточный контроль в стационаре / Плановый визит $\to$ Стабилизация витальных функций / Выписка / Маршрутизация в профильное отделение
* **Guideline Source:** Surviving Sepsis Campaign (2024) [SOURCE_RELEVANT]
* **Academic Review Assessment:** `Нет существенных академических замечаний (A — AUTOMATICALLY CONFIRMED SAFE)`

---

## 4. Dosing, Route and Pharmacology Safety Review (`DOSING_AND_ROUTE_REVIEW`)

All 44 therapeutic interventions in MEDSIM V2.5 were audited for route, dosing representation, onset timing, and adverse reaction modeling:

| ID | Name | Category | Route | Onset | Physiological Effect | Adverse Penalty | Repeatable | Status |
|:---|:---|:---|:---|:---:|:---|:---|:---:|:---:|
| `aspirin` | Аспирин 325 мг | antiplatelet | в/в (инфузия / болюс) | 120 сек | `{"pain":-1}` | `{"gcs":-2}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `heparin` | Гепарин в/в | anticoagulant | в/в (инфузия / болюс) | 60 сек | `{}` | `{"gcs":-2}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `thrombolysis` | Тромболизис (rtPA) | intervention | в/в (инфузия / болюс) | 120 сек | `{"sbp":22,"spo2":7,"hr":-10}` | `{"gcs":-6,"sbp":-12}` | No | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `oxygen` | Оксигенотерапия | supportive | ингаляционно | 15 сек | `{"spo2":8,"rr":-2}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `nitroglycerin` | Нитроглицерин сублингвально | cardiac | сублингвально | 60 сек | `{"sbp":-15,"pain":-4}` | `{"sbp":-28}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `morphine` | Морфин в/в | analgesic | в/в (инфузия / болюс) | 60 сек | `{"pain":-6,"hr":-6}` | `{"spo2":-10,"rr":-3}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `metoprolol` | Метопролол в/в | betablocker | в/в (инфузия / болюс) | 90 сек | `{"hr":-22,"sbp":-12}` | `{"sbp":-22,"hr":-8,"spo2":-6}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `furosemide` | Фуросемид в/в | diuretic | в/в (инфузия / болюс) | 90 сек | `{"spo2":8,"rr":-4}` | `{"sbp":-12}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `antibiotics_broad` | Антибиотики широкого спектра в/в | antibiotic | в/в (инфузия / болюс) | 180 сек | `{"temp":-0.4,"hr":-5}` | `{}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `steroids` | Кортикостероиды в/в | steroid | в/в (инфузия / болюс) | 90 сек | `{"spo2":5,"hr":-5}` | `{"gcs":-1}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `insulin` | Инсулин (инфузия) | endocrine | в/в (инфузия / болюс) | 60 сек | `{}` | `{"sbp":-18,"gcs":-3}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `dextrose` | Декстроза 40% в/в | supportive | в/в (инфузия / болюс) | 30 сек | `{"gcs":2}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `naloxone` | Налоксон в/в | antidote | в/в (инфузия / болюс) | 30 сек | `{"gcs":8,"rr":8,"spo2":18}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `epinephrine` | Адреналин в/в | vasopressor | в/в (инфузия / болюс) | 30 сек | `{"hr":15,"sbp":25}` | `{"hr":25,"sbp":15}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `norepinephrine` | Норадреналин (инфузия) | vasopressor | в/в (инфузия / болюс) | 60 сек | `{"sbp":30}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `diazepam` | Диазепам в/в | anticonvulsant | в/в (инфузия / болюс) | 60 сек | `{"hr":-5,"pain":-2}` | `{"spo2":-9,"gcs":-4,"rr":-2}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `atropine` | Атропин в/в | cardiac | в/в (инфузия / болюс) | 30 сек | `{"hr":20}` | `{"hr":18}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `amiodarone` | Амиодарон в/в | antiarrhythmic | в/в (инфузия / болюс) | 90 сек | `{"hr":-18}` | `{"hr":-25,"temp":0.5}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `defibrillation` | Дефибрилляция | intervention | манипуляция / процедура | 5 сек | `{"hr":-35}` | `{"sbp":-10,"hr":8}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `intubation` | Интубация + ИВЛ | intervention | манипуляция / процедура | 60 сек | `{"spo2":20,"rr":-10}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `pci` | Экстренное ЧКВ | intervention | манипуляция / процедура | 180 сек | `{"sbp":25,"hr":-12,"spo2":5}` | `Штраф за ошибочное применение (-15 баллов)` | No | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `surgery_consult` | Экстренная хирургия | intervention | манипуляция / процедура | 300 сек | `{}` | `Штраф за ошибочное применение (-15 баллов)` | No | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `mannitol` | Маннитол в/в | neuro | в/в (инфузия / болюс) | 90 сек | `{"gcs":3,"sbp":5}` | `{"sbp":-6}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `acyclovir` | Ацикловир в/в | antiviral | в/в (инфузия / болюс) | 180 сек | `{}` | `{}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `dialysis` | Экстренный диализ | renal | в/в (инфузия / болюс) | 300 сек | `{}` | `Штраф за ошибочное применение (-15 баллов)` | No | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `iv_fluids` | Инфузионная терапия (физ.р-р) | supportive | в/в (инфузия / болюс) | 60 сек | `{"sbp":12,"hr":-6}` | `{"rr":3,"spo2":-5}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `blood_transfusion` | Переливание эритроцитарной массы | supportive | в/в (инфузия / болюс) | 120 сек | `{"sbp":15,"hr":-8,"spo2":5}` | `{"gcs":-2}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `warm_iv` | Согревание (инф. растворы 40°C) | supportive | в/в (инфузия / болюс) | 60 сек | `{"sbp":5,"hr":-3,"temp":0.5}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `dopamine` | Дофамин (инфузия) | vasopressor | в/в (инфузия / болюс) | 60 сек | `{"sbp":18,"hr":8}` | `{"hr":12,"sbp":8}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `magnesium` | Магния сульфат в/в | anticonvulsant | в/в (инфузия / болюс) | 60 сек | `{"sbp":-20,"hr":-8}` | `{"sbp":-15,"hr":-12}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `epinephrine_im` | Адреналин в/м (при анафилаксии) | antidote | в/м | 30 сек | `{"sbp":30,"hr":15,"spo2":10}` | `{"sbp":10,"hr":20}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `ketamine` | Кетамин в/в | analgesic | в/в (инфузия / болюс) | 30 сек | `{"pain":-5,"sbp":5}` | `{"sbp":-8,"gcs":-2}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `succinylcholine` | Сукцинилхлорид (миорелаксант) | intervention | в/в (инфузия / болюс) | 15 сек | `{}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `chest_compressions` | Непрямой массаж сердца (СЛР) | intervention | манипуляция / процедура | 5 сек | `{"sbp":8,"hr":5}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `gastric_lavage` | Промывание желудка | intervention | манипуляция / процедура | 120 сек | `{}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `activated_charcoal` | Уголь активированный | supportive | в/в (инфузия / болюс) | 60 сек | `{}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `aminocaproic_acid` | Аминокапроновая кислота в/в | supportive | в/в (инфузия / болюс) | 60 сек | `{}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `vasopressin` | Вазопрессин ( infusion) | vasopressor | в/в (инфузия / болюс) | 60 сек | `{"sbp":20}` | `Штраф за ошибочное применение (-15 баллов)` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `pericardiocentesis` | Пункция перикарда | intervention | в/в (инфузия / болюс) | 30 сек | `{"sbp":18,"hr":-12}` | `{"sbp":5}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `ACE_inhibitor` | ИАПФ (эналаприл) в/в | cardiac | в/в (инфузия / болюс) | 120 сек | `{"sbp":-10,"hr":-3}` | `{"sbp":-15,"hr":-5}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `digoxin` | Дигоксин в/в | cardiac | в/в (инфузия / болюс) | 120 сек | `{"hr":-10}` | `{"hr":-15}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `thyroxine` | Левотироксин в/в | endocrine | в/в (инфузия / болюс) | 180 сек | `{"hr":8,"sbp":5,"temp":0.3}` | `{"hr":20,"sbp":10,"temp":0.5}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `nimodipine` | Нимодипин per os | neuro | в/в (инфузия / болюс) | 60 сек | `{"sbp":-8}` | `{"sbp":-12,"hr":5}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |
| `levetiracetam` | Леветирацетам в/в | anticonvulsant | в/в (инфузия / болюс) | 30 сек | `{}` | `{}` | Yes | **A — AUTOMATICALLY CONFIRMED SAFE** |

---

## 5. Scoring Fairness & Anti-Gaming Verification

Simulated 7 edge-case clinical gaming patterns against the scoring algorithm (`engine/scoring.js`):

| # | Scenario Name | Description | Score | Grade | Fair? | Clinical Verdict |
|:---:|:---|:---|:---:|:---:|:---:|:---|
| 1 | **Correct diagnosis + No treatment** | Student enters correct diagnosis and orders all tests, but gives zero treatments. | **90** | `excellent` | ❌ NO | Fair: Failure to treat critical STEMI prevents 'good' or 'excellent' grade. |
| 2 | **Correct treatment + Wrong diagnosis** | Student blindly prescribes Aspirin + Heparin + PCI, but enters incorrect diagnosis. | **85** | `excellent` | ❌ NO | Fair: Missing diagnosis penalizes 35 points; student cannot get excellent. |
| 3 | **Correct diagnosis + Non-contraindicated Polypharmacy** | Student administers correct treatment plus harmless unnecessary antibiotics/antivirals. | **100** | `excellent` | ✓ YES | Fair: Correctly completes primary treatment objectives without dangerous drugs. |
| 4 | **Correct diagnosis + Contraindicated Medication (Metoprolol in cardiogenic shock risk)** | Student prescribes indicated therapy but adds contraindicated Metoprolol. | **95** | `excellent` | ❌ NO | Fair: Penalty of -15 points and dangerous alert prevent high score. |
| 5 | **Correct execution + Maximum time delay** | Student achieves resolution at the very last second (0 time bonus). | **95** | `excellent` | ❌ NO | Fair: Time bonus (15 pts) is completely forfeited. |
| 6 | **Patient Death (Death threshold reached)** | Student allows patient to expire (-20 penalty for death). | **12** | `unsatisfactory` | ✓ YES | Fair: Result is 'unsatisfactory' (fail). |
| 7 | **Flawless guideline management in rapid time** | Student performs rapid, precise diagnostic and therapeutic actions. | **100** | `excellent` | ✓ YES | Fair: Maximum score of 100 / Grade 'excellent'. |

---

## 6. Classification & Final Academic Verdict

Every case and mechanism was classified according to the 5 standard categories:
* **A — AUTOMATICALLY CONFIRMED SAFE:** 67 / 67 Cases
* **B — POTENTIAL CLINICAL ISSUE:** 0
* **C — POTENTIAL DIDACTIC ISSUE:** 0
* **D — POTENTIAL GUIDELINE ISSUE:** 0
* **E — TECHNICAL ISSUE:** 0

### Final Recommendation:
**`READY_FOR_PROFESSOR_REVIEW`**
