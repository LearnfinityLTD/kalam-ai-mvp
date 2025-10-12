// app/verified-courses/[providerId]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { VerificationBadge } from "@/components/VerificationBadge/VerificationBadge";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VerifiedCourse {
  id: string;
  title: string;
  description: string;
  platform: string;
  course_url: string;
  score: number;
  grade: string;
  verified_date: string;
}

interface CourseFromDB {
  id: string;
  title: string;
  description: string;
  platform: string;
  course_url: string;
  verification_badges: {
    score: number;
    grade: string;
    verified_date: string;
    is_active: boolean;
  } | null;
}

interface Creator {
  id: string;
  name: string;
}

type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

async function getProviderCourses(
  providerId: string
): Promise<{ courses: VerifiedCourse[]; providerName: string }> {
  // Fetch provider name
  const { data: creator } = await supabase
    .from("users")
    .select("name")
    .eq("id", providerId)
    .single();

  const providerName = (creator as Creator | null)?.name || "Unknown Provider";

  // Fetch verified courses for this provider
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      description,
      platform,
      course_url,
      verification_badges (
        score,
        grade,
        verified_date,
        is_active
      )
    `
    )
    .eq("creator_id", providerId)
    .eq("status", "verified");

  if (error || !data) {
    console.error("Error fetching courses:", error);
    return { courses: [], providerName };
  }

  const typedData = data as unknown as CourseFromDB[];

  const coursesWithBadges = typedData.filter(
    (course) =>
      course.verification_badges && course.verification_badges.is_active
  );

  const courses = coursesWithBadges
    .map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      platform: course.platform,
      course_url: course.course_url,
      score: course.verification_badges?.score || 0,
      grade: course.verification_badges?.grade || "F",
      verified_date:
        course.verification_badges?.verified_date || new Date().toISOString(),
    }))
    .sort((a, b) => b.score - a.score);

  return { courses, providerName };
}

export default async function ProviderCoursesPage({
  params,
}: {
  params: { providerId: string };
}) {
  const { courses, providerName } = await getProviderCourses(params.providerId);

  const averageScore =
    courses.length > 0
      ? Math.round(
          courses.reduce((acc, c) => acc + c.score, 0) / courses.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/verified-courses"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Providers
          </Link>
        </nav>

        {/* Provider Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {providerName}
              </h1>
              <p className="text-lg text-gray-600">
                All verified courses from this provider
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {averageScore}/100
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {courses.length}
            </div>
            <div className="text-gray-600">Verified Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {
                courses.filter((c) => c.grade === "A+" || c.grade === "A")
                  .length
              }
            </div>
            <div className="text-gray-600">Grade A+ or A</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {[...new Set(courses.map((c) => c.platform))].length}
            </div>
            <div className="text-gray-600">Platforms</div>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No verified courses yet for this provider.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Platform Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {course.platform}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(course.verified_date).toLocaleDateString(
                        "en-GB",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]">
                    {course.description}
                  </p>

                  {/* Verification Badge */}
                  <div className="mb-4">
                    <VerificationBadge
                      score={course.score}
                      grade={course.grade as Grade}
                      size="sm"
                    />
                  </div>

                  {/* View Course Button */}
                  <a
                    href={course.course_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Course →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
