from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app import database, schemas, crud, auth, models
from app.database import SessionLocal
import os
from dotenv import load_dotenv
from typing import List
import base64


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
router = APIRouter(prefix="/users", tags=["Users"])
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email_or_cod(db, user.identifier)
    if not db_user or not auth.verify_password(user.password, db_user.user_password):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")

    if db_user.user_status != "Habilitado":
        raise HTTPException(status_code=403, detail="Su cuenta está deshabilitada. Contacte al administrador.")
        
    token = auth.create_token({"sub": db_user.user_cod, "role": db_user.user_role})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/create", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="No autorizado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_cod = payload.get("sub")
        if user_cod is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.user_cod == user_cod).first()
    if user is None:
        raise credentials_exception
    return user

# Endpoint protegido
@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.get("/", response_model=List[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    db: Session = Depends(get_db),
):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Validar imagen si viene incluida
    if user_data.user_photo:
        try:
            user_data.user_photo = validate_image_base64(user_data.user_photo)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    # Actualizar campos
    for key, value in user_data.dict().items():
        if value is None:
            continue
        if key == "user_password":
            setattr(user, key, auth.hash_password(value))
        else:
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return {"msg": "Usuario eliminado"}
    
