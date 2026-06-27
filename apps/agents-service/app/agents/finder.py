from langgraph.graph import END, START, StateGraph

from app.core.nodes import research_node, search_node,fire_crawler_node, analyze_node
from app.core.schemas import leadsSearchState

flow = StateGraph(leadsSearchState)

flow.add_node("search", search_node)
flow.add_node("crawl", fire_crawler_node)
flow.add_node("analyze", analyze_node)

flow.add_edge(START, "search")
flow.add_edge("search", "crawl")
flow.add_edge("crawl", "analyze")
flow.add_edge("analyze", END)

graph = flow.compile()
