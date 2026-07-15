import httpx

http_client: httpx.AsyncClient | None = None


def set_http_client(client: httpx.AsyncClient):
    global http_client
    http_client = client


def get_http_client() -> httpx.AsyncClient:
    if http_client is None:
        raise RuntimeError("HTTP client has not been initialized.")

    return http_client