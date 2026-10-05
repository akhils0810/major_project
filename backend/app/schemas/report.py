from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class ReportBase(BaseModel):
    content: str
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    state: Optional[str] = None
    city: Optional[str] = None
    event_category: str = "unknown"

class ReportCreate(ReportBase):
    pass

class ReportNormalized(ReportBase):
    source_id: Optional[UUID] = None
    external_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    confidence_score: float = 0.0
    verification_status: str = "UNVERIFIED"

class ReportRead(ReportNormalized):
    id: UUID
    is_duplicate: bool
    duplicate_of: Optional[UUID] = None
    event_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
