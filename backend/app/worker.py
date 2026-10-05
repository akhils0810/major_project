import os
import logging
from celery import Celery
from celery.schedules import crontab
from app.db.session import SessionLocal
from app.services.clustering import run_clustering

logger = logging.getLogger(__name__)

# Initialize Celery
# We use the redis service from docker-compose
redis_url = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")

celery_app = Celery(
    "worker",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Schedule periodic tasks
celery_app.conf.beat_schedule = {
    "run-clustering-every-5-minutes": {
        "task": "app.worker.cluster_orphaned_reports",
        "schedule": crontab(minute="*/5"),
    },
}

@celery_app.task(name="app.worker.cluster_orphaned_reports")
def cluster_orphaned_reports():
    """
    Background task to periodically run the clustering algorithm.
    """
    db = SessionLocal()
    try:
        logger.info("Starting background clustering task...")
        events_touched = run_clustering(db)
        logger.info(f"Background clustering task completed. Events touched: {events_touched}")
        return {"events_touched": events_touched}
    except Exception as e:
        logger.error(f"Error during background clustering: {e}")
        db.rollback()
        raise
    finally:
        db.close()
