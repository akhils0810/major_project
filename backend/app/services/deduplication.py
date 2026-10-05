import math
from typing import Optional
from datetime import datetime, timedelta, timezone
from uuid import UUID
from sqlalchemy.orm import Session
from difflib import SequenceMatcher

from app.models.report import Report

# Constants for deduplication
TIME_WINDOW_HOURS = 12
DISTANCE_THRESHOLD_KM = 5.0
SIMILARITY_THRESHOLD = 0.7

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees)
    """
    if None in (lat1, lon1, lat2, lon2):
        return float('inf')
        
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers
    return c * r

def string_similarity(a: str, b: str) -> float:
    """
    Returns a similarity ratio between 0.0 and 1.0 for two strings.
    """
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def find_duplicate(db: Session, new_report: Report) -> Optional[UUID]:
    """
    Finds if the new_report is a duplicate of an existing report.
    Returns the UUID of the original report if a duplicate is found, else None.
    """
    if not new_report.timestamp:
        return None
        
    # Ensure timestamp is offset-naive UTC or handle appropriately depending on DB setup.
    # We will assume timestamp is comparable directly.
    time_threshold = new_report.timestamp - timedelta(hours=TIME_WINDOW_HOURS)
    
    # Base query: same category, within the time window, not already marked as a duplicate
    query = db.query(Report).filter(
        Report.event_category == new_report.event_category,
        Report.timestamp >= time_threshold,
        Report.is_duplicate == False,
        Report.id != new_report.id
    )
    
    # Optimization: Filter by city if available
    if new_report.city:
        query = query.filter(Report.city == new_report.city)
        
    recent_reports = query.all()
    
    for existing in recent_reports:
        # 1. Spatial Check
        if new_report.latitude and new_report.longitude and existing.latitude and existing.longitude:
            dist = haversine_distance(
                new_report.latitude, new_report.longitude,
                existing.latitude, existing.longitude
            )
            if dist > DISTANCE_THRESHOLD_KM:
                continue
        elif new_report.city and existing.city and new_report.city.lower() != existing.city.lower():
            # If coordinates are missing, strict city match was already applied by SQL, 
            # but we double check here just in case city wasn't provided for one of them.
            continue
            
        # 2. Textual Similarity Check
        if string_similarity(new_report.content, existing.content) >= SIMILARITY_THRESHOLD:
            return existing.id
            
    return None
