import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassCard } from "@/components/ui/glass-card";
import type { Course } from "@/types";

interface HomeFeaturedCoursesProps {
  featuredCourses: Course[];
}

/**
 * HomeFeaturedCourses renders a grid of popular courses
 * fetched from the database, giving visitors a quick look at actual lessons.
 */
export function HomeFeaturedCourses({ featuredCourses }: HomeFeaturedCoursesProps) {
  return (
    <section className="py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Lộ trình học tối ưu</p>
          <h2 className="text-3xl font-bold tracking-normal text-text-primary">Khóa học tiếng Anh nổi bật</h2>
        </div>
        <Link
          className="text-sm font-semibold text-primary hover:text-hover"
          href="/courses"
          title="Khám phá toàn bộ danh sách khóa học tiếng Anh trực tuyến"
        >
          Xem tất cả khóa học
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredCourses.length > 0 ? (
          featuredCourses.map((course) => (
            <GlassCard key={course.id} className="p-6 rounded-2xl flex flex-col h-full border-transparent hover:border-primary transition-all">
              <div className="h-48 rounded-xl mb-6 flex items-center justify-center bg-primary/5">
                <span className="material-symbols-outlined text-7xl text-primary" aria-hidden="true">
                  {course.level === "BEGINNER" ? "school" : course.level === "INTERMEDIATE" ? "workspace_premium" : "translate"}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-text-primary">{course.title}</h3>
              <p className="text-sm text-text-secondary mb-6 flex-grow line-clamp-3">{course.description}</p>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  {course.lessons?.length ?? 0} bài học
                </span>
                <span className="text-primary font-bold text-sm">
                  {course.level === "BEGINNER" ? "Miễn phí" : "Phổ biến"}
                </span>
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="w-full py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors text-center text-sm"
                aria-label={`Xem chi tiết nội dung khóa học ${course.title}`}
                title={`Xem chi tiết nội dung khóa học ${course.title}`}
              >
                Xem chi tiết khóa học
              </Link>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="Chưa tải được khóa học nổi bật"
              description="Hãy khởi động backend và kiểm tra NEXT_PUBLIC_API_URL để xem dữ liệu thật từ PostgreSQL."
            />
          </div>
        )}
      </div>
    </section>
  );
}
