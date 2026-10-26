import json
import os

with open('docs/icons-gallery/icons-data.json', encoding='utf-8') as f:
    icons = json.load(f)

artifact_dir = '/Users/arsenykozlov/.gemini/antigravity/brain/17bd63fd-990c-497e-9ded-1a02629953f7'
os.makedirs(artifact_dir, exist_ok=True)
os.makedirs('docs/icons-gallery', exist_ok=True)

# Build pre-rendered cards
cards_html = []
for item in icons:
    name = item['name']
    label = item['label']
    desc = item['desc']
    cat = item['cat']
    is_new = item['isNew']
    inner = item['inner']
    
    new_badge = '<span class="absolute top-1 right-1 text-[8.5px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">NEW</span>' if is_new else ''
    
    card = f"""
      <div 
        class="icon-card relative group bg-[#0f172a]/80 hover:bg-[#1e293b] border border-[#334155] hover:border-sky-500/60 rounded-xl p-2.5 flex flex-col items-center justify-between text-center cursor-pointer select-none transition-all duration-150 hover:-translate-y-0.5 shadow-sm"
        data-name="{name.lower()}"
        data-label="{label.lower()}"
        data-desc="{desc.lower()}"
        data-cat="{cat}"
        data-new="{'true' if is_new else 'false'}"
        onclick="copyCode('<{name} size={{24}} />')"
        title="{label}: {desc}&#10;Клик для копирования JSX"
      >
        {new_badge}
        <div class="h-10 w-10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform duration-150 icon-svg-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
            {inner}
          </svg>
        </div>
        <div class="w-full mt-1.5 pointer-events-none">
          <div class="text-[10.5px] font-semibold text-slate-200 truncate group-hover:text-sky-300 transition-colors">
            {label}
          </div>
          <div class="text-[9px] font-mono text-slate-400 truncate mt-0.5">
            {name}
          </div>
        </div>
      </div>
    """
    cards_html.append(card)

all_cards_str = "\n".join(cards_html)

full_html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedSim Icons Showcase</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .no-scrollbar::-webkit-scrollbar {{ display: none; }}
    .no-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
  </style>
