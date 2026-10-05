from typing import Any, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.report import Report
from app.models.source import Source
from app.schemas.report import ReportCreate, ReportNormalized, ReportRead
from app.models.user import User
from app.services.deduplication import find_duplicate
import uuid

router = APIRouter()

@router.get("/", response_model=List[ReportRead])
def read_reports(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """
    Retrieve raw reports, ordered by most recent.
    """
    reports = db.query(Report).order_by(Report.timestamp.desc()).offset(skip).limit(limit).all()
    return reports

@router.post("/citizen", response_model=ReportRead)
def submit_citizen_report(
    report_in: ReportCreate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Submit a weather report from the public citizen portal.
    """
    source = db.query(Source).filter(Source.source_type == "citizen").first()
    if not source:
        source = Source(source_type="citizen", source_name="Citizen Portal", trust_score=50.0)
        db.add(source)
        db.commit()
        db.refresh(source)
    
    from app.ml.predict import predict_category
    ml_result = predict_category(report_in.content or "")
    
    new_report = Report(
        source_id=source.id,
        content=report_in.content,
        media_url=report_in.media_url,
        media_type=report_in.media_type,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        state=report_in.state,
        city=report_in.city,
        event_category=ml_result.get("category", report_in.event_category),
        confidence_score=ml_result.get("confidence", 0.0) / 100.0,
        verification_status="PENDING",
        timestamp=datetime.utcnow(),
    )
    
    # Deduplication check before committing
    duplicate_of_id = find_duplicate(db, new_report)
    if duplicate_of_id:
        new_report.is_duplicate = True
        new_report.duplicate_of = duplicate_of_id
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.post("/ingest", response_model=List[ReportRead])
def ingest_normalized_reports(
    reports_in: List[ReportNormalized],
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Ingest a batch of normalized reports from external adapters/sources.
    Processes them synchronously for local mode.
    """
    created_reports = []
    
    for report_in in reports_in:
        new_report = Report(
            source_id=report_in.source_id,
            external_id=report_in.external_id,
            content=report_in.content,
            media_url=report_in.media_url,
            media_type=report_in.media_type,
            latitude=report_in.latitude,
            longitude=report_in.longitude,
            state=report_in.state,
            city=report_in.city,
            event_category=report_in.event_category,
            timestamp=report_in.timestamp,
            confidence_score=report_in.confidence_score,
            verification_status=report_in.verification_status,
        )
        
        duplicate_of_id = find_duplicate(db, new_report)
        if duplicate_of_id:
            new_report.is_duplicate = True
            new_report.duplicate_of = duplicate_of_id
            
        db.add(new_report)
        created_reports.append(new_report)
        
    db.commit()
    
    for r in created_reports:
        db.refresh(r)
        
    return created_reports

from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

@router.patch("/{report_id}/status", response_model=ReportRead)
def update_report_status(
    report_id: str,
    status_update: StatusUpdate,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Update the verification status of a report.
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report.verification_status = status_update.status
    db.commit()
    db.refresh(report)
    return report
