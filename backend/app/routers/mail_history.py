from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
from .mail_config import send_email


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/seguimiento/historial-correos", tags=["Historial Correos"])


@router.get("/", response_model=List[schemas.MailHistoryOut])
def list_history(db: Session = Depends(get_db)):
    return db.query(models.MailHistory).all()


@router.post("/", response_model=schemas.MailHistoryOut)
def create_history(
    data: schemas.MailHistoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.MailHistory(
        Name=data.Name,
        Subject=data.Subject,
        Body=data.Body,
        id_formato_mail=data.id_formato_mail,
        Destination=data.Destination,
        id_seller=data.id_seller,
        id_client=data.id_client,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/enviar-clientes")
def send_client_emails(
    payload: schemas.SendClientEmails,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cfg = db.query(models.MailConfig).first()
    template = db.query(models.MailTemplate).filter(models.MailTemplate.Destination == "C").first()
    if not cfg or not template:
        raise HTTPException(status_code=400, detail="Configuración o plantilla faltante")
    for pid in payload.policy_ids:
        policy = db.query(models.Policy).get(pid)
        if not policy:
            continue
        client = db.query(models.Client).get(policy.id_ctms)
        if not client or not client.email:
            continue
        try:
            send_email(cfg, client.email, template.Subject, template.Body)
        except Exception:
            pass
        hist = models.MailHistory(
            Name=template.Name,
            Subject=template.Subject,
            Body=template.Body,
            id_formato_mail=template.id,
            Destination="C",
            id_client=client.id,
            CreateDate=date.today(),
            LastDateMod=date.today(),
            id_usrs_create=current_user.id,
            id_usrs_update=current_user.id,
        )
        db.add(hist)
    db.commit()
    return {"msg": "Correos enviados"}