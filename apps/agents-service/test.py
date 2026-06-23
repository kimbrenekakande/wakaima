from app.core.models import profileDataRetriverModel

profile = """
    # Gloveg Agri Ltd\n\nGloveg Agri Ltd is a Farming company. Founded in 2017. Headquartered in Kampala, Uganda.\n\n## About\nGloveg Agri is an agribusiness and agricultural services company headquartered in Kampala, Uganda. The Company has a vision of accelerating food security across Africa and to become a major player in Africa's food production. Our services cut across the entire agricultural value chain that ranges from land acquisition, production, financial and insurance services, value addition, and marketing.\nWhy Choose Us\nWe deeply understand and appreciate that agriculture is the backbone and leading foreign exchange earner of our economy. Everyone in Uganda is desirous of participating in agricultural production to improve their income levels and food security. However, many people are fully and busily engaged in the corporate world with no or limited time to engage in agricultural production. Also, many people lack modern agricultural equipment and technical knowhow to engage in meaningful, productive and economically viable agricultural production. It is against this background that, Gloveg Agri Limited proposes to adopt a corporate farming model by deploying its modern machinery and manpower to cheaply undertake agricultural production on behalf of our busy corporate clients.\n\n## Company Details\n- Industry: Farming\n- Type: Privately Held\n- Headquarters: Kampala, Uganda\n- Founded Year: 2017\n- Homepage: glovegagric.com\n- Aliases: gloveg agri ltd\n- LinkedIn: linkedin.com/company/gloveg-agri-ltd\n- Linkedin Followers: 93 (Yearly: +8.1%)\n\n## Workforce\n- Employees: 3\n  - Yearly Growth: -25.0%\n- Talent Sources: Africa Career Networks (1)\n- Alumni Go To: Development Infrastructure (1)\n\n## Categories\nn/a
"""


response = profileDataRetriverModel.invoke(
    [
        {
            "role": "user", 
            "content": f"""analyze the lead company profile below and extract the details
            lead_profile: {profile}"""
        }
    ]
)

print(response)
