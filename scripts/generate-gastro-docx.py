import urllib.request
import urllib.parse
import json
import os
import time
from docx import Document
from docx.shared import Inches, Pt, RGBColor

def create_gastro_doc():
    doc = Document()

    title = doc.add_heading('Клинические иллюстрации и снимки к кейсам гастроэнтерологии', level=0)
    p_intro = doc.add_paragraph(
        'Учебные материалы для согласования с преподавателем перед интеграцией в симулятор MedSim.\n'
        'Снимки подобраны для обучения студентов 4-6 курсов (терапия / гастроэнтерология) из открытых '
        'медицинских репозиториев (Wikimedia Commons Open Medical Repository / CC-BY).'
    )

    cases_data = [
        {
            'case': 'Кейс 56: Острый некротизирующий панкреатит',
            'type': 'КТ органов брюшной полости с контрастированием',
            'desc': 'КТ ОБП в аксиальной проекции: диффузное увеличение ткани поджелудочной железы, отсутствие накопления контраста в зонах панкреонекроза, перипанкреатическая экссудация и инфильтрация парапанкреатической клетчатки (индекс Balthazar E).',
            'wiki_file': 'File:Akute exsudative Pankreatitis - CT axial.jpg'
        },
        {
            'case': 'Кейс 57: Острое язвенное желудочно-кишечное кровотечение',
            'type': 'Эзофагогастродуоденоскопия (ЭГДС)',
            'desc': 'ЭГДС: глубокий язвенный дефект с плотным фиксированным сгустком крови и признаками высокого риска рецидива кровотечения (классификация Forrest IIb). Показан комбинированный эндоскопический гемостаз + в/в ИПП.',
            'wiki_file': 'File:Peptic ulcer.jpg'
        },
        {
            'case': 'Кейс 58: Перфорация полого органа (язвы ДПК)',
            'type': 'Обзорная рентгенография органов брюшной полости',
            'desc': 'Обзорная рентгенограмма ОБП в вертикальном положении: четкий серповидный свободный газ под правым куполом диафрагмы (пневмоперитонеум) вследствие перфорации язвы. Абсолютное показание к экстренной лапаротомии/лапароскопии.',
            'wiki_file': 'File:Pneumoperitoneum bei Sigmaperforation 76M - CR LSL - 001.jpg'
        },
        {
            'case': 'Кейс stat_gastro_1: Язвенный колит, тяжелая атака',
            'type': 'Видеоколоноскопия',
            'desc': 'Колоноскопия: слизистая оболочка толстой кишки гиперемирована, зернистая, контактно кровоточит при малейшем касании тубуса, множественные сливные язвенные дефекты, покрытые фибрином (Mayo 3, тяжелая эндоскопическая активность).',
            'wiki_file': 'File:CD colitis.jpg'
        },
        {
            'case': 'Кейс stat_gastro_2: Декомпенсированный цирроз печени, портальная гипертензия',
            'type': 'ЭГДС (варикоз вен пищевода)',
            'desc': 'ЭГДС: крупные извитые стволы вен нижней трети пищевода с истончением стенки (варикозное расширение 2-3 степени). Высокий риск фатального кровотечения, показано профилактическое эндоскопическое лигирование.',
            'wiki_file': 'File:Endoscopic Banding for Esophageal Varices.png'
        },
        {
            'case': 'Кейс outp_gastro_1: Язвенная болезнь 12-перстной кишки',
            'type': 'ЭГДС',
            'desc': 'ЭГДС: округлый язвенный дефект передней стенки луковицы ДПК до 0.8 см под белым фибринозным налетом без признаков активного кровотечения (Forrest III). Быстрый уреазный тест на H. pylori положительный.',
            'wiki_file': 'File:Duodenal ulcer, Forrest III, healing phase.jpg'
        },
        {
            'case': 'Кейс outp_gastro_celiac: Целиакия (глютеновая энтеропатия)',
            'type': 'Эндоскопия тонкой кишки и биопсия',
            'desc': 'Эндоскопия нисходящей петли 12-перстной кишки: сглаженность складок Керкринга, мозаичный рельеф и характерная «гребешковая» исчерченность (scalloping). Гистологически: Marsh 3b — атрофия ворсин и лимфоцитоз.',
            'wiki_file': 'File:Scalloping of the Kerckring folds.jpg'
        }
    ]

    headers = {'User-Agent': 'MedSimEducationalProject/1.0 (contact: support@medsim.local)'}
    temp_dir = 'scratch_imgs'
    os.makedirs(temp_dir, exist_ok=True)

    for i, item in enumerate(cases_data):
        doc.add_heading(f"{i+1}. {item['case']}", level=1)
        p_meta = doc.add_paragraph()
        p_meta.add_run("Метод обследования: ").bold = True
        p_meta.add_run(f"{item['type']}\n")
        p_meta.add_run("Клиническое описание находки: ").bold = True
        p_meta.add_run(f"{item['desc']}")

        try:
            query_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(item['wiki_file'])}&prop=imageinfo&iiprop=url&format=json"
            req = urllib.request.Request(query_url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                pages = data.get('query', {}).get('pages', {})
                img_url = None
                for p in pages.values():
                    img_url = p.get('imageinfo', [{}])[0].get('url')
                    break
            
            if img_url:
                img_ext = os.path.splitext(img_url.split('?')[0])[1] or '.jpg'
                local_img = os.path.join(temp_dir, f'img_{i}{img_ext}')
                img_req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(img_req) as img_resp, open(local_img, 'wb') as out_f:
                    out_f.write(img_resp.read())
                
                doc.add_picture(local_img, width=Inches(4.5))
                p_src = doc.add_paragraph(f"Источник: Wikimedia Commons ({item['wiki_file']})")
                p_src.runs[0].font.size = Pt(8.5)
                p_src.runs[0].font.italic = True
            else:
                doc.add_paragraph(f"[Изображение по запросу {item['wiki_file']} доступно в архиве]")
        except Exception as e:
            doc.add_paragraph(f"[Изображение доступно онлайн: {item['wiki_file']}] (Ошибка скачивания: {e})")
        
        time.sleep(0.5)

    out_path = 'C:/Users/мишка/Downloads/гастро_снимки_обследования.docx'
    doc.save(out_path)
    print(f"Successfully created {out_path}")

if __name__ == '__main__':
    create_gastro_doc()
