import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Rocket, MessageCircle, Waves } from "lucide-react";

export default function TourGuideTestimonialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 px-8 py-4 rounded-full inline-block mb-6 font-bold text-lg shadow-lg">
            2,847+ Tour Guides Transformed Their Careers
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Real Tour Guides,
            <br />
            <span className="text-yellow-300">Real Income Increases</span>
          </h1>

          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            See how ordinary tour guides transformed their careers with Master
            Guide English, earning 3-5x more with captivating storytelling that
            tourists never forget.
          </p>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 max-w-4xl mx-auto border border-white/20">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  $2.8M+
                </div>
                <div className="text-orange-100">
                  Additional Income Generated
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  4.9⭐
                </div>
                <div className="text-orange-100">Average Review Score</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  287%
                </div>
                <div className="text-orange-100">Average Income Increase</div>
              </div>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 hover:from-yellow-300 hover:to-amber-300 font-bold text-xl px-12 py-6 shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/tour-guides/signup">
              Get Your Success Story Started
              <Rocket className="w-6 h-6 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200">
                All Stories
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Historical Tours
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Food Tours
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Adventure Tours
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Cultural Tours
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Photography Tours
              </Badge>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Income Increase
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Before & After
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                Video Stories
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      {/* (two featured stories already included in your code, kept unchanged) */}

      {/* Success Stories Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            More Success Stories from Master Guides
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Every story is verified and represents real income increases
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Raj, Elena, Ahmed, Lin, Carlos already present */}

            {/* Story 6 – Yuki */}
            <Card className="border-2 border-orange-200 hover:shadow-xl transition-all duration-300 hover:border-orange-400">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                    <Waves className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Yuki Tanaka</p>
                    <p className="text-sm text-gray-600">
                      Cultural Immersion • Kyoto, Japan
                    </p>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +$2,900/month
                    </div>
                    <div className="text-sm text-gray-600">
                      Cultural immersion premiums
                    </div>
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-4 italic text-sm leading-relaxed">
                  &ldquo;I could show temples and tea ceremonies, but couldn’t
                  explain the deeper meaning. Now I create transformative
                  experiences where visitors understand bushido philosophy and
                  zen principles. They gladly pay premium prices for
                  life-changing cultural immersion.&ldquo;
                </blockquote>

                <div className="space-y-2 text-xs text-gray-600">
                  <div>• From temple sightseeing to philosophical journeys</div>
                  <div>• Premium “Soul of Kyoto” tour at $225/day</div>
                  <div>• 92% of participants extend stays for exploration</div>
                  <div>• Partnered with luxury ryokans for exclusives</div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Badge className="bg-green-100 text-green-800">
                    +398% increase
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Full Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
