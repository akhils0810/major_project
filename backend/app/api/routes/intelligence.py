from typing import Any, Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, case
from datetime import datetime, timedelta, timezone

from app.api import deps
from app.models.report import Report
from app.models.event import Event
from app.models.source import Source

router = APIRouter()

@router.get("/time-series")
def get_time_series(
    db: Session = Depends(deps.get_db),
    hours: int = 24
) -> Any:
    """
    Get weather reports over time
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).replace(tzinfo=None)
    
    # Fetch all reports in timeframe once for efficiency
    reports = db.query(
        Report.timestamp,
        Report.confidence_score,
        Report.verification_status
    ).filter(Report.timestamp >= cutoff).all()
    
    # Determine bucket size
    is_daily = hours > 48
    bucket_hours = 24 if is_daily else 1
    num_buckets = hours // bucket_hours
    
    data_points = []
    
    for i in range(num_buckets):
        bucket_start = cutoff + timedelta(hours=i * bucket_hours)
        bucket_end = bucket_start + timedelta(hours=bucket_hours)
        
        # Make bucket datetimes naive for comparison with SQLite datetime
        naive_start = bucket_start.replace(tzinfo=None)
        naive_end = bucket_end.replace(tzinfo=None)
        
        # Filter reports for this bucket
        bucket_reports = [r for r in reports if r.timestamp and naive_start <= r.timestamp < naive_end]
        
        total_ingested = len(bucket_reports)
        ai_verified = sum(1 for r in bucket_reports if r.confidence_score > 0.8)
        human_verified = sum(1 for r in bucket_reports if r.verification_status == "VERIFIED")
        
        data_points.append({
            "timestamp": bucket_start.isoformat(),
            "total_ingested": total_ingested,
            "ai_processed": total_ingested,
            "ai_verified": ai_verified,
            "human_verified": human_verified
        })
        
    return data_points


@router.get("/hazards")
def get_hazard_distribution(
    db: Session = Depends(deps.get_db),
    hours: int = 24
) -> Any:
    """
    Get weather events by category
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).replace(tzinfo=None)
    
    results = db.query(
        Event.event_category,
        func.count(Event.id).label('event_count'),
        func.sum(Event.report_count).label('total_reports')
    ).filter(
        Event.created_at >= cutoff
    ).group_by(Event.event_category).all()
    
    total_events = sum(r.event_count for r in results) if results else 1
    
    distribution = []
    for r in results:
        distribution.append({
            "category": r.event_category,
            "event_count": r.event_count,
            "total_reports": r.total_reports or 0,
            "percentage": round((r.event_count / total_events) * 100, 1)
        })
        
    return distribution


@router.get("/states")
def get_state_activity(
    db: Session = Depends(deps.get_db),
    hours: int = 24
) -> Any:
    """
    Get national state-level intelligence
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).replace(tzinfo=None)
    
    results = db.query(
        Report.state,
        func.count(Report.id).label('total_reports'),
        func.sum(case((Report.verification_status == 'VERIFIED', 1), else_=0)).label('verified_reports')
    ).filter(
        Report.created_at >= cutoff,
        Report.state != None
    ).group_by(Report.state).all()
    
    state_data = []
    for r in results:
        verified_rate = round((r.verified_reports / r.total_reports) * 100, 1) if r.total_reports > 0 else 0
        
        primary_hazard = db.query(Report.event_category, func.count(Report.id).label('count')) \
            .filter(Report.state == r.state) \
            .group_by(Report.event_category) \
            .order_by(desc('count')) \
            .first()
            
        active_events = db.query(func.count(Event.id)).filter(Event.state == r.state).scalar() or 0
        
        state_data.append({
            "state": r.state,
            "total_reports": r.total_reports,
            "verified_reports": r.verified_reports,
            "verified_rate": verified_rate,
            "primary_hazard": primary_hazard.event_category if primary_hazard else "Unknown",
            "active_events": active_events
        })
        
    return state_data


@router.get("/verification")
def get_verification_distribution(
    db: Session = Depends(deps.get_db),
    hours: int = 24
) -> Any:
    """
    Get verification status distribution
    """
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).replace(tzinfo=None)
    
    results = db.query(
        Report.verification_status,
        func.count(Report.id).label('count')
    ).filter(
        Report.created_at >= cutoff
    ).group_by(Report.verification_status).all()
    
    total = sum(r.count for r in results) if results else 1
    
    distribution = []
    for r in results:
        distribution.append({
            "status": r.verification_status,
            "count": r.count,
            "percentage": round((r.count / total) * 100, 1)
        })
        
    return {
        "total": total if results else 0,
        "distribution": distribution
    }


@router.get("/sources")
def get_source_reliability(
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all data sources and their reliability metrics
    """
    from app.models.source import Source
    
    sources = db.query(Source).order_by(desc(Source.trust_score)).all()
    
    return [
        {
            "id": s.id,
            "source_name": s.source_name,
            "source_type": s.source_type,
            "trust_score": s.trust_score,
            "total_reports": s.total_reports,
            "verified_reports": s.verified_reports,
            "false_reports": s.false_reports,
            "created_at": s.created_at
        } for s in sources
    ]
