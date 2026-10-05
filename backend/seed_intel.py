import sys
import os
from datetime import datetime, timedelta, timezone
import random

# Add backend to path
sys.path.append(os.path.abspath("/Users/akhilsathwik/Desktop/project/backend"))

from app.database.session import SessionLocal
from app.models.report import Report
from app.models.event import Event

def seed_data():
    db = SessionLocal()
    
    # Delete existing test data for clean state
    db.query(Report).delete()
    db.query(Event).delete()
    
    now = datetime.now(timezone.utc)
    categories = ['rainfall', 'flooding', 'thunderstorm', 'heatwave']
    states = ['Maharashtra', 'Telangana', 'Karnataka', 'Delhi']
    
    print("Seeding extended dummy data for Intelligence Dashboard (up to 3 months)...")
    
    # Create random events
    events = []
    for _ in range(150):
        rand_val = random.random()
        if rand_val < 0.5:
            hours_ago = random.randint(0, 23)
        elif rand_val < 0.8:
            hours_ago = random.randint(24, 168)
        else:
            hours_ago = random.randint(169, 2160)
            
        created_at = now - timedelta(hours=hours_ago)
        
        e = Event(
            title=f"Event {_}",
            event_category=random.choice(categories),
            state=random.choice(states),
            city="City",
            latitude=20.0 + random.uniform(-5, 5),
            longitude=78.0 + random.uniform(-5, 5),
            start_time=created_at,
            severity="HIGH",
            confidence_score=random.uniform(0.5, 0.99),
            report_count=random.randint(5, 100),
            verification_status=random.choice(["VERIFIED", "PENDING", "UNVERIFIED"]),
            created_at=created_at
        )
        db.add(e)
        events.append(e)
    
    db.commit() # Commit to get event IDs
    
    # Create random reports
    # Skewed heavily to recent 24h, but spread across 90 days
    for i in range(2000):
        # 50% in the last 24 hours, 30% in last 7 days, 20% older
        rand_val = random.random()
        if rand_val < 0.5:
            hours_ago = random.randint(0, 23)
        elif rand_val < 0.8:
            hours_ago = random.randint(24, 168)
        else:
            hours_ago = random.randint(169, 2160)
            
        created_at = now - timedelta(hours=hours_ago, minutes=random.randint(0, 59))
        
        parent_event = random.choice(events)
        r = Report(
            content=f"Dummy report {i}",
            event_category=parent_event.event_category,
            state=parent_event.state,
            city=parent_event.city,
            latitude=parent_event.latitude,
            longitude=parent_event.longitude,
            timestamp=created_at,
            created_at=created_at,
            confidence_score=random.uniform(0.1, 0.99),
            verification_status=random.choice(["VERIFIED", "PENDING", "REJECTED", "UNVERIFIED"]),
            event_id=parent_event.id
        )
        db.add(r)
        
    db.commit()
    db.close()
    print("Seed complete.")

if __name__ == "__main__":
    seed_data()
