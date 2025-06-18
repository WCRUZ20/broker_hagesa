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


router = APIRouter(prefix="/polizas", tags=["Polizas"])


@router.post("/", response_model=schemas.PolicyOut)
def create_policy(
    data: schemas.PolicyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    policy = models.Policy(
        DocType=data.DocType,
        PolicyNum=data.PolicyNum,
        InitDate=data.InitDate,
        DueDate=data.DueDate,
        AscValue=data.AscValue,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_slrs=data.id_slrs,
        id_ctms=data.id_ctms,
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
        id_insurance=data.id_insurance,
        id_poliza_rel=data.id_poliza_rel,
        comentario=data.comentario,
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    for line in data.lines:
        pl = models.PolicyLine(
            id_policy=policy.id,
            id_itm=line.id_itm,
            LineNum=line.LineNum,
            LineTotal=line.LineTotal,
        )
        db.add(pl)
    db.commit()
    return policy


@router.get("/", response_model=List[schemas.PolicyListOut])
def list_policies(db: Session = Depends(get_db)):
    policies = db.query(models.Policy).all()
    today = date.today()
    result = []
    for p in policies:
        ins = db.query(models.InsuranceCompany).get(p.id_insurance)
        days_overdue = (today - p.DueDate).days if p.DueDate < today else 0
        base = schemas.PolicyOut.from_orm(p).dict()
        base.update(
            {
                "InsuranceName": ins.CompanyName if ins else None,
                "ComiPrcnt": ins.ComiPrcnt if ins else None,
                "DaysOverdue": days_overdue,
            }
        )
        result.append(schemas.PolicyListOut(**base))
    return result


@router.get("/{id}", response_model=schemas.PolicyDetailOut)
def get_policy(id: int, db: Session = Depends(get_db)):
    policy = db.query(models.Policy).get(id)
    if not policy:
        raise HTTPException(status_code=404, detail="Póliza no encontrada")
    lines = db.query(models.PolicyLine).filter_by(id_policy=id).all()
    return {**policy.__dict__, "lines": lines}


@router.put("/{id}", response_model=schemas.PolicyOut)
def update_policy(
    id: int,
    data: schemas.PolicyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    policy = db.query(models.Policy).get(id)
    if not policy:
        raise HTTPException(status_code=404, detail="Póliza no encontrada")

    policy.DocType = data.DocType
    policy.PolicyNum = data.PolicyNum
    policy.InitDate = data.InitDate
    policy.DueDate = data.DueDate
    policy.AscValue = data.AscValue
    policy.LastDateMod = date.today()
    policy.id_slrs = data.id_slrs
    policy.id_ctms = data.id_ctms
    policy.id_usrs_update = current_user.id
    policy.id_insurance = data.id_insurance
    policy.id_poliza_rel = data.id_poliza_rel
    policy.comentario = data.comentario

    db.query(models.PolicyLine).filter_by(id_policy=id).delete()
    for line in data.lines:
        db.add(
            models.PolicyLine(
                id_policy=id,
                id_itm=line.id_itm,
                LineNum=line.LineNum,
                LineTotal=line.LineTotal,
            )
        )
    db.commit()
    db.refresh(policy)
    return policy


@router.delete("/{id}")
def delete_policy(id: int, db: Session = Depends(get_db)):
    policy = db.query(models.Policy).get(id)
    if not policy:
        raise HTTPException(status_code=404, detail="Póliza no encontrada")
    db.query(models.PolicyLine).filter_by(id_policy=id).delete()
    db.delete(policy)
    db.commit()
    return {"msg": "Póliza eliminada"}