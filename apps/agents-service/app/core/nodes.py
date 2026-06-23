import json
import os
from typing import cast

import markdown
from core.models import groq, profileDataRetriverModel
from core.schemas import (
    CompanyReport,
    ProfileData,
    SearchResult,
    emailReq,
    # leadReq,
    leadsSearchState,
)
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, LLMConfig, LLMExtractionStrategy
from dotenv import load_dotenv
from exa_py import Exa

load_dotenv()


async def search_node(state: leadsSearchState):
    query = f"Generate Leads of {state.industry} Companies in {state.country}{' in ' + state.district if state.district else ''}"
    exa = Exa(api_key=os.getenv("EXA_API_KEY"))

    results = exa.search_and_contents(
        query,
        category="company",
        num_results=state.no_results,
        type="deep",
    )

    for r in results.results:
        print(r)
        state.leads.append(
            SearchResult(id=None, name=r.title, url=r.url, profile=r.text)
        )

    return state


def _parse_extracted_content(extracted_content):
    """Parse crawled extracted_content (a JSON string) into a dict.

    When chunking is enabled, the JSON string may contain a list of results
    (one per chunk) — this takes the first element.
    """
    parsed = json.loads(extracted_content)
    if isinstance(parsed, list):
        return parsed[0] if parsed else {}
    return parsed


async def research_node(state: leadsSearchState):

    llm_extraction_strategy = LLMExtractionStrategy(
        llm_config=LLMConfig(
            base_url="https://api.deepseek.com",
            provider="deepseek/deepseek-chat",
            api_token=os.getenv("DEEPSEEK_API_KEY"),
        ),
        schema=CompanyReport.model_json_schema(),
        extraction_type="schema",
        instruction="Extract a detailed lead report from the company website. provide as much info as posiible in the profile field ",
        chunk_token_threshold=1200,
        overlap_rate=0.1,
        apply_chunking=True,
        input_format="fit_markdown",
        verbose=True,
    )

    config = CrawlerRunConfig(extraction_strategy=llm_extraction_strategy)

    for lead in state.leads:
        if not lead.url:
            state.leads.remove(lead)
            continue

        async with AsyncWebCrawler() as crawler:
            results = await crawler.arun(lead.url, config=config)

            if results.extracted_content:
                data = _parse_extracted_content(results.extracted_content)
                lead.name = data.get("name", lead.name)
                lead.email = data.get("email", lead.email)
                lead.profile = data.get("profile", lead.profile)

            # if landing page doesn't contain an email
            if not lead.email:
                # First pass: look for a mailto: link
                for v in results.links.values():
                    for link in v:
                        href = link.get("href", "")
                        if "mailto:" in href:
                            lead.email = href.replace("mailto:", "")
                            break
                    if lead.email:
                        break

                # Second pass: if still no email, find a contact page and scrape it
                if lead.email == "":
                    for v in results.links.values():
                        for link in v:
                            href = link.get("href", "")
                            if "contact" in href:
                                contact_results = await crawler.arun(
                                    href, config=config
                                )
                                if (
                                    contact_results
                                    and contact_results.extracted_content
                                ):
                                    data = _parse_extracted_content(
                                        contact_results.extracted_content
                                    )
                                    lead.email = data.get("email", lead.email)
                                if lead.email:
                                    break
                        if lead.email:
                            break

    for lead in state.leads:
        if not lead.email:
            response = cast(
                ProfileData,
                profileDataRetriverModel.invoke(
                    [
                        {
                            "role": "user",
                            "content": f"""analyze the lead company profile below and extract the details
                            lead_profile: {lead.profile}""",
                        }
                    ]
                ),
            )

            if response:
                lead.email = response.email
                lead.location = response.location


async def draft_node(state: emailReq):
    for company in state.companies:
        response = groq.invoke(
            input=f"""
            write a markdown format lead generation email in react email syntax html to the company {company.name} from a computer retail and repair company called Eagle Info Solutions.
            the email should be custom tailored based of the company's profile in this case {company.profile}
            dont add thing but just the letter , dont communicate. make sure the response is plain text no layout.
            """
        )
        company.draft = markdown.markdown(response.text)
    return state
