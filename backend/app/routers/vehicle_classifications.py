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


router = APIRouter(prefix="/clasificaciones-vehiculo", tags=["ClasificacionesVehiculo"])


@router.post("/", response_model=schemas.VehicleClassificationOut)
def create_vehicle_classification(
    data: schemas.VehicleClassificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.VehicleClassification(
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


@router.get("/", response_model=List[schemas.VehicleClassificationOut])
def list_vehicle_classifications(db: Session = Depends(get_db)):
    return db.query(models.VehicleClassification).all()


@router.get("/{id}", response_model=schemas.VehicleClassificationOut)
def get_vehicle_classification(id: int, db: Session = Depends(get_db)):
    item = db.query(models.VehicleClassification).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Clasificación no encontrada")
    return item


@router.put("/{id}", response_model=schemas.VehicleClassificationOut)
def update_vehicle_classification(
    id: int,
    data: schemas.VehicleClassificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.VehicleClassification).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Clasificación no encontrada")

    item.Description = data.Description
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_vehicle_classification(id: int, db: Session = Depends(get_db)):
    item = db.query(models.VehicleClassification).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Clasificación no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Clasificación eliminada"}