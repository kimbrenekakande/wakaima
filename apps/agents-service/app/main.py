from fastapi import FastAPI
from dotenv import load_dotenv
from middleware.auth import authentication
from routes.v1 import leads, emails

load_dotenv()

app = FastAPI()
# app.middleware("http")(authentication)
app.include_router(leads.router)
app.include_router(emails.router)
