from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models
from app.schemas import CompanyBase, CompanyOut
from app.database import SessionLocal
from app.crud import validate_image_base64

router = APIRouter(prefix="/company", tags=["Company"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=CompanyOut)
def create_company(data: CompanyBase, db: Session = Depends(get_db)):
    if data.CompanyLogo:
        try:
            data.CompanyLogo = validate_image_base64(data.CompanyLogo)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    comp = models.Company(**data.dict())
    db.add(comp)
    db.commit()
    db.refresh(comp)
    return comp


@router.get("/", response_model=List[CompanyOut])
def list_companies(db: Session = Depends(get_db)):
    return db.query(models.Company).all()


@router.get("/{id}", response_model=CompanyOut)
def get_company(id: str, db: Session = Depends(get_db)):
    comp = db.query(models.Company).get(id)
    if not comp:
        raise HTTPException(status_code=404, detail="Compañía no encontrada")
    return comp


@router.put("/{id}", response_model=CompanyOut)
def update_company(id: str, data: CompanyBase, db: Session = Depends(get_db)):
    comp = db.query(models.Company).get(id)
    if not comp:
        raise HTTPException(status_code=404, detail="Compañía no encontrada")

    if data.CompanyLogo:
        try:
            data.CompanyLogo = validate_image_base64(data.CompanyLogo)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    for k, v in data.dict().items():
        setattr(comp, k, v)

    db.commit()
    db.refresh(comp)
    return comp