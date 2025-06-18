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


router = APIRouter(prefix="/seguimiento/plantillas-mail", tags=["Plantillas Mail"])


@router.post("/", response_model=schemas.MailTemplateOut)
def create_template(
    data: schemas.MailTemplateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.MailTemplate(
        Name=data.Name,
        Subject=data.Subject,
        Body=data.Body,
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


@router.get("/", response_model=List[schemas.MailTemplateOut])
def list_templates(db: Session = Depends(get_db)):
    return db.query(models.MailTemplate).all()


@router.get("/{id}", response_model=schemas.MailTemplateOut)
def get_template(id: int, db: Session = Depends(get_db)):
    item = db.query(models.MailTemplate).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    return item


@router.put("/{id}", response_model=schemas.MailTemplateOut)
def update_template(
    id: int,
    data: schemas.MailTemplateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.MailTemplate).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    item.Name = data.Name
    item.Subject = data.Subject
    item.Body = data.Body
    if data.Estado is not None:
        item.Estado = data.Estado
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_template(id: int, db: Session = Depends(get_db)):
    item = db.query(models.MailTemplate).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Plantilla no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Plantilla eliminada"}