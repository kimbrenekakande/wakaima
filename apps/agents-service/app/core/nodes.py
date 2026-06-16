import os

from core.models import groq
from core.schemas import SearchResult, emailReq, leadsSearchState
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from dotenv import load_dotenv
from exa_py import Exa

load_dotenv()


async def search_node(state: leadsSearchState):
    query = f"Generate Leads of {state.industry} Companies in uganda"
    exa = Exa(api_key=os.getenv("EXA_API_KEY"))

    results = exa.search_and_contents(
        query,
        category="company",
        num_results=20,
        type="deep",
    )

    for r in results.results:
        print(r)
        state.leads.append(SearchResult(name=r.title, url=r.url, profile=r.text))

    return state


async def research_node(state: leadsSearchState):
    md_generator = DefaultMarkdownGenerator(
        options={
            "ignore_links": True,
            "ignore_images": True,
            "skip_internal_links": True,
        }
    )
    config = CrawlerRunConfig(markdown_generator=md_generator)

    for lead in state.leads:
        if not lead.url:
            continue
        async with AsyncWebCrawler() as crawler:
            results = await crawler.arun(lead.url, config=config)
            if results.markdown:
                lead.profile = results.markdown.raw_markdown

            for v in results.links.values():
                for link in v:
                    href = link.get("href", "")
                    if "mailto:" in href:
                        lead.email = href.replace("mailto:", "")
                        break

    return state


async def draft_node(state: emailReq):
    for company in state.companies:
        response = groq.invoke(
            input=f"""
            write a mock lead generation email to the company {company.name} from a computer retail and repair company called Eagle Info Solutions.
            the email should be custom tailord based of the comanies profile in this case {company.profile}
            dont add thing but just the letter , dont communicate. make sure the response is plain text no layout.
            """
        )
        company.draft = response.text
    return state
