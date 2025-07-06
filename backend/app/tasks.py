from datetime import datetime, date
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import logging
import typing as t
from .database import SessionLocal
from . import models
from .routers.mail_config import send_email, strip_tags
from .routers.mail_history import render_template

logger = logging.getLogger(__name__)

# Use an AsyncIO-based scheduler so jobs run properly under FastAPI/uvicorn
scheduler = AsyncIOScheduler()



def send_due_emails() -> None:
    """Send automatic emails to clients based on configured parameters."""
    logger.info("Running scheduled email check")
    now = datetime.now()
    today = now.date()
    db = SessionLocal()
    try:
        params = db.query(models.MailSendingParam).first()
        if not params:
            logger.info("No mail sending parameters configured")
            return
        if params.manualsending == "Y":
            logger.info("Automatic sending disabled")
            return
        days_map = {
            0: params.monday,
            1: params.tuesday,
            2: params.wednesday,
            3: params.thursday,
            4: params.friday,
            5: params.saturday,
            6: params.sunday,
        }
        if days_map.get(now.weekday()) != "Y":
            logger.info("Sending not allowed today")
            return
        if params.hoursending:
            send_time = datetime.combine(today, params.hoursending)
            if now < send_time:
                logger.info("Waiting until configured send time")
                return

        cfg = db.query(models.MailConfig).first()
        template = (
            db.query(models.MailTemplate)
            .filter(models.MailTemplate.Destination == "C")
            .first()
        )
        if not cfg or not template:
            return

        policies = db.query(models.Policy).all()
        for policy in policies:
            if getattr(policy, "activo", "Y") != "Y":
                continue
            diff = (policy.DueDate - today).days
            before_due = diff >= 0 and diff <= (params.daystodue or 0)
            after_due = diff < 0 and abs(diff) <= (params.maxdaysallow or 0)
            if not (before_due or after_due):
                continue
            client = db.query(models.Client).get(policy.id_ctms)
            if not client or not client.email:
                continue
            existing = (
                db.query(models.MailHistory)
                .filter(
                    models.MailHistory.Destination == "C",
                    models.MailHistory.id_policy == policy.id,
                    models.MailHistory.CreateDate == today,
                )
                .first()
            )
            if existing:
                continue
            lines = db.query(models.PolicyLine).filter_by(id_policy=policy.id).all()
            vehicles = []
            for ln in lines:
                veh = db.query(models.Vehicle).get(ln.id_itm)
                if veh:
                    vehicles.append(veh)
            subj = strip_tags(
                render_template(db, template.Subject, policy, client, vehicles)
            )
            body = render_template(db, template.Body, policy, client, vehicles)
            try:
                logger.info(f"Sending email to {client.email} for policy {policy.id}")
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
                id_policy=policy.id,
                CreateDate=today,
                LastDateMod=today,
                id_usrs_create=1,
                id_usrs_update=1,
            )
            db.add(hist)
        db.commit()
        logger.info("Automatic email task completed")
    finally:
        db.close()


def start_scheduler() -> None:
    """Start background scheduler for automatic emails."""
    if not scheduler.running:
        scheduler.add_job(
            send_due_emails,
            "interval",
            minutes=1,
            id="send_due_emails",
            replace_existing=True,
        )
        scheduler.start()


def stop_scheduler() -> None:
    """Stop the background scheduler if running."""
    if scheduler.running:
        scheduler.shutdown(wait=False)