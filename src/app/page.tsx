import { Hero } from "@/app/components/landing/shared/Hero";
import { UserTypeSelection } from "@/app/components/landing/shared/UserTypeSelection";
import { Features } from "@/app/components/landing/shared/Features";
import Footer from "@/app/components/shared/Footer";
import NavBar from "@/app/components/landing/shared/NavBar";
import { CommunityStats } from "./components/landing/shared/CommunityStats";
import { FAQ } from "./components/landing/shared/FAQ";
import { SEOHead } from "@/components/landing/shared/SEOHead";
import { Pricing } from "./components/landing/shared/Pricing";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEOHead />
      <NavBar />
      <main className="w-full">
        <Hero />
        <CommunityStats />
        <UserTypeSelection />
        <Features />
        <FAQ />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
