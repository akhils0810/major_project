from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
import asyncio
import logging
from app.services.clustering import run_clustering
from app.database.session import SessionLocal, engine
from app.models.base import Base

logger = logging.getLogger(__name__)

async def background_clustering_task():
    while True:
        try:
            logger.info("Running background clustering...")
            db = SessionLocal()
            run_clustering(db)
            db.close()
        except Exception as e:
            logger.error(f"Error in background clustering: {e}")
        # Sleep for 5 minutes
        await asyncio.sleep(300)

@app.on_event("startup")
async def startup_event():
    # Automatically create SQLite tables if they don't exist
    Base.metadata.create_all(bind=engine)
    asyncio.create_task(background_clustering_task())
# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}

from fastapi import APIRouter
from app.api.routes import auth, reports, ml, events, dashboard, analytics, system, intelligence

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(ml.router, prefix="/ml", tags=["ml"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])

app.include_router(api_router, prefix=settings.API_V1_STR)


