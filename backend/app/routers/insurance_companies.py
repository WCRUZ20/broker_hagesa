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


router = APIRouter(prefix="/aseguradoras", tags=["Aseguradoras"])


@router.post("/", response_model=schemas.InsuranceCompanyOut)
def create_insurance_company(
    data: schemas.InsuranceCompanyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.InsuranceCompany(
        IdentType=data.IdentType,
        Identification=data.Identification,
        CompanyName=data.CompanyName,
        DirCompany=data.DirCompany,
        TelepCompany=data.TelepCompany,
        ComiPrcnt=data.ComiPrcnt,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.InsuranceCompanyOut])
def list_insurance_companies(db: Session = Depends(get_db)):
    return db.query(models.InsuranceCompany).all()


@router.get("/{id}", response_model=schemas.InsuranceCompanyOut)
def get_insurance_company(id: int, db: Session = Depends(get_db)):
    item = db.query(models.InsuranceCompany).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Aseguradora no encontrada")
    return item


@router.put("/{id}", response_model=schemas.InsuranceCompanyOut)
def update_insurance_company(
    id: int,
    data: schemas.InsuranceCompanyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.InsuranceCompany).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Aseguradora no encontrada")

    item.IdentType = data.IdentType
    item.Identification = data.Identification
    item.CompanyName = data.CompanyName
    item.DirCompany = data.DirCompany
    item.TelepCompany = data.TelepCompany
    item.ComiPrcnt = data.ComiPrcnt
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_insurance_company(id: int, db: Session = Depends(get_db)):
    item = db.query(models.InsuranceCompany).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Aseguradora no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Aseguradora eliminada"}