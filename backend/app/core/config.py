import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()

DEFAULT_DATABASE_URL = "postgresql+psycopg://user:password@localhost:5432/medsim"


@dataclass(frozen=True)
class Settings:
    app_env: str
    host: str
    port: int
    database_url: str
    jwt_secret: str
    jwt_expire_minutes: int
    cors_origins: list[str] = field(default_factory=list)


def _load_settings() -> Settings:
    cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    cors_origins = [o.strip() for o in cors_raw.split(",") if o.strip()]

    return Settings(
        app_env=os.getenv("APP_ENV", "development"),
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        database_url=os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL),
        jwt_secret=os.getenv("JWT_SECRET", "change-me-in-production"),
        jwt_expire_minutes=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")),
        cors_origins=cors_origins,
    )


settings = _load_settings()