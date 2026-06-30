"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Search, Mail, BarChart3, Users, Zap, Target } from "lucide-react";

const tasks = [
	{
		title: "AI Lead Discovery",
		subtitle: "Find qualified prospects by industry & location",
		icon: <Search className="w-4 h-4" />,
	},
	{
		title: "Smart Email Drafting",
		subtitle: "Personalized outreach crafted by AI",
		icon: <Mail className="w-4 h-4" />,
	},
	{
		title: "Pipeline Tracking",
		subtitle: "Visualize every deal stage in real-time",
		icon: <BarChart3 className="w-4 h-4" />,
	},
	{
		title: "Team Collaboration",
		subtitle: "Assign leads and track team performance",
		icon: <Users className="w-4 h-4" />,
	},
	{
		title: "One-Click Sending",
		subtitle: "Send or schedule emails instantly",
		icon: <Zap className="w-4 h-4" />,
	},
	{
		title: "Conversion Analytics",
		subtitle: "Measure reply rates and deals closed",
		icon: <Target className="w-4 h-4" />,
	},
];

export default function AutomatedTasksPanel() {
	return (
		<section className="relative w-full py-20 bg-background text-foreground">
			<div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-12">
				{/* LEFT SIDE - Task Loop with Vertical Bar */}
				<div className="relative w-full max-w-sm">
					<Card className="overflow-hidden bg-muted/30 dark:bg-muted/20 backdrop-blur-md shadow-xl rounded-lg">
						<CardContent className="relative h-[320px] p-0 overflow-hidden">
							{/* Scrollable Container */}
							<div className="relative h-full overflow-hidden">
								{/* Motion list */}
								<motion.div
									className="flex flex-col gap-2 absolute w-full"
									animate={{ y: ["0%", "-50%"] }}
									transition={{
										repeat: Infinity,
										repeatType: "loop",
										duration: 14,
										ease: "linear",
									}}
								>
									{[...tasks, ...tasks].map((task, i) => (
										<div
											key={i}
											className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 relative"
										>
											{/* Icon + Content */}
											<div className="flex items-center justify-between flex-1">
												<div className="flex items-center gap-2">
													<div>
														<p className="text-sm font-medium text-gray-900 dark:text-white">
															{task.title}
														</p>
														<p className="text-xs text-gray-500">
															{task.subtitle}
														</p>
													</div>
												</div>
												{task.icon}
											</div>
										</div>
									))}
								</motion.div>

								{/* Fade effect only inside card */}
								<div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background via-background/70 to-transparent pointer-events-none" />
								<div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* RIGHT SIDE - Content */}
				<div className="space-y-8">
					<h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
						AI-Powered Workflow
					</h2>
					<h3 className="text-lg sm:text-md lg:text-2xl font-normal text-gray-900 dark:text-white leading-relaxed">
						From discovery to deal — automated{" "}
						<span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-2xl">
							Wakaima automates the entire outreach workflow. Our AI finds
							qualified leads, drafts personalized emails, tracks your pipeline,
							and measures conversion — so your team can focus on closing, not
							grinding.
						</span>
					</h3>

					<div className="flex gap-4 flex-wrap mt-2">
						<Badge className="px-4 py-2 text-sm">AI Lead Gen</Badge>
						<Badge className="px-4 py-2 text-sm">Email Automation</Badge>
						<Badge className="px-4 py-2 text-sm">Pipeline Tracking</Badge>
					</div>
				</div>
			</div>
		</section>
	);
}
