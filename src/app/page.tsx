import Hero from "@/components/landing/Hero";
import UserTypeSelection from "@/components/landing/UserTypeSelection";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/app/components/shared/Footer";
import CTA from "@/components/landing/CTA";
import NavBar from "@/app/components/landing/NavBar";
import CommunityStats from "./components/landing/CommunityStats";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <UserTypeSelection />
      <Features />
      <CommunityStats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
