from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(dependencies=[Depends(get_current_user)], prefix="/seguimiento/plantillas-whatsapp", tags=["Plantillas WhatsApp"])



@router.post("/", response_model=schemas.WhatsAppTemplateOut)
def create_template(
    data: schemas.WhatsAppTemplateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.WhatsAppTemplate(
        Name=data.Name,
        Subject=data.Subject,
        Body=data.Body,
        Destination=data.Destination or "C",
        Estado=data.Estado or "A",
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.WhatsAppTemplateOut])
def list_templates(db: Session = Depends(get_db)):
    return db.query(models.WhatsAppTemplate).all()


@router.get("/{id}", response_model=schemas.WhatsAppTemplateOut)
def get_template(id: int, db: Session = Depends(get_db)):
    item = db.query(models.WhatsAppTemplate).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    return item


@router.put("/{id}", response_model=schemas.WhatsAppTemplateOut)
def update_template(
    id: int,
    data: schemas.WhatsAppTemplateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.WhatsAppTemplate).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    item.Name = data.Name
    item.Subject = data.Subject
    item.Body = data.Body
    if data.Destination is not None:
        item.Destination = data.Destination
    if data.Estado is not None:
        item.Estado = data.Estado
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_template(id: int, db: Session = Depends(get_db)):
    item = db.query(models.WhatsAppTemplate).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Plantilla eliminada"}