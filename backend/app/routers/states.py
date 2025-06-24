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

router = APIRouter(prefix="/provincias", tags=["Provincias"])


@router.post("", response_model=schemas.StateOut)
def create_provincia(
    data: schemas.StateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    provincia = models.State(
        id_pais=data.id_pais,
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(provincia)
    db.commit()
    db.refresh(provincia)
    return provincia


@router.get("", response_model=List[schemas.StateOut])
def list_provincias(db: Session = Depends(get_db)):
    return db.query(models.State).all()


@router.get("/{id}", response_model=schemas.StateOut)
def get_provincia(id: int, db: Session = Depends(get_db)):
    prov = db.query(models.State).get(id)
    if not prov:
        raise HTTPException(status_code=404, detail="Provincia no encontrada")
    return prov


@router.put("/{id}", response_model=schemas.StateOut)
def update_provincia(
    id: int,
    data: schemas.StateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    prov = db.query(models.State).get(id)
    if not prov:
        raise HTTPException(status_code=404, detail="Provincia no encontrada")

    prov.id_pais = data.id_pais
    prov.Description = data.Description
    prov.LastDateMod = date.today()
    prov.id_usrs_update = current_user.id

    db.commit()
    db.refresh(prov)
    return prov


@router.delete("/{id}")
def delete_provincia(id: int, db: Session = Depends(get_db)):
    prov = db.query(models.State).get(id)
    if not prov:
        raise HTTPException(status_code=404, detail="Provincia no encontrada")
    db.delete(prov)
    db.commit()
    return {"msg": "Provincia eliminada"}