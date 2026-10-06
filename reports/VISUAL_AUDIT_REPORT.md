# Полный визуальный отчет по интерфейсам и режимам MedSim

Дата формирования: 05.10.2026  
Инструмент захвата: Playwright Automated Visual Engine (Chromium Retina 2x)  
Интерактивная галерея для просмотра: [reports/gallery.html](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/gallery.html)  

---

## 📱 Охваченные устройства и разрешения

1. **Desktop (ПК / Ноутбук):** 1440 × 900 px — двухколоночная рабочая станция врача, верхний HUD виталов, постоянные вкладки диагностики/лечения/диагноза, нижний таймлайн.
2. **Tablet (Планшет / iPad):** 820 × 1180 px — адаптивная вертикальная ориентация, плавающие шторки, масштабируемый витальный монитор.
3. **Mobile (Смартфон / iPhone):** 390 × 844 px — мобильный интерфейс в один экран с нижней панелью действий (Quick Action Drawer), компактным статус-стрипом и выдвижными шторками назначения анализов и терапии.

---

## 🗂 Каталог скриншотов по разделам

### 1. Главное меню и модальные окна навигации
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **Главное меню (Все кейсы)** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/01_menu_main_all.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/01_menu_main_all.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/01_menu_main_all.png) | Каталог 67 кейсов, поиск, 3D тикер, карточки |
| **Меню: Фильтр ОРИТ** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/02_menu_dept_icu.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/02_menu_dept_icu.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/02_menu_dept_icu.png) | Экстренные реанимационные больные |
| **Меню: Фильтр Приёмное** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/03_menu_dept_admission.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/03_menu_dept_admission.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/03_menu_dept_admission.png) | Triage и первичная диагностика |
| **Меню: Фильтр Стационар** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/04_menu_dept_stationary.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/04_menu_dept_stationary.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/04_menu_dept_stationary.png) | Суточное ведение и дневники |
| **Меню: Фильтр Поликлиника** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/05_menu_dept_outpatient.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/05_menu_dept_outpatient.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/05_menu_dept_outpatient.png) | Первичный амбулаторный прием |
| **Модалка настроек** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/06_menu_settings_modal.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/06_menu_settings_modal.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/06_menu_settings_modal.png) | Сложность, режимы, обучение, темы, звук |
| **Модалка уведомлений** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/07_menu_notifications_modal.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/07_menu_notifications_modal.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/07_menu_notifications_modal.png) | Системные алерты и клинические события |
| **Профиль врача / Аккаунт** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/08_menu_account_modal.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/08_menu_account_modal.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/08_menu_account_modal.png) | Выбор роли, аватара, уровень XP |
| **Мобильное меню (Drawer)** | — | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/09_menu_mobile_drawer.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/09_menu_mobile_drawer.png) | Выдвижной сайдбар на тач-устройствах |

---

### 2. Обучение, Онбординг и Карта курсов
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **Онбординг** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/10_onboarding_step.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/10_onboarding_step.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/10_onboarding_step.png) | Вводный обучающий тур |
| **Карта курсов** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/16_course_map.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/16_course_map.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/16_course_map.png) | Древо синдромов и клинических тем |

---

### 3. Теория, Справочники, Протоколы и Калькуляторы
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **Теоретический хаб** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/11_theory_hub.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/11_theory_hub.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/11_theory_hub.png) | Каталог 35 нозологических тем |
| **Конспект нозологии** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/12_theory_topic_content.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/12_theory_topic_content.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/12_theory_topic_content.png) | Развернутый клинрек с диагностикой и лечением |
| **Справочник препаратов** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/13_theory_drug_reference.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/13_theory_drug_reference.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/13_theory_drug_reference.png) | База 40 препаратов с дозировками и эффектами |
| **Протоколы (ACLS/BLS)** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/14_theory_protocols.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/14_theory_protocols.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/14_theory_protocols.png) | Пошаговые алгоритмы реанимации |
| **Калькулятор GCS** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/15_theory_calculator_gcs.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/15_theory_calculator_gcs.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/15_theory_calculator_gcs.png) | Интерактивный расчет шкалы Глазго |

