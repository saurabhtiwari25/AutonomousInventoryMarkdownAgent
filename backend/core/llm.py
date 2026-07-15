from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings

def get_llm(temperature=0.3):
    """Get a configured Gemini LLM instance for agent use."""
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=settings.GEMINI_API_KEY,
        temperature=temperature,
    )
