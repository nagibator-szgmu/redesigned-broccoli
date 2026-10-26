import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

SRC_PPTX = '/Users/arsenykozlov/.gemini/antigravity/brain/f590aa99-d3d7-4c98-933d-845bb3d841c9/.user_uploaded/media_1790779222702.pptx'
OUT_PPTX = '/Users/arsenykozlov/Desktop/проекты/redesigned-broccoli-main/MedSim_Presentation_NTI.pptx'

prs = pptx.Presentation(SRC_PPTX)

# Global Palettes
COLOR_PURPLE = RGBColor(127, 20, 224)
COLOR_PURPLE_DARK = RGBColor(88, 9, 163)
COLOR_PURPLE_LIGHT = RGBColor(252, 250, 255)
COLOR_PURPLE_BORDER = RGBColor(220, 212, 238)
COLOR_PURPLE_FILL_TABLE = RGBColor(245, 237, 255)

COLOR_ORANGE = RGBColor(242, 114, 32)
COLOR_ORANGE_BRIGHT = RGBColor(255, 155, 60)
COLOR_ORANGE_LIGHT = RGBColor(255, 245, 238)

COLOR_DARK = RGBColor(25, 25, 30)
COLOR_MUTED = RGBColor(85, 90, 100)
COLOR_WHITE = RGBColor(255, 255, 255)
COLOR_LIGHT_VIOLET = RGBColor(220, 205, 245)

def clear_text_frame(tf):
    tf.text = ""
    while len(tf.paragraphs) > 1:
        p = tf.paragraphs[-1]._p
        p.getparent().remove(p)
    if len(tf.paragraphs) == 1:
        tf.paragraphs[0].text = ""

# ==============================================================================
# SLIDE 1: ТИТУЛЬНЫЙ (HERO)
# ==============================================================================
s1 = prs.slides[0]
for sh in s1.shapes:
    if sh.name in ['object 18', 'Прямоугольник 12'] and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

hero1 = s1.shapes.add_textbox(Inches(0.6), Inches(2.0), Inches(6.5), Inches(3.0))
h1_tf = hero1.text_frame
h1_tf.word_wrap = True
h1_tf.margin_left = h1_tf.margin_right = h1_tf.margin_top = h1_tf.margin_bottom = 0

p_tag = h1_tf.paragraphs[0]
p_tag.text = 'МЕДТЕХ  •  СИМУЛЯЦИОННОЕ ОБУЧЕНИЕ  •  ИМПОРТОЗАМЕЩЕНИЕ'
p_tag.font.name = 'Segoe UI'
p_tag.font.size = Pt(10)
p_tag.font.bold = True
p_tag.font.color.rgb = COLOR_ORANGE_BRIGHT
p_tag.space_after = Pt(8)

p_title = h1_tf.add_paragraph()
p_title.text = 'МЕДСИМ (MedSim)'
p_title.font.name = 'Segoe UI'
p_title.font.size = Pt(40)
p_title.font.bold = True
p_title.font.color.rgb = COLOR_WHITE
p_title.space_after = Pt(8)

p_sub = h1_tf.add_paragraph()
p_sub.text = 'Интерактивный тренажёр клинического мышления для студентов и ординаторов'
p_sub.font.name = 'Segoe UI'
p_sub.font.size = Pt(15.5)
p_sub.font.bold = True
p_sub.font.color.rgb = COLOR_WHITE
p_sub.space_after = Pt(10)

p_desc = h1_tf.add_paragraph()
p_desc.text = 'Отечественная кроссплатформенная веб-система симуляции клинических решений в реальном времени по актуальным Клиническим рекомендациям Минздрава РФ'
p_desc.font.name = 'Segoe UI'
p_desc.font.size = Pt(11.5)
p_desc.font.color.rgb = COLOR_LIGHT_VIOLET

# Team card at bottom left (completely clear of yellow loop)
card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(5.15), Inches(6.5), Inches(1.85))
card1.fill.solid()
card1.fill.fore_color.rgb = RGBColor(38, 12, 70)
card1.line.color.rgb = RGBColor(105, 50, 160)
card1.line.width = Pt(1)

c1_tf = card1.text_frame
c1_tf.word_wrap = True
c1_tf.margin_left = c1_tf.margin_right = Inches(0.2)
c1_tf.margin_top = c1_tf.margin_bottom = Inches(0.12)

cp0 = c1_tf.paragraphs[0]
cp0.text = 'ФГБОУ ВО СЗГМУ им. И.И. Мечникова Минздрава России'
cp0.font.name = 'Segoe UI'
cp0.font.size = Pt(11)
cp0.font.bold = True
cp0.font.color.rgb = COLOR_WHITE
cp0.space_after = Pt(4)

def add_team_line(tf, label, val):
    p = tf.add_paragraph()
    p.space_after = Pt(2)
    p.font.name = 'Segoe UI'
    p.font.size = Pt(9.5)
    r1 = p.add_run()
    r1.text = label + ': '
    r1.font.bold = True
    r1.font.color.rgb = COLOR_ORANGE_BRIGHT
    r2 = p.add_run()
    r2.text = val
    r2.font.color.rgb = COLOR_WHITE

add_team_line(c1_tf, 'Автор и разработчик', 'Козлов Арсений Анатольевич (студент 3 курса лечебного факультета)')
add_team_line(c1_tf, 'Научный руководитель', 'Расмагина Ирина Алексеевна, к.м.н., асс. кафедры пропедевтики')
add_team_line(c1_tf, 'Наставник проекта', 'Бакулин Игорь Геннадьевич, д.м.н., проф., зав. кафедрой, гл. гастроэнтеролог СЗФО')

# ==============================================================================
# SLIDE 2: ПРОБЛЕМА (3 CARDS IN PURPLE FRAME)
# ==============================================================================
s2 = prs.slides[1]
for sh in s2.shapes:
    if sh.name == 'object 70' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

# Notch text fitting perfectly into white notch
notch_box = s2.shapes.add_textbox(Inches(0.55), Inches(2.14), Inches(3.6), Inches(0.38))
tf_n = notch_box.text_frame
tf_n.word_wrap = False
tf_n.margin_left = tf_n.margin_right = tf_n.margin_top = tf_n.margin_bottom = 0
p_n = tf_n.paragraphs[0]
p_n.text = 'КЛЮЧЕВЫЕ БОЛИ РЫНКА'
p_n.font.name = 'Segoe UI'
p_n.font.size = Pt(11)
p_n.font.bold = True
p_n.font.color.rgb = COLOR_PURPLE

