import { Hero } from "@/app/components/landing/shared/Hero";
import { UserTypeSelection } from "@/app/components/landing/shared/UserTypeSelection";
import { Features } from "@/app/components/landing/shared/Features";
import Footer from "@/app/components/shared/Footer";
import NavBar from "@/app/components/landing/shared/NavBar";
import { CommunityStats } from "./components/landing/shared/CommunityStats";
import { FAQ } from "./components/landing/shared/FAQ";
import { SEOHead } from "@/components/landing/shared/SEOHead";
import { Pricing } from "@/components/landing/shared/Pricing";
import { CulturalContext } from "@/components/landing/shared/CulturalContext";
import { ContactSection } from "@/components/landing/shared/contact/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEOHead />
      <NavBar />
      <main className="w-full">
        <Hero />
        <CommunityStats />
        <UserTypeSelection />
        <CulturalContext />
        <Features />
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
