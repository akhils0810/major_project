from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models.report import Report
from app.models.event import Event

router = APIRouter()

@router.get("/overview")
def get_dashboard_overview(db: Session = Depends(deps.get_db)) -> Any:
    """
    Get KPI values for the dashboard overview.
    """
    # Active events count
    active_events = db.query(func.count(Event.id)).filter(Event.is_active == True).scalar()
    
    # Reports today (mocking for today using a simple count for demo)
    reports_today = db.query(func.count(Report.id)).scalar()
    
    # Reports verified
    reports_verified = db.query(func.count(Report.id)).filter(Report.verification_status == "VERIFIED").scalar()
    
    # Duplicates grouped
    duplicates_grouped = db.query(func.count(Report.id)).filter(Report.is_duplicate == True).scalar()
    
    return {
        "active_events": active_events or 0,
        "reports_today": reports_today or 0,
        "reports_verified": reports_verified or 0,
        "duplicates_grouped": duplicates_grouped or 0,
        "processing_latency": "14ms"
    }
