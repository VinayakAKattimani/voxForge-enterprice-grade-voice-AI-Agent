from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken

from datetime import datetime

class RefreshTokenRepository:
    def create(self, db: Session, refresh_token: RefreshToken):
        db.add(refresh_token)
        db.commit()
        db.refresh(refresh_token)
        return refresh_token

    def get_by_token(self, db : Session, token : str):
        return db.query(RefreshToken).filter(RefreshToken.token == token).first()


    def revoke(self, db: Session, refresh_token: ReferenceError):
        refresh_token.is_revoked = True
        db.commit()
        db.refresh(refresh_token)
        return refresh_token
        

    def delete_expired(self, db: Session):
        db.query(RefreshToken).filter(
            RefreshToken.expires_at < datatime.utcnow()
        ).delete()

        db.commit()