</head>
<body class="bg-[#020617] text-[#f8fafc] antialiased p-2 sm:p-3 select-none">
  <div class="bg-[#0b1120] text-[#f8fafc] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[540px]">
    
    <!-- Header -->
    <div class="p-3 border-b border-[#1e293b] bg-[#0f172a] flex flex-wrap items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-base">
          🩺
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            Каталог векторных иконок MedSim
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
              72 иконки
            </span>
          </h1>
          <p class="text-[11px] text-slate-400">
            Medical-grade Stroke 2.0px • Canvas 24×24 • 50 обновлённых + 22 новых
          </p>
        </div>
      </div>

      <!-- Controls: Size & Color -->
      <div class="flex items-center gap-2 text-xs">
        <!-- Size Selector -->
        <div class="flex items-center bg-[#020617] p-0.5 rounded-lg border border-[#334155]">
          <button onclick="changeSize(18)" id="btn-s-18" class="px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white">18</button>
          <button onclick="changeSize(24)" id="btn-s-24" class="px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[10.5px] font-bold">24</button>
          <button onclick="changeSize(30)" id="btn-s-30" class="px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white">30</button>
        </div>

        <!-- Color Palette -->
        <div class="flex items-center gap-1.5 bg-[#020617] p-1 rounded-lg border border-[#334155]">
          <button onclick="changeColor('#38bdf8')" title="Cyan" class="w-3.5 h-3.5 rounded-full bg-sky-400 border border-sky-300 ring-2 ring-sky-400/50"></button>
          <button onclick="changeColor('#34d399')" title="Emerald" class="w-3.5 h-3.5 rounded-full bg-emerald-400 hover:scale-110 transition"></button>
          <button onclick="changeColor('#fb7185')" title="Rose" class="w-3.5 h-3.5 rounded-full bg-rose-400 hover:scale-110 transition"></button>
          <button onclick="changeColor('#fbbf24')" title="Amber" class="w-3.5 h-3.5 rounded-full bg-amber-400 hover:scale-110 transition"></button>
          <button onclick="changeColor('#f8fafc')" title="White" class="w-3.5 h-3.5 rounded-full bg-white hover:scale-110 transition"></button>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="px-3 py-2 bg-[#020617]/90 border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-2">
      <!-- Category Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[11px] font-medium">
        <button onclick="filterCat('all')" id="tab-all" class="px-2 py-0.5 rounded-md bg-sky-600 text-white shadow-sm">
          Все (72)
        </button>
        <button onclick="filterCat('clinical')" id="tab-clinical" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Анатомия & Клиника (31)
        </button>
        <button onclick="filterCat('academic')" id="tab-academic" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Обучение & Маршруты (17)
        </button>
        <button onclick="filterCat('navigation')" id="tab-navigation" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Стрелки (6)
        </button>
        <button onclick="filterCat('status')" id="tab-status" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Статусы (5)
        </button>
        <button onclick="filterCat('ui')" id="tab-ui" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Интерфейс (13)
        </button>
        <button onclick="toggleNewOnly()" id="tab-new" class="px-2 py-0.5 rounded-md text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40 transition flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Новые (22)
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative flex-1 sm:max-w-xs min-w-[150px]">
        <input 
          id="search-input" 
          type="text" 
          oninput="filterSearch(this.value)" 
          placeholder="Поиск иконки..." 
          class="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
        />
        <svg class="w-3 h-3 text-slate-400 absolute left-2 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Icons Grid Container (Pre-rendered static HTML) -->
    <div id="icons-container" class="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
{all_cards_str}
    </div>

    <!-- Footer Stats & Toast Notification -->
    <div class="px-3 py-1.5 border-t border-[#1e293b] bg-[#0f172a] flex items-center justify-between text-[11px] text-slate-400">
      <div id="counter-text">Показано 72 из 72 иконок</div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-slate-400">Кликните на карточку, чтобы скопировать JSX</span>
        <div id="toast" class="hidden px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
          Скопировано!
        </div>
      </div>
    </div>
  </div>

  <script>
    let activeCat = 'all';
    let onlyNew = false;
    let query = '';

    function applyFilter() {{
      const cards = document.querySelectorAll('.icon-card');
      let visibleCount = 0;
      cards.forEach(card => {{
        const cat = card.getAttribute('data-cat');
        const isNew = card.getAttribute('data-new') === 'true';
        const name = card.getAttribute('data-name');
        const label = card.getAttribute('data-label');
        const desc = card.getAttribute('data-desc');

        let matchCat = (activeCat === 'all') || (cat === activeCat);
        if (onlyNew && !isNew) matchCat = false;

        let matchQuery = true;
        if (query) {{
          matchQuery = name.includes(query) || label.includes(query) || desc.includes(query);
        }}

        if (matchCat && matchQuery) {{
          card.style.display = 'flex';
          visibleCount++;
        }} else {{
          card.style.display = 'none';
        }}
      }});
      document.getElementById('counter-text').textContent = 'Показано ' + visibleCount + ' из ' + cards.length + ' иконок';
    }}

    function filterCat(cat) {{
      activeCat = cat;
      onlyNew = false;
      updateTabs();
      applyFilter();
    }}

    function toggleNewOnly() {{
      onlyNew = !onlyNew;
      updateTabs();
      applyFilter();
    }}

    function filterSearch(val) {{
      query = val.trim().toLowerCase();
      applyFilter();
    }}

    function updateTabs() {{
      ['all', 'clinical', 'academic', 'navigation', 'status', 'ui'].forEach(cat => {{
        const btn = document.getElementById('tab-' + cat);
        if (cat === activeCat && !onlyNew) {{
          btn.className = 'px-2 py-0.5 rounded-md bg-sky-600 text-white shadow-sm';
        }} else {{
          btn.className = 'px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition';
        }}
      }});
      const newBtn = document.getElementById('tab-new');
      if (onlyNew) {{
        newBtn.className = 'px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm flex items-center gap-1';
      }} else {{
        newBtn.className = 'px-2 py-0.5 rounded-md text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40 transition flex items-center gap-1';
      }}
    }}

    function changeSize(size) {{
      [18, 24, 30].forEach(s => {{
        const btn = document.getElementById('btn-s-' + s);
        if (s === size) {{
          btn.className = 'px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono text-[10.5px] font-bold';
        }} else {{
          btn.className = 'px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white';
        }}
      }});
      document.querySelectorAll('.icon-svg-wrapper svg').forEach(svg => {{
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
      }});
    }}

    function changeColor(color) {{
      document.querySelectorAll('.icon-svg-wrapper').forEach(wrapper => {{
        wrapper.style.color = color;
      }});
    }}

    function copyCode(text) {{
      if (navigator.clipboard) {{
        navigator.clipboard.writeText(text).then(() => {{
          const toast = document.getElementById('toast');
          toast.textContent = 'Скопировано: ' + text;
          toast.classList.remove('hidden');
          setTimeout(() => toast.classList.add('hidden'), 2000);
        }});
      }}
    }}
  </script>
</body>
</html>
"""

# Write to docs/icons-gallery/index.html
with open('docs/icons-gallery/index.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

# Write to artifact directory
artifact_file = os.path.join(artifact_dir, 'icons-gallery.html')
with open(artifact_file, 'w', encoding='utf-8') as f:
    f.write(full_html)

print(f"Successfully generated pre-rendered icons gallery with {len(icons)} icons!")
