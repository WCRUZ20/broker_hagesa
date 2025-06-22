from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
import smtplib
from email.mime.text import MIMEText


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def send_email(cfg: models.MailConfig, to: str, subject: str, body: str):
    mmsg = MIMEText(body, "html")
    msg["Subject"] = subject
    msg["From"] = cfg.USER_SMTP
    msg["To"] = to

    with smtplib.SMTP(cfg.HOST_SMTP, int(cfg.PORT_SMTP)) as server:
        server.starttls()
        server.login(cfg.USER_SMTP, cfg.PASS_SMTP)
        server.sendmail(cfg.USER_SMTP, [to], msg.as_string())


router = APIRouter(prefix="/seguimiento/parametrizaciones-mail", tags=["Parametrizaciones Mail"])


@router.post("/", response_model=schemas.MailConfigOut)
def create_mail_config(
    data: schemas.MailConfigCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = models.MailConfig(
        USER_SMTP=data.USER_SMTP,
        PASS_SMTP=data.PASS_SMTP,
        HOST_SMTP=data.HOST_SMTP,
        PORT_SMTP=data.PORT_SMTP,
        Estado=data.Estado or "D",
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=current_user.id,
        id_usrs_update=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[schemas.MailConfigOut])
def list_mail_configs(db: Session = Depends(get_db)):
    return db.query(models.MailConfig).all()


@router.get("/{id}", response_model=schemas.MailConfigOut)
def get_mail_config(id: int, db: Session = Depends(get_db)):
    item = db.query(models.MailConfig).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Configuraci\u00f3n no encontrada")
    return item


@router.put("/{id}", response_model=schemas.MailConfigOut)
def update_mail_config(
    id: int,
    data: schemas.MailConfigCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.MailConfig).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Configuraci\u00f3n no encontrada")
    item.USER_SMTP = data.USER_SMTP
    item.PASS_SMTP = data.PASS_SMTP
    item.HOST_SMTP = data.HOST_SMTP
    item.PORT_SMTP = data.PORT_SMTP
    if data.Estado is not None:
        item.Estado = data.Estado
    item.LastDateMod = date.today()
    item.id_usrs_update = current_user.id
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_mail_config(id: int, db: Session = Depends(get_db)):
    item = db.query(models.MailConfig).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Configuraci\u00f3n no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Configuraci\u00f3n eliminada"}


@router.post("/{id}/test")
def send_test_mail(
    id: int,
    to: str,
    subject: str = "Prueba de correo",
    body: str = "Esto es un correo de prueba",
    items: list[str] | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cfg = db.query(models.MailConfig).get(id)
    if not cfg:
        raise HTTPException(status_code=404, detail="Configuracion no encontrada")
        list_html = ""
    if items:
        list_html = "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"
    body = body.replace("{LISTA_DETALLES}", list_html)
    try:
        send_email(cfg, to, subject, body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"msg": "Correo enviado"}