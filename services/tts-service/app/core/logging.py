import logging
import os

from app.core.config import settings


os.makedirs(
    settings.LOG_DIR,
    exist_ok=True
)


log_file = os.path.join(
    settings.LOG_DIR,
    settings.LOG_FILE
)


logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(log_file),
    ],
)


logger = logging.getLogger("tts-service")