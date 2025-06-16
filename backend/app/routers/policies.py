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


@router.get("/", response_model=List[schemas.PolicyOut])
def list_policies(db: Session = Depends(get_db)):
    return db.query(models.Policy).all()