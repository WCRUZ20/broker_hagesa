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
        template_client = (
            db.query(models.MailTemplate)
            .filter(models.MailTemplate.Destination == "C")
            .first()
        )

        template_seller = (
            db.query(models.MailTemplate)
            .filter(models.MailTemplate.Destination == "S")
            .first()
        )
        if not cfg or not template_client:
            return

        policies = db.query(models.Policy).all()
        for policy in policies:
            if getattr(policy, "activo", "Y") != "Y":
                continue
            
            diff = (policy.DueDate - today).days
            before_due = diff >= 0 and diff <= (params.daystodue or 0)
            after_due = diff < 0 and abs(diff) <= (params.maxdaysallow or 0)
            send_client = (
                getattr(policy, "aut_noti", "N") == "Y" and (before_due or after_due)
            )
            send_seller = diff >= 0 and diff <= (params.daystodueSeller or 0)
            if not send_client and not send_seller:
                continue
            client = db.query(models.Client).get(policy.id_ctms)
            if not client:
                continue
            if send_client and not client.email:
                send_client = False
                if not send_seller:
                    continue
            if send_client:
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
                    send_client = False
            if not send_client and not send_seller:
                continue
            lines = db.query(models.PolicyLine).filter_by(id_policy=policy.id).all()
            vehicles = []
            for ln in lines:
                veh = db.query(models.Vehicle).get(ln.id_itm)
                if veh:
                    vehicles.append(veh)
            
            if send_client:
                subj = strip_tags(
                    render_template(db, template_client.Subject, policy, client, vehicles)
                )
                body = render_template(db, template_client.Body, policy, client, vehicles)
                try:
                    logger.info(
                        f"Sending email to {client.email} for policy {policy.PolicyNum}"
                    )
                    send_email(cfg, client.email, subj, body)
                except Exception:
                    pass
                hist = models.MailHistory(
                    Name=template_client.Name,
                    Subject=subj,
                    Body=body,
                    id_formato_mail=template_client.id,
                    Destination="C",
                    id_client=client.id,
                    id_policy=policy.id,
                    CreateDate=today,
                    LastDateMod=today,
                    id_usrs_create=1,
                    id_usrs_update=1,
                )
                db.add(hist)
            
            # Send email to seller if applicable
            if template_seller:
                seller = db.query(models.Seller).get(policy.id_slrs)
                if seller and seller.email:
                    if send_seller:
                        existing_s = (
                            db.query(models.MailHistory)
                            .filter(
                                models.MailHistory.Destination == "S",
                                models.MailHistory.id_policy == policy.id,
                                models.MailHistory.id_seller == seller.id,
                                models.MailHistory.CreateDate == today,
                            )
                            .first()
                        )
                        if not existing_s:
                            subj_s = strip_tags(
                                render_template(
                                    db,
                                    template_seller.Subject,
                                    policy,
                                    client,
                                    vehicles,
                                    seller,
                                )
                            )
                            body_s = render_template(
                                db,
                                template_seller.Body,
                                policy,
                                client,
                                vehicles,
                                seller,
                            )
                            try:
                                logger.info(
                                    f"Sending email for sellers to {seller.email} for policy {policy.PolicyNum} to due {diff} days"
                                )
                                send_email(cfg, seller.email, subj_s, body_s)
                            except Exception:
                                pass
                            hist_s = models.MailHistory(
                                Name=template_seller.Name,
                                Subject=subj_s,
                                Body=body_s,
                                id_formato_mail=template_seller.id,
                                Destination="S",
                                id_seller=seller.id,
                                id_policy=policy.id,
                                CreateDate=today,
                                LastDateMod=today,
                                id_usrs_create=1,
                                id_usrs_update=1,
                            )
                            db.add(hist_s)
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