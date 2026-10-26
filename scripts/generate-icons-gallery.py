import json
import os

with open('docs/icons-gallery/icons-data.json', encoding='utf-8') as f:
    icons = json.load(f)

artifact_dir = '/Users/arsenykozlov/.gemini/antigravity/brain/17bd63fd-990c-497e-9ded-1a02629953f7'
os.makedirs(artifact_dir, exist_ok=True)
os.makedirs('docs/icons-gallery', exist_ok=True)

icons_json_str = json.dumps(icons, ensure_ascii=False)

html_template = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedSim Icons Showcase</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .icon-card { transition: all 0.16s ease-out; }
    .icon-card:hover { transform: translateY(-2px); }
  </style>
</head>
<body class="bg-transparent text-[var(--foreground,#f1f5f9)] antialiased p-2 sm:p-3 select-none">
  <div class="bg-[var(--card,#0f172a)] text-[var(--foreground,#f8fafc)] border border-[var(--border,#334155)] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
    
    <!-- Header -->
    <div class="p-3 border-b border-[var(--border,#334155)] bg-[var(--card,#0f172a)] flex flex-wrap items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-base">
          🩺
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-[var(--foreground,#f8fafc)] flex items-center gap-1.5">
            Каталог векторных иконок MedSim
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              72 иконки
            </span>
          </h1>
          <p class="text-[11px] text-[var(--muted-foreground,#94a3b8)]">
            Medical-grade Stroke 2.0px • Canvas 24×24 • 50 обновлённых + 22 новых
          </p>
        </div>
      </div>

      <!-- Controls: Size & Color -->
      <div class="flex items-center gap-2 text-xs">
        <!-- Size Selector -->
        <div class="flex items-center bg-[var(--background,#020617)] p-0.5 rounded-lg border border-[var(--border,#334155)]">
          <button onclick="setSize(18)" id="btn-s-18" class="px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white">18</button>
          <button onclick="setSize(22)" id="btn-s-22" class="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono text-[10.5px] font-bold">22</button>
          <button onclick="setSize(28)" id="btn-s-28" class="px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white">28</button>
          <button onclick="setSize(36)" id="btn-s-36" class="px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white">36</button>
        </div>

        <!-- Color Palette -->
        <div class="flex items-center gap-1.5 bg-[var(--background,#020617)] p-1 rounded-lg border border-[var(--border,#334155)]">
          <button onclick="setColor('#38bdf8')" title="Medical Cyan" class="w-3.5 h-3.5 rounded-full bg-sky-400 border border-sky-300 ring-2 ring-sky-400/50"></button>
          <button onclick="setColor('#34d399')" title="Vital Emerald" class="w-3.5 h-3.5 rounded-full bg-emerald-400 hover:scale-110 transition"></button>
          <button onclick="setColor('#fb7185')" title="Cardio Rose" class="w-3.5 h-3.5 rounded-full bg-rose-400 hover:scale-110 transition"></button>
          <button onclick="setColor('#fbbf24')" title="Alert Amber" class="w-3.5 h-3.5 rounded-full bg-amber-400 hover:scale-110 transition"></button>
          <button onclick="setColor('#c084fc')" title="Neuro Purple" class="w-3.5 h-3.5 rounded-full bg-purple-400 hover:scale-110 transition"></button>
          <button onclick="setColor('currentColor')" title="Current Theme Color" class="w-3.5 h-3.5 rounded-full bg-slate-200 hover:scale-110 transition"></button>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="px-3 py-2 bg-[var(--background,#020617)]/70 border-b border-[var(--border,#334155)] flex flex-wrap items-center justify-between gap-2">
      <!-- Category Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[11.5px] font-medium">
        <button onclick="setCategory('all')" id="tab-all" class="px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-sm">
          Все (72)
        </button>
        <button onclick="setCategory('clinical')" id="tab-clinical" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Анатомия & Клиника (31)
        </button>
        <button onclick="setCategory('academic')" id="tab-academic" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Обучение & Маршруты (17)
        </button>
        <button onclick="setCategory('navigation')" id="tab-navigation" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Стрелки (6)
        </button>
        <button onclick="setCategory('status')" id="tab-status" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Статусы (5)
        </button>
        <button onclick="setCategory('ui')" id="tab-ui" class="px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Интерфейс (13)
        </button>
        <button onclick="toggleNewOnly()" id="tab-new" class="px-2 py-0.5 rounded-md text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40 transition flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Новые (22)
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative flex-1 sm:max-w-xs min-w-[160px]">
        <input 
          id="search-input" 
          type="text" 
          oninput="handleSearch(this.value)" 
          placeholder="Поиск иконки..." 
          class="w-full bg-[var(--card,#0f172a)] border border-[var(--border,#334155)] rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <svg class="w-3 h-3 text-slate-400 absolute left-2 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Icons Grid Container (Scrollable) -->
    <div id="icons-container" class="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
      <!-- Icons rendered via JS -->
    </div>

    <!-- Footer Stats & Toast Notification -->
    <div class="px-3 py-1.5 border-t border-[var(--border,#334155)] bg-[var(--card,#0f172a)] flex items-center justify-between text-[11px] text-slate-400">
      <div id="counter-text">Показано 72 из 72 иконок</div>
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-slate-400">Кликните на карточку, чтобы скопировать JSX</span>
        <div id="toast" class="hidden px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold transition-opacity duration-200">
          Скопировано!
        </div>
      </div>
    </div>
  </div>

  <script>
    const iconsData = __ICONS_DATA__;
    let currentCategory = 'all';
    let currentQuery = '';
    let newOnly = false;
    let currentSize = 22;
    let currentColor = '#38bdf8';

    function setSize(s) {
      currentSize = s;
      [18, 22, 28, 36].forEach(size => {
        const btn = document.getElementById('btn-s-' + size);
        if (size === s) {
          btn.className = 'px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono text-[10.5px] font-bold';
        } else {
          btn.className = 'px-1.5 py-0.5 rounded text-slate-400 font-mono text-[10.5px] hover:text-white';
        }
      });
      render();
    }

    function setColor(c) {
      currentColor = c;
      render();
    }

    function setCategory(cat) {
      currentCategory = cat;
      newOnly = false;
      updateTabs();
      render();
    }

    function toggleNewOnly() {
      newOnly = !newOnly;
      updateTabs();
      render();
    }

    function updateTabs() {
      ['all', 'clinical', 'academic', 'navigation', 'status', 'ui'].forEach(cat => {
        const btn = document.getElementById('tab-' + cat);
        if (cat === currentCategory && !newOnly) {
          btn.className = 'px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-sm';
        } else {
          btn.className = 'px-2 py-0.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition';
        }
      });
      const newBtn = document.getElementById('tab-new');
      if (newOnly) {
        newBtn.className = 'px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm flex items-center gap-1';
      } else {
        newBtn.className = 'px-2 py-0.5 rounded-md text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40 transition flex items-center gap-1';
      }
    }

    function handleSearch(q) {
      currentQuery = q.trim().toLowerCase();
      render();
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.textContent = 'Скопировано: ' + text;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2000);
      });
    }

    function render() {
      const container = document.getElementById('icons-container');
      const filtered = iconsData.filter(item => {
        if (newOnly && !item.isNew) return false;
        if (!newOnly && currentCategory !== 'all' && item.cat !== currentCategory) return false;
        if (currentQuery) {
          const matchName = item.name.toLowerCase().includes(currentQuery);
          const matchLabel = item.label.toLowerCase().includes(currentQuery);
          const matchDesc = item.desc.toLowerCase().includes(currentQuery);
          if (!matchName && !matchLabel && !matchDesc) return false;
        }
        return true;
      });

      document.getElementById('counter-text').textContent = 
        `Показано ${filtered.length} из ${iconsData.length} иконок`;

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="col-span-full py-12 text-center text-slate-400 text-xs">
            Иконки не найдены по запросу "${currentQuery}"
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(item => {
        const copyCode = `<${item.name} size={${currentSize}} />`;
        return `
          <div 
            onclick="copyToClipboard('${copyCode}')"
            title="${item.label}: ${item.desc}&#10;Кликните для копирования JSX"
            class="icon-card relative group bg-[var(--background,#020617)]/70 hover:bg-slate-800/80 border border-[var(--border,#334155)] hover:border-blue-500/60 rounded-xl p-2.5 flex flex-col items-center justify-between text-center cursor-pointer select-none"
          >
            ${item.isNew ? '<span class="absolute top-1 right-1 text-[8.5px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">NEW</span>' : ''}
            
            <div class="h-10 flex items-center justify-center text-slate-200 group-hover:scale-110 transition-transform duration-150" style="color: ${currentColor}">
              <svg 
                width="${currentSize}" 
                height="${currentSize}" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="${currentColor}" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                class="shrink-0"
              >
                ${item.inner}
              </svg>
            </div>

            <div class="w-full mt-1.5">
              <div class="text-[10.5px] font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                ${item.label}
              </div>
              <div class="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                ${item.name}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    render();
  </script>
</body>
</html>
""".replace("__ICONS_DATA__", icons_json_str)

# Write to workspace
with open('docs/icons-gallery/index.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

# Write to artifact
artifact_file = os.path.join(artifact_dir, 'icons-gallery.html')
with open(artifact_file, 'w', encoding='utf-8') as f:
    f.write(html_template)

print('Generated docs/icons-gallery/index.html and artifact file successfully!')
