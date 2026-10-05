import logging
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.event import Event
from app.models.report import Report
from app.models.source import Source
from app.models.verification_record import VerificationRecord

logger = logging.getLogger(__name__)

OFFICIAL_TRUST_THRESHOLD = 90.0
MIN_CITIZEN_REPORTS_FOR_VERIFICATION = 3

def verify_event(db: Session, event_id: UUID, user_id: UUID = None) -> Event:
    """
    Evaluates the verification status and confidence score of an event based on its reports.
    Updates the Event and creates a VerificationRecord.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise ValueError(f"Event with id {event_id} not found.")

    # 1. Fetch all reports linked to this event (excluding duplicates linked to other events, 
    # but we will just query all reports that have this event_id)
    reports = db.query(Report).filter(Report.event_id == event_id).all()
    
    event.report_count = len(reports)
    
    if event.report_count == 0:
        event.confidence_score = 0.0
        event.verification_status = "UNVERIFIED"
        db.commit()
        return event

    # 2. Analyze sources
    sources = []
    has_official_source = False
    total_citizen_trust = 0.0
    citizen_count = 0
    
    for report in reports:
        source = db.query(Source).filter(Source.id == report.source_id).first()
        if source:
            sources.append(source)
            if source.trust_score >= OFFICIAL_TRUST_THRESHOLD:
                has_official_source = True
            elif source.source_type == "citizen":
                total_citizen_trust += source.trust_score
                citizen_count += 1
                
    # 3. Apply Verification Rules
    old_status = event.verification_status
    new_status = "UNVERIFIED"
    new_confidence = 0.0
    reason = ""
    
    if has_official_source:
        new_status = "VERIFIED"
        new_confidence = 100.0
        reason = "Verified by official high-trust source."
    elif citizen_count >= MIN_CITIZEN_REPORTS_FOR_VERIFICATION:
        new_status = "VERIFIED"
        # Cap confidence at 85% for crowdsourced data
        new_confidence = min(85.0, (total_citizen_trust / citizen_count) + (citizen_count * 5.0))
        reason = f"Verified by {citizen_count} independent citizen reports."
    else:
        new_status = "UNVERIFIED"
        new_confidence = 50.0 if citizen_count > 0 else 0.0
        reason = "Insufficient reports for verification."

    # Update event
    event.verification_status = new_status
    event.confidence_score = new_confidence
    event.updated_at = datetime.now(timezone.utc)
    
    # Create verification record
    record = VerificationRecord(
        event_id=event.id,
        user_id=user_id,
        previous_status=old_status,
        new_status=new_status,
        confidence_score=new_confidence,
        reason=reason,
        verification_method="AUTOMATED" if not user_id else "MANUAL"
    )
    
    db.add(record)
    db.commit()
    db.refresh(event)
    
    logger.info(f"Event {event_id} verification updated to {new_status} (Confidence: {new_confidence})")
    
    return event
