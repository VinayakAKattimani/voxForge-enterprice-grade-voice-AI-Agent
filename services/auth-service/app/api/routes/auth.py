from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

auth_service = AuthService()


@router.post("/register")
def register(request: RegisterRequest, db : Session = Depends(get_db)):
    return auth_service.register(
        db = db,
        request=request
    )

@router.post("/login")
def login(request: LoginRequest, db: Session=Depends(get_db)):
    return auth_service.login(
        db=db,
        request=request
    )