cards2_data = [
    {
        'kpi': '45 000+',
        'kpi_sub': 'студентов и 20 000+ ординаторов в РФ',
        'kpi_color': COLOR_PURPLE,
        'title': 'Дефицит самостоятельной курации',
        'points': [
            ('>70% начинающих врачей', 'приходят в ординатуру без опыта самостоятельного ведения экстренных и тяжёлых больных.'),
            ('Ограничения клиники:', 'Студентов не допускают к реальным реанимационным и экстренным решениям из-за рисков для пациентов.'),
            ('Следствие:', 'Высокий уровень врачебного стресса на первых дежурствах, страх фатальной ошибки.')
        ]
    },
    {
        'kpi': '25%',
        'kpi_sub': 'дефектов в первичном звене',
        'kpi_color': COLOR_ORANGE,
        'title': 'Статичность классического обучения',
        'points': [
            ('Тесты на бумаге', 'статичны: студент не чувствует дефицита времени и угасания виталов (АД, ЧСС, SpO2) за 30 секунд.'),
            ('CustDev (87,2%):', 'Обучающиеся заявили об острой нехватке интерактивной практики принятия решений.'),
            ('Цена промедления:', 'Ошибки сортировки и задержка неотложной терапии наносят колоссальный ущерб здоровью.')
        ]
    },
    {
        'kpi': '$50 000',
        'kpi_sub': 'в год за зарубежные аналоги',
        'kpi_color': COLOR_PURPLE,
        'title': 'Недоступность существующих решений',
        'points': [
            ('Body Interact и Full Code:', 'Заблокированы из-за санкций, оторваны от стандартов РФ и стоят от $50 000/год.'),
            ('Манекены (3–15 млн ₽):', 'Тренируют только мануальные навыки (СЛР, интубация), но не клиническое мышление врача.'),
            ('Решение «МедСим»:', 'BYOD-доступ по Клиническим рекомендациям Минздрава РФ с любого смартфона/ноутбука в 5–10 раз дешевле.')
        ]
    }
]

left_start = Inches(0.55)
card_w = Inches(3.85)
gap = Inches(0.24)
top_pos = Inches(2.65)
card_h = Inches(4.15)

for i, cd in enumerate(cards2_data):
    cx = left_start + i * (card_w + gap)
    card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_pos, card_w, card_h)
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.2)
    
    tf = card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Inches(0.2)
    tf.margin_top = Inches(0.18)
    tf.margin_bottom = Inches(0.15)
    
    # KPI Big Number
    p0 = tf.paragraphs[0]
    p0.text = cd['kpi']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(24)
    p0.font.bold = True
    p0.font.color.rgb = cd['kpi_color']
    p0.space_after = Pt(1)
    
    # KPI Subtitle
    p_ksub = tf.add_paragraph()
    p_ksub.text = cd['kpi_sub']
    p_ksub.font.name = 'Segoe UI'
    p_ksub.font.size = Pt(9.5)
    p_ksub.font.color.rgb = COLOR_MUTED
    p_ksub.space_after = Pt(6)
    
    # Title
    p1 = tf.add_paragraph()
    p1.text = cd['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(8)
    
    # Points
    for pfx, body in cd['points']:
        pp = tf.add_paragraph()
        pp.space_after = Pt(4)
        pp.space_before = Pt(1)
        r_pfx = pp.add_run()
        r_pfx.text = '• ' + pfx + ' '
        r_pfx.font.name = 'Segoe UI'
        r_pfx.font.size = Pt(9.5)
        r_pfx.font.bold = True
        r_pfx.font.color.rgb = COLOR_DARK
        
        r_body = pp.add_run()
        r_body.text = body
        r_body.font.name = 'Segoe UI'
        r_body.font.size = Pt(9.5)
        r_body.font.color.rgb = COLOR_MUTED

# ==============================================================================
# SLIDE 3: РЕШЕНИЕ (4 DEPARTMENTS GRID + BOTTOM PILL)
# ==============================================================================
s3 = prs.slides[2]
for sh in s3.shapes:
    if sh.name == 'Прямоугольник 57' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

banner3 = s3.shapes.add_textbox(Inches(0.6), Inches(1.6), Inches(8.5), Inches(0.9))
b3_tf = banner3.text_frame
b3_tf.word_wrap = True
b3_tf.margin_left = b3_tf.margin_right = b3_tf.margin_top = b3_tf.margin_bottom = 0

bp0 = b3_tf.paragraphs[0]
bp0.text = 'ИНТЕРАКТИВНЫЙ ВЕБ-СИМУЛЯТОР КЛИНИЧЕСКИХ РЕШЕНИЙ'
bp0.font.name = 'Segoe UI'
bp0.font.size = Pt(10)
bp0.font.bold = True
bp0.font.color.rgb = COLOR_PURPLE
bp0.space_after = Pt(2)

bp1 = b3_tf.add_paragraph()
bp1.text = '«МедСим» переносит обучающегося в реальные клинические условия с непрерывной динамикой состояния больного по стандартам Минздрава РФ'
bp1.font.name = 'Segoe UI'
bp1.font.size = Pt(12)
bp1.font.bold = True
bp1.font.color.rgb = COLOR_DARK

depts3 = [
    {
        'tag': 'ОРИТ (ICU)',
        'tag_color': RGBColor(220, 38, 38),
        'title': 'Экстренная реанимация',
        'desc': 'Таймер 12–15 мин, протокол ABCDE, динамика 7 виталов каждые 30 сек. Исходы: стабилизация или остановка сердца.'
    },
    {
        'tag': 'ПРИЁМНОЕ ОТДЕЛЕНИЕ',
        'tag_color': COLOR_ORANGE,
        'title': 'Сортировка и маршрутизация',
        'desc': 'Дифференциальная диагностика под дефицитом времени, первичная стабилизация и выбор маршрута госпитализации.'
    },
    {
        'tag': 'ПОЛИКЛИНИКА',
        'tag_color': RGBColor(16, 149, 193),
        'title': 'Амбулаторный приём',
        'desc': 'Приём без таймера, сбор анамнеза заболевания и жизни, назначение целевых анализов и формулировка диагноза.'
    },
    {
        'tag': 'СТАЦИОНАР',
        'tag_color': COLOR_PURPLE,
        'title': 'Суточный цикл курации',
        'desc': 'Утренний обход, лабораторный контроль, коррекция фармакотерапии, контроль полипрагмазии и критерии выписки.'
    }
]

for i, d in enumerate(depts3):
    col = i % 2
    row = i // 2
    cx = Inches(0.6) + col * Inches(4.35)
    cy = Inches(2.65) + row * Inches(1.8)
    
    card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(4.15), Inches(1.65))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.16)
    ctf.margin_top = ctf.margin_bottom = Inches(0.12)
    
    p0 = ctf.paragraphs[0]
    p0.text = d['tag']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(9.5)
    p0.font.bold = True
    p0.font.color.rgb = d['tag_color']
    p0.space_after = Pt(2)
    
    p1 = ctf.add_paragraph()
    p1.text = d['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(3)
    
    p2 = ctf.add_paragraph()
    p2.text = d['desc']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = COLOR_MUTED

pill3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.35), Inches(8.5), Inches(0.55))
pill3.fill.solid()
pill3.fill.fore_color.rgb = COLOR_PURPLE
pill3.line.fill.background()
ptf3 = pill3.text_frame
ptf3.word_wrap = False
ptf3.margin_left = ptf3.margin_right = ptf3.margin_top = ptf3.margin_bottom = 0
pp3 = ptf3.paragraphs[0]
pp3.text = '79 верифицированных сценариев   |   100% КР Минздрава РФ   |   <1.5 с запуск (PWA)   |   Модель BYOD'
pp3.alignment = PP_ALIGN.CENTER
pp3.font.name = 'Segoe UI'
pp3.font.size = Pt(10)
pp3.font.bold = True
pp3.font.color.rgb = COLOR_WHITE

