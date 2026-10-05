import logging
import random
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine
from app.models.base import Base
from app.models.source import Source
from app.models.report import Report
from app.models.event import Event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INDIAN_CITIES = [
    {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867},
    {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777},
    {"city": "Delhi", "state": "Delhi", "lat": 28.7041, "lon": 77.1025},
    {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707},
    {"city": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946},
    {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639},
    {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lon": 73.8567},
    {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lon": 72.5714},
    {"city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873},
]

EVENT_CATEGORIES = [
    "rainfall", "thunderstorm", "flooding", "heatwave", "fog", "dust_storm", "strong_winds"
]

TEMPLATES = {
    "rainfall": ["Heavy rainfall observed here.", "Continuous rain for 2 hours.", "Drizzling since morning.", "Sudden downpour."],
    "thunderstorm": ["Loud thunder and lightning.", "Thunderstorm approaching.", "Heavy storm with lightning strikes."],
    "flooding": ["Streets are waterlogged.", "Severe flooding on the main road.", "Water entered houses."],
    "heatwave": ["Unbearable heat today.", "Extremely hot weather.", "Temperature above 45C."],
    "fog": ["Zero visibility due to dense fog.", "Very foggy morning.", "Thick fog on the highway."],
    "dust_storm": ["Massive dust storm.", "Can't see anything, too much dust.", "Strong winds carrying dust."],
    "strong_winds": ["Trees uprooted by strong winds.", "Very windy today.", "Gale force winds."]
}

def generate_demo_data(db: Session, num_reports: int = 200):
    # Setup sources
    sources_data = [
        {"type": "citizen", "name": "Citizen Portal", "trust": 50.0},
        {"type": "api", "name": "Mock Weather API", "trust": 95.0},
        {"type": "news", "name": "Mock Local News RSS", "trust": 80.0},
    ]
    
    sources = []
    for s_data in sources_data:
        source = db.query(Source).filter(Source.source_type == s_data["type"]).first()
        if not source:
            source = Source(source_type=s_data["type"], source_name=s_data["name"], trust_score=s_data["trust"])
            db.add(source)
            db.commit()
            db.refresh(source)
        sources.append(source)

    logger.info(f"Generating {num_reports} demo reports...")
    
    now = datetime.now(timezone.utc)
    
    reports_added = 0
    for _ in range(num_reports):
        location = random.choice(INDIAN_CITIES)
        category = random.choice(EVENT_CATEGORIES)
        content = random.choice(TEMPLATES[category])
        source = random.choice(sources)
        
        # Jitter location slightly
        lat = location["lat"] + random.uniform(-0.05, 0.05)
        lon = location["lon"] + random.uniform(-0.05, 0.05)
        
        # Jitter time (past 7 days)
        hours_ago = random.uniform(0, 7 * 24)
        timestamp = now - timedelta(hours=hours_ago)
        
        report = Report(
            source_id=source.id,
            content=content,
            latitude=lat,
            longitude=lon,
            city=location["city"],
            state=location["state"],
            event_category=category,
            timestamp=timestamp,
            confidence_score=random.uniform(30.0, 99.0) if source.source_type != "citizen" else random.uniform(10.0, 70.0),
            verification_status="UNVERIFIED",
        )
        db.add(report)
        reports_added += 1

    db.commit()
    logger.info(f"Successfully generated {reports_added} reports.")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        generate_demo_data(db)
    finally:
        db.close()
