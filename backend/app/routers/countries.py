from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from app.database import SessionLocal


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/paises", tags=["Países"])


@router.post("", response_model=schemas.CountryOut)
def create_pais(data: schemas.CountryCreate, db: Session = Depends(get_db)):
    pais = models.Country(**data.dict())
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
def update_pais(id: int, data: schemas.CountryCreate, db: Session = Depends(get_db)):
    pais = db.query(models.Country).get(id)
    if not pais:
        raise HTTPException(status_code=404, detail="País no encontrado")
    for k, v in data.dict().items():
        setattr(pais, k, v)
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