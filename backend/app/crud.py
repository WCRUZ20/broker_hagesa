from sqlalchemy.orm import Session
from app import models, auth
import base64

def validate_image_base64(base64_data):
    try:
        header, encoded = base64_data.split(",", 1)
        data = base64.b64decode(encoded)

        # Validar tamaño máximo (500 KB)
        if len(data) > 500 * 1024:
            raise ValueError("La imagen excede los 500 KB.")

        # Validar tipo
        if not (header.startswith("data:image/jpeg") or header.startswith("data:image/png")):
            raise ValueError("Tipo de imagen no permitido.")

        return base64_data
    except Exception:
        raise ValueError("Imagen inválida.")

def get_user_by_email_or_cod(db: Session, identifier: str):
    return db.query(models.User).filter(
        (models.User.user_email == identifier) |
        (models.User.user_cod == identifier)
    ).first()

def create_user(db: Session, user_data):
    photo = user_data.user_photo
    if photo:
        try:
            photo = validate_image_base64(photo)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    hashed_pwd = auth.hash_password(user_data.user_password)
    user = models.User(
        user_name=user_data.user_name,
        last_name=user_data.last_name,
        user_role=user_data.user_role,
        user_cod=user_data.user_cod,
        user_email=user_data.user_email,
        user_password=hashed_pwd,
        user_photo=getattr(user_data, "user_photo", None),
        user_position=getattr(user_data, "user_position", None),
        user_status=getattr(user_data, "user_status", "Habilitado")
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
