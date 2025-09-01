"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Briefcase, Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function UserTypeSelection() {
  return (
    <section id="user-selection" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tailored experiences for your specific communication needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Mosque Guards Path */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-2 hover:border-green-500 transition-colors group">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Mosque Guards</h3>
                  <p className="text-gray-600">
                    Master tourist interactions with confidence
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Real Tourist Scenarios</h4>
                      <p className="text-sm text-gray-600">
                        Practice greetings, directions, cultural explanations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Prayer-Aware Learning</h4>
                      <p className="text-sm text-gray-600">
                        Automatic breaks during prayer times
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Mosque Management</h4>
                      <p className="text-sm text-gray-600">
                        Track team progress and engagement
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/guards">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg">
                    Start as Mosque Guard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Business Professionals Path (Coming Soon) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full border-2 hover:border-blue-500 transition-colors group relative">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Coming Soon</Badge>
              </div>

              <CardContent className="p-8 opacity-75">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Business Professionals
                  </h3>
                  <p className="text-gray-600">
                    Excel in international business communication
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Business Scenarios</h4>
                      <p className="text-sm text-gray-600">
                        Meetings, presentations, negotiations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Industry-Specific Content</h4>
                      <p className="text-sm text-gray-600">
                        Tailored vocabulary and scenarios
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Team Analytics</h4>
                      <p className="text-sm text-gray-600">
                        Corporate progress tracking
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg"
                  disabled
                >
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tour Guides Path */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="h-full border-2 hover:border-amber-500 transition-colors group">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                    <MapPin className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Tour Guides</h3>
                  <p className="text-gray-600">
                    Lead international visitors with clarity and cultural
                    confidence
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Guided Tour Scripts</h4>
                      <p className="text-sm text-gray-600">
                        Ready-to-use routes, intros, and FAQs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Crowd & Timing Prompts</h4>
                      <p className="text-sm text-gray-600">
                        Manage groups smoothly around prayer times
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Cultural Briefings</h4>
                      <p className="text-sm text-gray-600">
                        Explain etiquette and history respectfully
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/tour-guides">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 text-lg">
                    Start as Tour Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
