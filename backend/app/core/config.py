from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Portal Web Comunal"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Base de datos
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./portal_comunal.db"
    # Seguridad
    SECRET_KEY: str = "tu-clave-super-secreta-cambiala-en-produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 días

settings = Settings()
