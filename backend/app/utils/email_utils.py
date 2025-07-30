from typing import Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
import logging
import re

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def strip_tags(text: str) -> str:
    """Remove HTML tags from a string."""
    if not text:
        return ""
    return re.sub(r"<[^>]+>", "", text)


def send_email_enhanced(cfg: Any, to: str, subject: str, body: str, es_html: bool = True, tipo_test: int = 3, titulo: str = "Sistema"):
    """Envía correo electrónico usando SMTP con manejo mejorado."""
    try:
        subject = strip_tags(subject)
        logger.info(f"Iniciando envío de correo - Tipo: {tipo_test}")
        logger.info(f"Servidor: {cfg.HOST_SMTP}, Puerto: {cfg.PORT_SMTP}")
        logger.info(f"Destinatario: {to}")

        mensaje = MIMEMultipart()

        if tipo_test == 1:
            mensaje['From'] = f"Test SMTP <{cfg.USER_SMTP}>"
            mensaje['Subject'] = Header("Prueba Configuracion Cuenta", 'utf-8')
            cuerpo_final = "Prueba de configuracion del servidor de correo. Si recibes este mensaje, la configuración SMTP es correcta."
            es_html = False
        elif tipo_test in (2, 3, 4):
            mensaje['From'] = f"{titulo} <{cfg.USER_SMTP}>"
            mensaje['Subject'] = Header(subject, 'utf-8')
            cuerpo_final = body
        else:
            mensaje['From'] = f"{titulo} <{cfg.USER_SMTP}>"
            mensaje['Subject'] = Header(subject, 'utf-8')
            cuerpo_final = body

        mensaje['To'] = to
        if es_html:
            mensaje.attach(MIMEText(cuerpo_final, 'html', 'utf-8'))
        else:
            mensaje.attach(MIMEText(cuerpo_final, 'plain', 'utf-8'))

        puerto = int(cfg.PORT_SMTP)
        usar_ssl = puerto in [587, 25]
        servidor = smtplib.SMTP(cfg.HOST_SMTP, puerto)

        if usar_ssl:
            servidor.starttls()
            logger.info("SSL/TLS habilitado")

        servidor.login(cfg.USER_SMTP, cfg.PASS_SMTP)
        logger.info("Autenticación exitosa")

        texto_mensaje = mensaje.as_string()
        servidor.sendmail(cfg.USER_SMTP, [to], texto_mensaje.encode('utf-8'))
        servidor.quit()

        logger.info("Correo enviado exitosamente")
        return True

    except UnicodeEncodeError as e:
        error_msg = f"Error de codificación: {str(e)}. Intenta usar caracteres ASCII únicamente."
        logger.error(error_msg)
        raise
    except smtplib.SMTPAuthenticationError as e:
        error_msg = f"Error de autenticación: {str(e)}. Verifica tu email y contraseña."
        logger.error(error_msg)
        raise
    except smtplib.SMTPException as e:
        error_msg = f"Error SMTP: {str(e)}"
        logger.error(error_msg)
        raise
    except Exception as e:
        error_msg = f"Error al enviar correo: {str(e)}"
        logger.error(error_msg)
        raise


def send_email(cfg: Any, to: str, subject: str, body: str):
    """Función de compatibilidad simple."""
    return send_email_enhanced(cfg, to, subject, body, es_html=True, tipo_test=3)