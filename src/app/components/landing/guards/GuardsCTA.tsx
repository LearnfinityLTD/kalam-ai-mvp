import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Award,
  Heart,
} from "lucide-react";

export default function CTAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Professional Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-green-700 to-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full inline-block mb-6 font-bold">
            🕌 2030 Vision: Preparing for 30M+ International Pilgrims
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join a Growing Community of
            <br />
            <span className="text-yellow-300">Professional Mosque Staff</span>
          </h1>

          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Enhance your English communication skills to better serve
            international visitors with dignity and confidence. Join hundreds of
            mosque staff who are already improving their professional
            capabilities.
          </p>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-white font-medium text-lg mb-4">
              New Member Benefits Include:
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <Award className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">
                  Professional Certificate
                </div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">
                  Islamic Values Focused
                </div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-yellow-300 font-bold">
                  Community Support
                </div>
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
                Learn More About كلام AI
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
            Trusted by mosque staff across the region
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
                Common Challenges for Mosque Staff
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Communication Barriers
                    </h3>
                    <p className="text-gray-700">
                      International visitors sometimes need help with
                      directions, Islamic etiquette guidance, or emergency
                      assistance, but language barriers can make these
                      interactions challenging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Professional Confidence
                    </h3>
                    <p className="text-gray-700">
                      You have deep knowledge of Islamic practices and genuine
                      care for visitors, but expressing this clearly in English
                      can feel challenging at times.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-orange-600 font-bold">?</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Career Growth Opportunities
                    </h3>
                    <p className="text-gray-700">
                      Strong English communication skills open doors to
                      leadership roles and specialized positions in increasingly
                      international Islamic institutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">
                  كلام AI: Professional Development for Mosque Staff
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">
                        Confident Communication
                      </h3>
                      <p className="text-green-100">
                        Develop professional English skills for any visitor
                        interaction while maintaining Islamic dignity and
                        respect
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Cultural Intelligence</h3>
                      <p className="text-green-100">
                        Learn to explain Islamic practices clearly to
                        international visitors while fostering mutual
                        understanding and respect
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-yellow-300 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Professional Growth</h3>
                      <p className="text-green-100">
                        Build skills that qualify you for advancement
                        opportunities in international Islamic institutions
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full mt-6 bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold"
                >
                  <Link href="/guards/signup">
                    Start Your Development Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Professional Development Matters Now
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <Globe className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                Growing International Visitors
              </h3>
              <p className="text-gray-700 text-sm">
                Saudi Arabia&apos;s Vision 2030 and similar initiatives across
                the region are increasing international religious tourism.
                Professional communication skills help you serve visitors
                better.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <Heart className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                Serve with Excellence
              </h3>
              <p className="text-gray-700 text-sm">
                Every positive interaction with international visitors reflects
                the hospitality and beauty of Islam. Professional communication
                helps you be an excellent ambassador.
              </p>
            </div>
          </div>

          <div className="bg-green-100 border-l-4 border-green-500 p-6 mb-8">
            <p className="text-green-800 font-bold text-lg">
              💡 Investment in Your Professional Growth
            </p>
            <p className="text-green-700 mt-2">
              Join a community of mosque staff who are investing in their
              professional development and ability to serve with excellence.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8"
          >
            <Link href="/auth/signin?type=guard">
              Explore كلام AI Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories from Our Community
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
                  invaluable.&rdquo;
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
                  &ldquo;The emergency communication training proved invaluable
                  when we had a medical incident. I could communicate clearly
                  with paramedics and comfort the family. My supervisor
                  recognized my professional growth and offered me a
                  promotion!&rdquo;
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
                  &ldquo;I was hesitant about speaking English with tourists.
                  Now I&apos;m the preferred guide for international visitor
                  tours. The pronunciation coaching designed for Arabic speakers
                  made all the difference.&rdquo;
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
              Join over 500 mosque staff members who are developing their
              professional skills
            </p>
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href="/guards/signup">Start Your Development Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  Will this work with my busy mosque schedule?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Absolutely! كلام AI is designed for working mosque staff.
                  Lessons are 10-15 minutes each, automatically pause for prayer
                  times, and can be completed during quiet periods. Our AI
                  adapts to your schedule, making learning convenient and
                  respectful.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  I&apos;m not very comfortable with technology. Is this too
                  complicated?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Not at all! If you can use WhatsApp, you can use كلام AI. The
                  interface is available in both Arabic and English, and our
                  support team provides complimentary setup assistance. Most
                  staff members are practicing within 5 minutes of joining.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  Will this respect my Islamic values?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Absolutely. كلام AI was developed by a Muslim team
                  specifically to honor Islamic values. All content is reviewed
                  by Islamic scholars, prayer times are respected, and the
                  training helps you become an even better ambassador for Islam.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-left">
                  How quickly will I see improvement?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Most staff members notice improvement within the first week.
                  By week 4, you&apos;ll handle basic visitor interactions with
                  greater confidence. By month 3, you&apos;ll likely be
                  comfortable assisting with more complex international visitor
                  needs.
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
            Ready to Enhance Your Professional Skills?
          </h2>

          <p className="text-xl text-green-100 mb-8">
            Join 500+ mosque staff members who are investing in their
            professional development and ability to serve with excellence.
          </p>

          <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6 text-white">
              <div>
                <h3 className="font-bold mb-4">What You&apos;ll Gain:</h3>
                <ul className="text-left space-y-2 text-green-100">
                  <li>✓ Confident English communication skills</li>
                  <li>✓ Professional development certificate</li>
                  <li>✓ Career advancement opportunities</li>
                  <li>✓ Enhanced visitor service abilities</li>
                  <li>✓ Greater confidence representing Islam</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Our Commitment:</h3>
                <ul className="text-left space-y-2 text-green-100">
                  <li>✓ Respect for Islamic values</li>
                  <li>✓ Flexible learning schedule</li>
                  <li>✓ Professional development focus</li>
                  <li>✓ Community support network</li>
                  <li>✓ Culturally appropriate content</li>
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
                Begin Your Professional Development
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </Button>

            <div className="flex items-center justify-center space-x-6 text-green-200 text-sm">
              <span>✓ 30-day satisfaction guarantee</span>
              <span>✓ Islamic values respected</span>
              <span>✓ Start immediately</span>
            </div>
          </div>

          <div className="mt-8 text-green-200">
            <p className="font-medium">
              Trusted by mosque staff across the region
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
