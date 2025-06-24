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

router = APIRouter(prefix="/ciudades", tags=["Ciudades"])


@router.post("", response_model=schemas.CityOut)
def create_ciudad(
    data: schemas.CityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    ciudad = models.City(
        id_provincia=data.id_provincia,
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(ciudad)
    db.commit()
    db.refresh(ciudad)
    return ciudad


@router.get("", response_model=List[schemas.CityOut])
def list_ciudades(db: Session = Depends(get_db)):
    return db.query(models.City).all()


@router.get("/{id}", response_model=schemas.CityOut)
def get_ciudad(id: int, db: Session = Depends(get_db)):
    city = db.query(models.City).get(id)
    if not city:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    return city


@router.put("/{id}", response_model=schemas.CityOut)
def update_ciudad(
    id: int,
    data: schemas.CityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    city = db.query(models.City).get(id)
    if not city:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")

    city.id_provincia = data.id_provincia
    city.Description = data.Description
    city.LastDateMod = date.today()
    city.id_usrs_update = current_user.id

    db.commit()
    db.refresh(city)
    return city


@router.delete("/{id}")
def delete_ciudad(id: int, db: Session = Depends(get_db)):
    city = db.query(models.City).get(id)
    if not city:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    db.delete(city)
    db.commit()
    return {"msg": "Ciudad eliminada"}