from datetime import datetime, timedelta, timezone
from uuid import uuid4
from app.models.report import Report
from app.services.deduplication import haversine_distance, string_similarity, find_duplicate

def test_haversine_distance():
    # Hyderabad to Bangalore ~ 500km
    lat1, lon1 = 17.3850, 78.4867
    lat2, lon2 = 12.9716, 77.5946
    
    dist = haversine_distance(lat1, lon1, lat2, lon2)
    assert 480 < dist < 520

    # Same point
    dist = haversine_distance(lat1, lon1, lat1, lon1)
    assert dist == 0.0
    
def test_string_similarity():
    # Identical strings
    assert string_similarity("Heavy rain", "Heavy rain") == 1.0
    
    # Completely different
    assert string_similarity("Sunshine", "Flooding") < 0.2
    
    # Similar strings
    assert string_similarity("Waterlogging on Main St", "Water logging on Main St.") > 0.8

def test_find_duplicate(db):
    # Setup initial report
    now = datetime.now(timezone.utc)
    original_id = uuid4()
    r1 = Report(
        id=original_id,
        content="Massive flooding in Kukatpally",
        event_category="flooding",
        city="Hyderabad",
        timestamp=now - timedelta(hours=1),
        is_duplicate=False
    )
    db.add(r1)
    db.commit()
    
    # Test duplicate detection (similar text, same city, within 12h)
    r2 = Report(
        id=uuid4(),
        content="Massive flooding at Kukatpally area",
        event_category="flooding",
        city="Hyderabad",
        timestamp=now,
        is_duplicate=False
    )
    
    duplicate_of = find_duplicate(db, r2)
    assert duplicate_of == original_id
    
    # Test non-duplicate (different category)
    r3 = Report(
        id=uuid4(),
        content="Massive flooding at Kukatpally area",
        event_category="rainfall", # Different
        city="Hyderabad",
        timestamp=now,
        is_duplicate=False
    )
    assert find_duplicate(db, r3) is None
