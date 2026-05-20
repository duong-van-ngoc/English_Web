import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";
import { api } from "@/lib/api";

export default async function CoursesPage() {
  const courses = await api.getCourses();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Courses
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary sm:text-4xl">
          Lộ trình học tiếng Anh từ dữ liệu thật
        </h1>
        <p className="mt-4 text-base leading-7 text-text-secondary">
          Danh sách khóa học này đang được lấy trực tiếp từ NestJS backend và
          PostgreSQL thay vì dữ liệu giả trong frontend.
        </p>
      </div>

      <div className="mt-8">
        {courses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard course={course} key={course.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Các khóa học mới sẽ xuất hiện ở đây khi dữ liệu được thêm vào PostgreSQL."
            title="Chưa có khóa học"
          />
        )}
      </div>
    </div>
  );
}
