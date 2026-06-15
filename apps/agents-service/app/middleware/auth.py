import os
from fastapi import Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("SECRET_KEY")

async def authentication(request : Request, call_next):
    if request.url.path == "/health" :
        return await call_next(request)
        
    api = request.headers.get("api")
    if api != API_KEY :
        return JSONResponse( status_code=401, content={"detail": "Invalid API key"} )
        
    response = await call_next(request)
    return response
