from typing import List, Optional
from datetime import date
from pydantic import BaseModel, constr, validator

# --- Base Models ---

class UsuarioBase(BaseModel):
    username: str
    rol: str

class UsuarioCreate(UsuarioBase):
    password: str

class Usuario(UsuarioBase):
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class CalleBase(BaseModel):
    nombre_calle: str
    vocero_responsable: Optional[str] = None

class CalleCreate(CalleBase):
    pass

class Calle(CalleBase):
    id_calle: int
    class Config:
        orm_mode = True

class HabitanteBase(BaseModel):
    cedula: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    sexo: str
    telefono: Optional[str] = None
    necesidades_especiales: bool = False
    detalles_salud: Optional[str] = None
    discapacidad: bool = False
    tipo_discapacidad: Optional[str] = None
    requiere_atencion_medica: bool = False
    tratamientos_medicos: Optional[str] = None
    foto_perfil: Optional[str] = None
    id_familia: Optional[int] = None

    @validator('cedula')
    def validate_cedula(cls, v):
        import re
        if not re.match(r'^[VE]-\d{7,8}$', v):
            raise ValueError('La cédula debe comenzar con V- o E- seguida de 7 u 8 dígitos')
        return v

    @validator('fecha_nacimiento')
    def validate_fecha_nacimiento(cls, v):
        if v > date.today():
            raise ValueError('La fecha de nacimiento no puede ser en el futuro')
        return v

class HabitanteCreate(HabitanteBase):
    pass

class Habitante(HabitanteBase):
    class Config:
        orm_mode = True

class FamiliaBase(BaseModel):
    codigo_vivienda: str
    id_calle: int
    numero_cargas: int = 0
    id_jefe_familia: Optional[str] = None

class FamiliaCreate(FamiliaBase):
    pass

class Familia(FamiliaBase):
    id_familia: int
    habitantes: List[Habitante] = []
    class Config:
        orm_mode = True

class BeneficioBase(BaseModel):
    tipo: str
    fecha: date
    detalles: Optional[str] = None
    id_familia: Optional[int] = None
    cedula_habitante: Optional[str] = None

class BeneficioCreate(BeneficioBase):
    pass

class Beneficio(BeneficioBase):
    id_beneficio: int
    class Config:
        orm_mode = True
