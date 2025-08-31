import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import {
  Landmark,
  Building2,
  Users,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  Globe,
  ClipboardList,
  Sparkles,
} from "lucide-react";

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Results & Pilot Stories (Founding Cohort)
          </h1>
          <p className="text-green-100 text-lg max-w-3xl mx-auto">
            We’re collecting verified stories from our early users. Until then,
            here’s transparent traction and how you can become a featured case
            study.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-700 hover:bg-gray-100"
            >
              <Link href="/guards/signup">Join the Founding Cohort</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-700"
            >
              <Link href="/contact">Partner with Us (Mosques)</Link>
            </Button>
          </div>
        </div>
      </section> */}

      {/* Traction Signals (no fabricated quotes) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Early Traction We Can Stand Behind
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Founding Learners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-700">0 → 500+</p>
                <p className="text-sm text-gray-600">Target for pilot cohort</p>
                <div className="mt-3 text-xs text-gray-500">
                  We’ll publish anonymized usage stats (sessions, completion,
                  streaks) as the cohort progresses.
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-blue-600" />
                  Mosque Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-700">
                  Pilot Pipeline
                </p>
                <p className="text-sm text-gray-600">
                  Actively onboarding admins
                </p>
                <ul className="mt-3 text-sm text-gray-700 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />{" "}
                    Admin dashboards ready
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />{" "}
                    Scenario library for guards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />{" "}
                    Prayer-aware learning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  Regions of Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-amber-700">MENA + SEA</p>
                <p className="text-sm text-gray-600">Priority focus</p>
                <div className="mt-3 text-xs text-gray-500">
                  We’ll publish country-by-country engagement once live data
                  accrues.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Study Pipeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Upcoming Case Studies (Apply to Be Featured)
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-green-600" />
                  Guard Communication Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We’ll measure pre/post confidence, scenario completion rates,
                  emergency phrase recall, and visitor satisfaction proxies.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> 20+
                    core scenarios tracked
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />{" "}
                    Pronunciation score deltas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />{" "}
                    Streaks & session duration
                  </li>
                </ul>
                <Button asChild className="mt-2">
                  <Link href="/guards/signup">Enroll Your Team</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Admin & Operations Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  For mosque admins: adoption, engagement, and operational
                  improvements (noise incidents, queue handling, tour guidance
                  clarity).
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> Team
                    progress dashboard metrics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />{" "}
                    Training hours vs outcomes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />{" "}
                    Visitor experience signals
                  </li>
                </ul>
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/contact">Request Pilot Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* “Your Logo Here” grid (social proof placeholder without faking logos) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Be a Featured Partner
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-500"
              >
                Your Mosque Here
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href="/contact">Talk to Partnerships</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ethics note */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm text-slate-700">
              We never fabricate testimonials. Stories will appear here as
              they’re verified.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
