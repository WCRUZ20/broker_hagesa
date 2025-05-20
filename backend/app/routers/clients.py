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

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/", response_model=schemas.ClientOut)
def create_cliente(cliente: schemas.ClientCreate, db: Session = Depends(get_db)):
    nuevo = models.Client(**cliente.dict())
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
