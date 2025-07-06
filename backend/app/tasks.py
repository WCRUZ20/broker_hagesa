from datetime import datetime, date
from apscheduler.schedulers.background import BackgroundScheduler
from .database import SessionLocal
from . import models
from .routers.mail_config import send_email, strip_tags
from .routers.mail_history import render_template

scheduler = BackgroundScheduler()
_last_sent = None

def send_due_emails():
    global _last_sent
    now = datetime.now()
    today = now.date()
    db = SessionLocal()
    try:
        params = db.query(models.MailSendingParam).first()
        if not params:
            return
        if params.manualsending == 'Y':
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
        if days_map.get(now.weekday()) != 'Y':
            return
        if params.hoursending:
            send_time = datetime.combine(today, params.hoursending)
            if now < send_time:
                return
        if _last_sent == today:
            return

        cfg = db.query(models.MailConfig).first()
        client_template = db.query(models.MailTemplate).filter(models.MailTemplate.Destination == 'C').first()
        seller_template = db.query(models.MailTemplate).filter(models.MailTemplate.Destination == 'S').first()
        if not cfg or not client_template:
            return

        policies = db.query(models.Policy).all()
        for policy in policies:
            if policy.activo != 'Y':
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
                    models.MailHistory.Destination == 'C',
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
            seller = db.query(models.Seller).get(policy.id_slrs)
            subj = strip_tags(
                render_template(db, client_template.Subject, policy, client, vehicles, seller)
            )
            body = render_template(db, client_template.Body, policy, client, vehicles, seller)
            try:
                send_email(cfg, client.email, subj, body)
            except Exception:
                pass
            hist = models.MailHistory(
                Name=client_template.Name,
                Subject=subj,
                Body=body,
                id_formato_mail=client_template.id,
                Destination='C',
                id_client=client.id,
                CreateDate=today,
                LastDateMod=today,
                id_usrs_create=1,
                id_usrs_update=1,
            )
            db.add(hist)
            # Correos automáticos a vendedores
            if seller_template and seller and seller.email:
                before_due_s = diff >= 0 and diff <= (params.daystodueSeller or 0)
                if before_due_s or after_due:
                    existing_s = (
                        db.query(models.MailHistory)
                        .filter(
                            models.MailHistory.Destination == 'S',
                            models.MailHistory.id_seller == seller.id,
                            models.MailHistory.CreateDate == today,
                        )
                        .first()
                    )
                    if not existing_s:
                        subj_s = strip_tags(
                            render_template(db, seller_template.Subject, policy, client, vehicles, seller)
                        )
                        body_s = render_template(db, seller_template.Body, policy, client, vehicles, seller)
                        try:
                            send_email(cfg, seller.email, subj_s, body_s)
                        except Exception:
                            pass
                        hist_s = models.MailHistory(
                            Name=seller_template.Name,
                            Subject=subj_s,
                            Body=body_s,
                            id_formato_mail=seller_template.id,
                            Destination='S',
                            id_seller=seller.id,
                            CreateDate=today,
                            LastDateMod=today,
                            id_usrs_create=1,
                            id_usrs_update=1,
                        )
                        db.add(hist_s)
        db.commit()
        _last_sent = today
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(send_due_emails, 'interval', minutes=1)
    scheduler.start()

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()