from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import ChatMessage, ChatResponse

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, current_user: dict = Depends(get_current_user)):
    # Basic chatbot logic placeholder
    user_input = message.message.lower()
    if "hello" in user_input:
        response_text = f"Hello {current_user.get('name', 'Student')}! How can I help you today?"
    elif "semester" in user_input:
        response_text = f"You are currently in semester {current_user.get('current_semester')}."
    else:
        response_text = "I am a basic chatbot. I'm still learning!"
        
    return {"response": response_text}
