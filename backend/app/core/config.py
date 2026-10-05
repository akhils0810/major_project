from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "National Weather Big Data Analytics Platform"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "weather_db"
    
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        import os
        return os.getenv("DATABASE_URL", "sqlite:///./weather.db")
    
    class Config:
        env_file = ".env"

settings = Settings()
