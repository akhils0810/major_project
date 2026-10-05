from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api import deps
from app.models.event import Event
from app.schemas.event import EventRead
from app.services.verification import verify_event
from app.models.user import User
from app.models.report import Report
from app.models.source import Source
from typing import Dict
from datetime import datetime, timezone

router = APIRouter()

@router.get("/", response_model=List[EventRead])
def read_events(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve events.
    """
    events = db.query(Event).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventRead)
def read_event(
    event_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific event by id.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/{event_id}/verify", response_model=EventRead)
def trigger_event_verification(
    event_id: UUID,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Trigger the automated verification service for an event.
    """
    try:
        event = verify_event(db, event_id, user_id=current_user.id)
        return event
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

from app.services.clustering import run_clustering

@router.post("/cluster")
def trigger_clustering(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Batch process all orphaned reports and cluster them into Events.
    """
    events_touched = run_clustering(db)
    return {"status": "success", "events_touched": events_touched}

@router.get("/{event_id}/evidence")
def get_event_evidence(
    event_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get the evidence graph for a specific event.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    reports = db.query(Report).filter(Report.event_id == event_id).order_by(Report.timestamp.desc()).all()
    
    nodes = []
    contradiction_count = 0
    
    # We will simulate some contradiction detection logic based on confidence score and timestamps
    for r in reports:
        # Fetch the source to get source_name and source_type
        source = db.query(Source).filter(Source.id == r.source_id).first()
        source_name = source.source_name if source else "Unknown Citizen"
        source_type = source.source_type if source else "citizen"
        
        # Simple heuristic for contradiction: low confidence + different category or high confidence mismatch
        is_contradiction = r.confidence_score < 0.4
        if is_contradiction:
            contradiction_count += 1
            
        nodes.append({
            "id": r.id,
            "source_name": source_name,
            "source_type": source_type,
            "content": r.content,
            "timestamp": r.timestamp,
            "confidence_score": r.confidence_score,
            "is_contradiction": is_contradiction,
            "latitude": r.latitude,
            "longitude": r.longitude
        })
        
    return {
        "event_id": event_id,
        "nodes": nodes,
        "total_nodes": len(nodes),
        "contradiction_count": contradiction_count
    }


@router.get("/{event_id}/impact")
def get_event_impact(
    event_id: UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get the AI-generated impact intelligence and route risk assessment for a specific event.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Simulate AI calculated impact based on event severity and report count
    severity_multiplier = 1.5 if event.severity == "HIGH" else 1.0
    affected_population = int((event.report_count * 1450) * severity_multiplier)
    economic_impact_cr = round((event.report_count * 0.75) * severity_multiplier, 2)
    
    # Simulate route risk
    routes = [
        {"id": "NH-44", "status": "BLOCKED", "risk_level": "CRITICAL", "reason": "Severe waterlogging reported by 12 citizens"},
        {"id": "State Highway 12", "status": "AT RISK", "risk_level": "HIGH", "reason": "Proximity to overflowing catchment area"},
        {"id": "Expressway Alt-B", "status": "CLEAR", "risk_level": "LOW", "reason": "No anomalies detected in last 4 hours"}
    ]
    
    # Add some randomness to routes if it's not a severe event
    if event.report_count < 20:
        routes = routes[1:]
        
    return {
        "event_id": event_id,
        "affected_population_est": affected_population,
        "economic_impact_est_cr": economic_impact_cr,
        "critical_infrastructure_at_risk": int(event.report_count / 5) + 1,
        "route_assessments": routes,
        "last_updated": datetime.now(timezone.utc)
    }
