from agents.finder import graph
from core.schemas import leadReq, leadsSearchState
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["Leads"])


@router.post("/lead")
async def get_leads(body: leadReq):

    initial_state: leadsSearchState = leadsSearchState(
        industry=body.industry,
        country=body.country,
        leads=[],
    )
    x = await graph.ainvoke(initial_state)

    return x
