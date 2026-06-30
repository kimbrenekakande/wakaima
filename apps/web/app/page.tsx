import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { LogosSection } from "@/components/logos-section";
import AutomatedTasksPanel from "@/components/ruixen/automated-tasks-panel";
import FooterPro from "@/components/ruixen/footer-pro";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LogosSection />
        <AutomatedTasksPanel />
        <FooterPro />
      </main>
    </>
  );
}
