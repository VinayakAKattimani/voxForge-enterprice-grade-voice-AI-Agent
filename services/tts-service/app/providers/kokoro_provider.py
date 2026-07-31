import numpy as np

from fastapi import HTTPException
from kokoro import KPipeline

from app.core.config import settings
from app.providers.base import BaseTTSProvider
from app.providers.voices import VOICES, voice_exists
from app.storage.audio import save_audio
from app.core.logging import logger


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
        if not voice_exists(voice):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported voice: {voice}"
            )
        

        if self.pipeline is None:
            raise HTTPException(
                status_code=503,
                detail="TTS model is not loaded."
            )

        try:
            generator = self.pipeline(
                text,
                voice=voice
            )


            audio_path = None


            audio_chunks = []
            logger.info("Generating audio")
            for _, _, audio in generator:

                audio_chunks.append(
                    audio.numpy()
                )
            logger.info("Generated %d audio chunks", len(audio_chunks))

            if not audio_chunks:
                raise HTTPException(
                    status_code=500,
                    detail="No audio generated."
                )
            
            final_audio = np.concatenate(
                audio_chunks
            )


            audio_path = save_audio(
                final_audio
            )

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Speech generation failed: {str(e)}"
            )


        return {
            "message": "Speech generated successfully",
            "audio_path": audio_path,
            "voice": voice,
            "language": language
        }


    async def get_voices(self):

        return VOICES

    def is_ready(self) -> bool:
        return self.pipeline is not None