from langchain_groq import ChatGroq
from core.config import settings

def get_llm(temperature=0.3):
    """Get a configured Groq LLM instance for agent use."""
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=settings.GROQ_API_KEY,
        temperature=temperature,
    )
