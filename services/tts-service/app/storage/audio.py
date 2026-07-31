import os
import uuid

import soundfile as sf

from app.core.config import settings


def save_audio(
    audio_data,
    sample_rate: int = 24000,
) -> str:

    os.makedirs(
        settings.AUDIO_DIR,
        exist_ok=True
    )

    filename = f"{uuid.uuid4()}.wav"

    file_path = os.path.join(
        settings.AUDIO_DIR,
        filename
    )

    sf.write(
        file_path,
        audio_data,
        sample_rate
    )

    return file_path