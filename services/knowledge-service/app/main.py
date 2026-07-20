from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI
from app.kafka.consumer import start_consumer
from app.api.routers import api_router
from app.core.config import settings
from app.kafka.producer import (
    start_producer,
    stop_producer,
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    await start_producer()

    consumer_task = asyncio.create_task(
        start_consumer()
    )

    yield

    consumer_task.cancel()

    await stop_producer()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

app.include_router(
    api_router,
    prefix=settings.API_V1_STR,
)