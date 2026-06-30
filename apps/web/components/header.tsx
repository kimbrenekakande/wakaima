"use client";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b pt-5", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<Link
					className="flex items-center rounded-md px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50"
					href="/"
				>
					<img
						alt="Wakaima"
						className="h-14 w-auto dark:hidden"
						src="/brand/wakaima-logo-black.png"
					/>
					<img
						alt="Wakaima"
						className="hidden h-14 w-auto dark:block"
						src="/brand/wakaima-logo-white.png"
					/>
				</Link>
				<div className="flex items-center gap-2">
					<Button variant="outline" render={<Link href="/login" />}>
						Log In
					</Button>
					<Button render={<Link href="/signup" />}>
						Get Started
					</Button>
				</div>
			</nav>
		</header>
	);
}
