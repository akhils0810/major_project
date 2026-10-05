from typing import List, Dict, Any
import uuid
from datetime import datetime
from app.ingestion.base import BaseDataSource
from app.schemas.report import ReportNormalized

class WeatherAPICollector(BaseDataSource):
    
    @property
    def source_type(self) -> str:
        return "api"
        
    @property
    def source_name(self) -> str:
        return "Mock Weather API"
        
    @property
    def default_trust_score(self) -> float:
        return 95.0

    def fetch(self) -> List[Dict[str, Any]]:
        # In a real scenario, this would make HTTP requests to IMD/OpenWeatherMap
        return [
            {
                "id": "WAPI-1001",
                "desc": "Heavy rainfall observed.",
                "lat": 17.3850,
                "lon": 78.4867,
                "city": "Hyderabad",
                "state": "Telangana",
                "time": datetime.utcnow().isoformat(),
                "type": "rainfall"
            }
        ]

    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[ReportNormalized]:
        normalized = []
        for item in raw_data:
            report = ReportNormalized(
                content=item.get("desc", ""),
                latitude=item.get("lat"),
                longitude=item.get("lon"),
                city=item.get("city"),
                state=item.get("state"),
                event_category=item.get("type", "unknown"),
                external_id=item.get("id"),
            )
            normalized.append(report)
        return normalized
