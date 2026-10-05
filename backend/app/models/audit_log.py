from sqlalchemy import Column, String, DateTime, ForeignKey, Uuid
import uuid
from datetime import datetime, timezone
from app.models.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False) # e.g., 'event', 'report'
    entity_id = Column(Uuid(as_uuid=True), nullable=False)
    
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
