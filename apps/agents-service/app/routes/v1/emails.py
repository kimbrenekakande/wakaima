from agents.mailer import graph
from core.models import groq
from core.schemas import emailReq
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["Emails"])


@router.get("/email")
async def get_emails(body: emailReq):
    mail_list = body.companies
    initial_State: emailReq = emailReq(companies=mail_list)
    x = await graph.ainvoke(initial_State)
    return x


@router.get("/email/test")
async def call_llm():
    call = groq.invoke(input="what is afrofuturism")
    return call.text