# ==============================================================================
# SLIDE 4: ТЕХНОЛОГИЧЕСКОЕ ЯДРО (4 STACKED TECH CARDS)
# ==============================================================================
s4 = prs.slides[3]
for sh in s4.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

tech_cards = [
    {
        'tag': 'SIMULATION ENGINE',
        'title': 'Движок динамической детериорации',
        'desc': 'Непрерывный пересчёт 7 виталов (АД, ЧСС, ЧДД, SpO2, ШКГ, боль, t°) с шагом 30 сек и валидация индекса тяжести SOFA-like (0–20 баллов).'
    },
    {
        'tag': 'PHARMACODYNAMICS MATRIX',
        'title': 'Фармакодинамическая матрица',
        'desc': 'Моделирование эффектов 52 лекарственных препаратов с учётом латентного периода, терапевтического окна и парадоксальных реакций.'
    },
    {
        'tag': 'DETERMINISTIC DEBRIEFING',
        'title': 'Алгоритмический дебрифинг',
        'desc': 'Автоматический аудит действий врача по Клиническим рекомендациям Минздрава РФ с детекцией фатальных ошибок и полипрагмазии.'
    },
    {
        'tag': 'NEURAL PATIENT MODULE',
        'title': 'LLM «Виртуальный пациент»',
        'desc': 'Отечественные языковые модели (GigaChat / YandexGPT) для тренировки сбора анамнеза по Калгари-Кембриджской модели.'
    }
]

top_s4 = Inches(1.6)
card_h4 = Inches(1.1)
gap_s4 = Inches(0.1)

for i, tc in enumerate(tech_cards):
    cy = top_s4 + i * (card_h4 + gap_s4)
    card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), cy, Inches(6.4), card_h4)
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.18)
    ctf.margin_top = ctf.margin_bottom = Inches(0.1)
    
    p0 = ctf.paragraphs[0]
    p0.text = tc['tag']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(8.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PURPLE
    p0.space_after = Pt(1)
    
    p1 = ctf.add_paragraph()
    p1.text = tc['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(2)
    
    p2 = ctf.add_paragraph()
    p2.text = tc['desc']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(9)
    p2.font.color.rgb = COLOR_MUTED

pill4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.45), Inches(6.4), Inches(0.45))
pill4.fill.solid()
pill4.fill.fore_color.rgb = COLOR_ORANGE_LIGHT
pill4.line.color.rgb = COLOR_ORANGE
pill4.line.width = Pt(1)
ptf4 = pill4.text_frame
ptf4.word_wrap = False
ptf4.margin_left = ptf4.margin_right = ptf4.margin_top = ptf4.margin_bottom = 0
pp4 = ptf4.paragraphs[0]
pp4.text = 'Критическая технология РФ: ИИ, цифровое био-моделирование и суверенное ПО'
pp4.alignment = PP_ALIGN.CENTER
pp4.font.name = 'Segoe UI'
pp4.font.size = Pt(9.5)
pp4.font.bold = True
pp4.font.color.rgb = COLOR_ORANGE

# ==============================================================================
# SLIDE 5: КОНКУРЕНТЫ И АНАЛОГИ (HIGH-END SAAS COMPARISON TABLE)
# ==============================================================================
s5 = prs.slides[4]
for sh in list(s5.shapes):
    if sh.has_table:
        sp = sh._element
        sp.getparent().remove(sp)
    elif sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

sub5 = s5.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.0), Inches(0.45))
sub5.text_frame.word_wrap = True
sub5.text_frame.margin_left = sub5.text_frame.margin_right = sub5.text_frame.margin_top = sub5.text_frame.margin_bottom = 0
p_sub5 = sub5.text_frame.paragraphs[0]
p_sub5.text = 'Сравнительный анализ подтверждает ключевое преимущество «МедСим» в 100% соответствии Клиническим рекомендациям Минздрава РФ и ценовой доступности для вузов.'
p_sub5.font.name = 'Segoe UI'
p_sub5.font.size = Pt(10.5)
p_sub5.font.color.rgb = COLOR_MUTED

t_rows = 6
t_cols = 5
tbl_shape = s5.shapes.add_table(t_rows, t_cols, Inches(0.6), Inches(2.05), Inches(12.1), Inches(4.7))
tbl = tbl_shape.table
tbl.columns[0].width = Inches(2.3)
tbl.columns[1].width = Inches(2.5)
tbl.columns[2].width = Inches(2.4)
tbl.columns[3].width = Inches(2.4)
tbl.columns[4].width = Inches(2.5)

