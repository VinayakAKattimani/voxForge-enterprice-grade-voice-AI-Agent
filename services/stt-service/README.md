# STT Service

An enterprise-grade **Speech-to-Text (STT) microservice** built with **FastAPI** for the **Enterprise Voice AI Platform**. This service is responsible for converting speech from audio streams or uploaded files into text using modern automatic speech recognition (ASR) models. It supports both real-time and batch transcription and is designed to integrate seamlessly with the platform's API Gateway and downstream AI services.

---

# Features

* RESTful APIs built with FastAPI
* High-performance speech recognition using Faster-Whisper
* Support for batch audio transcription
* Real-time streaming transcription (WebSocket)
* Multi-language speech recognition
* Automatic language detection
* Word and segment timestamps
* Confidence scores
* Voice Activity Detection (VAD)
* Audio file validation
* Background transcription jobs
* OpenAPI/Swagger documentation
* Health check endpoints
* Structured logging
* Dockerized deployment
* Enterprise-ready modular architecture

---

# Project Structure

```text
stt-service/
│
├── app/
│   ├── api/                  # API endpoints
│   ├── core/                 # Configuration and application settings
│   ├── db/                   # Database configuration
│   ├── models/               # SQLAlchemy models
│   ├── repositories/         # Database operations
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Business logic and transcription engine
│   ├── middleware/           # Custom middleware
│   ├── dependencies/         # Dependency injection
│   ├── workers/              # Background jobs
│   ├── utils/                # Helper utilities
│   └── main.py               # Application entry point
│
├── alembic/                  # Database migrations
├── storage/
│   ├── uploads/              # Uploaded audio files
│   └── transcripts/          # Generated transcript files
│
├── tests/                    # Unit and integration tests
├── docker/                   # Docker-related configuration
├── scripts/                  # Utility scripts
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

# Responsibilities

The STT Service is responsible for:

* Accepting audio files from clients or internal services.
* Validating supported audio formats.
* Performing speech-to-text transcription.
* Detecting spoken language.
* Generating timestamps for transcript segments.
* Returning structured transcription results.
* Providing streaming transcription for real-time conversations.
* Exposing health and readiness endpoints.

---

# Supported Audio Formats

* WAV
* MP3
* FLAC
* OGG
* M4A
* WEBM

---

# Technology Stack

| Component        | Technology                                 |
| ---------------- | ------------------------------------------ |
| Framework        | FastAPI                                    |
| Language         | Python 3.11+                               |
| ASR Engine       | Faster-Whisper                             |
| Runtime          | CTranslate2                                |
| Database         | PostgreSQL                                 |
| ORM              | SQLAlchemy                                 |
| Migrations       | Alembic                                    |
| Validation       | Pydantic v2                                |
| Server           | Uvicorn                                    |
| Background Tasks | FastAPI BackgroundTasks (future Celery/RQ) |
| Authentication   | JWT (via API Gateway)                      |
| Containerization | Docker                                     |

---

# Planned API Endpoints

## Health

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Service health check |
| GET    | `/ready`  | Readiness check      |

---

## Speech-to-Text

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| POST   | `/transcribe`          | Transcribe uploaded audio             |
| POST   | `/transcribe/async`    | Submit asynchronous transcription job |
| GET    | `/transcribe/{job_id}` | Retrieve transcription status/result  |

---

## Streaming

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| WS     | `/ws/transcribe` | Real-time speech-to-text over WebSocket |

---

# Request Flow

```text
Client
   │
   ▼
API Gateway
   │
   ▼
STT Service
   │
   ├── Validate Audio
   ├── Store Audio
   ├── Speech Recognition
   ├── Generate Transcript
   └── Return JSON Response
```

---

# Integration with Enterprise Voice AI Platform

The STT Service integrates with the following platform components:

* API Gateway
* Authentication Service
* Conversation Service
* LLM Service
* Knowledge Service
* Future TTS Service
* Future Analytics Service
* Future Notification Service

---

# Future Enhancements

* Speaker diarization
* Custom vocabulary support
* Wake-word detection
* Speaker identification
* GPU inference optimization
* Model selection per request
* Batch transcription queue
* Object storage integration (MinIO/S3)
* Redis caching
* Celery-based distributed workers
* Prometheus metrics
* OpenTelemetry tracing
* Kubernetes deployment support

---

# Development

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
uvicorn app.main:app --reload
```

---

# License

This project is part of the **Enterprise Voice AI Platform** and is intended for educational, research, and enterprise application development.
