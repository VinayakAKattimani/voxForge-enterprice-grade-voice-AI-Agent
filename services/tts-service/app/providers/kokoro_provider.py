import soundfile as sf
import torch

from kokoro import KPipeline
import numpy as np
from app.core.config import settings
from app.providers.base import BaseTTSProvider
from app.storage.audio import save_audio
from app.providers.voices import VOICES

class KokoroProvider(BaseTTSProvider):

    def __init__(self):
        self.device = settings.KOKORO_DEVICE
        self.pipeline = None


    async def load(self):
        """
        Load Kokoro model once during startup.
        """

        self.pipeline = KPipeline(
            lang_code="a"
        )

        print("Kokoro pipeline loaded")


    async def synthesize(
        self,
        text: str,
        voice: str,
        language: str,
    ):
        

        if self.pipeline is None:
            raise RuntimeError(
                "Kokoro model not loaded"
            )


        generator = self.pipeline(
            text,
            voice=voice
        )


        audio_path = None


        audio_chunks = []
        print("Generating audio...")
        for _, _, audio in generator:

            audio_chunks.append(
                audio.numpy()
            )
        print("Chunks generated:", len(audio_chunks))


        final_audio = np.concatenate(
            audio_chunks
        )


        audio_path = save_audio(
            final_audio
        )


        return {
            "message": "Speech generated successfully",
            "audio_path": audio_path,
            "voice": voice,
            "language": language
        }


    async def get_voices(self):

        return VOICES