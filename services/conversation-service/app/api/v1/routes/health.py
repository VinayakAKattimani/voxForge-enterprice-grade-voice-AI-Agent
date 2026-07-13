from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import get_db


router = APIRouter()


@router.get("/health")
async def health_check(
    db: Session = Depends(get_db),
):
    try:
        db.execute(text("SELECT 1"))

        return {
            "service": "conversation-service",
            "status": "healthy",
            "database": "connected",
        }

    except Exception:
        return {
            "service": "conversation-service",
            "status": "unhealthy",
            "database": "disconnected",
        }