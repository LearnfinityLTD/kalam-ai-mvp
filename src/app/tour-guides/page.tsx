// src/app/tour-guides/page.tsx
import { Features } from "@/components/landing/shared/Features";
import NavBar from "@/components/landing/shared/NavBar";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import TourGuidesHero from "../components/landing/tour-guides/TourGuidesHero";
import TourGuidesCTAPage from "@/components/landing/tour-guides/TourGuidesCTA";
import TourGuideTestimonialsPage from "../components/landing/tour-guides/TourGuidesTestimonials";
// import TourGuidesTestimonials from "@/components/landing/tour-guides/TourGuidesTestimonials";

export default function TourGuidesPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="bg-blue-50 text-center py-2 text-sm">
        Not a tour guide? Check out our pages for{" "}
        <Link href="/guards" className="text-blue-700 hover:underline">
          guards
        </Link>{" "}
        or{" "}
        <Link href="/professionals" className="text-blue-700 hover:underline">
          professionals
        </Link>
      </div>
      <TourGuidesHero />
      <TourGuidesCTAPage />
      <TourGuideTestimonialsPage />
      <Features />
      <Footer />
    </div>
  );
}
