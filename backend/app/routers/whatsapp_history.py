from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
from .whatsapp_config import send_whatsapp
from .mail_history import render_template
from .mail_config import strip_tags


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(prefix="/seguimiento/historial-whatsapp", tags=["Historial WhatsApp"])


@router.get("/", response_model=List[schemas.WhatsAppHistoryOut])
def list_history(db: Session = Depends(get_db)):
    return db.query(models.WhatsAppHistory).all()


@router.post("/", response_model=schemas.WhatsAppHistoryOut)
def create_history(
    data: schemas.WhatsAppHistoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.WhatsAppHistory(
        Name=data.Name,
        Subject=data.Subject,
        Body=data.Body,
        id_formato_wa=data.id_formato_wa,
        Destination=data.Destination,
        id_seller=data.id_seller,
        id_client=data.id_client,
        id_policy=data.id_policy,
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
def send_client_whatsapp(
    payload: schemas.SendClientEmails,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    params = db.query(models.WhatsAppSendingParam).first()
    if not params or params.manualsending != "Y":
        raise HTTPException(status_code=400, detail="El envío manual está desactivado")

    cfg = db.query(models.WhatsAppConfig).first()
    template = db.query(models.WhatsAppTemplate).filter(models.WhatsAppTemplate.Destination == "C").first()
    if not cfg or not template:
        raise HTTPException(status_code=400, detail="Configuración o plantilla faltante")

    for pid in payload.policy_ids:
        policy = db.query(models.Policy).get(pid)
        if not policy:
            continue
        client = db.query(models.Client).get(policy.id_ctms)
        seller = db.query(models.Seller).get(policy.id_slrs)
        if not client or not client.telefono:
            continue

        lines = db.query(models.PolicyLine).filter_by(id_policy=policy.id).all()
        vehicles: List[models.Vehicle] = []
        for ln in lines:
            veh = db.query(models.Vehicle).get(ln.id_itm)
            if veh:
                vehicles.append(veh)

        subj = strip_tags(
            render_template(db, template.Subject, policy, client, vehicles, seller)
        )
        body = strip_tags(
            render_template(db, template.Body, policy, client, vehicles, seller)
        )

        try:
            send_whatsapp(cfg, client.telefono, f"{subj}\n{body}")
        except Exception:
            pass

        hist = models.WhatsAppHistory(
            Name=template.Name,
            Subject=subj,
            Body=body,
            id_formato_wa=template.id,
            Destination="C",
            id_client=client.id,
            id_policy=policy.id,
            CreateDate=date.today(),
            LastDateMod=date.today(),
            id_usrs_create=current_user.id,
            id_usrs_update=current_user.id,
        )
        db.add(hist)
    db.commit()
    return {"msg": "Mensajes enviados"}


@router.post("/enviar-vendedores")
def send_seller_whatsapp(
    payload: schemas.SendSellerEmails,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    params = db.query(models.WhatsAppSendingParam).first()
    if not params or params.manualsending != "Y":
        raise HTTPException(status_code=400, detail="El envío manual está desactivado")

    cfg = db.query(models.WhatsAppConfig).first()
    template = db.query(models.WhatsAppTemplate).filter(models.WhatsAppTemplate.Destination == "S").first()
    if not cfg or not template:
        raise HTTPException(status_code=400, detail="Configuración o plantilla faltante")

    for pid in payload.policy_ids:
        policy = db.query(models.Policy).get(pid)
        if not policy:
            continue
        seller = db.query(models.Seller).get(policy.id_slrs)
        if not seller or not seller.telefono:
            continue
        client = db.query(models.Client).get(policy.id_ctms)

        lines = db.query(models.PolicyLine).filter_by(id_policy=policy.id).all()
        vehicles: List[models.Vehicle] = []
        for ln in lines:
            veh = db.query(models.Vehicle).get(ln.id_itm)
            if veh:
                vehicles.append(veh)

        subj = strip_tags(
            render_template(db, template.Subject, policy, client, vehicles, seller)
        )
        body = strip_tags(
            render_template(db, template.Body, policy, client, vehicles, seller)
        )

        try:
            send_whatsapp(cfg, seller.telefono, f"{subj}\n{body}")
        except Exception:
            pass

        hist = models.WhatsAppHistory(
            Name=template.Name,
            Subject=subj,
            Body=body,
            id_formato_wa=template.id,
            Destination="S",
            id_seller=seller.id,
            id_policy=policy.id,
            CreateDate=date.today(),
            LastDateMod=date.today(),
            id_usrs_create=current_user.id,
            id_usrs_update=current_user.id,
        )
        db.add(hist)
    db.commit()
    return {"msg": "Mensajes enviados"}