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


router = APIRouter(prefix="/vehiculos", tags=["Vehiculos"])


@router.post("/", response_model=schemas.VehicleOut)
def create_vehicle(
    data: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = models.Vehicle(
        id_itm_type=data.id_itm_type,
        Brand=data.Brand,
        Model=data.Model,
        YearItem=data.YearItem,
        Clasification=data.Clasification,
        Plate=data.Plate,
        Motor=data.Motor,
        Chassis=data.Chassis,
        Color=data.Color,
        OriCountry=data.OriCountry,
        Propetary=data.Propetary,
        id_use_item=data.id_use_item,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("/", response_model=List[schemas.VehicleOut])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(models.Vehicle).all()


@router.get("/{id}", response_model=schemas.VehicleOut)
def get_vehicle(id: int, db: Session = Depends(get_db)):
    vehicle = db.query(models.Vehicle).get(id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return vehicle


@router.put("/{id}", response_model=schemas.VehicleOut)
def update_vehicle(
    id: int,
    data: schemas.VehicleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    vehicle = db.query(models.Vehicle).get(id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")

    vehicle.id_itm_type = data.id_itm_type
    vehicle.Brand = data.Brand
    vehicle.Model = data.Model
    vehicle.YearItem = data.YearItem
    vehicle.Clasification = data.Clasification
    vehicle.Plate = data.Plate
    vehicle.Motor = data.Motor
    vehicle.Chassis = data.Chassis
    vehicle.Color = data.Color
    vehicle.OriCountry = data.OriCountry
    vehicle.Propetary = data.Propetary
    vehicle.id_use_item = data.id_use_item
    vehicle.LastDateMod = date.today()
    vehicle.id_usrs_update = current_user.id

    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{id}")
def delete_vehicle(id: int, db: Session = Depends(get_db)):
    vehicle = db.query(models.Vehicle).get(id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    db.delete(vehicle)
    db.commit()
    return {"msg": "Vehículo eliminado"}