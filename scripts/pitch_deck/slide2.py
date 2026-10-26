from pptx.util import Inches, Pt
from .config import (
    FONT_PRIMARY, C_DARK, C_BLUE, C_BLUE_DARK,
    C_BLUE_BG, C_BLUE_BORDER, C_RED, C_RED_BG, C_RED_BORDER,
    C_AMBER, C_AMBER_BG, C_AMBER_BORDER
)
from .helpers import (
    add_card, add_badge, set_tf_margins,
    clear_non_title_shapes, format_slide_title, add_bullets
)

def build_slide2(slide):
    clear_non_title_shapes(slide)
    format_slide_title(slide, "АКТУАЛЬНОСТЬ И ПРОБЛЕМАТИКА ПРОЕКТА")

    left_base = Inches(1.40)
    w_card = Inches(3.28)
    gap = Inches(0.18)
    top_card = Inches(1.20)
    h_card = Inches(4.15)

    # Card 1: Macro-trends
    c1 = add_card(slide, left_base, top_card, w_card, h_card)
    add_badge(slide, left_base + Inches(0.14), top_card + Inches(0.12),
              Inches(2.40), Inches(0.26), "01 / РЕГУЛЯТОРИКА И РЫНОК",
              bg_color=C_BLUE_BG, border_color=C_BLUE_BORDER, text_color=C_BLUE_DARK)
    tf1 = c1.text_frame
    set_tf_margins(tf1, top=36, bottom=10, left=12, right=12)

    p = tf1.paragraphs[0]
    p.text = "ст. 37 ФЗ-323"
    p.font.name, p.font.size, p.font.bold = FONT_PRIMARY, Pt(22), True
    p.font.color.rgb = C_BLUE

    p = tf1.add_paragraph()
    p.text = "Обязательность КР Минздрава РФ"
    p.font.name, p.font.size, p.font.bold = FONT_PRIMARY, Pt(10), True
    p.font.color.rgb = C_DARK
    p.space_after = Pt(6)

    add_bullets(tf1, [
        ("Нормативный переход", "Клинические рекомендации (КР) стали законодательно обязательными. Врача оценивают строго по протоколам Минздрава РФ."),
        ("Санкционный вакуум", "Полный уход европейских систем (Body Interact, SimX). Отзыв лицензий и невозможность закупки зарубежного ПО в медвузах РФ."),
        ("Рынок HealthNet", "120+ медицинских вузов, 110+ центров аккредитации, >350 тыс. обучающихся. Целевой рынок симуляторов — 4.2 млрд ₽/год.")
    ], font_size=9, space_after=3)

    # Card 2: Customer Pain
    left_c2 = left_base + w_card + gap
    c2 = add_card(slide, left_c2, top_card, w_card, h_card)
    add_badge(slide, left_c2 + Inches(0.14), top_card + Inches(0.12),
              Inches(2.40), Inches(0.26), "02 / КЛИНИЧЕСКИЙ БАРЬЕР",
              bg_color=C_RED_BG, border_color=C_RED_BORDER, text_color=C_RED)
    tf2 = c2.text_frame
    set_tf_margins(tf2, top=36, bottom=10, left=12, right=12)

    p = tf2.paragraphs[0]
    p.text = "28% дефектов"
    p.font.name, p.font.size, p.font.bold = FONT_PRIMARY, Pt(22), True
    p.font.color.rgb = C_RED

    p = tf2.add_paragraph()
    p.text = "Тактические ошибки интернов в 1-й год"
    p.font.name, p.font.size, p.font.bold = FONT_PRIMARY, Pt(10), True
    p.font.color.rgb = C_DARK
    p.space_after = Pt(6)

    add_bullets(tf2, [
        ("«Книжная» медицина", "85% подготовки клинического мышления — статичные тесты без динамики ухудшения больного, цейтнота и цены ошибки."),
        ("Деонтологический барьер", "Студентов нельзя допускать к экстренным пациентам в ОРИТ из соображений безопасности и врачебной этики."),
        ("Синдром растерянности", "Молодые врачи испытывают страх перед реальным пациентом в условиях цейтнота (10–15 минут на решение).")
    ], font_size=9, space_after=3)

    # Card 3: Equipment Barrier
    left_c3 = left_c2 + w_card + gap
    c3 = add_card(slide, left_c3, top_card, w_card, h_card)
    add_badge(slide, left_c3 + Inches(0.14), top_card + Inches(0.12),
              Inches(2.40), Inches(0.26), "03 / АППАРАТНЫЙ БАРЬЕР",
              bg_color=C_AMBER_BG, border_color=C_AMBER_BORDER, text_color=C_AMBER)
    tf3 = c3.text_frame
    set_tf_margins(tf3, top=36, bottom=10, left=12, right=12)

    p = tf3.paragraphs[0]
    p.text = "25–45 млн ₽"
    p.font.name, p.font.size, p.font.bold = FONT_PRIMARY, Pt(22), True
    p.font.color.rgb = C_AMBER

    p = tf3.add_paragraph()
    p.text = "Стоимость 1 робота-манекена (Laerdal)"
    p.font.name, p.font.size, p.font.bold = FONT_PRIMARY, Pt(10), True
    p.font.color.rgb = C_DARK
    p.space_after = Pt(6)

    add_bullets(tf3, [
        ("Колоссальные капзатраты", "Закупка роботов по параллельному импорту требует сотен миллионов рублей и несет валютные риски."),
        ("«Бутылочное горлышко»", "Аппаратный центр пропускает не более 5–10 студентов в смену. 90% студентов остаются без личной практики."),
        ("Дороговизна владения", "Запчасти, расходные датчики и ремонт зарубежных роботов заблокированы и обходятся в миллионы рублей ежегодно.")
    ], font_size=9, space_after=3)

    # Bottom Formula Banner
    banner = add_card(slide, left_base, Inches(5.45), Inches(10.20), Inches(1.35),
                      bg_color=C_BLUE_BG, border_color=C_BLUE_BORDER)
    tf_b = banner.text_frame
    set_tf_margins(tf_b, top=8, bottom=8, left=14, right=14)

    pb0 = tf_b.paragraphs[0]
    pb0.text = "ЗАДАЧА ПАРТНЕРА И КАНОНИЧЕСКАЯ ФОРМУЛА АКСЕЛЕРАТОРА:"
    pb0.font.name, pb0.font.size, pb0.font.bold = FONT_PRIMARY, Pt(9), True
    pb0.font.color.rgb = C_BLUE_DARK
    pb0.space_after = Pt(2)

    pb1 = tf_b.add_paragraph()
    r = pb1.add_run()
    r.text = (
        "«В связи с законодательным переходом на обязательные КР Минздрава РФ (ст. 37 ФЗ-323) и уходом зарубежного ПО (Body Interact), "
        "дефицит практики клинического мышления стал критическим. Из-за дороговизны импортных манекенов (25–45 млн ₽) "
        "медвузы РФ не могут дать каждому студенту личный опыт дежурства. "
        "MedSim устраняет этот разрыв, обеспечивая 100% охват персональной практикой и снижая затраты более чем в 10 раз.»"
    )
    r.font.name, r.font.size, r.font.color.rgb = FONT_PRIMARY, Pt(9.5), C_DARK

    slide.notes_slide.notes_text_frame.text = (
        "СЛАЙД 2 (1:00 - 3:00) | АКТУАЛЬНОСТЬ И ПРОБЛЕМА\n"
        "«Почему тема технологического суверенитета в медицинском образовании стоит сегодня так остро?\n"
        "Во-первых, нормативный фактор: согласно ст. 37 323-го Федерального закона, клинические рекомендации Минздрава России стали обязательными. "
        "Врача теперь оценивают строго по соблюдению утвержденных протоколов.\n"
        "Во-вторых, санкционный уход западных систем: европейский симулятор Body Interact заблокирован, лицензии отозваны. "
        "А импортные роботы-манекены стоят от 25 до 45 миллионов рублей при параллельном импорте! Ни один вуз не может оснастить ими всех студентов: "
        "пропускная способность центров всего 5–10 человек в смену.\n"
        "В-третьих, цена врачебной ошибки: до 28% дефектов в экстренной медицине совершают начинающие специалисты именно из-за растерянности в цейтноте. "
        "Задача нашего клинического партнера — СЗГМУ им. Мечникова — дать каждому студенту персональную цифровую станцию врача.»"
    )
