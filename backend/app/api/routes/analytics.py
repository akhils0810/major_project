from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.api import deps
from app.models.report import Report
from app.models.event import Event

router = APIRouter()

@router.get("/velocity")
def get_velocity(db: Session = Depends(deps.get_db)) -> Any:
    # Simplified mock implementation for time series
    return [
        {"time": "00:00", "reports": 120, "events": 45},
        {"time": "04:00", "reports": 180, "events": 50},
        {"time": "08:00", "reports": 400, "events": 110},
        {"time": "12:00", "reports": 550, "events": 180},
        {"time": "16:00", "reports": 720, "events": 210},
        {"time": "20:00", "reports": 430, "events": 150},
        {"time": "23:59", "reports": 250, "events": 90},
    ]

@router.get("/hazards")
def get_hazards(db: Session = Depends(deps.get_db)) -> Any:
    hazards = db.query(Event.category_type, func.count(Event.id).label('count')).group_by(Event.category_type).all()
    
    total = sum([h.count for h in hazards]) or 1
    
    # Map to UI format and colors
    colors = {
        'rain': 'bg-blue-500',
        'flood': 'bg-cyan-500',
        'thunderstorm': 'bg-indigo-400',
        'heatwave': 'bg-orange-500',
        'wind': 'bg-teal-500',
        'fog': 'bg-slate-400'
    }
    
    result = []
    for h in hazards:
        share = int((h.count / total) * 100)
        result.append({
            "name": h.category_type.capitalize(),
            "share": share,
            "color": colors.get(h.category_type, 'bg-gray-500')
        })
        
    return sorted(result, key=lambda x: x['share'], reverse=True)

@router.get("/regional")
def get_regional(db: Session = Depends(deps.get_db)) -> Any:
    regions = db.query(Event.state, func.count(Event.id).label('count')).filter(Event.state != None).group_by(Event.state).order_by(desc('count')).limit(5).all()
    
    result = []
    for r in regions:
        # Dummy trend logic
        trend = "+5%"
        result.append({
            "state": r.state,
            "events": r.count,
            "trend": trend
        })
    return result

@router.get("/verification")
def get_verification_stats(db: Session = Depends(deps.get_db)) -> Any:
    return [
        {"label": "Auto verified", "value": "94.2%", "desc": "pipeline accuracy"},
        {"label": "Human agreement", "value": "96.8%", "desc": "expert override rate"},
        {"label": "False-positive rate", "value": "2.1%", "desc": "flagged anomalies"},
        {"label": "Noise removed", "value": "20.8%", "desc": "duplicate reports"},
    ]
