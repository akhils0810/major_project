from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class EvidenceNode(BaseModel):
    id: UUID
    source_name: str
    source_type: str
    content: str
    timestamp: datetime
    confidence_score: float
    is_contradiction: bool
    
class EvidenceGraph(BaseModel):
    event_id: UUID
    nodes: List[EvidenceNode]
    total_nodes: int
    contradiction_count: int
