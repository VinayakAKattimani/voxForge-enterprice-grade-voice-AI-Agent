# LLM Service

## Features

- Chat API
- Streaming API
- Conversation Memory
- Ollama Integration

## Setup

pip install -r requirements.txt

## Run

uvicorn app.main:app --reload

## Endpoints

POST /api/v1/chat

POST /api/v1/chat/stream

GET /api/v1/models

GET /api/v1/health