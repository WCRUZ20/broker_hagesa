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


router = APIRouter(prefix="/paises", tags=["Países"])


@router.post("", response_model=schemas.CountryOut)
def create_pais(
    data: schemas.CountryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pais = models.Country(
        id=data.id,
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(pais)
    db.commit()
    db.refresh(pais)
    return pais


@router.get("", response_model=List[schemas.CountryOut])
def list_paises(db: Session = Depends(get_db)):
    return db.query(models.Country).all()


@router.get("/{id}", response_model=schemas.CountryOut)
def get_pais(id: int, db: Session = Depends(get_db)):
    pais = db.query(models.Country).get(id)
    if not pais:
        raise HTTPException(status_code=404, detail="País no encontrado")
    return pais


@router.put("/{id}", response_model=schemas.CountryOut)
def update_pais(
    id: int,
    data: schemas.CountryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    pais = db.query(models.Country).get(id)
    if not pais:
        raise HTTPException(status_code=404, detail="País no encontrado")

    pais.Description = data.Description
    pais.LastDateMod = date.today()
    pais.id_usrs_update = current_user.id

    db.commit()
    db.refresh(pais)
    return pais


@router.delete("/{id}")
def delete_pais(id: int, db: Session = Depends(get_db)):
    pais = db.query(models.Country).get(id)
    if not pais:
        raise HTTPException(status_code=404, detail="País no encontrado")
    db.delete(pais)
    db.commit()
    return {"msg": "País eliminado"}
