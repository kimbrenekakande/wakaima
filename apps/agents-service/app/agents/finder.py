from langgraph.graph import END, START, StateGraph

from core.schemas import leadsSearchState
from core.nodes import research_node, search_node

flow = StateGraph(leadsSearchState)

flow.add_node("search",search_node)
flow.add_node("research", research_node)

flow.add_edge(START, "search")
flow.add_edge("search", "research")
flow.add_edge("research", END)

graph = flow.compile()
