from langgraph.graph import END, START, StateGraph

from core.schemas import emailReq
from core.nodes import draft_node

flow = StateGraph(emailReq)

flow.add_node("draft",draft_node)

flow.add_edge(START, "draft")
flow.add_edge("draft", END)

graph = flow.compile()
