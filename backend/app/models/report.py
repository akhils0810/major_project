from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Uuid
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime, timezone
from app.models.base import Base

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id = Column(Uuid(as_uuid=True), ForeignKey("sources.id"), nullable=True)
    
    external_id = Column(String, nullable=True, index=True)
    
    content = Column(String, nullable=False)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    
    event_category = Column(String, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    
    confidence_score = Column(Float, default=0.0)
    verification_status = Column(String, default="UNVERIFIED")
    
    is_duplicate = Column(Boolean, default=False)
    duplicate_of = Column(Uuid(as_uuid=True), ForeignKey("reports.id"), nullable=True)
    event_id = Column(Uuid(as_uuid=True), ForeignKey("events.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    source = relationship("Source")
    event = relationship("Event")
