"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Briefcase, Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export const UserTypeSelection = () => {
  const userTypes = [
    {
      icon: Shield,
      title: "Mosque Guards",
      description: "Master tourist interactions with cultural confidence",
      color: "green",
      features: [
        {
          icon: Star,
          title: "Real Tourist Scenarios",
          desc: "Practice greetings, directions, cultural explanations",
        },
        {
          icon: Clock,
          title: "Prayer-Aware Learning",
          desc: "Automatic breaks during prayer times",
        },
        {
          icon: Briefcase,
          title: "Team Management",
          desc: "Track progress across your mosque team",
        },
      ],
      cta: "Start as Mosque Guard",
      href: "/guards",
      popular: true,
    },
    {
      icon: Briefcase,
      title: "Business Professionals",
      description: "Excel in international business communication",
      color: "blue",
      features: [
        {
          icon: Star,
          title: "Business Scenarios",
          desc: "Meetings, presentations, negotiations",
        },
        {
          icon: Clock,
          title: "Industry-Specific",
          desc: "Tailored vocabulary and scenarios",
        },
        {
          icon: Briefcase,
          title: "Team Analytics",
          desc: "Corporate progress tracking",
        },
      ],
      cta: "Join Waitlist",
      comingSoon: true,
    },
    {
      icon: MapPin,
      title: "Tour Guides",
      description:
        "Lead international visitors with clarity and cultural confidence",
      color: "amber",
      features: [
        {
          icon: Star,
          title: "Guided Tour Scripts",
          desc: "Ready-to-use routes, intros, and FAQs",
        },
        {
          icon: Clock,
          title: "Crowd Management",
          desc: "Manage groups smoothly around prayer times",
        },
        {
          icon: MapPin,
          title: "Cultural Briefings",
          desc: "Explain etiquette and history respectfully",
        },
      ],
      cta: "Start as Tour Guide",
      href: "/tour-guides",
    },
  ];

  return (
    <section id="user-selection" className="py-20 bg-gray-50">
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored experiences designed for your specific professional
            communication needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {type.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-green-600 text-white px-4 py-2 font-semibold">
                    Most Popular 🔥
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  type.popular
                    ? "border-green-400 shadow-lg"
                    : "border-gray-200 hover:border-green-300"
                } ${type.comingSoon ? "opacity-90" : ""}`}
              >
                {type.comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                )}

                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                        type.color === "green"
                          ? "bg-green-100 group-hover:bg-green-200"
                          : type.color === "blue"
                          ? "bg-blue-100 group-hover:bg-blue-200"
                          : "bg-amber-100 group-hover:bg-amber-200"
                      }`}
                    >
                      <type.icon
                        className={`h-8 w-8 ${
                          type.color === "green"
                            ? "text-green-600"
                            : type.color === "blue"
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <feature.icon
                          className={`h-5 w-5 mt-0.5 ${
                            type.color === "green"
                              ? "text-green-500"
                              : type.color === "blue"
                              ? "text-blue-500"
                              : "text-amber-500"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {type.href ? (
                    <Link href={type.href}>
                      <Button
                        className={`w-full py-4 text-lg font-semibold transition-all ${
                          type.color === "green"
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                            : type.color === "blue"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-amber-600 hover:bg-amber-700 text-white"
                        } ${
                          type.comingSoon
                            ? "opacity-75"
                            : "hover:-translate-y-0.5"
                        }`}
                        disabled={type.comingSoon}
                      >
                        {type.cta} {!type.comingSoon && "→"}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className={`w-full py-4 text-lg font-semibold transition-all ${
                        type.color === "green"
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                          : type.color === "blue"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      } ${
                        type.comingSoon
                          ? "opacity-75"
                          : "hover:-translate-y-0.5"
                      }`}
                      disabled={type.comingSoon}
                    >
                      {type.cta} {!type.comingSoon && "→"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
