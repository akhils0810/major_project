import os
import json
import logging
from datetime import datetime
from confluent_kafka import Consumer, KafkaError, KafkaException

from app.db.session import SessionLocal
from app.models.report import Report
from app.services.deduplication import find_duplicate

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("kafka_consumer")

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
TOPIC_NAME = "weather_reports"
GROUP_ID = "weather_report_consumer_group"

def process_message(msg_value: str, db):
    """
    Parses the JSON message, runs deduplication, and commits to DB.
    """
    try:
        data = json.loads(msg_value)
        
        # We need to construct a Report object from the dictionary
        new_report = Report(
            source_id=data.get('source_id'),
            external_id=data.get('external_id'),
            content=data.get('content'),
            media_url=data.get('media_url'),
            media_type=data.get('media_type'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            state=data.get('state'),
            city=data.get('city'),
            event_category=data.get('event_category'),
            confidence_score=data.get('confidence_score', 0.0),
            verification_status=data.get('verification_status', 'UNVERIFIED'),
        )
        
        # Parse timestamp safely
        ts_str = data.get('timestamp')
        if ts_str:
            new_report.timestamp = datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
            
        duplicate_of_id = find_duplicate(db, new_report)
        if duplicate_of_id:
            new_report.is_duplicate = True
            new_report.duplicate_of = duplicate_of_id
            
        db.add(new_report)
        db.commit()
        logger.info(f"Consumed and saved report to DB (Duplicate: {new_report.is_duplicate})")
        
    except json.JSONDecodeError:
        logger.error(f"Failed to parse JSON: {msg_value}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        db.rollback()

def start_consumer():
    """
    Starts the Kafka consumer loop.
    """
    conf = {
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    
    try:
        consumer.subscribe([TOPIC_NAME])
        logger.info(f"Subscribed to topic {TOPIC_NAME}. Waiting for messages...")
        
        # We will reuse the same DB session for the loop, but it's often safer 
        # to create a new session per batch or per message to avoid long-running transactions.
        while True:
            msg = consumer.poll(timeout=1.0)
            
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event
                    logger.debug(f"{msg.topic()} [{msg.partition()}] reached end at offset {msg.offset()}")
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                # Valid message
                db = SessionLocal()
                process_message(msg.value().decode('utf-8'), db)
                db.close()
                
    except KeyboardInterrupt:
        logger.info("Aborted by user")
    except Exception as e:
        logger.error(f"Kafka consumer crashed: {e}")
    finally:
        consumer.close()

if __name__ == "__main__":
    start_consumer()
