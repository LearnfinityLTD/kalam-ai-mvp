// app/admin/review/[courseId]/page.tsx
import { createClient } from "@supabase/supabase-js";
import ReviewInterface from "@/components/ReviewInterface/ReviewInterface";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CourseData {
  id: string;
  title: string;
  description: string;
  platform: string;
  course_url: string;
  status: string;
  creator: {
    name: string;
    email: string;
  };
}

async function getCourse(courseId: string): Promise<CourseData | null> {
  const { data, error } = await supabase
    .from("courses")
    .select(`id, title, description, platform, course_url, status, creator_id`)
    .eq("id", courseId)
    .single();

  if (error || !data) {
    return null;
  }

  const { data: creator } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", data.creator_id)
    .single();

  return {
    ...data,
    creator: creator || { name: "Unknown", email: "" },
  };
}

export default async function ReviewCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await getCourse(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {course.title}
          </h1>
          <p className="text-gray-600 mb-2">{course.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Platform: <span className="font-medium">{course.platform}</span>
            </span>
            <span>•</span>
            <span>
              Creator:{" "}
              <span className="font-medium">{course.creator.name}</span>
            </span>
          </div>
        </div>
      </div>

      <ReviewInterface
        courseId={course.id}
        courseUrl={course.course_url}
        currentStatus={course.status}
      />
    </div>
  );
}
