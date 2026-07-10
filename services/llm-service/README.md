# LLM Service

An enterprise-grade **LLM (Large Language Model) microservice** built with **FastAPI** for the **Enterprise Voice AI Platform**. This service acts as the AI orchestration layer responsible for generating responses, managing conversation context, and streaming outputs from Large Language Models.

---

## Features

* RESTful Chat API
* Streaming Chat Responses
* Conversation Memory
* Prompt Builder
* Provider Abstraction Layer
* Factory Pattern for LLM Providers
* Ollama Integration
* Request Validation
* Structured Logging
* Centralized Exception Handling
* Health Check Endpoint
* Model Discovery Endpoint

---

## Tech Stack

* Python 3.12+
* FastAPI
* Pydantic
* HTTPX
* Ollama
* AsyncIO

---

## Project Structure

```text
llm-service
│
├── app
│   ├── api
│   │   └── routes
│   │       ├── chat.py
│   │       ├── health.py
│   │       └── models.py
│   │
│   ├── core
│   │   ├── config.py
│   │   └── logger.py
│   │
│   ├── exceptions
│   │   ├── handlers.py
│   │   └── llm_exception.py
│   │
│   ├── prompts
│   │   ├── prompt_builder.py
│   │   └── system_prompt.py
│   │
│   ├── providers
│   │   ├── base_provider.py
│   │   ├── factory.py
│   │   └── ollama_provider.py
│   │
│   ├── schemas
│   │   ├── chat.py
│   │   └── response.py
│   │
│   ├── services
│   │   ├── conversation_manager.py
│   │   └── llm_service.py
│   │
│   └── main.py
│
├── tests
├── requirements.txt
├── .env
└── README.md
```

---

## Architecture

```text
Client
   │
   ▼
FastAPI Routes
   │
   ▼
LLM Service
   │
   ▼
Prompt Builder
   │
   ▼
Provider Factory
   │
   ▼
Ollama Provider
   │
   ▼
Ollama Server
```

---

## API Endpoints

### Chat

```
POST /api/v1/chat
```

Generates a response from the configured LLM.

---

### Streaming Chat

```
POST /api/v1/chat/stream
```

Streams generated responses token-by-token.

---

### Models

```
GET /api/v1/models
```

Returns the list of available LLM models.

---

### Health Check

```
GET /api/v1/health
```

Returns the service health status.

---

## Request Example

```json
{
  "conversation_id": "demo123",
  "message": "What is Artificial Intelligence?"
}
```

---

## Response Example

```json
{
  "response": "Artificial Intelligence is the simulation of human intelligence by machines."
}
```

---

## Current Capabilities

* Maintains in-memory conversation history
* Supports synchronous and streaming responses
* Uses configurable system prompts
* Validates incoming requests
* Handles provider failures gracefully
* Supports provider abstraction for future LLM integrations

---

## Planned Enhancements

* Redis-based conversation storage
* Multi-provider support (OpenAI, Gemini, Anthropic)
* RAG (Retrieval-Augmented Generation)
* Embedding support
* Function / Tool Calling
* Docker & Docker Compose
* Kubernetes Deployment
* Prometheus Metrics
* CI/CD Pipeline
* Unit & Integration Tests

---

## License

This project is part of the **Enterprise Voice AI Platform** and is intended for learning, experimentation, and demonstrating enterprise backend architecture using Large Language Models.
