from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Uuid
import uuid
from datetime import datetime, timezone
from app.models.base import Base

class VerificationRecord(Base):
    __tablename__ = "verification_records"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(Uuid(as_uuid=True), ForeignKey("events.id"), nullable=False)
    
    source_score = Column(Float, nullable=True)
    content_score = Column(Float, nullable=True)
    corroboration_score = Column(Float, nullable=True)
    location_score = Column(Float, nullable=True)
    media_score = Column(Float, nullable=True)
    final_score = Column(Float, nullable=False)
    
    decision = Column(String, nullable=False)
    reviewed_by = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    review_reason = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
