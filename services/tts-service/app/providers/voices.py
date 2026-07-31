VOICES = [
    {
        "id": "af_heart",
        "language": "en",
        "gender": "female",
        "description": "American female voice"
    },
    {
        "id": "af_bella",
        "language": "en",
        "gender": "female",
        "description": "American female voice"
    },
    {
        "id": "am_adam",
        "language": "en",
        "gender": "male",
        "description": "American male voice"
    },
    {
        "id": "am_michael",
        "language": "en",
        "gender": "male",
        "description": "American male voice"
    }
]

def voice_exists(voice_id: str) -> bool:
    return any(
        voice["id"] == voice_id
        for voice in VOICES
    )