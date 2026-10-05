from sqlalchemy import Column, String, Float, Integer, DateTime, Uuid
import uuid
from datetime import datetime, timezone
from app.models.base import Base

class Source(Base):
    __tablename__ = "sources"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type = Column(String, nullable=False) # e.g. citizen, api, news
    source_name = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    trust_score = Column(Float, default=50.0)
    total_reports = Column(Integer, default=0)
    verified_reports = Column(Integer, default=0)
    false_reports = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
