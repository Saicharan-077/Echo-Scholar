from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union
import os
from dotenv import load_dotenv

# Pre-load environment variables
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./EchoXScholar.db"
    
    # Supabase (Optional APIs and DB Configuration)
    supabase_url: str = ""
    supabase_key: str = ""
    
    # JWT
    secret_key: str = "change-this-secret-key-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    
    # Gemini API
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    # Featherless.ai (Hackathon Open-Source AI Engine)
    featherless_api_key: str = ""
    featherless_model: str = "meta-llama/Meta-Llama-3.1-70B-Instruct"

    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4"

    # Groq API
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    # Ollama (Local)
    ollama_base_url: str = "http://localhost:11434/v1"
    ollama_model: str = "deepseek-r1"

    # OpenRouter API
    openrouter_api_key: str = ""
    openrouter_model: str = "meta-llama/llama-3.3-70b-instruct"
    
    # PDF.co 
    pdf_co_api_key: str = ""
    
    # Google OAuth
    google_client_id: str = ""
    
    # ElevenLabs
    elevenlabs_api_key: str = ""
    voice_id_male: str = "21m00Tcm4TlvDq8ikWAM"
    voice_id_female: str = "2EiwWnGeFN0m4CMYp7k9"
    
    # Cloudinary (Optional for cloud storage)
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    
    # CORS — stored as a string, split on commas
    cors_origins: Union[List[str], str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Upload
    max_upload_size: int = 52428800  # 50MB
    upload_dir: str = "./uploads"

    @property
    def cors_origins_list(self) -> List[str]:
        """Returns CORS origins as a list."""
        if isinstance(self.cors_origins, str):
            return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        return self.cors_origins


settings = Settings()

