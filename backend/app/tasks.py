from datetime import datetime, date
from apscheduler.schedulers.background import BackgroundScheduler
from .database import SessionLocal
from . import models
from .routers.mail_config import send_email, strip_tags
from .routers.mail_history import render_template

scheduler = BackgroundScheduler()
_last_sent: date | None = None


def send_due_emails() -> None:
    """Send automatic emails to clients based on configured parameters."""
    global _last_sent
    now = datetime.now()
    today = now.date()
    db = SessionLocal()
    try:
        params = db.query(models.MailSendingParam).first()
        if not params:
            return
        if params.manualsending == "Y":
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
            return
        if params.hoursending:
            send_time = datetime.combine(today, params.hoursending)
            if now < send_time:
                return
        if _last_sent == today:
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
                    models.MailHistory.id_client == client.id,
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
                CreateDate=today,
                LastDateMod=today,
                id_usrs_create=1,
                id_usrs_update=1,
            )
            db.add(hist)
        db.commit()
        _last_sent = today
    finally:
        db.close()


def start_scheduler() -> None:
    """Start background scheduler for automatic emails."""
    scheduler.add_job(send_due_emails, "interval", minutes=1)
    scheduler.start()


def stop_scheduler() -> None:
    """Stop the background scheduler if running."""
    if scheduler.running:
        scheduler.shutdown()