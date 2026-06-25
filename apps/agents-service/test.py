import dotenv
from langchain.chat_models import init_chat_model
import app.core.prompts as prompts

dotenv.load_dotenv()

groq = init_chat_model("groq:llama-3.3-70b-versatile", temperature=0)


response = groq.invoke( input = prompts.draft)

print(response.content)