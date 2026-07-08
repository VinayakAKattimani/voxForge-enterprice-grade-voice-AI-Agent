from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies.db import get_db
from app.schemas.auth_schema import (LoginRequest, RegisterRequest, RefreshTokenRequest, RegisterResponse, TokenResponse, LogoutResponse)
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

auth_service = AuthService()


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(request: RegisterRequest, db : Session = Depends(get_db)):
    return auth_service.register(
        db = db,
        request=request
    )

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session=Depends(get_db)):
    return auth_service.login(
        db=db,
        request=request
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh(request:RefreshTokenRequest, db:Session = Depends(get_db)):
    return auth_service.refresh(
        db=db,
        request=request
    )

@router.post("/logout", response_model=LogoutResponse)
def logout(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    return auth_service.logout(db=db, request=request)