headers5 = [
    "Критерий сравнения",
    "«МедСим» (СЗГМУ, Россия)",
    "Body Interact (Португалия)",
    "Full Code Medical (США)",
    "Роботы-манекены (РФ/импорт)"
]

for col_idx, h_text in enumerate(headers5):
    cell = tbl.cell(0, col_idx)
    cell.fill.solid()
    if col_idx == 1:
        cell.fill.fore_color.rgb = COLOR_PURPLE
    else:
        cell.fill.fore_color.rgb = RGBColor(30, 30, 35)
    p = cell.text_frame.paragraphs[0]
    p.text = h_text
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.alignment = PP_ALIGN.CENTER if col_idx > 0 else PP_ALIGN.LEFT

table_data5 = [
    ("Соответствие КР Минздрава РФ",
     "100% (рубрикатор МЗ РФ, cr.minzdrav.gov.ru)",
     "0% (протоколы AHA, ERC, NICE)",
     "0% (клинические стандарты США)",
     "Косвенное (зависит от преподавателя)"),
    ("Язык и терминология",
     "Русский язык, МКБ-10, терминология РФ",
     "Английский (неполный машинный перевод)",
     "Исключительно английский язык",
     "Русский (голос оператора)"),
    ("Доступность и платформа",
     "Web/PWA: запуск <1.5 сек на любом ПК/смартфоне",
     "Специализированные столы и терминалы",
     "Мобильное приложение (риск блокировок)",
     "Только в симуляционном центре"),
    ("Стоимость лицензии для вуза",
     "Доступная подписка (250–600 тыс. руб./год)",
     "От $50 000 в год (недоступно к оплате)",
     "От $30 000 в год (валютные ограничения)",
     "От 3 000 000 до 15 000 000 руб."),
    ("Охват отделений",
     "4 отделения: ОРИТ, приёмное, поликлиника, стационар",
     "Преимущественно скорая помощь и ОРИТ",
     "Исключительно неотложная помощь (ER)",
     "Изолированные мануальные навыки (СЛР)")
]

for row_idx, row_data in enumerate(table_data5, start=1):
    for col_idx, cell_value in enumerate(row_data):
        cell = tbl.cell(row_idx, col_idx)
        cell.fill.solid()
        if col_idx == 1:
            cell.fill.fore_color.rgb = COLOR_PURPLE_FILL_TABLE
        elif row_idx % 2 == 0:
            cell.fill.fore_color.rgb = RGBColor(248, 248, 250)
        else:
            cell.fill.fore_color.rgb = COLOR_WHITE
        p = cell.text_frame.paragraphs[0]
        p.text = cell_value
        p.font.name = "Segoe UI"
        p.font.size = Pt(9.5)
        p.font.bold = (col_idx == 1)
        p.font.color.rgb = COLOR_PURPLE_DARK if col_idx == 1 else COLOR_DARK

# ==============================================================================
# SLIDE 6: МОДЕЛЬ МОНЕТИЗАЦИИ И РЫНОК (TAM/SAM/SOM + B2B/B2C CARDS)
# ==============================================================================
s6 = prs.slides[5]
for sh in s6.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

market_stats = [
    ('12,5 млрд ₽', 'TAM', 'Рынок симуляционного мед-обучения РФ и СНГ', COLOR_PURPLE),
    ('1,8 млрд ₽', 'SAM', 'ПО для 100+ медвузов и 400+ колледжей', COLOR_ORANGE),
    ('90 млн ₽', 'SOM', '25 ведущих медвузов РФ на горизонте 3 лет', COLOR_PURPLE)
]

for i, (num, tag, desc, col) in enumerate(market_stats):
    cx = Inches(0.6) + i * Inches(2.25)
    box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.6), Inches(2.1), Inches(1.3))
    box.fill.solid()
    box.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    box.line.color.rgb = COLOR_PURPLE_BORDER
    box.line.width = Pt(1.1)
    
    btf = box.text_frame
    btf.word_wrap = True
    btf.margin_left = btf.margin_right = Inches(0.12)
    btf.margin_top = btf.margin_bottom = Inches(0.1)
    
    p0 = btf.paragraphs[0]
    p0.text = num
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(16)
    p0.font.bold = True
    p0.font.color.rgb = col
    
    p1 = btf.add_paragraph()
    p1.text = tag
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(8.5)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_MUTED
    
    p2 = btf.add_paragraph()
    p2.text = desc
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(8)
    p2.font.color.rgb = COLOR_DARK

biz_models = [
    {
        'tag': 'B2G / B2B ЛИЦЕНЗИЯ ДЛЯ ВУЗОВ (ОСНОВНОЙ СЕГМЕНТ)',
        'title': '250 000 – 600 000 руб./год на кафедру',
        'desc': 'Пакетная подписка на факультет: кабинет преподавателя, аналитика успеваемости групп, банк контрольных и олимпиадных клинических кейсов.'
    },
    {
        'tag': 'B2C ИНДИВИДУАЛЬНАЯ ПОДПИСКА (ДОПОЛНИТЕЛЬНЫЙ СЕГМЕНТ)',
        'title': '290 – 490 руб./месяц для студентов и ординаторов',
        'desc': 'Индивидуальный доступ к расширенным сценариям, режим подготовки к первичной аккредитации врачей и персональный сертификат.'
    }
]

for i, bm in enumerate(biz_models):
    cy = Inches(3.05) + i * Inches(1.6)
    card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), cy, Inches(6.6), Inches(1.45))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.18)
    ctf.margin_top = ctf.margin_bottom = Inches(0.12)
    
    p0 = ctf.paragraphs[0]
    p0.text = bm['tag']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(8.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PURPLE
    p0.space_after = Pt(2)
    
    p1 = ctf.add_paragraph()
    p1.text = bm['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(12)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(3)
    
    p2 = ctf.add_paragraph()
    p2.text = bm['desc']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = COLOR_MUTED

pill6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.35), Inches(6.6), Inches(0.5))
pill6.fill.solid()
pill6.fill.fore_color.rgb = COLOR_PURPLE
pill6.line.fill.background()
ptf6 = pill6.text_frame
ptf6.word_wrap = False
ptf6.margin_left = ptf6.margin_right = ptf6.margin_top = ptf6.margin_bottom = 0
pp6 = ptf6.paragraphs[0]
pp6.text = '2025–26: Пилот в СЗГМУ (80+ чел.)  ➔  2026–27: 10–15 вузов РФ  ➔  2027+: Олимпиады РНМОТ'
pp6.alignment = PP_ALIGN.CENTER
pp6.font.name = 'Segoe UI'
pp6.font.size = Pt(9.5)
pp6.font.bold = True
pp6.font.color.rgb = COLOR_WHITE

