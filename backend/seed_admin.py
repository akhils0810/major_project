import logging
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_admin(db: Session):
    admin_email = "admin@example.com"
    user = db.query(User).filter(User.email == admin_email).first()
    if not user:
        admin_user = User(
            name="Super Admin",
            email=admin_email,
            password_hash=get_password_hash("admin123"),
            role="admin",
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        logger.info(f"Admin user created: {admin_email} / admin123")
    else:
        logger.info("Admin user already exists.")

if __name__ == "__main__":
    db = SessionLocal()
    seed_admin(db)
    db.close()
