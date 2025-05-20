from sqlalchemy.orm import Session
from app import models, auth

def get_user_by_email_or_cod(db: Session, identifier: str):
    return db.query(models.User).filter(
        (models.User.user_email == identifier) |
        (models.User.user_cod == identifier)
    ).first()

def create_user(db: Session, user_data):
    hashed_pwd = auth.hash_password(user_data.user_password)
    user = models.User(
        user_name=user_data.user_name,
        last_name=user_data.last_name,
        user_role=user_data.user_role,
        user_cod=user_data.user_cod,
        user_email=user_data.user_email,
        user_password=hashed_pwd
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user