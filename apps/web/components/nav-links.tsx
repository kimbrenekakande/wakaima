import type { LinkItemType } from "@/components/sheard";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Globe02Icon,
	Mail01Icon,
	WorkflowSquare02Icon,
	Analytics02Icon,
	Plug01Icon,
	CodeIcon,
	UserMultipleIcon,
	StarIcon,
	Agreement02Icon,
	File02Icon,
	Shield01Icon,
	RotateLeft01Icon,
	Leaf01Icon,
	HelpCircleIcon,
} from "@hugeicons/core-free-icons";

export const productLinks: LinkItemType[] = [
	{
		label: "Lead Discovery",
		href: "/#lead-discovery",
		description: "AI-powered lead generation and enrichment",
		icon: <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} />,
	},
	{
		label: "Email Outreach",
		href: "/#outreach",
		description: "AI-drafted, personalized email campaigns",
		icon: <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />,
	},
	{
		label: "Pipeline Management",
		href: "/#pipeline",
		description: "Track deals from prospect to close",
		icon: <HugeiconsIcon icon={WorkflowSquare02Icon} strokeWidth={2} />,
	},
	{
		label: "Analytics",
		href: "/#analytics",
		description: "Conversion tracking and performance insights",
		icon: <HugeiconsIcon icon={Analytics02Icon} strokeWidth={2} />,
	},
	{
		label: "Integrations",
		href: "/#integrations",
		description: "Connect your CRM, email, and tools",
		icon: <HugeiconsIcon icon={Plug01Icon} strokeWidth={2} />,
	},
	{
		label: "API",
		href: "/#api",
		description: "Build custom workflows with our API",
		icon: <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />,
	},
];

export const companyLinks: LinkItemType[] = [
	{
		label: "About Us",
		href: "/about",
		description: "Learn more about our story and mission",
		icon: <HugeiconsIcon icon={UserMultipleIcon} strokeWidth={2} />,
	},
	{
		label: "Customer Stories",
		href: "/customers",
		description: "See how teams close more deals with Wakaima",
		icon: <HugeiconsIcon icon={StarIcon} strokeWidth={2} />,
	},
	{
		label: "Partnerships",
		href: "/partners",
		description: "Collaborate with us for mutual growth",
		icon: <HugeiconsIcon icon={Agreement02Icon} strokeWidth={2} />,
	},
];

export const companyLinks2: LinkItemType[] = [
	{
		label: "Terms of Service",
		href: "/terms",
		icon: <HugeiconsIcon icon={File02Icon} strokeWidth={2} />,
	},
	{
		label: "Privacy Policy",
		href: "/privacy",
		icon: <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />,
	},
	{
		label: "Refund Policy",
		href: "/refunds",
		icon: <HugeiconsIcon icon={RotateLeft01Icon} strokeWidth={2} />,
	},
	{
		label: "Blog",
		href: "/blog",
		icon: <HugeiconsIcon icon={Leaf01Icon} strokeWidth={2} />,
	},
	{
		label: "Help Center",
		href: "/help",
		icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
	},
];
