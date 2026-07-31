from fastapi import FastAPI
from app.core.config import settings
from app.core.lifespan import lifespan
from app.api.router import router

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)


app.include_router(
    router,
    prefix=settings.API_V1_PREFIX
)