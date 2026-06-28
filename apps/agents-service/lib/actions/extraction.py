from typing import cast

from app.core.models import profileDataRetrieverModel
from app.core.schemas import ProfileData


async def ProfileDataExtraction(profile : str) -> ProfileData:
    result = cast(
        ProfileData,
        profileDataRetrieverModel.invoke(
            [
                {
                    "role": "user",
                    "content": f"""analyze the lead company profile below and extract its email and location. if any insnt available return null
                lead_profile: {profile}""",
                }
            ]
        ),
    )

    response: ProfileData = ProfileData(
        email=result.email,
        location=result.location,
    )
    return response
