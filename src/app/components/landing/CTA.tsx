import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import {
  Building,
  Users,
  Star,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  Gift,
  Globe,
} from "lucide-react";

export default function CTAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Urgent Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full inline-block mb-6 font-bold">
            🕌 2030 Vision Alert: 30M+ International Pilgrims Expected
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {"Don’t Get Left Behind When"}
            <br />
            <span className="text-yellow-300">The World Comes to You</span>
          </h1>

          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            In 5 years, your mosque will receive visitors from 150+ countries.
            {
              " Will your staff be ready to serve them with confidence and dignity?"
            }
          </p>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-white font-medium text-lg mb-4">
              Limited Time: First 100 Guards Get
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <Gift className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">3 Months Free</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">Certificate</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">1-on-1 Support</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold text-lg px-8"
            >
              <Link href="/guards/signup">
                Claim Your Spot Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              <Link href="/guards/demo">Watch 2-Min Demo</Link>
            </Button>
          </div>

          <p className="text-green-200 mt-4 text-sm">
            Only 23 spots left • Offer expires in 5 days
          </p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Challenge Every Mosque Guard Faces
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Tourist Frustration
                    </h3>
                    <p className="text-gray-700">
                      {
                        "International visitors get confused when you can’t help "
                      }
                      {"them find prayer rooms, explain Islamic etiquette, or "}
                      {"direct them during emergencies."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Personal Embarrassment
                    </h3>
                    <p className="text-gray-700">
                      {
                        "You know what you want to say in Arabic, but struggle to "
                      }
                      {"express it clearly in English, leading to "}
                      {"misunderstandings and awkward situations."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Career Limitations
                    </h3>
                    <p className="text-gray-700">
                      {
                        "Poor English communication holds you back from promotions "
                      }
                      {
                        "and leadership roles in increasingly international Islamic "
                      }
                      {"institutions."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">
                  كلام AI Changes Everything
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">
                        Confident Communication
                      </h3>
                      <p className="text-green-100">
                        {
                          "Handle any tourist interaction with professional English "
                        }
                        {"while maintaining Islamic dignity"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Cultural Intelligence</h3>
                      <p className="text-green-100">
                        {
                          "Explain Islamic practices clearly to non-Muslims while "
                        }
                        {"respecting both cultures"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Career Advancement</h3>
                      <p className="text-green-100">
                        {"Qualify for leadership positions in international "}
                        {"Islamic institutions"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full mt-6 bg-black text-green-900 hover:bg-blue-100 font-bold"
                >
                  <Link href="/guards/signup" className="text-gray-800">
                    Start Your Transformation Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-yellow-50 border-y-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why You Must Act Now
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                2030 Deadline Approaching
              </h3>
              <p className="text-gray-700 text-sm">
                {
                  "Saudi Arabia’s Vision 2030 will bring unprecedented numbers of "
                }
                {
                  "international visitors. Guards who speak English confidently "
                }
                {"will be in high demand."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                Limited Beta Access
              </h3>
              <p className="text-gray-700 text-sm">
                {"Only 100 founding members get lifetime access at early-bird "}
                {"pricing. After that, prices increase by 300%."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <Gift className="w-8 h-8 text-orange-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                Bonus Expires Soon
              </h3>
              <p className="text-gray-700 text-sm">
                {
                  "Free certification program and 1-on-1 coaching worth $500 - only "
                }
                {"available for the next 5 days."}
              </p>
            </div>
          </div>

          <div className="bg-red-100 border-l-4 border-red-500 p-6 mb-8">
            <p className="text-red-700 font-bold text-lg">
              {"⚠️ Warning: Don’t wait until your mosque is overwhelmed with "}
              {"international visitors"}
            </p>
            <p className="text-red-600 mt-2">
              {
                "Guards who can’t communicate effectively will be replaced by those "
              }
              {"who can. Secure your position now."}
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8"
          >
            <Link href="/guards/signup">
              Secure My Position Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Proof Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Real Results from Real Guards
          </h2>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Khalid Al-Otaibi</p>
                    <p className="text-xs text-gray-600">
                      Masjid Al-Haram, Mecca
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-sm mb-4">
                  &ldquo;In just 6 weeks, I went from avoiding English
                  conversations to confidently helping international pilgrims.
                  Yesterday I helped a confused family from Indonesia navigate
                  their first Hajj. The cultural context training was
                  crucial.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Level 4 Complete
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ahmed Al-Mansouri</p>
                    <p className="text-xs text-gray-600">
                      Islamic Center, Dubai
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-sm mb-4">
                  &ldquo;The emergency communication training saved the day when
                  we had a medical incident. I could communicate clearly with
                  paramedics and comfort the family. My supervisor was impressed
                  and I got a promotion!&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Now Head Guard
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Omar Hassan</p>
                    <p className="text-xs text-gray-600">
                      Sultan Qaboos Mosque, Oman
                    </p>
                  </div>
                </div>
                <blockquote className="text-gray-700 text-sm mb-4">
                  &ldquo;I was terrified of speaking English with tourists. Now
                  I&apos;m the go-to person for international visitor tours. The
                  pronunciation coaching for Arabic speakers made all the
                  difference.&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Tour Leader
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              {"Join over 500 guards who’ve already transformed their careers"}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href="/guards/signup">Start Your Success Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Common Questions from Guards
          </h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  {"Will this work with my busy mosque schedule?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {
                    "Absolutely! كلام AI is designed for working guards. Lessons "
                  }
                  {
                    "are 10-15 minutes each, automatically pause for prayer times, "
                  }
                  {
                    "and can be done during quiet periods. Our AI adapts to your "
                  }
                  {"schedule, not the other way around."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  {"I’m not good with technology. Is this too complicated?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {
                    "Not at all! If you can use WhatsApp, you can use كلام AI. The "
                  }
                  {"interface is in Arabic and English, and our support team "}
                  {
                    "provides free setup help. Most guards are practicing within 5 "
                  }
                  {"minutes of signing up."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  {"Will this conflict with my Islamic values?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {
                    "Never. كلام AI was built by a Muslim developer specifically to "
                  }
                  {
                    "respect Islamic values. All content is reviewed by Islamic "
                  }
                  {
                    "scholars, prayer times are honored, and the training helps you "
                  }
                  {"be a better ambassador for Islam."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  {"How quickly will I see results?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {
                    "Most guards notice improvement within the first week. By week "
                  }
                  {
                    "4, you’ll handle basic tourist interactions confidently. By "
                  }
                  {
                    "month 3, you’ll be the go-to person for international visitor "
                  }
                  {"assistance."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-700 via-green-800 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {"Don’t Let This Opportunity Pass"}
          </h2>

          <p className="text-xl text-green-100 mb-8">
            {"500+ guards have already transformed their careers. Will you be "}
            {"next?"}
          </p>

          <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-white">
              <div>
                <h3 className="font-bold mb-4">If You Join Today:</h3>
                <ul className="text-left space-y-2 text-green-100">
                  <li>✓ {"Confident English in 30 days"}</li>
                  <li>✓ {"Professional certification included"}</li>
                  <li>✓ {"Career advancement opportunities"}</li>
                  <li>✓ {"Respect from international visitors"}</li>
                  <li>✓ {"Pride in representing Islam professionally"}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">If You Wait:</h3>
                <ul className="text-left space-y-2 text-red-200">
                  <li>✗ {"Miss the early-bird pricing"}</li>
                  <li>✗ {"Struggle when tourism increases"}</li>
                  <li>✗ {"Watch others get promoted instead"}</li>
                  <li>✗ {"Continue feeling embarrassed with tourists"}</li>
                  <li>✗ {"Risk being replaced by bilingual guards"}</li>
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
              <Link href="/guards/signup">
                YES! Transform My English Now
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </Button>

            <div className="flex items-center justify-center space-x-6 text-green-200 text-sm">
              <span>✓ {"30-day guarantee"}</span>
              <span>✓ {"Islamic values respected"}</span>
              <span>✓ {"Start immediately"}</span>
            </div>
          </div>

          <div className="mt-8 text-green-200">
            <p className="font-bold">Only 23 spots remaining at this price</p>
          </div>
        </div>
      </section>
    </div>
  );
}
