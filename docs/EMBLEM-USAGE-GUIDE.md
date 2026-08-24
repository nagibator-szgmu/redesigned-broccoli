# 🚀 3D Emblem "45 am" — Руководство по передаче и использованию

Эмблема «45 am» выполнена в формате объёмного 4-гранного 3D-каната с процедурной генерацией текста высокой чёткости и анимацией в обратную сторону.

---

## 📁 Доступные файлы для передачи:

1. **`FluidEmblem45AM.jsx`** — Готовый автономный React-компонент (для React / Next.js / Vite проектов).
2. **`emblem-45am-standalone.html`** — Автономный HTML-файл (работает прямо в браузере через CDN Three.js без сборщиков и без установки Node.js!).

---

## 💻 Как использовать в React / Next.js / Vite:

1. Скопируйте файл `FluidEmblem45AM.jsx` в ваш проект (например, в `src/components/`).
2. Установите Three.js (если еще не установлен):
   ```bash
   npm install three
   ```
3. Импортируйте и используйте в любом месте:
   ```jsx
   import React from 'react';
   import { FluidEmblem45AM } from './FluidEmblem45AM';

   export function App() {
     return (
       <FluidEmblem45AM
         text="45 am"
         speed={0.225}
         width="200px"
         height="130px"
       />
     );
   }
   ```

---

## 🌐 Как использовать в чистом HTML/CSS/JS (без React):

Просто откройте файл `emblem-45am-standalone.html` в браузере или скопируйте скрипт в ваш сайт. Зависимость Three.js подключается автоматически через CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

---

## ⚙️ Настраиваемые параметры:

| Параметр | По умолчанию | Описание |
|---|---|---|
| `text` | `'45 am'` | Текст, бегущий по граням ленты |
| `speed` | `0.225` | Скорость анимации движения |
| `backgroundColor` | `'#ffffff'` | Белый чистый фон контейнера |
| `colors` | `['#1143FE', '#FFFFFF', '#000000', '#01FF71']` | 4 цвета граней (Синий, Белый, Чёрный, Зелёный) |
