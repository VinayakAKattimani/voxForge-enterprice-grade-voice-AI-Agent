# TTS Service

A production-ready Text-to-Speech (TTS) microservice for the Enterprise Voice AI Platform.

The service converts text into high-quality speech using a pluggable provider architecture, allowing seamless integration with local and cloud TTS engines.

---

## Features

* Text-to-Speech synthesis
* Streaming audio generation
* Multiple TTS provider support
* Voice selection
* Language selection
* Configurable speech rate
* Audio format support
* REST API
* Health monitoring
* Docker support
* Enterprise-ready architecture

---

## Tech Stack

* Python 3.10+
* FastAPI
* Uvicorn
* Pydantic
* Docker

Supported providers can include:

* Kokoro (Local)
* Edge TTS
* OpenAI TTS
* ElevenLabs

---

## Project Structure

```text
tts-service/
├── app/
│   ├── api/
│   │   └── routes/
│   ├── core/
│   ├── dependencies/
│   ├── providers/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   └── main.py
├── tests/
├── Dockerfile
├── requirements.txt
├── .env
└── README.md
```

---

## API Endpoints

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| POST   | `/api/v1/tts/synthesize` | Generate speech from text |
| POST   | `/api/v1/tts/stream`     | Stream synthesized speech |
| GET    | `/api/v1/tts/voices`     | List available voices     |
| GET    | `/api/v1/tts/languages`  | List supported languages  |
| GET    | `/health`                | Health check              |

---

## Running Locally

### Create a Virtual Environment

```bash
python -m venv .venv
```

### Activate the Environment

Windows

```bash
.venv\Scripts\activate
```

Linux/macOS

```bash
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
APP_NAME=TTS Service
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8006

TTS_PROVIDER=kokoro
```

### Start the Service

```bash
uvicorn app.main:app --reload
```

---

## Docker

Build the image:

```bash
docker build -t tts-service .
```

Run the container:

```bash
docker run -p 8006:8006 tts-service
```

---

## Development Roadmap

* Project setup
* Configuration management
* Provider abstraction
* Kokoro integration
* Speech synthesis
* Audio streaming
* Voice management
* Multi-provider support
* Dockerization
* Gateway integration
* Testing
* Production optimizations

---

## License

This project is part of the Enterprise Voice AI Platform.
