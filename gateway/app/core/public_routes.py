PUBLIC_ROUTES = {
    # Auth public APIs
    ("POST", "/api/v1/auth/login"),
    ("POST", "/api/v1/auth/register"),
    ("POST", "/api/v1/auth/refresh"),
    ("POST", "/api/v1/auth/logout"),

    # Gateway Health
    ("GET", "/health"),

    # STT/TTS Health
    ("GET", "/api/v1/stt/health"),
    ("GET", "/api/v1/tts/health"),

    # Swagger/OpenAPI
    ("GET", "/docs"),
    ("GET", "/openapi.json"),
    ("GET", "/redoc"),
    ("GET", "/favicon.ico"),
}