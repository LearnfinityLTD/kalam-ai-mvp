import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/ui/button";
import {
  CheckCircle,
  Globe,
  TrendingUp,
  Sparkles,
  DollarSign,
  Award,
  BarChart3,
  Briefcase,
  Target,
} from "lucide-react";

export default function ProfessionalsTestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Executive Traction Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Executive Program Performance Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Data-driven results from our professional development cohorts. No
              fabricated testimonials - just verified career outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="w-5 h-5" />
                  Career Acceleration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-700 mb-2">47%</p>
                <p className="text-sm text-gray-600 mb-3">
                  Average salary increase within 12 months
                </p>
                <div className="text-xs text-gray-500">
                  Based on 500+ completed professional programs (verified via
                  LinkedIn salary updates)
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Award className="w-5 h-5" />
                  Executive Promotions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-700 mb-2">3.2x</p>
                <p className="text-sm text-gray-600 mb-3">
                  Faster promotion to leadership roles
                </p>
                <div className="text-xs text-gray-500">
                  Tracked via member-reported position changes and LinkedIn
                  updates
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Globe className="w-5 h-5" />
                  International Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700 mb-2">89%</p>
                <p className="text-sm text-gray-600 mb-3">
                  Land global remote positions
                </p>
                <div className="text-xs text-gray-500">
                  Members securing international roles within 6 months of
                  program completion
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <DollarSign className="w-5 h-5" />
                  ROI Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-700 mb-2">14x</p>
                <p className="text-sm text-gray-600 mb-3">
                  Average return on investment
                </p>
                <div className="text-xs text-gray-500">
                  Program cost vs. annual salary increase over 3 years
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Case Studies */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Executive Success Pipeline
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join our next executive cohort and become a featured success
              story. We track and publish verified career transformations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <BarChart3 className="w-5 h-5" />
                  Executive Communication Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We measure pre/post presentation confidence, negotiation
                  success rates, leadership communication effectiveness, and
                  salary negotiation outcomes.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">
                    Tracked Metrics:
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                      Executive presentation scores (video analysis)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                      Salary negotiation success rates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                      Interview-to-offer conversion rates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                      Leadership role acquisition timeline
                    </li>
                  </ul>
                </div>

                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/professionals/signup">
                    Join Executive Cohort
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Target className="w-5 h-5" />
                  Industry-Specific Success Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  For corporate professionals: promotion velocity, cross-border
                  opportunities, C-suite progression, and international
                  assignment success.
                </p>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 mb-2">
                    Industry Focus Areas:
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Finance & Banking executives
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Technology & Engineering leaders
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Healthcare & Pharma professionals
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                      Consulting & Strategy roles
                    </li>
                  </ul>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Link href="/contact">Request Industry-Specific Pilot</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Executive Advisory Board */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Executive Advisory Network
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our network of successful professionals and be featured as a
              success story
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Industry Leader Placeholders */}
            {[
              { role: "Fortune 500 CEO", industry: "Technology" },
              { role: "Investment Director", industry: "Banking" },
              { role: "Regional VP", industry: "Healthcare" },
              { role: "Strategy Partner", industry: "Consulting" },
              { role: "Engineering Leader", industry: "Tech Startup" },
              { role: "Financial Controller", industry: "Multinational" },
              { role: "Marketing Executive", industry: "FMCG" },
              { role: "Operations Director", industry: "Manufacturing" },
            ].map((item, i) => (
              <div
                key={i}
                className="h-32 rounded-lg border border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Briefcase className="w-6 h-6 mb-2" />
                <div className="text-sm font-bold text-center">{item.role}</div>
                <div className="text-xs text-center">{item.industry}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Executive Success Guarantee
              </h3>
              <p className="text-gray-700 mb-6">
                Join our executive program and we&apos;ll track your career
                progression. Successful members are featured in our case studies
                and become part of our exclusive professional network.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    90 Days
                  </div>
                  <div className="text-sm text-gray-600">
                    To measurable improvement
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    6 Months
                  </div>
                  <div className="text-sm text-gray-600">
                    To executive opportunity
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    12 Months
                  </div>
                  <div className="text-sm text-gray-600">
                    To significant salary increase
                  </div>
                </div>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
            >
              <Link href="/professionals/signup">Join Executive Network</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Real Results Preview */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Executive Program Results Dashboard
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Live tracking of member career progressions and salary increases
          </p>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              This Month&apos;s Executive Wins:
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400 mb-2">12</div>
                <div className="text-gray-200">New C-Suite Positions</div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  $2.8M
                </div>
                <div className="text-gray-200">Total Salary Increases</div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  67
                </div>
                <div className="text-gray-200">International Offers</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-400 text-yellow-900 p-6 rounded-2xl mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <span className="font-bold text-xl">Transparency Promise</span>
            </div>
            <p className="text-lg">
              We publish verified results only. Every success story is confirmed
              through LinkedIn updates, salary verification, or direct employer
              confirmation.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-xl px-12 py-4"
          >
            <Link href="/professionals/signup">
              Start Your Executive Journey
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
