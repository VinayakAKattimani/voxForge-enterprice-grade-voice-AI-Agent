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
        group_id="knowledge-service",
        value_deserializer=lambda m: json.loads(m.decode()),
    )

    await consumer.start()

    print("Kafka Consumer Started")

    try:

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