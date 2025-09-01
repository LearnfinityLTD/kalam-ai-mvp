// src/app/guards/page.tsx
import GuardsHero from "@/components/landing/guards/GuardsHero";
import GuardsCTA from "@/components/landing/guards/GuardsCTA";
import GuardsTestimonials from "@/components/landing/guards/GuardsTestimonials";
import Features from "@/components/landing/shared/Features";
import NavBar from "@/components/landing/shared/NavBar";
import Footer from "@/components/shared/Footer";
import Link from "next/link";

export default function GuardsPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="bg-blue-50 text-center py-2 text-sm">
        Not a guard? Check out our pages for{" "}
        <Link href="/tour-guides" className="text-blue-700 hover:underline">
          tour guides
        </Link>{" "}
        or{" "}
        <Link href="/professionals" className="text-blue-700 hover:underline">
          professionals
        </Link>
      </div>

      <GuardsHero />
      <GuardsCTA />
      <GuardsTestimonials />
      <Features />
      <Footer />
    </div>
  );
}
