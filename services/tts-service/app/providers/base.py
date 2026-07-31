from abc import ABC, abstractmethod


class BaseTTSProvider(ABC):

    @abstractmethod
    async def synthesize(
        self,
        text: str,
        voice: str,
        language: str,
    ):
        """
        Convert text into speech.
        """
        pass


    @abstractmethod
    async def get_voices(self):
        """
        Return available voices.
        """
        pass