from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from app.database import SessionLocal
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="hagesa_api")

def geocode_cliente(db: Session, data: schemas.ClientBase):
    parts = []
    if data.id_parroquia:
        p = db.query(models.Parish).get(data.id_parroquia)
        if p:
            parts.append(p.Description)
    if data.id_ciudad:
        c = db.query(models.City).get(data.id_ciudad)
        if c:
            parts.append(c.Description)
    if data.id_provincia:
        s = db.query(models.State).get(data.id_provincia)
        if s:
            parts.append(s.Description)
    if data.id_pais:
        pais = db.query(models.Country).get(data.id_pais)
        if pais:
            parts.append(pais.Description)
    if not parts:
        return None, None
    address = ", ".join(parts)
    try:
        loc = geolocator.geocode(address)
        if loc:
            return loc.latitude, loc.longitude
    except Exception:
        pass
    return None, None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/", response_model=schemas.ClientOut)
def create_cliente(cliente: schemas.ClientCreate, db: Session = Depends(get_db)):
    data = cliente.dict()
    lat, lon = geocode_cliente(db, cliente)
    data["latitud"] = lat
    data["longitud"] = lon
    nuevo = models.Client(**data)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[schemas.ClientOut])
def list_clientes(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

@router.get("/{id}", response_model=schemas.ClientOut)
def get_cliente(id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Client).get(id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.put("/{id}", response_model=schemas.ClientOut)
def update_cliente(id: int, data: schemas.ClientCreate, db: Session = Depends(get_db)):
    cliente = db.query(models.Client).get(id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for key, value in data.dict().items():
        setattr(cliente, key, value)
    lat, lon = geocode_cliente(db, data)
    cliente.latitud = lat
    cliente.longitud = lon
    db.commit()
    db.refresh(cliente)
    return cliente

@router.delete("/{id}")
def delete_cliente(id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Client).get(id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
    return {"msg": "Cliente eliminado"}
