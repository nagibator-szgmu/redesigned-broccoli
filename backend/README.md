# MedSim Backend

FastAPI-сервер для проекта MedSim.

## Требования

- Python 3.11+

## Установка

```bash
cd backend
python -m venv .venv
```

Активация виртуального окружения:

**Windows (PowerShell):**

```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

```bash
pip install -r requirements.txt
cp .env.example .env
```

## Запуск

Из папки `backend/`:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Сервер будет доступен по адресу: http://127.0.0.1:8000

## Endpoints

| Метод | Путь | Ответ |
|-------|------|-------|
| GET | `/` | `{"status": "ok", "service": "MedSim Backend"}` |
| GET | `/api/v1/health` | `{"status": "healthy"}` |

## Проверка

```bash
curl http://127.0.0.1:8000/
curl http://127.0.0.1:8000/api/v1/health
```

## PostgreSQL (будущий этап)

Подключение к базе данных пока не активировано. Подготовлены файлы конфигурации:

- `app/core/config.py` — чтение `DATABASE_URL` из переменных окружения
- `app/db/session.py` — заготовка сессии SQLAlchemy

### Настройка

1. Установите PostgreSQL и создайте базу данных `medsim`.
2. Скопируйте `.env.example` в `.env` и укажите реальные учётные данные:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/medsim
```

3. На следующих этапах будут добавлены:
   - `sqlalchemy` и `psycopg2-binary` (или `asyncpg`) в `requirements.txt`
   - инициализация `engine` и `SessionLocal` в `app/db/session.py`
   - модели, миграции и репозитории

Текущий этап не выполняет подключение к базе и не создаёт таблицы.

## Структура

```
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       └── health/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── dependencies/
│   └── utils/
├── tests/
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```
