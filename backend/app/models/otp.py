from sqlalchemy import Column,Integer,String,DateTime
from app.core.database import Base
from datetime import datetime

class OTP(Base):
    __tablename__="otp"

    id=Column(Integer,primary_key=True,index=True)

    email=Column(String,index=True)

    otp=Column(String)

    expires_at=Column(DateTime)

    attempts=Column(Integer,default=0)

    created_at=Column(DateTime,default=datetime.utcnow)