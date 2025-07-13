from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
import pywhatkit


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/seguimiento/parametrizaciones-whatsapp", tags=["Parametrizaciones WhatsApp"])


@router.post("/", response_model=schemas.WhatsAppConfigOut)
def create_whatsapp_config(
    data: schemas.WhatsAppConfigCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.WhatsAppConfig(
        ACCOUNT_SID=data.ACCOUNT_SID,
        AUTH_TOKEN=data.AUTH_TOKEN,
        FROM_NUMBER=data.FROM_NUMBER,
        API_WS=data.API_WS,
        LIB_PY=data.LIB_PY,
        Estado=data.Estado or "D",
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.WhatsAppConfigOut])
def list_whatsapp_configs(db: Session = Depends(get_db)):
    return db.query(models.WhatsAppConfig).all()


@router.get("/{id}", response_model=schemas.WhatsAppConfigOut)
def get_whatsapp_config(id: int, db: Session = Depends(get_db)):
    item = db.query(models.WhatsAppConfig).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    return item


@router.put("/{id}", response_model=schemas.WhatsAppConfigOut)
def update_whatsapp_config(
    id: int,
    data: schemas.WhatsAppConfigCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.WhatsAppConfig).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    item.ACCOUNT_SID = data.ACCOUNT_SID
    item.AUTH_TOKEN = data.AUTH_TOKEN
    item.FROM_NUMBER = data.FROM_NUMBER
    item.API_WS = data.API_WS
    item.LIB_PY = data.LIB_PY
    if data.Estado is not None:
        item.Estado = data.Estado
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_whatsapp_config(id: int, db: Session = Depends(get_db)):
    item = db.query(models.WhatsAppConfig).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Configuración eliminada"}

@router.post("/{id}/test")
def send_test_whatsapp(
    id: int,
    to: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cfg = db.query(models.WhatsAppConfig).get(id)
    if not cfg:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")

    if cfg.API_WS == "Y":
        raise HTTPException(status_code=400, detail="Envíos vía API aún no implementados")

    if cfg.LIB_PY != "Y":
        raise HTTPException(status_code=400, detail="Configuración no usa Pywhatkit")

    try:
        pywhatkit.sendwhatmsg_instantly(to, "Mensaje de prueba de HAGESA", wait_time=10, tab_close=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"msg": "Mensaje enviado"}