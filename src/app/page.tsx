import Hero from "@/app/components/landing/Hero";
import UserTypeSelection from "@/components/landing/UserTypeSelection";
import Features from "@/app/components/landing/shared/Features";
import Footer from "@/app/components/shared/Footer";
import NavBar from "@/app/components/landing/shared/NavBar";
import CommunityStats from "./components/landing/shared/CommunityStats";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />
      <UserTypeSelection />
      <CommunityStats />
      <Features />
      <Footer />
    </div>
  );
}
