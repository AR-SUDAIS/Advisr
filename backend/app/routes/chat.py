from fastapi import APIRouter, Depends, HTTPException
from app.auth import get_current_user
from app.models import ChatMessage, ChatResponse
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, current_user: dict = Depends(get_current_user)):
    user_input = message.message
    
    # Context Construction
    student_name = current_user.get('name', 'Student')
    current_sem = current_user.get('current_semester', 1)
    history = current_user.get('semesters', [])
    
    # Calculate basic stats for context
    history_summary = ""
    if history:
        history_summary = "Academic History:\n"
        for sem in history:
            sem_subjects = sem.get('subjects', [])
            sem_summary = ", ".join([f"{sub['name']} ({sub['grade']})" for sub in sem_subjects])
            history_summary += f"- Semester {sem['semester_number']}: {sem_summary}\n"
    else:
        history_summary = "No completed semesters yet."

    system_prompt = (
        f"You are the Student Advisor and Personal Mentor of {student_name}. "
        f"He is currently in semester {current_sem}. "
        f"Academic record (absolute truth): {history_summary}. "

        "ROLE: Provide accurate, honest, and practical academic guidance. "
        "Be direct. Do not sugarcoat. Do not give false hope. "
        "Be concise and professional. "

        "RESPONSE RULES: "
        "- Maximum 200 words unless deeper explanation is absolutely necessary. "
        "- Use clear headings and bullet points. "
        "- Keep sentences short. "
        "- Avoid long paragraphs. "
        "- Do not repeat information. "
        "- For simple queries (e.g., greetings), respond in 1–2 lines only. "

        "STRUCTURE FORMAT (use when giving academic explanations): "
        "1) Topic "
        "2) Concept (short explanation) "
        "3) Why It Matters "
        "4) Resources "
        "5) Action Step "

        "RESOURCE POLICY: "
        "- Only recommend trusted platforms (official documentation, NPTEL, Coursera, edX, "
        "GeeksforGeeks, university websites). "
        "- Only provide links if confident they are valid and official. "
        "- Never fabricate URLs. "
        "- If unsure, mention the platform name without a URL. "

        "If information is missing or uncertain, clearly say you do not know."
    )

    prompt = f"{system_prompt}\n\nStudent: {user_input}\nAdvisor:"

    payload = {
        "model": "gemma3:latest", 
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        
        if response.status_code == 404:

             logger.warning("Model gemma:3 not found, trying gemma:2b")
             payload["model"] = "gemma:2b"
             response = requests.post(OLLAMA_API_URL, json=payload)

        response.raise_for_status()
        result = response.json()
        bot_response = result.get("response", "I'm having trouble thinking right now.")
        
        return {"response": bot_response}

    except requests.exceptions.RequestException as e:
        logger.error(f"Ollama API Error: {e}")
        return {"response": "I'm sorry, I'm currently unable to access."}
