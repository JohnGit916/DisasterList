from extensions import db
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    reports = relationship("IncidentReport", back_populates="user", cascade="all, delete")
    offers = relationship("ResponseOffer", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User {self.username}>"
