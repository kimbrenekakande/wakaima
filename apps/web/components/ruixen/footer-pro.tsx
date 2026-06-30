"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

/* ── types ─────────────────────────────────────────────────────── */
interface FooterLink {
	label: string;
	href: string;
}

interface FooterColumn {
	title: string;
	links: FooterLink[];
}

interface FooterSocial {
	icon: React.ComponentType<{ className?: string }>;
	href: string;
	label?: string;
}

interface FooterProProps {
	brandMark?: React.ReactNode;
	brandName?: string;
	description?: string;
	columns?: FooterColumn[];
	socials?: FooterSocial[];
	bottomLinks?: FooterLink[];
	statusText?: string;
	copyright?: string;
}

/* ── default brand mark ────────────────────────────────────────── */
function DefaultMark() {
	return (
		<>
			<Image
				alt="Wakaima"
				className="dark:hidden"
				height={18}
				src="/brand/wakaima-logo-black.png"
				width={90}
			/>
			<Image
				alt="Wakaima"
				className="hidden dark:block"
				height={18}
				src="/brand/wakaima-logo-white.png"
				width={90}
			/>
		</>
	);
}

/* ── defaults ──────────────────────────────────────────────────── */
const defaults = {
	brandName: "",
	description:
		"AI-powered lead management for modern sales teams. Discover qualified leads, draft personalized emails, and close more deals — all in one platform.",
	columns: [
		{
			title: "Product",
			links: [
				{ label: "Lead Discovery", href: "/#lead-discovery" },
				{ label: "Email Outreach", href: "/#outreach" },
				{ label: "Pipeline", href: "/#pipeline" },
				{ label: "Analytics", href: "/#analytics" },
				{ label: "Integrations", href: "/#integrations" },
			],
		},
		{
			title: "Resources",
			links: [
				{ label: "Documentation", href: "/docs" },
				{ label: "API Reference", href: "/docs/api" },
				{ label: "Guides", href: "/guides" },
				{ label: "Blog", href: "/blog" },
				{ label: "Help Center", href: "/help" },
			],
		},
		{
			title: "Company",
			links: [
				{ label: "About", href: "/about" },
				{ label: "Customers", href: "/customers" },
				{ label: "Partners", href: "/partners" },
				{ label: "Careers", href: "/careers" },
				{ label: "Contact", href: "/contact" },
			],
		},
	] as FooterColumn[],
	socials: [] as FooterSocial[],
	bottomLinks: [
		{ label: "Privacy", href: "/privacy" },
		{ label: "Terms", href: "/terms" },
	] as FooterLink[],
	statusText: "All systems operational",
	copyright: `\u00A9 ${new Date().getFullYear()} Wakaima`,
};

export default function FooterPro(props?: FooterProProps) {
	const brandMark = props?.brandMark;
	const brandName = props?.brandName ?? defaults.brandName;
	const description = props?.description ?? defaults.description;
	const columns = props?.columns ?? defaults.columns;
	const socials = props?.socials ?? defaults.socials;
	const bottomLinks = props?.bottomLinks ?? defaults.bottomLinks;
	const statusText = props?.statusText ?? defaults.statusText;
	const copyright = props?.copyright ?? defaults.copyright;

	return (
		<footer className="border-t border-foreground/[0.06] bg-background">
			<div className="mx-auto max-w-5xl px-4 py-12 lg:py-16">
				<div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
					{/* brand */}
					<div className="shrink-0 lg:max-w-[280px]">
						<div className="flex items-center gap-2.5">
							{brandMark ?? <DefaultMark />}
							{brandName && (
								<span className="text-[15px] font-[590] tracking-[-0.015em] text-foreground">
									{brandName}
								</span>
							)}
						</div>
						<p className="mt-4 text-[13px] leading-[1.6] text-foreground/45">
							{description}
						</p>
					</div>

					{/* columns */}
					<div className="grid grid-cols-3 gap-8 w-full lg:w-auto text-right">
						{columns.map((col) => (
							<div key={col.title}>
								<p className="text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/30">
									{col.title}
								</p>
								<ul className="mt-4 space-y-2.5">
									{col.links.map((link) => (
										<li key={link.label}>
											<Link
												href={link.href}
												className="inline-flex items-center text-[13px] text-foreground/50 transition-colors duration-150 hover:text-foreground"
											>
												<span className="transition-transform duration-150 hover:translate-x-0.5">
													{link.label}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="mt-14 border-t border-foreground/[0.06] pt-6">

					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<p className="text-[12px] text-foreground/25">{copyright}</p>

						<div className="flex items-center gap-5">
							{bottomLinks.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									className="text-[12px] text-foreground/30 transition-colors duration-150 hover:text-foreground/60"
								>
									{link.label}
								</Link>
							))}

							{socials.length > 0 && bottomLinks.length > 0 && (
								<div className="h-3 w-px bg-foreground/[0.08]" />
							)}

							{socials.map(({ icon: Icon, href, label }, idx) => (
								<Link
									key={idx}
									href={href}
									aria-label={label}
									className="text-foreground/30 transition-colors duration-150 hover:text-foreground/60"
								>
									<Icon className="size-3.5" />
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
