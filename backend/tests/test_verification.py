from datetime import datetime, timezone
from uuid import uuid4
from app.models.event import Event
from app.models.report import Report
from app.models.source import Source
from app.services.verification import verify_event

def test_verify_event_official_source(db):
    # Setup Event
    event = Event(
        id=uuid4(),
        title="Test Event",
        event_category="rainfall",
        start_time=datetime.now(timezone.utc)
    )
    db.add(event)
    
    # Setup Source
    official_source = Source(
        id=uuid4(),
        source_type="api",
        trust_score=95.0
    )
    db.add(official_source)
    
    # Setup Report
    report = Report(
        id=uuid4(),
        event_id=event.id,
        source_id=official_source.id,
        event_category="rainfall"
    )
    db.add(report)
    db.commit()
    
    updated_event = verify_event(db, event.id)
    assert updated_event.verification_status == "VERIFIED"
    assert updated_event.confidence_score == 100.0

def test_verify_event_crowdsource(db):
    event = Event(
        id=uuid4(),
        title="Test Event 2",
        event_category="rainfall",
        start_time=datetime.now(timezone.utc)
    )
    db.add(event)
    db.commit()
    
    # Needs 3 citizen reports to verify
    for i in range(3):
        source = Source(id=uuid4(), source_type="citizen", trust_score=50.0)
        report = Report(id=uuid4(), event_id=event.id, source_id=source.id, event_category="rainfall")
        db.add(source)
        db.add(report)
        
    db.commit()
    
    updated_event = verify_event(db, event.id)
    assert updated_event.verification_status == "VERIFIED"
    assert updated_event.confidence_score > 50.0 
