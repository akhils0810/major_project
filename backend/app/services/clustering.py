import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, text
import uuid

from app.models.report import Report
from app.models.event import Event
from app.services.verification import verify_event

logger = logging.getLogger(__name__)

# How long an event is considered "active" for clustering new reports
EVENT_ACTIVE_WINDOW_HOURS = 24

def run_clustering(db: Session) -> int:
    """
    Groups orphaned reports into Events.
    Returns the number of events created or updated.
    """
    # 1. Fetch orphaned reports (not duplicates, no event assigned)
    orphans = db.query(Report).filter(
        Report.event_id == None,
        Report.is_duplicate == False
    ).order_by(Report.timestamp.asc()).all()

    if not orphans:
        logger.info("No orphaned reports to cluster.")
        return 0

    events_touched = set()

    for report in orphans:
        # A simple clustering strategy based on category and city
        # For a production system, we'd use PostGIS clustering (e.g. ST_ClusterDBSCAN)
        
        city = report.city if report.city else "Unknown Location"
        category = report.event_category
        
        # Look for an active event in the same city and category
        time_threshold = report.timestamp - timedelta(hours=EVENT_ACTIVE_WINDOW_HOURS)
        
        active_event = db.query(Event).filter(
            Event.event_category == category,
            Event.city == city,
            Event.updated_at >= time_threshold
        ).order_by(Event.updated_at.desc()).first()

        if active_event:
            # Attach to existing event
            report.event_id = active_event.id
            active_event.updated_at = datetime.now(timezone.utc)
            events_touched.add(active_event.id)
            logger.info(f"Attached report {report.id} to existing event {active_event.id}")
        else:
            # Create a new event
            title = f"{category.replace('_', ' ').title()} in {city}"
            new_event = Event(
                id=uuid.uuid4(),
                title=title,
                event_category=category,
                state=report.state,
                city=city,
                latitude=report.latitude,
                longitude=report.longitude,
                start_time=report.timestamp,
                severity="unknown",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(new_event)
            db.flush() # flush to get the ID without committing
            
            report.event_id = new_event.id
            events_touched.add(new_event.id)
            logger.info(f"Created new event {new_event.id}: {title}")

    # Commit all report assignments and new events
    db.commit()

    # 2. Trigger Verification for all touched events
    for event_id in events_touched:
        verify_event(db, event_id)

    return len(events_touched)
