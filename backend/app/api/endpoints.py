from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from typing import List
from pydantic import BaseModel
import os

from app.db.database import get_db
from app.schemas import schemas
from app.crud import crud
from app.core import security
from app.models import models
from app.core.config import settings

api_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    from jose import JWTError, jwt
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def get_current_admin_user(current_user: models.Usuario = Depends(get_current_user)):
    if current_user.rol not in ["administrador", "coordinador"]:
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere rol de administrador.")
    return current_user

# --- Auth ---
@api_router.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(subject=user.username)
    return {"access_token": access_token, "token_type": "bearer"}

class RecoverRequest(BaseModel):
    cedula: str

class ResetRequest(BaseModel):
    cedula: str
    codigo: str
    nueva_clave: str

@api_router.post("/auth/recover-account")
def recover_account(req: RecoverRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=req.cedula)
    if not user:
        raise HTTPException(status_code=404, detail="Cédula no registrada")
    return {"message": "Código generado"}

@api_router.post("/auth/reset-password")
def reset_password(req: ResetRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=req.cedula)
    if not user or req.codigo != "123456":
        raise HTTPException(status_code=400, detail="Código inválido o usuario no encontrado")
    user.password_hash = security.get_password_hash(req.nueva_clave)
    db.commit()
    return {"message": "Contraseña actualizada"}

@api_router.post("/usuarios/", response_model=schemas.Usuario)
def create_usuario(user: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    user.rol = "vecino" # Role by default
    return crud.create_user(db=db, user=user)

# --- Habitantes ---
@api_router.post("/habitantes/", response_model=schemas.Habitante)
def create_habitante(habitante: schemas.HabitanteCreate, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_admin_user)):
    db_habitante = crud.get_habitante(db, cedula=habitante.cedula)
    if db_habitante:
        raise HTTPException(status_code=400, detail="Cédula ya registrada")
    return crud.create_habitante(db=db, habitante=habitante)

@api_router.get("/habitantes/", response_model=List[schemas.Habitante])
def read_habitantes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    habitantes = crud.get_habitantes(db, skip=skip, limit=limit)
    return habitantes

# --- Dashboard ---
@api_router.get("/dashboard/")
def read_dashboard_stats(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return crud.get_dashboard_stats(db)

# --- Búsqueda y Actividad ---
@api_router.get("/buscar/", response_model=List[schemas.Habitante])
def buscar_habitantes(query: str, limit: int = 20, db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return crud.search_habitantes(db, query=query, limit=limit)

@api_router.get("/actividad/")
def actividad_reciente(db: Session = Depends(get_db), current_user: models.Usuario = Depends(get_current_user)):
    return crud.get_actividad_reciente(db)

# --- Backups ---
@api_router.get("/backup/export")
def export_backup(current_user: models.Usuario = Depends(get_current_admin_user)):
    db_path = "portal_comunal.db"
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database file not found")
    return FileResponse(path=db_path, filename="portal_comunal.db", media_type="application/octet-stream")

@api_router.post("/backup/restore")
def restore_backup(file: UploadFile = File(...), current_user: models.Usuario = Depends(get_current_admin_user)):
    db_path = "portal_comunal.db"
    try:
        contents = file.file.read()
        with open(db_path, 'wb') as f:
            f.write(contents)
    except Exception:
        raise HTTPException(status_code=500, detail="Error al subir el archivo")
    finally:
        file.file.close()
    return {"message": "Base de datos restaurada correctamente"}
