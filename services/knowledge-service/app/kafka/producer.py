import json

from aiokafka import AIOKafkaProducer

from app.core.config import settings


producer: AIOKafkaProducer | None = None


async def start_producer():

    global producer

    producer = AIOKafkaProducer(
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
    )

    await producer.start()

    print("Kafka Producer Started")


async def stop_producer():

    global producer

    if producer:
        await producer.stop()

        print("Kafka Producer Stopped")


async def publish(
    topic: str,
    message: dict,
):

    if producer is None:
        raise RuntimeError("Kafka producer not started")

    await producer.send_and_wait(
        topic,
        json.dumps(message).encode("utf-8"),
    )