# ==============================================================================
# SLIDE 7: КОМАНДА И ПРОГРЕСС (2x2 TEAM CARDS)
# ==============================================================================
s7 = prs.slides[6]
for sh in s7.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

team_members = [
    {
        'name': 'Расмагина Ирина Алексеевна',
        'role': 'Руководитель проекта',
        'info': 'К.м.н., врач-гастроэнтеролог, асс. кафедры пропедевтики СЗГМУ. Автор 28 публикаций, 9 РИД, 4 грантов (в т.ч. РНФ 2024–2025). Руководство клинической методологией.'
    },
    {
        'name': 'Бакулин Игорь Геннадьевич',
        'role': 'Наставник проекта',
        'info': 'Д.м.н., профессор, зав. кафедрой внутренних болезней СЗГМУ им. Мечникова, главный внештатный специалист гастроэнтеролог СЗФО РФ, вице-президент РНМОТ.'
    },
    {
        'name': 'Козлов Арсений Анатольевич',
        'role': 'Соавтор, Архитектор UI/UX',
        'info': 'Студент 3 курса лечебного факультета СЗГМУ (21 год). Проектирование веб-системы (React 18, Vite), 4 симуляционных отделения, база теории, дизайн-система.'
    },
    {
        'name': 'Голощапов Михаил Михайлович',
        'role': 'Соавтор, Разработчик движка',
        'info': 'Студент 3 курса лечебного факультета СЗГМУ (19 лет). Математическое ядро детериорации (7 виталов, шаг 30 сек, SOFA-like), фармакоотклик, модуль LLM-пациента.'
    }
]

for i, tm in enumerate(team_members):
    col = i % 2
    row = i // 2
    cx = Inches(0.6) + col * Inches(3.4)
    cy = Inches(1.6) + row * Inches(2.3)
    
    card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(3.25), Inches(2.15))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.16)
    ctf.margin_top = ctf.margin_bottom = Inches(0.12)
    
    p0 = ctf.paragraphs[0]
    p0.text = tm['name']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_DARK
    p0.space_after = Pt(2)
    
    p1 = ctf.add_paragraph()
    p1.text = tm['role']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(9.5)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_PURPLE
    p1.space_after = Pt(4)
    
    p2 = ctf.add_paragraph()
    p2.text = tm['info']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = COLOR_MUTED

pill7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.35), Inches(6.65), Inches(0.5))
pill7.fill.solid()
pill7.fill.fore_color.rgb = COLOR_ORANGE_LIGHT
pill7.line.color.rgb = COLOR_ORANGE
pill7.line.width = Pt(1)
ptf7 = pill7.text_frame
ptf7.word_wrap = False
ptf7.margin_left = ptf7.margin_right = ptf7.margin_top = ptf7.margin_bottom = 0
pp7 = ptf7.paragraphs[0]
pp7.text = 'Компетенции: клиническая экспертиза кафедры + IT-хард-скиллы = защищённый РИД'
pp7.alignment = PP_ALIGN.CENTER
pp7.font.name = 'Segoe UI'
pp7.font.size = Pt(9.5)
pp7.font.bold = True
pp7.font.color.rgb = COLOR_ORANGE

# ==============================================================================
# SLIDE 8: ПАРТНЕРЫ (4 PARTNER CARDS)
# ==============================================================================
s8 = prs.slides[7]
for sh in s8.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

partners8 = [
    {
        'tag': 'ОПОРНАЯ ОРГАНИЗАЦИЯ',
        'title': 'ФГБОУ ВО СЗГМУ им. И.И. Мечникова Минздрава РФ',
        'desc': 'Кафедра пропедевтики внутренних болезней. Предоставление клинической базы, апробация тренажёра на выборке 80+ обучающихся, интеграция в учебные планы.'
    },
    {
        'tag': 'ВНЕШНЯЯ ВРАЧЕБНАЯ ЭКСПЕРТИЗА',
        'title': 'Российское научное медицинское общество терапевтов (РНМОТ)',
        'desc': 'Методическое сопровождение соответствия стандартам терапии, верификация клинических кейсов, проведение межвузовских олимпиад под эгидой общества.'
    },
    {
        'tag': 'ФОКУС-ГРУППЫ И НАУЧНАЯ АПРОБАЦИЯ',
        'title': 'Совет СНО СЗГМУ им. И.И. Мечникова (5 500+ участников)',
        'desc': 'Формирование репрезентативных фокус-групп, проведение CustDev, подготовка совместных научных публикаций ВАК/Scopus и докладов на конференциях.'
    },
    {
        'tag': 'ИНФОРМАЦИОННАЯ ДИСТРИБУЦИЯ',
        'title': 'Партнёрские EdTech-сообщества (Школа Сеченова, MedVuza)',
        'desc': 'Информационный охват более 50 000 студентов и ординаторов медвузов РФ, совместные образовательные спецкурсы и пилотные запуски.'
    }
]

for i, p in enumerate(partners8):
    cy = Inches(1.6) + i * Inches(1.15)
    card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), cy, Inches(6.6), Inches(1.05))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.18)
    ctf.margin_top = ctf.margin_bottom = Inches(0.1)
    
    p0 = ctf.paragraphs[0]
    p0.text = p['tag']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(8.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PURPLE
    p0.space_after = Pt(1)
    
    p1 = ctf.add_paragraph()
    p1.text = p['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(2)
    
    p2 = ctf.add_paragraph()
    p2.text = p['desc']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = COLOR_MUTED

pill8 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.35), Inches(6.6), Inches(0.5))
pill8.fill.solid()
pill8.fill.fore_color.rgb = COLOR_PURPLE
pill8.line.fill.background()
ptf8 = pill8.text_frame
ptf8.word_wrap = False
ptf8.margin_left = ptf8.margin_right = ptf8.margin_top = ptf8.margin_bottom = 0
pp8 = ptf8.paragraphs[0]
pp8.text = 'Ближайшие шаги: пилот на 80+ чел., Олимпиада по терапии, акт внедрения в учебный процесс'
pp8.alignment = PP_ALIGN.CENTER
pp8.font.name = 'Segoe UI'
pp8.font.size = Pt(9.5)
pp8.font.bold = True
pp8.font.color.rgb = COLOR_WHITE

