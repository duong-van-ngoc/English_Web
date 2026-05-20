import Link from "next/link";

import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { api } from "@/lib/api";
import type { Course } from "@/types";

export default async function HomePage() {
  let courses: Course[] = [];

  try {
    courses = await api.getCourses();
  } catch {
    courses = [];
  }

  const featuredCourses = courses.slice(0, 2);
  const totalLessons = courses.reduce(
    (sum, course) => sum + (course.lessons?.length ?? 0),
    0,
  );
  const learningStats = [
    { label: "Lộ trình", value: String(courses.length) },
    { label: "Bài học", value: String(totalLessons) },
    { label: "Cấp độ", value: courses[0]?.level ?? "--" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="glass-panel floating-card flex flex-col justify-between rounded-lg p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              TOEIC foundation
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal text-text-primary sm:text-5xl">
              Bắt đầu học tiếng Anh từ nền tảng, rồi tiến dần tới TOEIC.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary">
              Chọn một lộ trình, học từng bài nhỏ, theo dõi mục tiêu và chuyển sang
              luyện TOEIC khi nền tảng đã đủ chắc.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/courses">Xem khóa học</PrimaryButton>
            <PrimaryButton href="/login" variant="secondary">
              Học thử
            </PrimaryButton>
          </div>
        </div>

        <aside className="floating-card rounded-lg border border-primary/30 bg-text-primary p-6 text-white">
          <p className="text-sm font-semibold text-secondary">Kế hoạch hôm nay</p>
          <div className="mt-5 space-y-4">
            {[
              "Ôn 20 từ vựng công việc",
              "Hoàn thành 1 bài phát âm",
              "Đọc 1 đoạn Part 5 cơ bản",
            ].map((task, index) => (
              <div
                className="flex items-center gap-3 rounded-md border border-white/10 bg-white/10 p-3 backdrop-blur"
                key={task}
              >
                <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-sm font-bold text-text-primary">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{task}</span>
              </div>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            {learningStats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-cyan-100/75">{stat.label}</dt>
                <dd className="mt-1 text-lg font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Lộ trình nổi bật
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-normal text-text-primary">
              Chọn điểm bắt đầu phù hợp
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-primary hover:text-hover"
            href="/courses"
          >
            Xem tất cả khóa học
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => <CourseCard course={course} key={course.id} />)
          ) : (
            <EmptyState
              title="Chưa tải được khóa học nổi bật"
              description="Hãy khởi động backend và kiểm tra NEXT_PUBLIC_API_URL để xem dữ liệu thật từ PostgreSQL."
            />
          )}
        </div>
      </section>
    </div>
  );
}
