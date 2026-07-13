from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class MessageSchema(BaseModel):
    sender: str # "user" or "ai"
    text: str
    timestamp: str

class ChatBase(BaseModel):
    title: str

class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ChatResponse(ChatBase):
    id: int
    user_id: int
    messages: List[MessageSchema] = []
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    message: str
    resume_id: Optional[int] = None