# ==============================================================================
# SLIDE 9: УРОВЕНЬ ГОТОВНОСТИ ТЕХНОЛОГИИ (TRL TABLE WITH HIGHLIGHTED ROWS)
# ==============================================================================
s9 = prs.slides[8]
for sh in s9.shapes:
    if sh.name in ['Прямоугольник 4', 'Прямоугольник 5'] and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

# Top 2 Status Cards
trl_statuses = [
    {
        'status': 'ТЕКУЩИЙ СТАТУС — УГТ 5–6 (TRL 5–6)',
        'color': COLOR_PURPLE,
        'bg': COLOR_PURPLE_LIGHT,
        'border': COLOR_PURPLE_BORDER,
        'desc': 'Полнофункциональный веб-прототип (PWA), 79 оцифрованных сценариев, верифицирован математический движок детериорации (шаг 30 с) и фармакоматрица на 52 препарата. Пройдены испытания на кафедре.'
    },
    {
        'status': 'ЦЕЛЕВОЙ СТАТУС — УГТ 7 (TRL 7)',
        'color': COLOR_ORANGE,
        'bg': COLOR_ORANGE_LIGHT,
        'border': COLOR_ORANGE,
        'desc': 'Опытная эксплуатация прототипа в реальном образовательном процессе кафедры пропедевтики СЗГМУ им. Мечникова (80+ студентов и ординаторов), проведение олимпиад по кардиологии и терапии.'
    }
]

for i, st in enumerate(trl_statuses):
    cx = Inches(0.6) + i * Inches(6.1)
    card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.5), Inches(5.9), Inches(1.4))
    card.fill.solid()
    card.fill.fore_color.rgb = st['bg']
    card.line.color.rgb = st['border']
    card.line.width = Pt(1.2)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.18)
    ctf.margin_top = ctf.margin_bottom = Inches(0.12)
    
    p0 = ctf.paragraphs[0]
    p0.text = st['status']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = st['color']
    p0.space_after = Pt(3)
    
    p1 = ctf.add_paragraph()
    p1.text = st['desc']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(9)
    p1.font.color.rgb = COLOR_DARK

# Format existing TRL table on slide 9
for sh in s9.shapes:
    if sh.has_table:
        tbl = sh.table
        sh.top = Inches(3.05)
        sh.left = Inches(0.6)
        sh.width = Inches(12.0)
        sh.height = Inches(3.8)
        
        # Highlight Row 2 (TRL 4-6) and Row 3 (TRL 7)
        for r_idx, row in enumerate(tbl.rows):
            for cell in row.cells:
                if r_idx == 0:
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_ORANGE
                    for p in cell.text_frame.paragraphs:
                        p.font.name = 'Segoe UI'
                        p.font.size = Pt(10.5)
                        p.font.bold = True
                        p.font.color.rgb = COLOR_WHITE
                elif r_idx == 2: # TRL 4-6 Current
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_PURPLE_FILL_TABLE
                    for p in cell.text_frame.paragraphs:
                        p.font.name = 'Segoe UI'
                        p.font.size = Pt(9.5)
                        p.font.bold = True
                        p.font.color.rgb = COLOR_PURPLE_DARK
                elif r_idx == 3: # TRL 7 Target
                    cell.fill.solid()
                    cell.fill.fore_color.rgb = COLOR_ORANGE_LIGHT
                    for p in cell.text_frame.paragraphs:
                        p.font.name = 'Segoe UI'
                        p.font.size = Pt(9.5)
                        p.font.bold = True
                        p.font.color.rgb = COLOR_ORANGE
                else:
                    if r_idx % 2 == 1:
                        cell.fill.solid()
                        cell.fill.fore_color.rgb = RGBColor(250, 250, 252)
                    for p in cell.text_frame.paragraphs:
                        p.font.name = 'Segoe UI'
                        p.font.size = Pt(9.5)
                        p.font.color.rgb = COLOR_DARK

# ==============================================================================
# SLIDE 10: ПРОГРЕСС ЗА ВРЕМЯ АКСЕЛЕРАЦИИ (TABLE BEFORE / AFTER)
# ==============================================================================
s10 = prs.slides[9]
for sh in s10.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

sub10 = s10.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.0), Inches(0.45))
sub10.text_frame.word_wrap = True
sub10.text_frame.margin_left = sub10.text_frame.margin_right = sub10.text_frame.margin_top = sub10.text_frame.margin_bottom = 0
p_sub10 = sub10.text_frame.paragraphs[0]
p_sub10.text = 'За время акселерационной программы проект совершил качественный переход от исследовательской идеи к масштабируемому программному продукту.'
p_sub10.font.name = 'Segoe UI'
p_sub10.font.size = Pt(10.5)
p_sub10.font.color.rgb = COLOR_MUTED

