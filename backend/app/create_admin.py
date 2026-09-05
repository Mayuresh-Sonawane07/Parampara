import argparse
import sys
import getpass
from app.database import SessionLocal, Base, engine
from app import models, auth

def create_admin(username: str, email: str, password: str):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(
            (models.User.username == username) | (models.User.email == email)
        ).first()
        
        if existing:
            print(f"User with username '{username}' or email '{email}' already exists.")
            update = input("Do you want to update their password? (y/N): ").strip().lower()
            if update == 'y':
                existing.hashed_password = auth.get_password_hash(password)
                existing.is_admin = True
                db.commit()
                print(f"Successfully updated password for admin user '{username}'.")
            return

        admin_user = models.User(
            username=username,
            email=email,
            hashed_password=auth.get_password_hash(password),
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print(f"Successfully created administrator: {username} ({email})")
    except Exception as e:
        db.rollback()
        print(f"Error creating admin user: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()

def main():
    parser = argparse.ArgumentParser(description="Create an administrator account for Parampara AR Lite")
    parser.add_argument("--username", "-u", default="admin", help="Admin username (default: admin)")
    parser.add_argument("--email", "-e", default="admin@parampara.heritage", help="Admin email")
    parser.add_argument("--password", "-p", help="Admin password (if omitted, will be prompted securely)")

    args = parser.parse_args()

    password = args.password
    if not password:
        password = getpass.getpass("Enter administrator password: ")
        confirm = getpass.getpass("Confirm administrator password: ")
        if password != confirm:
            print("Passwords do not match.", file=sys.stderr)
            sys.exit(1)

    if len(password) < 8:
        print("Password must be at least 8 characters.", file=sys.stderr)
        sys.exit(1)

    create_admin(args.username, args.email, password)

if __name__ == "__main__":
    main()
