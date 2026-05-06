export const DIAGNOSTICS = [
  {id:"ecg",name:"ЭКГ",cat:"cardiac"},{id:"echo",name:"ЭхоКГ",cat:"cardiac"},
  {id:"bp_monitor",name:"Суточное мониторирование АД",cat:"cardiac"},
  {id:"troponin",name:"Тропонин I",cat:"lab"},{id:"bnp",name:"BNP / NT-proBNP",cat:"lab"},
  {id:"cbc",name:"ОАК",cat:"lab"},{id:"bmp",name:"Биохимия крови",cat:"lab"},
  {id:"crp",name:"СРБ / Прокальцитонин",cat:"lab"},{id:"d_dimer",name:"D-димер",cat:"lab"},
  {id:"coag",name:"Коагулограмма",cat:"lab"},{id:"glucose",name:"Глюкоза крови",cat:"lab"},
  {id:"lipid",name:"Липидный профиль",cat:"lab"},{id:"thyroid",name:"ТТГ / Т4 своб.",cat:"lab"},
  {id:"culture",name:"Посев крови / мочи",cat:"lab"},{id:"urine",name:"ОАМ",cat:"lab"},
  {id:"abg",name:"Газы артериальной крови",cat:"respiratory"},{id:"spo2",name:"Пульсоксиметрия",cat:"respiratory"},
  {id:"xray",name:"Рентген грудной клетки",cat:"imaging"},{id:"ct_chest",name:"КТ грудной клетки",cat:"imaging"},
  {id:"ct_head",name:"КТ головного мозга",cat:"imaging"},{id:"mri",name:"МРТ головного мозга",cat:"imaging"},
  {id:"usg_abdo",name:"УЗИ брюшной полости",cat:"imaging"},
  {id:"eeg",name:"ЭЭГ",cat:"neuro"},{id:"lumbar",name:"Люмбальная пункция",cat:"neuro"},
  {id:"cohb",name:"Карбоксигемоглобин (COHb)",cat:"lab"},
  {id:"ketones",name:"Кетоны крови",cat:"lab"},
];

export const MISSED_TEST_REASONS = {
  ecg:"ЭКГ — первый обязательный тест при боли в груди. Позволяет диагностировать ОКС за минуты.",
  troponin:"Тропонин — маркер некроза миокарда. Необходим для подтверждения ОИМ.",
  ct_head:"КТ головы — обязательна при неврологической симптоматике. Исключает геморрагию до тромболизиса.",
  d_dimer:"D-димер — скрининговый тест на ТЭЛА. Нормальный результат исключает ТЭЛА.",
  ct_chest:"КТ-ангиография — золотой стандарт диагностики ТЭЛА и оценки лёгочных патологий.",
  lumbar:"Люмбальная пункция подтверждает САК и менингит, когда КТ недостаточно.",
  abg:"Газы артериальной крови оценивают тяжесть дыхательной недостаточности и ацидоза.",
  bnp:"BNP/NT-proBNP — биомаркер сердечной недостаточности. Высокий уровень подтверждает ОДХСН.",
  thyroid:"ТТГ/Т4 — единственный способ подтвердить тиреотоксикоз лабораторно.",
  echo:"ЭхоКГ оценивает функцию сердца, зоны гипокинеза и выпот — критично при кардиальной патологии.",
  coag:"Коагулограмма обязательна перед тромболизисом и при подозрении на ДВС-синдром.",
  crp:"СРБ и прокальцитонин — маркеры системного воспаления, подтверждают сепсис.",
  culture:"Посев крови до начала антибиотиков — позволяет идентифицировать возбудитель и подобрать терапию.",
  cohb:"Карбоксигемоглобин — единственный способ диагностировать отравление CO. Пульсоксиметр ложно-нормальный при CO-отравлении.",
  ketones:"Кетоны крови подтверждают ДКА и оценивают тяжесть кетоацидоза. Необходимы для мониторинга ответа на инсулинотерапию.",
  glucose:"Уровень глюкозы критичен при диагностике ДКА, гипогликемии и оценке инсулинотерапии.",
};

export const CAT_COLOR = {
  cardiac:"#ff3d5a",lab:"#00e6c8",imaging:"#9d6ff5",respiratory:"#00e5a0",vital:"#f5c842",neuro:"#f57c42",
  antiplatelet:"#ff3d5a",anticoagulant:"#ff3d5a",intervention:"#ff3d5a",supportive:"#00e5a0",analgesic:"#f57c42",
  betablocker:"#9d6ff5",diuretic:"#00e6c8",antibiotic:"#00e5a0",steroid:"#f5c842",endocrine:"#f5c842",
  antidote:"#00e5a0",vasopressor:"#ff3d5a",anticonvulsant:"#f57c42",antiarrhythmic:"#9d6ff5",
  antiviral:"#00e5a0",renal:"#00e6c8",
};