# Style the table
for sh in s10.shapes:
    if sh.has_table:
        tbl = sh.table
        sh.top = Inches(2.05)
        sh.left = Inches(0.6)
        sh.width = Inches(12.0)
        sh.height = Inches(4.7)
        tbl.columns[0].width = Inches(5.2)
        tbl.columns[1].width = Inches(6.8)
        
        # Header Row
        cell_before = tbl.cell(0, 0)
        cell_before.fill.solid()
        cell_before.fill.fore_color.rgb = RGBColor(70, 75, 85)
        p_b = cell_before.text_frame.paragraphs[0]
        p_b.text = 'До участия в акселерационной программе'
        p_b.font.name = 'Segoe UI'
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = COLOR_WHITE
        
        cell_after = tbl.cell(0, 1)
        cell_after.fill.solid()
        cell_after.fill.fore_color.rgb = COLOR_PURPLE
        p_a = cell_after.text_frame.paragraphs[0]
        p_a.text = 'После участия в акселерационной программе'
        p_a.font.name = 'Segoe UI'
        p_a.font.size = Pt(11)
        p_a.font.bold = True
        p_a.font.color.rgb = COLOR_WHITE
        
        # Data Rows
        rows10_data = [
            ("УГТ 3–4: Теоретическая концепция, формулы модели детериорации на бумаге и черновые скрипты.",
             "УГТ 5–6: Работающий веб-тренажер (PWA), 79 оцифрованных сценариев, 4 отделения, детериорация виталов в реальном времени."),
            ("Производственная готовность: Разрозненные прототипы интерфейса, ручная проверка кейсов.",
             "Производственная готовность: Отказоустойчивая система (React 18, Vite, Three.js), запуск <1.5 сек, автоматический дебрифинг ошибок по КР Минздрава РФ, CI/CD."),
            ("Рыночная готовность: Несформированное ценностное предложение, отсутствие данных о спросе.",
             "Рыночная готовность: Проведен CustDev (70+ студентов и ординаторов), подтверждена острая потребность (87.2%), разработана модель B2B/B2G подписок для медвузов."),
            ("Партнерства: Инициативная разработка двух студентов лечебного факультета без институционального статуса.",
             "Партнерства: Наставничество зав. кафедрой проф. И.Г. Бакулина, поддержка к.м.н. И.А. Расмагиной, пилотирование на кафедре и олимпиадах СЗГМУ.")
        ]
        
        for r_idx, (b_txt, a_txt) in enumerate(rows10_data, start=1):
            c0 = tbl.cell(r_idx, 0)
            c0.fill.solid()
            c0.fill.fore_color.rgb = RGBColor(248, 248, 250)
            p0 = c0.text_frame.paragraphs[0]
            p0.text = b_txt
            p0.font.name = 'Segoe UI'
            p0.font.size = Pt(9.5)
            p0.font.color.rgb = COLOR_MUTED
            
            c1 = tbl.cell(r_idx, 1)
            c1.fill.solid()
            c1.fill.fore_color.rgb = COLOR_PURPLE_FILL_TABLE
            p1 = c1.text_frame.paragraphs[0]
            p1.text = a_txt
            p1.font.name = 'Segoe UI'
            p1.font.size = Pt(9.5)
            p1.font.bold = True
            p1.font.color.rgb = COLOR_PURPLE_DARK

# ==============================================================================
# SLIDE 11: ПЛАНЫ РАЗВИТИЯ (4 ROADMAP CARDS)
# ==============================================================================
s11 = prs.slides[10]
for sh in s11.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

plans11 = [
    {
        'tag': 'R&D И КЛИНИЧЕСКИЙ КОНТЕНТ',
        'title': 'Расширение до 100+ кейсов и LLM-пациент',
        'desc': 'Добавление профиля «Гастроэнтерология», интеграция генеративного диалогового модуля «Виртуальный пациент» на отечественных LLM по Калгари-Кембриджской модели.'
    },
    {
        'tag': 'ЗАЩИТА ИНТЕЛЛЕКТУАЛЬНОЙ СОБСТВЕННОСТИ',
        'title': 'Регистрация РИД в Роспатенте',
        'desc': 'Получение свидетельств о гос. регистрации программы для ЭВМ «МедСим» и базы данных клинических сценариев; патентование алгоритма детериорации виталов.'
    },
    {
        'tag': 'НАУЧНАЯ АПРОБАЦИЯ И ПУБЛИКАЦИИ',
        'title': 'Пилотирование на 80+ обучающихся и статьи ВАК',
        'desc': 'Внедрение в олимпиады СЗГМУ по кардиологии и терапии; подготовка не менее 2 научных статей в журналах ВАК/Scopus и 3 докладов на всероссийских конференциях.'
    },
    {
        'tag': 'ИНВЕСТИЦИИ И МАСШТАБИРОВАНИЕ',
        'title': 'Грант «Студенческий стартап» и выход в 5+ вузов',
        'desc': 'Подача заявки на грант ФСИ (1 млн руб.); масштабирование на медицинские университеты СЗФО в 2026–2027 гг.; интеграция в систему НМО.'
    }
]

for i, pl in enumerate(plans11):
    cy = Inches(1.6) + i * Inches(1.15)
    card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), cy, Inches(6.6), Inches(1.05))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.18)
    ctf.margin_top = ctf.margin_bottom = Inches(0.1)
    
    p0 = ctf.paragraphs[0]
    p0.text = pl['tag']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(8.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PURPLE
    p0.space_after = Pt(1)
    
    p1 = ctf.add_paragraph()
    p1.text = pl['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(2)
    
    p2 = ctf.add_paragraph()
    p2.text = pl['desc']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = COLOR_MUTED

pill11 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.35), Inches(6.6), Inches(0.5))
pill11.fill.solid()
pill11.fill.fore_color.rgb = COLOR_PURPLE
pill11.line.fill.background()
ptf11 = pill11.text_frame
ptf11.word_wrap = False
ptf11.margin_left = ptf11.margin_right = ptf11.margin_top = ptf11.margin_bottom = 0
pp11 = ptf11.paragraphs[0]
pp11.text = 'Горизонт реализации: 100+ сценариев  •  2 патента  •  Пилоты в 5+ медвузах РФ'
pp11.alignment = PP_ALIGN.CENTER
pp11.font.name = 'Segoe UI'
pp11.font.size = Pt(9.5)
pp11.font.bold = True
pp11.font.color.rgb = COLOR_WHITE

# ==============================================================================
# SLIDE 12: ЗАПРОС (4 REQUEST CARDS)
# ==============================================================================
s12 = prs.slides[11]
for sh in s12.shapes:
    if sh.name == 'Прямоугольник 3' and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

requests12 = [
    {
        'tag': 'ФИНАНСИРОВАНИЕ ИНФРАСТРУКТУРЫ',
        'title': 'Серверные мощности в РФ и API отечественных LLM',
        'desc': 'Аренда защищённых отечественных серверов для бесперебойной работы при массовых олимпиадах (до 200 одновременных сессий); токены API отечественных нейросетей.'
    },
    {
        'tag': 'НЕТВОРКИНГ И ИНСТИТУЦИОНАЛЬНОЕ СОДЕЙСТВИЕ',
        'title': 'Выход на проректоров медвузов РФ и РОСОМЕД',
        'desc': 'Содействие Платформы НТИ в контактах с проректорами по учебной работе медицинских вузов; взаимодействие с Федеральным центром симуляционного обучения.'
    },
    {
        'tag': 'МЕНТОРСТВО И B2G-ЭКСПЕРТИЗА',
        'title': 'Упаковка B2G-контрактов и защита РИД',
        'desc': 'Экспертная помощь в структурировании продаж университетских лицензий, юридическое сопровождение защиты интеллектуальных прав и лицензирования.'
    },
    {
        'tag': 'МЕДИА И ФЕДЕРАЛЬНЫЙ PR',
        'title': 'Освещение в ресурсах НТИ и Минздрава РФ',
        'desc': 'Информационная поддержка проекта в федеральных каналах экосистемы НТИ, Минздрава и Минобрнауки; привлечение вузов-партнёров к межвузовским олимпиадам.'
    }
]

