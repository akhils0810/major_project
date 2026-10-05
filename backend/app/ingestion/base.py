from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.schemas.report import ReportNormalized

class BaseDataSource(ABC):
    """
    Base abstraction for all data ingestion sources.
    """
    
    @property
    @abstractmethod
    def source_type(self) -> str:
        """Returns the type of the source (e.g. 'api', 'news', 'citizen')"""
        pass
        
    @property
    @abstractmethod
    def source_name(self) -> str:
        """Returns the name of the source (e.g. 'IMD API', 'Citizen Portal')"""
        pass
        
    @property
    @abstractmethod
    def default_trust_score(self) -> float:
        """Returns the default trust score for this source (0-100)"""
        pass

    @abstractmethod
    def fetch(self) -> List[Dict[str, Any]]:
        """
        Fetches raw data from the external source.
        """
        pass

    @abstractmethod
    def normalize(self, raw_data: List[Dict[str, Any]]) -> List[ReportNormalized]:
        """
        Converts the raw data into the unified internal ReportNormalized schema.
        """
        pass
