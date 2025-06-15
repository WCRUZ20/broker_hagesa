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


router = APIRouter(prefix="/tipos-vehiculo", tags=["TiposVehiculo"])


@router.post("/", response_model=schemas.VehicleTypeOut)
def create_vehicle_type(
    data: schemas.VehicleTypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.VehicleType(
        Description=data.Description,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.VehicleTypeOut])
def list_vehicle_types(db: Session = Depends(get_db)):
    return db.query(models.VehicleType).all()


@router.get("/{id}", response_model=schemas.VehicleTypeOut)
def get_vehicle_type(id: int, db: Session = Depends(get_db)):
    item = db.query(models.VehicleType).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    return item


@router.put("/{id}", response_model=schemas.VehicleTypeOut)
def update_vehicle_type(
    id: int,
    data: schemas.VehicleTypeCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.VehicleType).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")

    item.Description = data.Description
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_vehicle_type(id: int, db: Session = Depends(get_db)):
    item = db.query(models.VehicleType).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Tipo no encontrado")
    db.delete(item)
    db.commit()
    return {"msg": "Tipo eliminado"}