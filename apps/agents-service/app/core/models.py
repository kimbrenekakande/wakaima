import dotenv
from langchain.chat_models import init_chat_model

from app.core.schemas import ProfileData

dotenv.load_dotenv()

groq = init_chat_model("groq:llama-3.3-70b-versatile", temperature=0)

profileDataRetriverModel = groq.with_structured_output(ProfileData)
