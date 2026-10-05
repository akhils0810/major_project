from typing import List, Dict, Any
from datetime import datetime
from app.ingestion.base import BaseDataSource
from app.schemas.report import ReportNormalized

class RSSNewsCollector(BaseDataSource):
    
    @property
    def source_type(self) -> str:
        return "news"
        
    @property
    def source_name(self) -> str:
        return "Mock Local News RSS"
        
    @property
    def default_trust_score(self) -> float:
        return 80.0

    def fetch(self) -> List[Dict[str, Any]]:
        # In a real scenario, this would parse an RSS feed
        return [
            {
                "guid": "NEWS-2001",
                "title": "Severe flooding reported in Kukatpally",
                "description": "Streets are waterlogged after 3 hours of continuous rain.",
                "city": "Hyderabad",
                "state": "Telangana",
                "pubDate": datetime.utcnow().isoformat(),
            }
        ]

    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[ReportNormalized]:
        normalized = []
        for item in raw_data:
            report = ReportNormalized(
                content=item.get("title", "") + " - " + item.get("description", ""),
                city=item.get("city"),
                state=item.get("state"),
                event_category="flooding", # A real system would use ML here
                external_id=item.get("guid"),
            )
            normalized.append(report)
        return normalized
