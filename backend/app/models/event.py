from sqlalchemy import Column, String, Float, Integer, DateTime, Uuid
import uuid
from datetime import datetime, timezone
from app.models.base import Base

class Event(Base):
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    event_category = Column(String, nullable=False, index=True)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    severity = Column(String, nullable=True)
    confidence_score = Column(Float, default=0.0)
    report_count = Column(Integer, default=0)
    verification_status = Column(String, default="UNVERIFIED")
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
