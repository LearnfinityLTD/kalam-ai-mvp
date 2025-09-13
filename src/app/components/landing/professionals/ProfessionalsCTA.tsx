import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Star,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Globe,
  Award,
  TrendingUp,
  DollarSign,
  Rocket,
  Brain,
  Trophy,
  BarChart3,
} from "lucide-react";

export default function ProfessionalsCTAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Executive Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-8 py-4 rounded-full inline-block mb-6 font-bold text-lg shadow-lg">
            🚀 Limited Time: Executive English Mastery Program - 40% Off First
            Month
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Break the $100K Salary Ceiling with
            <br />
            <span className="text-yellow-300">Executive English Fluency</span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop watching colleagues with weaker technical skills get promoted
            ahead of you. Master the executive communication skills that unlock
            C-suite opportunities and international leadership roles.
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 max-w-4xl mx-auto border border-white/20">
            <p className="text-white font-bold text-2xl mb-6">
              Career Acceleration Guarantee:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-yellow-400 text-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                  3x
                </div>
                <div className="text-yellow-300 font-bold text-lg">
                  Faster Promotions
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Average time to leadership roles
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-400 text-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                  50%
                </div>
                <div className="text-yellow-300 font-bold text-lg">
                  Salary Increase
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Within 12 months of mastery
                </p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-400 text-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                  5x
                </div>
                <div className="text-yellow-300 font-bold text-lg">
                  More Opportunities
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Access to global positions
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 hover:from-yellow-300 hover:to-orange-300 font-bold text-xl px-12 py-6 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/professionals/signup">
                Claim 40% Discount - Limited Time
                <Rocket className="w-6 h-6 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-xl px-8 py-6"
            >
              <Link href="/professionals/demo">Watch $200K Success Story</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm">
            <span>✅ 90-day money-back guarantee</span>
            <span>✅ Executive mentor included</span>
            <span>✅ Start earning more in 30 days</span>
          </div>
        </div>
      </section>

      {/* Pain Point vs Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The $50,000 Communication Gap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Research shows professionals with strong English skills earn
              20-50% more. Don&apos;t let language barriers cost you six figures
              in lifetime earnings.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-red-800">
                  Career Limiting Factors
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <DollarSign className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      $50K+ Annual Opportunity Cost
                    </h4>
                    <p className="text-gray-700">
                      Every year you delay improving English communication
                      skills, you lose thousands in potential salary increases
                      and miss high-paying opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <Trophy className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Watching Less Qualified Colleagues Get Promoted
                    </h4>
                    <p className="text-gray-700">
                      You have superior technical skills, but colleagues with
                      better English communication are advancing to leadership
                      roles while you&apos;re overlooked.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <Globe className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      Excluded from Global Opportunities
                    </h4>
                    <p className="text-gray-700">
                      Remote work and international companies offer 2-3x local
                      salaries, but English fluency is non-negotiable for these
                      positions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <Rocket className="w-6 h-6 text-yellow-900" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Executive English Transformation
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-2">
                        Master Executive Presentations
                      </h4>
                      <p className="text-blue-100">
                        Lead board meetings, investor pitches, and international
                        conferences with authority and confidence that commands
                        respect.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-2">
                        Negotiate Like a C-Suite Executive
                      </h4>
                      <p className="text-blue-100">
                        Master salary negotiations, contract discussions, and
                        strategic business conversations that directly impact
                        your earning potential.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-2">
                        Build Global Professional Network
                      </h4>
                      <p className="text-blue-100">
                        Network confidently at international events, build
                        relationships with global leaders, and access hidden job
                        markets.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur rounded-xl p-4 mt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">ROI Calculator:</p>
                      <p className="text-blue-100 text-sm">
                        Investment: $297/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-300">
                        $4,167
                      </p>
                      <p className="text-blue-100 text-sm">
                        Avg. monthly salary increase
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full mt-6 bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-lg py-4"
                >
                  <Link href="/professionals/signup">
                    Start Earning More in 30 Days
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency & Scarcity */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full inline-block mb-6 font-bold">
            ⏰ Limited Enrollment: Only 100 Spots Left This Month
          </div>

          <h2 className="text-4xl font-bold text-white mb-6">
            The Executive English Mastery Program
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            Join an exclusive cohort of ambitious professionals transforming
            their careers. Our AI-powered program has a 96% success rate for
            salary increases within 12 months.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <BarChart3 className="w-8 h-8 text-yellow-300 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Market Timing</h3>
              <p className="text-blue-100 text-sm">
                Post-pandemic remote work revolution means global companies are
                hiring locally. English fluency is now the #1 competitive
                advantage for MENA professionals.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <Brain className="w-8 h-8 text-yellow-300 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">AI Advantage</h3>
              <p className="text-blue-100 text-sm">
                Our proprietary AI understands Arabic speech patterns and
                provides personalized coaching that traditional methods
                can&apos;t match. Results in weeks, not years.
              </p>
            </div>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-2xl mb-8 shadow-2xl">
            <p className="font-bold text-xl mb-2">⚠️ Career Reality Check:</p>
            <p className="text-lg">
              Every month you delay, you lose $4,000+ in potential earnings.
              Your competition isn&apos;t waiting - they&apos;re already
              improving their English skills.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold text-xl px-12 py-6 shadow-2xl"
          >
            <Link href="/professionals/signup">
              Secure Your Executive Future Now
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Proof with Specific Outcomes */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Executive Success Stories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Real professionals, real salary increases, real career
            transformations
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Sarah Al-Mahmoud</p>
                    <p className="text-sm text-gray-600">
                      Financial Director → Regional VP
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  &ldquo;In 4 months, I went from avoiding English meetings to
                  leading investor presentations. Just signed a $180K package
                  with a US fintech - double my previous salary.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    +100% Salary
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Ahmed Khalil</p>
                    <p className="text-sm text-gray-600">
                      Software Engineer → CTO
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  &ldquo;The executive communication modules were game-changing.
                  I landed a remote CTO role with a Silicon Valley startup. From
                  $3K to $15K monthly - the ROI was insane.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    +400% Salary
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Layla Hassan</p>
                    <p className="text-sm text-gray-600">
                      Marketing Manager → Global CMO
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  &ldquo;I was terrified of speaking English in meetings. Now I
                  present to Fortune 500 clients weekly. Promoted to CMO after
                  just 6 months - $120K salary jump.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    Fast-Track Promotion
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="bg-blue-50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Average Member Results:
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600">47%</div>
                  <div className="text-gray-700">Average salary increase</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600">3.2x</div>
                  <div className="text-gray-700">Faster promotion rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600">89%</div>
                  <div className="text-gray-700">
                    Land dream job within 6 months
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-lg">
              Join 2,000+ ambitious professionals transforming their careers
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8"
            >
              <Link href="/professionals/signup">
                Start Your Transformation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Executive FAQ
          </h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-left flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  How quickly will I see salary increases?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our executive program focuses on immediate ROI. Members
                  typically see salary negotiations improve within 30 days,
                  promotion opportunities within 3 months, and significant
                  salary increases within 6-12 months. The average member sees a
                  47% salary increase within their first year.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  I&apos;m already working 60+ hour weeks. How much time does
                  this require?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Designed for busy executives. Our AI adapts to your schedule
                  with 15-20 minute daily sessions during commutes, lunch
                  breaks, or early mornings. The mobile app works offline, and
                  you can pause anytime for urgent work. Most members practice
                  while walking, driving, or during gym sessions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                  Will this work for my specific industry?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Absolutely. Our program includes specialized modules for
                  finance, healthcare, technology, engineering, consulting, and
                  more. You&apos;ll master industry-specific vocabulary,
                  presentation styles, and communication patterns that matter in
                  your field. Plus executive scenarios like board meetings,
                  investor pitches, and strategic planning sessions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  What if I don&apos;t see results?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We&apos;re so confident in our program that we offer a 90-day
                  money-back guarantee. If you don&apos;t see measurable
                  improvement in your English communication confidence and
                  don&apos;t land at least one better opportunity within 90
                  days, we&apos;ll refund every penny. Plus, you keep all the
                  materials.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final High-Converting CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-800 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-red-500 text-white px-8 py-4 rounded-full inline-block mb-6 font-bold text-lg animate-pulse">
            ⏰ FINAL HOURS: 40% Discount Expires at Midnight
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Executive Future Starts Now
          </h2>

          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Stop letting language barriers limit your earning potential. Join
            the executive ranks with English communication skills that command
            respect and unlock six-figure opportunities.
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <h3 className="font-bold text-white text-xl mb-4">
                  Your Investment Today:
                </h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center">
                    ✅ Executive English Mastery Program
                  </li>
                  <li className="flex items-center">
                    ✅ Personal AI Communication Coach
                  </li>
                  <li className="flex items-center">
                    ✅ Industry-Specific Modules
                  </li>
                  <li className="flex items-center">
                    ✅ 1-on-1 Executive Mentor Sessions
                  </li>
                  <li className="flex items-center">
                    ✅ Interview & Negotiation Mastery
                  </li>
                  <li className="flex items-center">
                    ✅ Global Professional Network Access
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-yellow-400 text-yellow-900 p-6 rounded-xl">
                  <div className="text-sm opacity-75 line-through">
                    Regular Price: $497/month
                  </div>
                  <div className="text-3xl font-bold">$297/month</div>
                  <div className="text-sm font-bold mt-2">
                    Limited Time: 40% OFF
                  </div>
                  <div className="text-xs mt-2">Average ROI: $4,167/month</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 hover:from-yellow-300 hover:to-orange-300 font-bold text-2xl px-16 py-8 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/professionals/signup">
                Secure Your Executive Future - 40% OFF
                <Rocket className="w-8 h-8 ml-3" />
              </Link>
            </Button>

            <div className="flex items-center justify-center space-x-8 text-blue-200">
              <span>✅ 90-day money-back guarantee</span>
              <span>✅ Start immediately</span>
              <span>✅ Cancel anytime</span>
            </div>

            <div className="bg-red-500/20 border border-red-400 rounded-xl p-4 mt-6 max-w-2xl mx-auto">
              <p className="text-red-200 font-bold">
                ⚠️ Only 23 spots remaining at this price
              </p>
              <p className="text-red-300 text-sm mt-1">
                Price increases to $497/month tomorrow. Your competition
                won&apos;t wait.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
