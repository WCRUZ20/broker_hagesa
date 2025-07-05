from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
from .mail_config import send_email

def render_template(db: Session, text: str, policy: models.Policy, client: models.Client, vehicles: List[models.Vehicle]) -> str:
    """Reemplaza las variables predefinidas en la plantilla"""
    veh = vehicles[0] if vehicles else None
    brand_name = ""
    if veh:
        brand = db.query(models.Brand).get(veh.Brand)
        brand_name = brand.Description if brand else ""

    list_items = []
    for v in vehicles:
        b = db.query(models.Brand).get(v.Brand)
        bname = b.Description if b else ""
        list_items.append(f"{bname} {v.Model} - {v.Plate}")
    list_html = "<ul>" + "".join(f"<li>{i}</li>" for i in list_items) + "</ul>" if list_items else ""

    replacements = {
        "{NOMBRE_CLIENTE}": f"{client.nombre} {client.apellidos or ''}".strip(),
        "{IDENTIFICACION_CLIENTE}": client.identificacion or "",
        "{VEH_MARCA}": brand_name,
        "{VEH_MODELO}": veh.Model if veh else "",
        "{VEH_PLACA}": veh.Plate if veh else "",
        "{VEH_COLOR}": veh.Color if veh else "",
        "{NUMERO_POLIZA}": policy.PolicyNum,
        "{FECHA_INICIO}": policy.InitDate.strftime("%Y-%m-%d"),
        "{FECHA_VENCIMIENTO}": policy.DueDate.strftime("%Y-%m-%d"),
        "{VALOR_ASEGURADO}": str(policy.AscValue),
        "{LISTA_DETALLES}": list_html,
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

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

        lines = db.query(models.PolicyLine).filter_by(id_policy=policy.id).all()
        vehicles = []
        for ln in lines:
            veh = db.query(models.Vehicle).get(ln.id_itm)
            if veh:
                vehicles.append(veh)

        subj = render_template(db, template.Subject, policy, client, vehicles)
        body = render_template(db, template.Body, policy, client, vehicles)

        try:
            send_email(cfg, client.email, subj, body)
        except Exception:
            pass
        hist = models.MailHistory(
            Name=template.Name,
            Subject=subj,
            Body=body,
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