---

### 4. Достижения, Сертификаты и Кабинет преподавателя
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **Таблица лидеров / Статистика** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/17_leaderboard.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/17_leaderboard.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/17_leaderboard.png) | История попыток, средний балл ОСКЭ |
| **Витрина сертификатов** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/18_certificates.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/18_certificates.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/18_certificates.png) | 17 наград и дипломов по специализациям |
| **Кабинет преподавателя** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/19_teacher_dashboard.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/19_teacher_dashboard.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/19_teacher_dashboard.png) | Аналитика группы, тепловая карта когнитивных ошибок |

---

### 5. Игровой режим: ОРИТ (ICU Workstation)
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **ОРИТ: Главный рабочий стол & ABCDE** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/20_game_icu_workspace_abcde.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/20_game_icu_workspace_abcde.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/20_game_icu_workspace_abcde.png) | Виталы, ЭКГ в динамике, синдромальный стрип, жалоба, диалог |
| **ОРИТ: Вкладка / Шторка Диагностики** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/21_game_icu_diagnostics_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/21_game_icu_mobile_diag_drawer.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/21_game_icu_mobile_diag_drawer.png) | Назначение лабораторных и инструментальных тестов |
| **ОРИТ: Вкладка / Шторка Терапии** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/22_game_icu_treatment_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/22_game_icu_mobile_treat_drawer.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/22_game_icu_mobile_treat_drawer.png) | Выбор экстренных медикаментов по категориям |
| **ОРИТ: Постановка диагноза** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/23_game_icu_diagnosis_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/23_game_icu_mobile_diagnose_view.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/23_game_icu_mobile_diagnose_view.png) | Формулирование клинического диагноза |

---

### 6. Игровые режимы: Приёмное, Стационар, Поликлиника
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **Приёмное отделение** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/24_game_admission_workspace.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/24_game_admission_workspace.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/24_game_admission_workspace.png) | Краткий анамнез, triage, маршрутизация |
| **Стационар: Обход утро** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/25_game_stationary_workspace.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/25_game_stationary_workspace.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/25_game_stationary_workspace.png) | Суточный цикл, утренний статус |
| **Стационар: Анамнез болезни** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/26_game_stationary_anamnesis_illness.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/26_game_stationary_anamnesis_illness.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/26_game_stationary_anamnesis_illness.png) | Раскрытый анамнез заболевания |
| **Стационар: Анамнез жизни** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/27_game_stationary_anamnesis_life.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/27_game_stationary_anamnesis_life.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/27_game_stationary_anamnesis_life.png) | Раскрытый анамнез жизни (аллергии, сопутствующие) |
| **Поликлиника: Прием врача** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/28_game_outpatient_workspace.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/28_game_outpatient_workspace.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/28_game_outpatient_workspace.png) | Жалобы, осмотр, амбулаторный план |

---

### 7. Экран результатов (ResultScreen & Дебрифинг)
| Раздел / Экран | Desktop | Tablet | Mobile | Описание |
| :--- | :---: | :---: | :---: | :--- |
| **Результаты: Обзор и оценка ОСКЭ** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/29_result_summary_overview.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/29_result_summary_overview.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/29_result_summary_overview.png) | Баллы (0-100), исход, дельты ЖП, правильный диагноз |
| **Результаты: Анализ ошибок** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/30_result_errors_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/30_result_errors_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/30_result_errors_tab.png) | Дефекты оказания помощи, пропущенные тесты |
| **Результаты: Теория и КР** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/31_result_theory_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/31_result_theory_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/31_result_theory_tab.png) | Ссылка на клинреки Минздрава и обоснование |
| **Результаты: Хронология (Таймлайн)** | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/desktop/32_result_timeline_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/tablet/32_result_timeline_tab.png) | [Скрин](file:///Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/reports/screenshots/mobile/32_result_timeline_tab.png) | Хронологическая шкала каждого действия игрока |
