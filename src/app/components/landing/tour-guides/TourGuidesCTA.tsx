import Link from "next/link";
import { Button } from "@/ui/button";
import { Users, Star, CheckCircle, ArrowRight, Gift } from "lucide-react";

export default function TourGuidesCTA() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-300 text-yellow-900 px-6 py-3 rounded-full inline-block mb-6 font-bold">
            🌍 Trusted by 2,800+ Tour Guides Worldwide
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Become a <span className="text-yellow-300">5-Star Tour Guide</span>
          </h1>

          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Master storytelling and English skills to connect with international
            groups, earn bigger tips, and get more 5-star reviews.
          </p>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-white font-medium text-lg mb-4">
              New Member Benefits Include:
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <Star className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">5-Star Reviews</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">Bigger Groups</div>
              </div>
              <div className="text-center">
                <Gift className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">Higher Tips</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-lg px-8"
            >
              <Link href="/auth/signup?type=guide">
                Start Your Tour Guide Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              <Link href="/guides/demo">Watch 2-Min Demo</Link>
            </Button>
          </div>

          <p className="text-orange-200 mt-4 text-sm">
            Join a global community of guides building thriving careers
          </p>
        </div>
      </section>

      {/* Problem / Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Common Challenges for Tour Guides
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Language Barriers
                    </h3>
                    <p className="text-gray-700">
                      Struggling to explain sites clearly in English makes it
                      hard to impress international groups.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Missed Tips & Reviews
                    </h3>
                    <p className="text-gray-700">
                      Without engaging storytelling, tourists tip less and leave
                      fewer reviews.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Small Group Sizes
                    </h3>
                    <p className="text-gray-700">
                      English-speaking guides attract more tourists and bigger
                      groups daily.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div>
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">
                  كلام AI: Professional Development for Tour Guides
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Engaging Storytelling</h3>
                      <p className="text-orange-100">
                        Learn to tell captivating stories that tourists remember
                        and share.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Confident English</h3>
                      <p className="text-orange-100">
                        Communicate clearly with any international group.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Career Growth</h3>
                      <p className="text-orange-100">
                        Attract larger groups, earn more tips, and secure
                        premium tours.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full mt-6 bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold"
                >
                  <Link href="/guides/signup">
                    Start Your Development Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-700 via-red-700 to-pink-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Become a 5-Star Tour Guide?
          </h2>

          <p className="text-xl text-orange-100 mb-8">
            Join thousands of guides worldwide already boosting their careers
            with كلام AI.
          </p>

          <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-white">
              <div>
                <h3 className="font-bold mb-4">What You&apos;ll Gain:</h3>
                <ul className="text-left space-y-2 text-orange-100">
                  <li>✓ Captivating English storytelling</li>
                  <li>✓ More 5-star reviews & tips</li>
                  <li>✓ Confidence with international groups</li>
                  <li>✓ Career advancement opportunities</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Our Commitment:</h3>
                <ul className="text-left space-y-2 text-orange-100">
                  <li>✓ Respect for your cultural values</li>
                  <li>✓ Flexible learning schedule</li>
                  <li>✓ Practical scenario-based training</li>
                  <li>✓ Community of professional guides</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-xl px-12 py-4"
            >
              <Link href="/guides/signup">
                Begin Your Professional Journey
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </Button>

            <div className="flex items-center justify-center space-x-6 text-orange-200 text-sm">
              <span>✓ 30-day satisfaction guarantee</span>
              <span>✓ Start immediately</span>
              <span>✓ Global community of guides</span>
            </div>
          </div>

          <div className="mt-8 text-orange-200">
            <p className="font-medium">Trusted by tour guides worldwide</p>
          </div>
        </div>
      </section>
    </div>
  );
}
