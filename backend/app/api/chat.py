from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.depedencies import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.models.resume import Resume
from app.schemas.chat import ChatCreate, ChatResponse, ChatMessageCreate, MessageSchema
from app.services.ai_service import AIService
from app.services.resume_parser import ResumeParser

router = APIRouter(prefix="/chats", tags=["chats"])

@router.get("", response_model=List[ChatResponse])
def get_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.created_at.desc()).all()
    return chats

@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
def create_chat(
    payload: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_chat = Chat(
        user_id=current_user.id,
        title=payload.title or "New Chat",
        messages=[]
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

@router.get("/{chat_id}", response_model=ChatResponse)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return chat

@router.post("/{chat_id}/message", response_model=MessageSchema)
def send_message(
    chat_id: int,
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Find chat
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # Fetch context resume if attached
    resume_text = ""
    parsed_data = {}
    if payload.resume_id:
        resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
        if resume:
            resume_text = resume.file_content_text
            parsed_data = ResumeParser.parse_text(resume_text)

    # Prepare message entries
    timestamp_str = datetime.now(timezone.utc).isoformat()
    
    user_msg = {
        "sender": "user",
        "text": payload.message,
        "timestamp": timestamp_str
    }

    # Generate response
    # Combine old messages and new user message
    messages_history = list(chat.messages) if chat.messages else []
    messages_history.append(user_msg)
    
    ai_response_text = AIService.get_chat_response(messages_history, resume_text, parsed_data)
    
    ai_msg = {
        "sender": "ai",
        "text": ai_response_text,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # Save back to database
    # SQLAlchemy requires flagging JSON attributes as modified, or creating a new list object
    updated_messages = list(chat.messages) if chat.messages else []
    updated_messages.append(user_msg)
    updated_messages.append(ai_msg)
    chat.messages = updated_messages
    
    # Automatically update title if first message
    if len(chat.messages) <= 2:
        chat.title = payload.message[:30] + ("..." if len(payload.message) > 30 else "")
        
    db.commit()
    
    return ai_msg
