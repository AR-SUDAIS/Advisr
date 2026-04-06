from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import ChatMessage, ChatResponse
import logging
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)


@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, current_user: dict = Depends(get_current_user)):
    user_input = message.message

    # Context Construction
    student_name = current_user.get('name', 'Student')
    current_sem = current_user.get('current_semester', 1)
    history = current_user.get('semesters', [])

    # Build academic history summary
    if history:
        history_summary = "Academic History:\n"
        for sem in history:
            sem_subjects = sem.get('subjects', [])
            sem_summary = ", ".join([f"{sub['name']} ({sub['grade']})" for sub in sem_subjects])
            history_summary += f"- Semester {sem['semester_number']}: {sem_summary}\n"
    else:
        history_summary = "No completed semesters yet."

    system_instruction = (
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

    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )
        response = model.generate_content(user_input)
        bot_response = response.text

        return {"response": bot_response}

    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return {"response": "I'm sorry, I'm currently unable to respond. Please try again later."}

