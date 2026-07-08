from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import (RegisterRequest, LoginRequest, RefreshTokenRequest, RegisterResponse, TokenResponse, LogoutResponse)
from app.models.user import User
from app.repositories.role_repository import RoleRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.core.security import (hash_password,verify_password, create_access_token, create_refresh_token)
from datetime import datetime, timedelta, timezone
from app.models.refresh_token import RefreshToken
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class AuthService:

    def __init__(self):
        self.user_repository = UserRepository()
        self.role_repository = RoleRepository()
        self.refresh_token_repository = RefreshTokenRepository()

    def _create_and_store_refresh_token(self, db: Session, user_id: UUID) -> str:
        """Create, store, and return a new refresh token."""

        refresh_token = create_refresh_token(
            data={
                "sub": str(user_id)
            }
        )

        refresh_token_entity = RefreshToken(
            user_id=user_id,
            token=refresh_token,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )

        self.refresh_token_repository.create(
            db=db,
            refresh_token=refresh_token_entity
        )

        return refresh_token
    
    def register(self, db: Session,request: RegisterRequest):
        
        """Register a new user with the default USER role."""


        existing_user = self.user_repository.get_by_email(
            db=db,
            email=request.email
        )

        if existing_user: 
            raise HTTPException(status_code = 409, detail = "Email already registered")
        

        hashed_password = hash_password(request.password)


        user_role = self.role_repository.get_by_name(db, "USER") 

        if not user_role:
            raise HTTPException(status_code=500, detail="Default USER role not found.")

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            password_hash=hashed_password,
            role_id=user_role.id
        )

        created_user = self.user_repository.create(
            db=db,
            user=user
        )

        logger.info(
            "User registered successfully: %s",
            created_user.email
        )
        
        return RegisterResponse(
            message="User registered successfully",
            user_id=created_user.id,
            email=created_user.email
        )
    
    

    def login(self, db: Session,request: LoginRequest):
        """Authenticate a user and return access and refresh tokens."""
        user = self.user_repository.get_by_email(
        db=db,
        email=request.email
        )

        if not user:
            logger.warning(
                "Failed login attempt for email: %s",
                request.email
            )
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(request.password, user.password_hash):
            logger.warning(
                "Failed login attempt for email: %s",
                request.email
            )
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email
            }
        )

        refresh_token = self._create_and_store_refresh_token(
            db=db,
            user_id=user.id
        )

        logger.info(
            "User logged in successfully: %s",
            user.email
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    

    def refresh(self, db: Session, request: RefreshTokenRequest):
        """Validate a refresh token and issue a new token pair."""

        stored_token = self.refresh_token_repository.get_by_token(
            db=db,
            token=request.refresh_token
        )

        if not stored_token:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        if stored_token.is_revoked:
            raise HTTPException(
                status_code=401,
                detail="Refresh token revoked"
            )

        if stored_token.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=401,
                detail="Refresh token expired"
        )

   
        self.refresh_token_repository.revoke(
            db=db,
            refresh_token=stored_token
        )

        new_access_token = create_access_token(
            data={
                "sub": str(stored_token.user_id)
            }
        )

        logger.info(
            "Refresh token rotated for user: %s",
            stored_token.user_id
        )

        new_refresh_token = self._create_and_store_refresh_token(
            db=db,
            user_id=stored_token.user_id
        )

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )

    def logout(self, db: Session,request: RefreshTokenRequest):
        """Revoke the provided refresh token and log the user out."""
        stored_token = self.refresh_token_repository.get_by_token(
            db=db,
            token=request.refresh_token
        )

        if not stored_token:
            raise HTTPException(
            status_code=404,
            detail="Refresh token not found"
            )
        
        self.refresh_token_repository.revoke(
            db=db,
            refresh_token=stored_token
        )

        logger.info(
            "User logged out: %s",
             stored_token.user_id
        )
        
        return LogoutResponse(
            message="Logged out successfully"
        )

    def get_current_user(self, db: Session,request: RegisterRequest):
        """Return the currently authenticated user."""
        pass