PUBLIC_ROUTES = {
    # Auth public APIs
    ("POST", "/api/v1/auth/login"),
    ("POST", "/api/v1/auth/register"),
    ("POST", "/api/v1/auth/refresh"),

    # Health
    ("GET", "/health"),

    # Swagger/OpenAPI
    ("GET", "/docs"),
    ("GET", "/openapi.json"),
    ("GET", "/redoc"),
    ("GET", "/favicon.ico"),
}