from dotenv import load_dotenv
from fastapi import FastAPI

from app.middleware.auth import authentication
from app.routes.v1 import emails, leads

load_dotenv()

app = FastAPI()
# app.middleware("http")(authentication)
app.include_router(leads.router)
app.include_router(emails.router)
