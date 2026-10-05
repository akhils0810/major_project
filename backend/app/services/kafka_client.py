import os
import json
import logging
from confluent_kafka import Producer

logger = logging.getLogger(__name__)

KAFKA_BROKER = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
TOPIC_NAME = "weather_reports"

producer_conf = {
    'bootstrap.servers': KAFKA_BROKER,
    'client.id': 'fastapi-producer',
    # We can handle disconnects gracefully rather than crashing if Kafka isn't up
    'message.timeout.ms': 3000
}

_producer_instance = None

def get_producer():
    global _producer_instance
    if _producer_instance is None:
        try:
            _producer_instance = Producer(producer_conf)
        except Exception as e:
            logger.error(f"Failed to initialize Kafka Producer: {e}")
    return _producer_instance

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result. """
    if err is not None:
        logger.error(f'Message delivery failed: {err}')
    else:
        logger.debug(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def produce_report(report_dict: dict):
    """
    Publishes a raw report to Kafka.
    """
    producer = get_producer()
    if not producer:
        logger.warning("Kafka Producer not available, skipping message publish.")
        return False
        
    try:
        # Convert datetime objects to ISO strings if needed
        for k, v in report_dict.items():
            if hasattr(v, 'isoformat'):
                report_dict[k] = v.isoformat()
                
        payload = json.dumps(report_dict)
        producer.produce(
            topic=TOPIC_NAME,
            value=payload.encode('utf-8'),
            callback=delivery_report
        )
        producer.poll(0)
        return True
    except Exception as e:
        logger.error(f"Failed to produce message to Kafka: {e}")
        return False

def flush_producer():
    producer = get_producer()
    if producer:
        producer.flush()
