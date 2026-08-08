from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, SessionLocal
from app.models import models
from app.api.endpoints import api_router
from app.crud import crud
from app.schemas import schemas

# Crear tablas en base de datos si no existen
models.Base.metadata.create_all(bind=engine)

# Crear administrador por defecto
db = SessionLocal()
admin_user = crud.get_user_by_username(db, username="V-00000000")
if not admin_user:
    admin_schema = schemas.UsuarioCreate(username="V-00000000", password="admin123", rol="admin")
    crud.create_user(db, admin_schema)
db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API para el Portal Web de Gestión de Información Comunal",
)

# CORS
origins = [
    "http://localhost",
    "http://localhost:5173", # Frontend Vite
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API del Portal Comunal"}
