def draft_prompt(mkt_corp: dict, lead_company: dict) -> str:
    """Return a prompt string for drafting a lead marketing email."""
    return f"""
            draft a lead marketing email to the lead company below.
        
            
            Marketing Company Profile :
                name : {mkt_corp["name"]}
                website : {mkt_corp["website"]}
                email : {mkt_corp["email"]}
                location : {mkt_corp["location"]}
                services : {mkt_corp["services"]}
            
            Lead Company Details :
                name: {lead_company["name"]}
                profile: {lead_company["profile"]}


             rules :
                 - Strictly in markdown format
                 - ground the email in what you can actually do for this company — tie every claim or pitch to something concrete in their profile, not generic marketing fluff.
                 - when selling what we can do for them, make sure its not specurative but rather based on the lead companies profile.
                 - Make sure the contents of the email do not include blanks to be filled
                 - dont add thing but just the email,
                 - do not specurate on what the company does
                 - dont communicate.
                 - do not add a top greeting like "Hello [Company Name]," or "Dear [Company Name]."
                 - Use no more than two heading levels (e.g., ## and ###). Do not use h1 (#) or headings larger than h2.
                 - avoid overusing em dashes between words

                 Write in a natural, human style. Specifically avoid these common AI writing patterns:
                 
                 VOCABULARY & TONE
                 - Cut generic intensifiers and puffery ("rich history," "stands as a testament," "plays a vital role," "boasts," "underscores"). State facts plainly instead.
                 - Don't inflate small topics by linking them to grand themes ("this reflects broader trends in...", "highlighting the enduring importance of..."). If the significance isn't concrete, leave it unstated.
                 - Avoid vague attributions ("some critics argue," "many believe," "experts say") — name a source or cut the claim.
                 - Skip travel-brochure language for places/culture (words like "nestled," "breathtaking," "vibrant tapestry").
                 
                 STRUCTURE & RHYTHM
                 - Don't restate or summarize what you just said ("In summary," "Overall," "In conclusion") unless explicitly asked for a summary.
                 - Avoid the "It's not X, it's Y" contrast-reframe pattern unless it's doing real work.
                 - Vary sentence length and structure — don't fall into a rigid rhythm of similar-length sentences with the same transition words ("Moreover," "Furthermore," "Additionally") stitching every paragraph.
                 - Don't impose a rigid template (e.g., automatic "Challenges" / "Future Outlook" sections) unless the user asked for that structure.
                 
                 FORMATTING
                 - Don't overuse bullet points, bold text, or headers for short, simple answers — prose is fine.
                 - Avoid title case in headings unless that's the house style.
                 - Skip decorative emojis unless the user uses them first or asks for them.
                 
                 SUBSTANCE
                 - Prefer specific, verifiable, sometimes idiosyncratic details over smoothed-over generalities. Specificity is the biggest tell of human writing; vague genericness is the biggest tell of AI writing.
                 - It's fine to be direct, opinionated, or blunt where appropriate — don't hedge everything into mush.
                 - Don't add unsolicited "analytical" tag-on phrases that state the obvious significance of a fact ("...demonstrating its lasting impact").
                 
                 Write as if a knowledgeable person dashed this off, not as if you're filling in a template.

            """
