from typing import Any
from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def get_system_status() -> Any:
    return {
        "services": [
            {"name": "API Server", "type": "FastAPI", "status": "Operational", "uptime": "99.99%", "latency": "24ms"},
            {"name": "PostgreSQL", "type": "Database", "status": "Operational", "uptime": "100%", "latency": "4ms"},
            {"name": "Kafka Cluster", "type": "Streaming", "status": "Operational", "uptime": "99.95%", "latency": "8ms"},
            {"name": "ML Service", "type": "Inference", "status": "Operational", "uptime": "99.80%", "latency": "124ms"},
            {"name": "Ingestion Workers", "type": "Background", "status": "Operational", "uptime": "99.90%", "latency": "-"},
            {"name": "Verification Engine", "type": "Processing", "status": "Operational", "uptime": "99.99%", "latency": "45ms"},
        ],
        "queues": {
            "ingestion": 14,
            "verification": 241,
            "dlq": 0
        }
    }
