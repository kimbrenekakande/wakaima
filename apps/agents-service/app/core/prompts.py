def draft_prompt(mkt_corp: dict, lead_company: dict) -> str:
    """Return a prompt string for drafting a lead marketing email."""
    return f"""
            draft a lead marketing email to the lead company below.
            
            rules :
                - Strictly in markdown format
                - the email should be custom tailored based to the companies interest based on the company's profile below.
                - when selling what we can do for them, make sure its not specurative but rather based on the lead companies profile.
                - Make sure the contents of the email do not include blanks to be filled
                - dont add thing but just the email,
                - do not specurate on what the company does
                - dont communicate.
            
            Marketing Company Profile :
                name : {mkt_corp["name"]}
                website : {mkt_corp["website"]}
                email : {mkt_corp["email"]}
                location : {mkt_corp["location"]}
                services : {mkt_corp["services"]}
            
            Lead Company Details :
                name: {lead_company["name"]}
                profile: {lead_company["profile"]}

            """
