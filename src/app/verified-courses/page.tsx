// app/verified-courses/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import NavBar from "../components/landing/shared/NavBar";
import Image from "next/image";
import Footer from "../components/shared/TempFooter";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Provider {
  id: string;
  name: string;
  courseCount: number;
  averageScore: number;
  averageGrade: string;
  platforms: string[];
}

interface CourseFromDB {
  id: string;
  creator_id: string;
  platform: string;
  verification_badges: {
    score: number;
    grade: string;
    is_active: boolean;
  } | null;
}

interface Creator {
  id: string;
  name: string;
}

async function getProviders(): Promise<Provider[]> {
  // Fetch all verified courses
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      creator_id,
      platform,
      verification_badges (
        score,
        grade,
        is_active
      )
    `
    )
    .eq("status", "verified");

  if (error || !courses) {
    console.error("Error fetching courses:", error);
    return [];
  }

  const typedCourses = courses as unknown as CourseFromDB[];

  // Filter courses with active badges
  const activeCourses = typedCourses.filter(
    (course) =>
      course.verification_badges && course.verification_badges.is_active
  );

  // Get unique creator IDs
  const creatorIds = [...new Set(activeCourses.map((c) => c.creator_id))];

  // Fetch creator names
  const { data: creators } = await supabase
    .from("users")
    .select("id, name")
    .in("id", creatorIds);

  const typedCreators = (creators || []) as Creator[];

  // Group courses by creator
  const providerMap = new Map<
    string,
    {
      name: string;
      courses: CourseFromDB[];
      platforms: Set<string>;
    }
  >();

  activeCourses.forEach((course) => {
    const creator = typedCreators.find((c) => c.id === course.creator_id);
    if (!creator) return;

    if (!providerMap.has(course.creator_id)) {
      providerMap.set(course.creator_id, {
        name: creator.name,
        courses: [],
        platforms: new Set(),
      });
    }

    const provider = providerMap.get(course.creator_id)!;
    provider.courses.push(course);
    provider.platforms.add(course.platform);
  });

  // Transform to Provider array
  const providers: Provider[] = Array.from(providerMap.entries()).map(
    ([id, data]) => {
      const scores = data.courses.map((c) => c.verification_badges?.score || 0);
      const averageScore = Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      );

      // Calculate average grade
      const gradeValues: { [key: string]: number } = {
        "A+": 95,
        A: 85,
        B: 75,
        C: 65,
        D: 55,
        F: 45,
      };
      const avgGradeValue =
        data.courses.reduce(
          (acc, c) =>
            acc + (gradeValues[c.verification_badges?.grade || "F"] || 0),
          0
        ) / data.courses.length;

      let averageGrade = "F";
      if (avgGradeValue >= 90) averageGrade = "A+";
      else if (avgGradeValue >= 80) averageGrade = "A";
      else if (avgGradeValue >= 70) averageGrade = "B";
      else if (avgGradeValue >= 60) averageGrade = "C";
      else if (avgGradeValue >= 50) averageGrade = "D";

      return {
        id,
        name: data.name,
        courseCount: data.courses.length,
        averageScore,
        averageGrade,
        platforms: Array.from(data.platforms),
      };
    }
  );

  // Sort by average score descending
  return providers.sort((a, b) => b.averageScore - a.averageScore);
}

function getGradeColor(grade: string): string {
  const colors: { [key: string]: string } = {
    "A+": "bg-emerald-500",
    A: "bg-green-500",
    B: "bg-blue-500",
    C: "bg-yellow-500",
    D: "bg-orange-500",
    F: "bg-red-500",
  };
  return colors[grade] || "bg-gray-500";
}

export default async function VerifiedCoursesPage() {
  const providers = await getProviders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <NavBar />
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl mt-30">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Course Provider Star Ratings
          </h1>
          <p className="text-lg text-blue-600 max-w-3xl mx-auto">
            Our independent ratings are the quick way to understand the quality
            of online courses. Our experts evaluate courses against a
            comprehensive rubric, then apply a simple rating of 0 to 100, so you
            can see, at a glance, how they stack up.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="max-w-md mx-auto mb-12">
          <select className="w-full px-6 py-4 rounded-lg bg-white text-gray-800 font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option>All Categories</option>
            <option>Web Development</option>
            <option>Backend Development</option>
            <option>Frontend Development</option>
            <option>DevOps</option>
            <option>Data Science</option>
          </select>
        </div>
      </div>

      {/* Providers Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Star Rating:
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Ratings</option>
                <option>5 Stars (A+)</option>
                <option>4 Stars (A)</option>
                <option>3 Stars (B)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Or search by provider name:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by provider name"
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Provider Cards */}
          {providers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No verified course providers yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/verified-courses/${provider.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-blue-100 hover:border-blue-400 cursor-pointer">
                    <div className="p-6">
                      {/* Provider Name */}
                      <div className="mb-4">
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">
                          {provider.name}
                        </h2>
                        <p className="text-sm text-gray-500">COURSE PROVIDER</p>
                      </div>

                      {/* Star Rating Badge */}
                      <div
                        className={`${getGradeColor(
                          provider.averageGrade
                        )} rounded-lg p-4 mb-4 flex items-center justify-between`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-6 h-6 ${
                                  i < Math.round(provider.averageScore / 20)
                                    ? "text-yellow-300"
                                    : "text-white opacity-30"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-white text-lg font-bold">
                            {provider.averageScore}/100
                          </span>
                          <span className="text-white text-sm">
                            Grade: {provider.averageGrade}
                          </span>
                        </div>
                        <div className="relative w-15 h-15 sm:w-15 sm:h-15 text-center">
                          <Image
                            src="/shield.png"
                            alt="Verify Learn Shield"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Verified Courses:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {provider.courseCount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Platforms:</span>
                          <span className="font-semibold text-gray-900">
                            {provider.platforms.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* View Button */}
                      <div className="pt-4 border-t border-gray-200">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                          View All Courses
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
