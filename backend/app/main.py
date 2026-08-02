from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.health.router import router as health_router
from app.api.v1.auth.router import router as auth_router
from app.core.config import settings
from app.db.session import init_db

app = FastAPI(title="MedSim Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1/health", tags=["health"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"status": "ok", "service": "MedSim Backend"}