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


router = APIRouter(prefix="/marcas", tags=["Marcas"])


@router.post("/", response_model=schemas.BrandOut)
def create_brand(
    data: schemas.BrandCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    brand = models.Brand(
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


@router.get("/", response_model=List[schemas.BrandOut])
def list_brands(db: Session = Depends(get_db)):
    return db.query(models.Brand).all()


@router.get("/{id}", response_model=schemas.BrandOut)
def get_brand(id: int, db: Session = Depends(get_db)):
    brand = db.query(models.Brand).get(id)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    return brand


@router.put("/{id}", response_model=schemas.BrandOut)
def update_brand(
    id: int,
    data: schemas.BrandCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    brand = db.query(models.Brand).get(id)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca no encontrada")

    brand.Description = data.Description
    brand.LastDateMod = date.today()
    brand.id_usrs_update = current_user.id

    db.commit()
    db.refresh(brand)
    return brand


@router.delete("/{id}")
def delete_brand(id: int, db: Session = Depends(get_db)):
    brand = db.query(models.Brand).get(id)
    if not brand:
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    db.delete(brand)
    db.commit()
    return {"msg": "Marca eliminada"}