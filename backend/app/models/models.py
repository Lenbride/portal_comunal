from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    rol = Column(String, default="consulta") # 'administrador', 'vocero', 'consulta'

class Calle(Base):
    __tablename__ = "calles"

    id_calle = Column(Integer, primary_key=True, index=True)
    nombre_calle = Column(String, unique=True, index=True, nullable=False)
    vocero_responsable = Column(String)

    familias = relationship("Familia", back_populates="calle")

class Familia(Base):
    __tablename__ = "familias"

    id_familia = Column(Integer, primary_key=True, index=True)
    id_jefe_familia = Column(String, ForeignKey("habitantes.cedula", use_alter=True)) # Para evitar circular dependency si no existen aun
    codigo_vivienda = Column(String)
    id_calle = Column(Integer, ForeignKey("calles.id_calle"))
    numero_cargas = Column(Integer, default=0)

    calle = relationship("Calle", back_populates="familias")
    habitantes = relationship("Habitante", back_populates="familia", foreign_keys="[Habitante.id_familia]")
    beneficios = relationship("Beneficio", back_populates="familia")

class Habitante(Base):
    __tablename__ = "habitantes"

    cedula = Column(String, primary_key=True, index=True) # Validacion V-/E- se hara en schemas
    nombres = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    sexo = Column(String(1)) # M / F
    telefono = Column(String)
    necesidades_especiales = Column(Boolean, default=False)
    detalles_salud = Column(Text)
    discapacidad = Column(Boolean, default=False)
    tipo_discapacidad = Column(String, nullable=True)
    requiere_atencion_medica = Column(Boolean, default=False)
    tratamientos_medicos = Column(Text, nullable=True)
    foto_perfil = Column(String, nullable=True)
    
    id_familia = Column(Integer, ForeignKey("familias.id_familia"))
    
    familia = relationship("Familia", back_populates="habitantes", foreign_keys=[id_familia])

class Beneficio(Base):
    __tablename__ = "beneficios"

    id_beneficio = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, nullable=False) # CLAP, Salud, Ayuda Tecnica
    fecha = Column(Date, nullable=False)
    detalles = Column(Text)
    
    id_familia = Column(Integer, ForeignKey("familias.id_familia"), nullable=True)
    cedula_habitante = Column(String, ForeignKey("habitantes.cedula"), nullable=True)

    familia = relationship("Familia", back_populates="beneficios")
