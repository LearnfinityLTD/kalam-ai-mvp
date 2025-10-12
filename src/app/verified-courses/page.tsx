// app/verified-courses/page.tsx
import { createClient } from "@supabase/supabase-js";
import { VerificationBadge } from "@/components/VerificationBadge/VerificationBadge";

// Initialize Supabase client
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
  creator_name: string;
}

interface CourseFromDB {
  id: string;
  title: string;
  description: string;
  platform: string;
  course_url: string;
  creator_id: string;
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

async function getVerifiedCourses(): Promise<VerifiedCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      description,
      platform,
      course_url,
      creator_id,
      verification_badges (
        score,
        grade,
        verified_date,
        is_active
      )
    `
    )
    .eq("status", "verified");

  if (error) {
    console.error("Error fetching verified courses:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Type assertion for data from Supabase
  const typedData = data as unknown as CourseFromDB[];

  // Filter courses that have active badges
  const coursesWithBadges = typedData.filter(
    (course) =>
      course.verification_badges && course.verification_badges.is_active
  );

  // Get unique creator IDs
  const creatorIds = [...new Set(coursesWithBadges.map((c) => c.creator_id))];

  // Fetch creator names
  const { data: creators } = await supabase
    .from("users")
    .select("id, name")
    .in("id", creatorIds);

  const typedCreators = (creators || []) as Creator[];

  const creatorMap = new Map(
    typedCreators.map((creator) => [creator.id, creator.name])
  );

  // Transform the data to match our interface
  return coursesWithBadges
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
      creator_name: creatorMap.get(course.creator_id) || "Unknown Creator",
    }))
    .sort((a, b) => b.score - a.score); // Sort by score descending
}

export default async function VerifiedCoursesPage() {
  const courses = await getVerifiedCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verified Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All courses have been independently verified by expert reviewers for
            quality, accuracy, and educational value.
          </p>
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
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(
                courses.reduce((acc, c) => acc + c.score, 0) / courses.length
              ) || 0}
            </div>
            <div className="text-gray-600">Average Score</div>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No verified courses yet. Check back soon!
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

                  {/* Creator */}
                  <p className="text-sm text-gray-500 mb-4">
                    by{" "}
                    <span className="font-medium">{course.creator_name}</span>
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
