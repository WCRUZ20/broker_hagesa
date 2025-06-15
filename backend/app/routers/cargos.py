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


router = APIRouter(prefix="/cargos", tags=["Cargos"])


@router.post("/", response_model=schemas.CargoOut)
def create_cargo(
    data: schemas.CargoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cargo = models.Cargo(
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(cargo)
    db.commit()
    db.refresh(cargo)
    return cargo


@router.get("/", response_model=List[schemas.CargoOut])
def list_cargos(db: Session = Depends(get_db)):
    return db.query(models.Cargo).all()


@router.get("/{id}", response_model=schemas.CargoOut)
def get_cargo(id: int, db: Session = Depends(get_db)):
    cargo = db.query(models.Cargo).get(id)
    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo no encontrado")
    return cargo


@router.put("/{id}", response_model=schemas.CargoOut)
def update_cargo(
    id: int,
    data: schemas.CargoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cargo = db.query(models.Cargo).get(id)
    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo no encontrado")

    cargo.Description = data.Description
    cargo.LastDateMod = date.today()
    cargo.id_usrs_update = current_user.id

    db.commit()
    db.refresh(cargo)
    return cargo


@router.delete("/{id}")
def delete_cargo(id: int, db: Session = Depends(get_db)):
    cargo = db.query(models.Cargo).get(id)
    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo no encontrado")
    db.delete(cargo)
    db.commit()
    return {"msg": "Cargo eliminado"}