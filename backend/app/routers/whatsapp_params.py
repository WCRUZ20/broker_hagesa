from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/seguimiento/parametros-whatsapp", tags=["Parametros WhatsApp"])


@router.post("/", response_model=schemas.WhatsAppParamOut)
def create_param(
    data: schemas.WhatsAppParamCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.WhatsAppSendingParam(
        manualsending=data.manualsending,
        daystodue=data.daystodue,
        daystodueSeller=data.daystodueSeller,
        monday=data.monday,
        tuesday=data.tuesday,
        wednesday=data.wednesday,
        thursday=data.thursday,
        friday=data.friday,
        saturday=data.saturday,
        sunday=data.sunday,
        hoursending=data.hoursending,
        maxdaysallow=data.maxdaysallow,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.WhatsAppParamOut])
def list_params(db: Session = Depends(get_db)):
    return db.query(models.WhatsAppSendingParam).all()


@router.get("/{id}", response_model=schemas.WhatsAppParamOut)
def get_param(id: int, db: Session = Depends(get_db)):
    item = db.query(models.WhatsAppSendingParam).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    return item


@router.put("/{id}", response_model=schemas.WhatsAppParamOut)
def update_param(
    id: int,
    data: schemas.WhatsAppParamCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.WhatsAppSendingParam).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    item.manualsending = data.manualsending
    item.daystodue = data.daystodue
    item.daystodueSeller = data.daystodueSeller
    item.monday = data.monday
    item.tuesday = data.tuesday
    item.wednesday = data.wednesday
    item.thursday = data.thursday
    item.friday = data.friday
    item.saturday = data.saturday
    item.sunday = data.sunday
    item.hoursending = data.hoursending
    item.maxdaysallow = data.maxdaysallow
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_param(id: int, db: Session = Depends(get_db)):
    item = db.query(models.WhatsAppSendingParam).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Parámetro no encontrado")
    db.delete(item)
    db.commit()
    return {"msg": "Parámetro eliminado"}