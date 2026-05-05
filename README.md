# MED•SIM — Клинический тренажёр

Медицинский симулятор для студентов и врачей.  
10 клинических кейсов: кардиология, неврология, хирургия, инфекции и др.

## Запуск локально

```bash
# 1. Установи зависимости (один раз)
npm install

# 2. Запусти игру
npm run dev
```

Откроется браузер на http://localhost:3000

## Сборка для деплоя

```bash
npm run build
```

Появится папка `dist/` — её загружаешь на Cloudflare Pages.

## Деплой на Cloudflare Pages (бесплатно, интернет для всех)

1. Зарегистрируйся на https://pages.cloudflare.com
2. New project → Connect to Git → выбери этот репозиторий
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Deploy!

Твоя игра будет доступна по адресу: https://medsim.pages.dev
