from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
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

router = APIRouter(prefix="/parroquias", tags=["Parroquias"])


@router.post("", response_model=schemas.ParishOut)
def create_parroquia(
    data: schemas.ParishCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    parroquia = models.Parish(
        id_ciudad=data.id_ciudad,
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(parroquia)
    db.commit()
    db.refresh(parroquia)
    return parroquia


@router.get("", response_model=List[schemas.ParishOut])
def list_parroquias(db: Session = Depends(get_db)):
    return db.query(models.Parish).all()


@router.get("/{id}", response_model=schemas.ParishOut)
def get_parroquia(id: int, db: Session = Depends(get_db)):
    par = db.query(models.Parish).get(id)
    if not par:
        raise HTTPException(status_code=404, detail="Parroquia no encontrada")
    return par


@router.put("/{id}", response_model=schemas.ParishOut)
def update_parroquia(
    id: int,
    data: schemas.ParishCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    par = db.query(models.Parish).get(id)
    if not par:
        raise HTTPException(status_code=404, detail="Parroquia no encontrada")

    par.id_ciudad = data.id_ciudad
    par.Description = data.Description
    par.LastDateMod = date.today()
    par.id_usrs_update = current_user.id

    db.commit()
    db.refresh(par)
    return par


@router.delete("/{id}")
def delete_parroquia(id: int, db: Session = Depends(get_db)):
    par = db.query(models.Parish).get(id)
    if not par:
        raise HTTPException(status_code=404, detail="Parroquia no encontrada")
    db.delete(par)
    db.commit()
    return {"msg": "Parroquia eliminada"}