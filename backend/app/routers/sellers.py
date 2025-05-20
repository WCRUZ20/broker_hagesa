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

router = APIRouter(prefix="/vendedores", tags=["Vendedores"])

@router.post("/", response_model=schemas.SellerOut)
def crear_vendedor(data: schemas.SellerCreate, db: Session = Depends(get_db)):
    vendedor = models.Seller(**data.dict())
    db.add(vendedor)
    db.commit()
    db.refresh(vendedor)
    return vendedor

@router.get("/", response_model=List[schemas.SellerOut])
def listar_vendedores(db: Session = Depends(get_db)):
    return db.query(models.Seller).all()

@router.get("/{id}", response_model=schemas.SellerOut)
def obtener_vendedor(id: int, db: Session = Depends(get_db)):
    vendedor = db.query(models.Seller).get(id)
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor no encontrado")
    return vendedor

@router.put("/{id}", response_model=schemas.SellerOut)
def actualizar_vendedor(id: int, data: schemas.SellerCreate, db: Session = Depends(get_db)):
    vendedor = db.query(models.Seller).get(id)
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor no encontrado")
    for k, v in data.dict().items():
        setattr(vendedor, k, v)
    db.commit()
    db.refresh(vendedor)
    return vendedor

@router.delete("/{id}")
def eliminar_vendedor(id: int, db: Session = Depends(get_db)):
    vendedor = db.query(models.Seller).get(id)
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor no encontrado")
    db.delete(vendedor)
    db.commit()
    return {"msg": "Vendedor eliminado"}
