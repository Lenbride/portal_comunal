from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.core.security import get_password_hash

# --- Usuarios ---
def get_user_by_username(db: Session, username: str):
    return db.query(models.Usuario).filter(models.Usuario.username == username).first()

def create_user(db: Session, user: schemas.UsuarioCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.Usuario(username=user.username, password_hash=hashed_password, rol=user.rol)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Calles ---
def get_calles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Calle).offset(skip).limit(limit).all()

def create_calle(db: Session, calle: schemas.CalleCreate):
    db_calle = models.Calle(**calle.dict())
    db.add(db_calle)
    db.commit()
    db.refresh(db_calle)
    return db_calle

# --- Habitantes ---
def get_habitante(db: Session, cedula: str):
    return db.query(models.Habitante).filter(models.Habitante.cedula == cedula).first()

def get_habitantes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Habitante).offset(skip).limit(limit).all()

def create_habitante(db: Session, habitante: schemas.HabitanteCreate):
    db_habitante = models.Habitante(**habitante.dict())
    db.add(db_habitante)
    db.commit()
    db.refresh(db_habitante)
    return db_habitante

# --- Familias ---
def get_familia(db: Session, id_familia: int):
    return db.query(models.Familia).filter(models.Familia.id_familia == id_familia).first()

def get_familias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Familia).offset(skip).limit(limit).all()

def create_familia(db: Session, familia: schemas.FamiliaCreate):
    db_familia = models.Familia(**familia.dict())
    db.add(db_familia)
    db.commit()
    db.refresh(db_familia)
    return db_familia

# --- Dashboard Stats ---
def get_dashboard_stats(db: Session):
    total_habitantes = db.query(models.Habitante).count()
    total_familias = db.query(models.Familia).count()
    total_calles = db.query(models.Calle).count()
    return {
        "total_habitantes": total_habitantes,
        "total_familias": total_familias,
        "total_calles": total_calles
    }

# --- Búsqueda y Actividad ---
def search_habitantes(db: Session, query: str, limit: int = 20):
    return db.query(models.Habitante).filter(
        (models.Habitante.cedula.ilike(f"%{query}%")) |
        (models.Habitante.nombres.ilike(f"%{query}%")) |
        (models.Habitante.apellidos.ilike(f"%{query}%"))
    ).limit(limit).all()

def get_actividad_reciente(db: Session):
    # Simulamos actividad reciente obteniendo los últimos beneficios
    recent_beneficios = db.query(models.Beneficio).order_by(models.Beneficio.id_beneficio.desc()).limit(5).all()
    activities = []
    for b in recent_beneficios:
        activities.append({
            "id": b.id_beneficio,
            "tipo": "beneficio",
            "descripcion": f"Beneficio {b.tipo} registrado",
            "fecha": str(b.fecha)
        })
    return activities
