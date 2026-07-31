"""
EchoXScholar AI Backend - FastAPI Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.core.config import settings
from app.core.database import init_db, AsyncSessionLocal
from app.api import api_router
from app.services.seed_data_service import SeedDataService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("Starting EchoXScholar AI Backend...")
    await init_db()
    
    # Auto-seed production demo user accounts
    try:
        async with AsyncSessionLocal() as session:
            await SeedDataService.seed_all_demo_data(session)
            print("Demo accounts and realistic learning data auto-seeded successfully!")
    except Exception as e:
        print(f"Demo seed notification: {e}")
        
    yield
    # Shutdown
    print("Shutting down EchoXScholar AI Backend...")


# Create FastAPI app
app = FastAPI(
    title="EchoXScholar API",
    description="""
    Backend API for EchoXScholar - Cognitive Twin AI Personal Learning Companion
    """,
    version="2.0.0",
    lifespan=lifespan,
)

from fastapi import Request
from fastapi.responses import JSONResponse

# Configure CORS
# allow_credentials=False allows allow_origins=["*"] to work universally with Authorization Bearer headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global Exception caught on {request.url.path}: {exc}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

# Include API router
app.include_router(api_router)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "EchoXScholar API",
        "version": "2.0.0"
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to EchoXScholar API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )
