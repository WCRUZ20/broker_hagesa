from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import date
from .. import models, schemas
from app.database import SessionLocal
from .users import get_current_user
import logging
from ..utils.email_utils import (
    send_email_enhanced,
    send_email,
    strip_tags,
)
# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(dependencies=[Depends(get_current_user)], 
    prefix="/seguimiento/parametrizaciones-mail", tags=["Parametrizaciones Mail"]
)


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
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
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
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
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
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    db.delete(item)
    db.commit()
    return {"msg": "Configuración eliminada"}


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
        send_email_enhanced(cfg, to, subject, body, es_html=True, tipo_test=3, titulo="Sistema de Pruebas")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"msg": "Correo enviado"}


@router.post("/test-config")
def test_mail_config(data: schemas.MailConfigTest):
    """Validate SMTP parameters without saving them - Versión mejorada."""
    cfg = models.MailConfig(
        USER_SMTP=data.USER_SMTP,
        PASS_SMTP=data.PASS_SMTP,
        HOST_SMTP=data.HOST_SMTP,
        PORT_SMTP=data.PORT_SMTP,
        Estado=data.Estado,
        CreateDate=date.today(),
        LastDateMod=date.today(),
        id_usrs_create=0,
        id_usrs_update=0,
    )
    
    try:
        # Usar el correo de destino proporcionado por el usuario
        correo_destino = data.test_email if data.test_email else data.USER_SMTP
        
        logger.info(f"Realizando test de configuración SMTP hacia: {correo_destino}")
        
        # Usar la función mejorada con tipo_test=1 para prueba de configuración
        send_email_enhanced(
            cfg=cfg, 
            to=correo_destino, 
            subject="Test de Configuración SMTP", 
            body="Prueba de configuración del servidor de correo", 
            es_html=False, 
            tipo_test=1,
            titulo="Correo Test Config. Mail Hagesa"
        )
        
        return {
            "msg": "Configuración SMTP válida", 
            "success": True,
            "details": {
                "servidor": data.HOST_SMTP,
                "puerto": data.PORT_SMTP,
                "usuario": data.USER_SMTP,
                "destino": correo_destino
            }
        }
        
    except HTTPException as e:
        # Re-lanzar HTTPException tal como está
        raise e
    except Exception as e:
        error_msg = f"Error inesperado al validar configuración: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)