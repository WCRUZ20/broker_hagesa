from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Mapping
from datetime import date

from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
from .mail_config import send_email

def fill_template(text: str, variables: Mapping[str, str]) -> str:
    """Replace known placeholders in *text* with values from *variables*."""
    for placeholder, value in variables.items():
        text = text.replace(placeholder, value)
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
        vehicles = [db.query(models.Vehicle).get(l.id_itm) for l in lines]
        first_vehicle = vehicles[0] if vehicles else None

        brand_desc = ""
        model = ""
        plate = ""
        color = ""
        if first_vehicle:
            brand_desc = (
                db.query(models.Brand.Description)
                .filter(models.Brand.id == first_vehicle.Brand)
                .scalar()
                or ""
            )
            model = first_vehicle.Model or ""
            plate = first_vehicle.Plate or ""
            color = first_vehicle.Color or ""

        list_html = ""
        if vehicles:
            items = []
            for v in vehicles:
                b_desc = (
                    db.query(models.Brand.Description)
                    .filter(models.Brand.id == v.Brand)
                    .scalar()
                    or ""
                )
                items.append(f"<li>{b_desc} {v.Model} {v.Plate} {v.Color}</li>")
            list_html = "<ul>" + "".join(items) + "</ul>"

        variables = {
            "{NOMBRE_CLIENTE}": f"{client.nombre or ''} {client.apellidos or ''}".strip(),
            "{IDENTIFICACION_CLIENTE}": client.identificacion or "",
            "{VEH_MARCA}": brand_desc,
            "{VEH_MODELO}": model,
            "{VEH_PLACA}": plate,
            "{VEH_COLOR}": color,
            "{NUMERO_POLIZA}": policy.PolicyNum,
            "{FECHA_INICIO}": policy.InitDate.isoformat(),
            "{FECHA_VENCIMIENTO}": policy.DueDate.isoformat(),
            "{VALOR_ASEGURADO}": str(policy.AscValue),
            "{LISTA_DETALLES}": list_html,
        }

        subject = fill_template(template.Subject, variables)
        body = fill_template(template.Body, variables)
        try:
            send_email(cfg, client.email, subject, body)
        except Exception:
            pass
        hist = models.MailHistory(
            Name=template.Name,
            Subject=subject,
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