from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class EventBase(BaseModel):
    title: str
    event_category: str
    state: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    severity: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: UUID
    confidence_score: float
    report_count: int
    verification_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
