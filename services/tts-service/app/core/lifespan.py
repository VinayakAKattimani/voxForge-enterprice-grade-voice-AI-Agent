from contextlib import asynccontextmanager

from app.core.logging import logger
from app.dependencies.providers import get_tts_provider


@asynccontextmanager
async def lifespan(app):

    logger.info("Starting TTS service")

    provider = get_tts_provider()

    await provider.load()

    logger.info("TTS provider initialized")

    yield

    logger.info("Stopping TTS service")