for i, rq in enumerate(requests12):
    cy = Inches(1.6) + i * Inches(1.15)
    card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), cy, Inches(6.6), Inches(1.05))
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_PURPLE_LIGHT
    card.line.color.rgb = COLOR_PURPLE_BORDER
    card.line.width = Pt(1.1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.18)
    ctf.margin_top = ctf.margin_bottom = Inches(0.1)
    
    p0 = ctf.paragraphs[0]
    p0.text = rq['tag']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(8.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PURPLE
    p0.space_after = Pt(1)
    
    p1 = ctf.add_paragraph()
    p1.text = rq['title']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(11)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_DARK
    p1.space_after = Pt(2)
    
    p2 = ctf.add_paragraph()
    p2.text = rq['desc']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = COLOR_MUTED

pill12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.35), Inches(6.6), Inches(0.5))
pill12.fill.solid()
pill12.fill.fore_color.rgb = COLOR_ORANGE_LIGHT
pill12.line.color.rgb = COLOR_ORANGE
pill12.line.width = Pt(1)
ptf12 = pill12.text_frame
ptf12.word_wrap = False
ptf12.margin_left = ptf12.margin_right = ptf12.margin_top = ptf12.margin_bottom = 0
pp12 = ptf12.paragraphs[0]
pp12.text = 'Цель запроса: быстрый пилотный охват 15+ медвузов РФ и интеграция в стандарты'
pp12.alignment = PP_ALIGN.CENTER
pp12.font.name = 'Segoe UI'
pp12.font.size = Pt(9.5)
pp12.font.bold = True
pp12.font.color.rgb = COLOR_ORANGE

# ==============================================================================
# SLIDE 13: ЭКСПЕРТНОЕ ЗАКЛЮЧЕНИЕ (DARK THEME WITH 3 GLASS CARDS, CLEAR OF LOOP)
# ==============================================================================
s13 = prs.slides[12]
for sh in s13.shapes:
    if sh.name in ['Прямоугольник 6', 'Прямоугольник 8'] and sh.has_text_frame:
        clear_text_frame(sh.text_frame)

expert_quotes = [
    {
        'author': 'Бакулин Игорь Геннадьевич',
        'regalia': 'Д.м.н., профессор, зав. кафедрой внутренних болезней СЗГМУ, главный гастроэнтеролог СЗФО, вице-президент РНМОТ',
        'quote': '«Проект «МедСим» обладает безусловной научной и клинической ценностью. Строгое соответствие актуальным Клиническим рекомендациям Минздрава РФ и динамический пересчёт витальных функций позволяют обучающимся преодолеть разрыв между теорией и практикой. Рекомендую к внедрению в учебный процесс и олимпиады.»'
    },
    {
        'author': 'Расмагина Ирина Алексеевна',
        'regalia': 'К.м.н., врач-гастроэнтеролог, асс. кафедры пропедевтики СЗГМУ им. Мечникова, руководитель грантов РНФ',
        'quote': '«Теоретическая реализуемость математического ядра детериорации доказана. Использование защищённых отечественных LLM для диалога виртуального пациента обеспечивает формирование деонтологических навыков и суверенитет ПО.»'
    },
    {
        'author': 'Экспертиза РОСОМЕД & HealthNet НТИ',
        'regalia': 'Специалисты по медицинскому симуляционному обучению и коммерциализации',
        'quote': '««МедСим» эффективно закрывает пустующую нишу между бумажными тестами и дорогостоящими манекенами: платформа тренирует скорость и логику принятия решений в динамике перед манипуляциями с высокой рентабельностью (>60%).»'
    }
]

top_s13 = Inches(1.5)
card_h13 = Inches(1.5)
gap_s13 = Inches(0.12)

for i, eq in enumerate(expert_quotes):
    cy = top_s13 + i * (card_h13 + gap_s13)
    card = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), cy, Inches(6.8), card_h13)
    card.fill.solid()
    card.fill.fore_color.rgb = RGBColor(38, 12, 70)
    card.line.color.rgb = RGBColor(105, 50, 160)
    card.line.width = Pt(1)
    
    ctf = card.text_frame
    ctf.word_wrap = True
    ctf.margin_left = ctf.margin_right = Inches(0.2)
    ctf.margin_top = ctf.margin_bottom = Inches(0.1)
    
    p0 = ctf.paragraphs[0]
    p0.text = eq['author']
    p0.font.name = 'Segoe UI'
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_ORANGE_BRIGHT
    p0.space_after = Pt(1)
    
    p1 = ctf.add_paragraph()
    p1.text = eq['regalia']
    p1.font.name = 'Segoe UI'
    p1.font.size = Pt(8)
    p1.font.color.rgb = COLOR_LIGHT_VIOLET
    p1.space_after = Pt(3)
    
    p2 = ctf.add_paragraph()
    p2.text = eq['quote']
    p2.font.name = 'Segoe UI'
    p2.font.size = Pt(8.5)
    p2.font.italic = True
    p2.font.color.rgb = COLOR_WHITE

# Footer placed safely at bottom left
footer13 = s13.shapes.add_textbox(Inches(0.6), Inches(6.55), Inches(6.5), Inches(0.4))
ftf13 = footer13.text_frame
ftf13.word_wrap = False
ftf13.margin_left = ftf13.margin_right = ftf13.margin_top = ftf13.margin_bottom = 0
p_f13 = ftf13.paragraphs[0]
p_f13.text = 'Все экспертные заключения верифицированы и внесены в ИС «Эксперты НТИ»'
p_f13.font.name = 'Segoe UI'
p_f13.font.size = Pt(10)
p_f13.font.italic = True
p_f13.font.color.rgb = COLOR_LIGHT_VIOLET

# Save presentation
prs.save(OUT_PPTX)
print("SUCCESS: Generated redesigned MedSim_Presentation_NTI.pptx")
