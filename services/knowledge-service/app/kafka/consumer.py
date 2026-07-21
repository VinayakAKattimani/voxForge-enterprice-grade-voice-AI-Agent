import json
from uuid import UUID

from aiokafka import AIOKafkaConsumer

from app.core.config import settings
from app.kafka.topics import DOCUMENT_UPLOADED
from app.db.session import SessionLocal
from app.services.document_processor_service import DocumentProcessorService


async def start_consumer():

    consumer = AIOKafkaConsumer(
        DOCUMENT_UPLOADED,
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id="knowledge-service-v2",
        auto_offset_reset="earliest",
        value_deserializer=lambda m: json.loads(m.decode()),
    )

    await consumer.start()

    await consumer.seek_to_beginning()

    print("Assignment:", consumer.assignment())

    print("Kafka Consumer Started")
    print("Subscribed to:", DOCUMENT_UPLOADED)

    try:
        
        print("Waiting for messages...")

        async for message in consumer:

            print("=" * 50)
            print("Received Event")
            print(message.value)
            print("=" * 50)

            document_id = message.value["document_id"]

            db = SessionLocal()

            try:
                processor = DocumentProcessorService(db)

                await processor.process_document(
                    UUID(document_id)
                )

                print(
                    "Document processed successfully:",
                    document_id
                )

            except Exception as e:
                print(
                    "Document processing failed:",
                    e
                )

            finally:
                db.close()

    finally:
        await consumer.stop()

        print("Kafka Consumer Stopped")