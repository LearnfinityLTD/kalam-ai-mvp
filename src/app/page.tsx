import { Hero } from "@/app/components/landing/shared/Hero";
import { Features } from "@/app/components/landing/shared/Features";
import Footer from "@/app/components/landing/shared/LandingFooter";
import NavBar from "@/app/components/landing/shared/NavBar";
import { CommunityStats } from "./components/landing/shared/CommunityStats";
import { FAQ } from "./components/landing/shared/FAQ";
import { SEOHead } from "@/components/landing/shared/SEOHead";
import { Pricing } from "@/components/landing/shared/Pricing";
import { ContactSection } from "@/components/landing/shared/contact/ContactSection";
import CompetitorComparison from "./components/landing/shared/CompetitorComparison";
import OnboardingFlow from "./components/landing/shared/OnboardingFlow";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEOHead />
      <NavBar />
      <main className="w-full">
        <Hero />
        <CommunityStats />
        <OnboardingFlow />
        <Features />
        <CompetitorComparison />
        <FAQ />
        <ContactSection
          userType="general"
          title="Ready to Transform Your English Communication?"
          subtitle="Connect with our team to get started or answer any questions"
        />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
