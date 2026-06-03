"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/types";
import { CourseCard, type CourseWithStats } from "@/components/course-card";
import { EmptyState } from "@/components/empty-state";

interface CoursesListClientProps {
  initialCourses: Course[];
}

type LevelFilter = "all" | "beginner" | "elementary" | "toeic-foundation" | "intermediate" | "advanced" | "vstep" | "reading" | "listening";
type SkillFilter = "all" | "vocabulary" | "grammar" | "listening" | "reading" | "vstep";

const MOCK_COURSES: CourseWithStats[] = [
  {
    id: "course-mock-1",
    title: "Tiếng Anh mất gốc",
    slug: "tieng-anh-mat-goc",
    description: "Xây dựng nền tảng từ bảng chữ cái, phát âm, từ vựng và ngữ pháp cơ bản.",
    level: "beginner",
    status: "PUBLISHED",
    lessonsCount: 20,
    vocabularyCount: 300,
    weeks: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-2",
    title: "TOEIC 450 Starter",
    slug: "toeic-450-starter",
    description: "Lộ trình từ vựng, ngữ pháp, nghe và đọc dành cho mục tiêu TOEIC 450+.",
    level: "toeic-foundation",
    status: "PUBLISHED",
    lessonsCount: 35,
    vocabularyCount: 700,
    weeks: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-3",
    title: "Ngữ pháp cơ bản",
    slug: "ngu-phap-co-ban",
    description: "Học các chủ điểm ngữ pháp quan trọng như thì, danh từ, động từ, mệnh đề.",
    level: "elementary",
    status: "PUBLISHED",
    lessonsCount: 18,
    quizCount: 120,
    weeks: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-4",
    title: "Từ vựng TOEIC theo chủ đề",
    slug: "tu-vung-toeic-theo-chu-de",
    description: "Học từ vựng theo các chủ đề thường gặp trong môi trường công việc.",
    level: "intermediate",
    status: "PUBLISHED",
    lessonsCount: 25,
    vocabularyCount: 1000,
    weeks: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-5",
    title: "Luyện đọc TOEIC Part 5–7",
    slug: "luyen-doc-toeic-part-5-7",
    description: "Rèn kỹ năng đọc hiểu, chọn đáp án nhanh và phân tích câu hỏi.",
    level: "reading",
    status: "PUBLISHED",
    lessonsCount: 22,
    questionsCount: 200,
    weeks: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-6",
    title: "Luyện nghe TOEIC cơ bản",
    slug: "luyen-nghe-toeic-co-ban",
    description: "Luyện nghe qua hình ảnh, hội thoại ngắn và đoạn nói ngắn.",
    level: "listening",
    status: "PUBLISHED",
    lessonsCount: 24,
    audioCount: 150,
    weeks: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-7",
    title: "Ôn thi VSTEP B1",
    slug: "on-thi-vstep-b1",
    description: "Lộ trình ôn thi VSTEP B1 giúp người học luyện 4 kỹ năng Nghe, Nói, Đọc, Viết theo định hướng bài thi.",
    level: "vstep",
    status: "PUBLISHED",
    lessonsCount: 40,
    vocabularyCount: 800,
    questionsCount: 200,
    essaysCount: 20,
    audioCount: 30,
    weeks: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "course-mock-8",
    title: "VSTEP Speaking & Writing",
    slug: "vstep-speaking-writing",
    description: "Luyện nói và viết theo các chủ đề thường gặp trong VSTEP, kèm bài mẫu và gợi ý cấu trúc câu.",
    level: "vstep",
    status: "PUBLISHED",
    lessonsCount: 25,
    topicsCount: 100,
    samplesCount: 50,
    weeks: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function CoursesListClient({ initialCourses }: CoursesListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [skillFilter, setSkillFilter] = useState<SkillFilter>("all");

  // Merge static metadata with dynamic backend courses
  const mergedCourses = useMemo(() => {
    // Clone mock courses
    const courses = JSON.parse(JSON.stringify(MOCK_COURSES)) as CourseWithStats[];

    if (initialCourses && initialCourses.length > 0) {
      initialCourses.forEach((dbCourse) => {
        const matchingMock = courses.find(
          (m) =>
            m.title.toLowerCase() === dbCourse.title.toLowerCase() ||
            m.slug.toLowerCase() === dbCourse.slug.toLowerCase()
        );
        if (matchingMock) {
          // Sync backend details to matching mock courses
          matchingMock.id = dbCourse.id;
          matchingMock.lessons = dbCourse.lessons;
          matchingMock.status = dbCourse.status;
        } else {
          // If backend has a new course not present in mocks, append it
          courses.push(dbCourse);
        }
      });
    }

    return courses;
  }, [initialCourses]);

  const filteredCourses = useMemo(() => {
    return mergedCourses.filter((course) => {
      // 1. Search term filter
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());

      // 2. Level filter
      const matchesLevel = levelFilter === "all" || course.level === levelFilter;

      // 3. Skill filter
      let matchesSkill = true;
      if (skillFilter !== "all") {
        const textToSearch = `${course.title} ${course.description ?? ""}`.toLowerCase();
        if (skillFilter === "vocabulary") {
          matchesSkill = textToSearch.includes("từ vựng") || textToSearch.includes("vocabulary");
        } else if (skillFilter === "grammar") {
          matchesSkill = textToSearch.includes("ngữ pháp") || textToSearch.includes("grammar");
        } else if (skillFilter === "listening") {
          matchesSkill = textToSearch.includes("nghe") || textToSearch.includes("listening");
        } else if (skillFilter === "reading") {
          matchesSkill = textToSearch.includes("đọc") || textToSearch.includes("reading");
        } else if (skillFilter === "vstep") {
          matchesSkill = textToSearch.includes("vstep");
        }
      }

      return matchesSearch && matchesLevel && matchesSkill;
    });
  }, [mergedCourses, searchTerm, levelFilter, skillFilter]);

  return (
    <div className="bg-gradient-mesh min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
        
        {/* Section 1: Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                school
              </span>
              <span className="text-xs font-semibold">Lộ trình cho người mất gốc</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight">
              Khám phá khóa học tiếng Anh phù hợp với bạn
            </h1>
            <p className="text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
              Hệ thống học tập thông minh giúp bạn chinh phục mục tiêu TOEIC 450-500 và VSTEP chỉ trong thời gian ngắn nhất. Cam kết hiệu quả với phương pháp thực hành 80%.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#courses-section"
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all text-center"
                title="Khám phá danh sách khóa học"
              >
                Bắt đầu học ngay
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/practice"
                className="glass-panel text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 border-primary/40 hover:bg-primary/5 hover:translate-y-[-2px] active:scale-95 transition-all text-center"
                title="Thực hiện bài kiểm tra năng lực"
              >
                Kiểm tra trình độ
                <span className="material-symbols-outlined" aria-hidden="true">
                  quiz
                </span>
              </Link>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000">
            <div className="glass-card p-4 rounded-[2rem] transform rotate-2 relative z-10">
              <Image
                alt="Học viên đang học trực tuyến với laptop cùng EnglishTobi"
                className="rounded-2xl w-full h-auto object-cover aspect-video"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLY3SRlNXkN-nXy-YTM-7dWBqDuNxfKbvW3lps_v48N51i3bZ8Kg3p4BBd40RRTUUA_Oe6-RsEoBqeU8YvCkbtJMJspGX7bCAmQXa3gCluPh_MJ8oGR_Fi66PZ4dm1IgKbPcsLoatfr6tQWVTjuKaJPnO6LtJy-WDOvRABJOrdvVdyxu6qPb6ZeAWENrd_MlBwiwDBhi4RwR7Te-fw48-1xN9JwEVexK2cwpU6KPX-ZVRL2-PpidwNSM1qsBMmIvEOrTAjEykAWAkr"
                width={600}
                height={340}
                priority
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" aria-hidden="true"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" aria-hidden="true"></div>
          </div>
        </section>

        {/* Section 2: Search & Filter Bar */}
        <section id="courses-section" className="scroll-mt-24">
          <div className="glass-card p-6 rounded-2xl flex flex-wrap lg:flex-nowrap gap-4 items-center shadow-md">
            <div className="flex-grow min-w-[280px] relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-text-secondary/50" aria-hidden="true">
                search
              </span>
              <input
                className="w-full bg-white/40 border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="Tìm khóa học..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="bg-white/40 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-primary font-semibold cursor-pointer"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
              >
                <option value="all">Tất cả trình độ</option>
                <option value="beginner">Mất gốc</option>
                <option value="elementary">Cơ bản</option>
                <option value="toeic-foundation">TOEIC 450+</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
                <option value="vstep">VSTEP</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
              </select>
              <select
                className="bg-white/40 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-primary font-semibold cursor-pointer"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value as SkillFilter)}
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="vocabulary">Từ vựng</option>
                <option value="grammar">Ngữ pháp</option>
                <option value="listening">Nghe</option>
                <option value="reading">Đọc</option>
                <option value="vstep">VSTEP</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Course List */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Tất cả khóa học
            </h2>
            <span className="text-sm font-semibold text-text-secondary bg-primary/10 px-3.5 py-1.5 rounded-full">
              Tìm thấy {filteredCourses.length} khóa học
            </span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard course={course} key={course.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa tìm thấy khóa học phù hợp"
              description="Hãy thử đổi bộ lọc hoặc từ khóa tìm kiếm khác để tìm khóa học mong muốn."
            />
          )}
        </section>

        {/* Section 4: Lộ trình đề xuất */}
        <section className="py-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-text-primary">
              Lộ trình học tập đề xuất
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            <p className="text-base text-text-secondary">
              Quy trình 3 bước khoa học giúp bạn đạt kết quả tối đa
            </p>
          </div>
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 -translate-y-12 z-0" aria-hidden="true"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-primary/20">
                  1
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-text-primary">
                    Đánh giá &amp; Phân tích
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Thực hiện bài kiểm tra đầu vào để xác định chính xác trình độ và lỗ hổng kiến thức hiện tại.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-accent/20">
                  2
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-text-primary">
                    Học tập Cá nhân hóa
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Hệ thống tự động gợi ý các bài học và bài luyện tập phù hợp nhất với điểm yếu của bạn.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-secondary text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-secondary/20">
                  3
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-text-primary">
                    Luyện tập &amp; Chinh phục
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Thực hành liên tục với các bộ đề thi thử TOEIC &amp; VSTEP sát thực tế để tự tin bứt phá điểm thi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Tại sao nên học theo khóa học */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-text-primary">
              Tại sao nên học theo khóa học?
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                  rocket_launch
                </span>
              </div>
              <h5 className="text-base font-bold text-text-primary">
                Học nhanh hơn 2x
              </h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Lộ trình học tập tinh gọn, tập trung hoàn toàn vào những kiến thức trọng tâm nhất.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-accent/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                  track_changes
                </span>
              </div>
              <h5 className="text-base font-bold text-text-primary">
                Theo sát mục tiêu
              </h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Luôn biết mình đang ở đâu và cần thêm bao nhiêu nỗ lực để đạt mục tiêu TOEIC/VSTEP mong muốn.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-secondary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                  verified_user
                </span>
              </div>
              <h5 className="text-base font-bold text-text-primary">
                Cam kết chất lượng
              </h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Kiến thức chuẩn xác kết hợp với phương pháp học khoa học đã được kiểm chứng hiệu quả.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-4 hover:border-primary/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                  psychology
                </span>
              </div>
              <h5 className="text-base font-bold text-text-primary">
                Nhớ lâu gấp 3
              </h5>
              <p className="text-xs text-text-secondary leading-relaxed">
                Áp dụng phương pháp lặp lại ngắt quãng (Spaced Repetition) thông minh và học qua hình ảnh.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Final CTA */}
        <section className="py-8">
          <div className="relative overflow-hidden glass-card rounded-[2.5rem] p-12 lg:p-20 text-center shadow-xl">
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                Bạn chưa biết nên bắt đầu từ đâu?
              </h2>
              <p className="text-base text-text-secondary">
                Hãy để chúng tôi giúp bạn xây dựng lộ trình học cá nhân hóa dựa trên trình độ hiện tại của bạn.
              </p>
              <Link
                href="/practice"
                className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-2xl font-bold inline-flex items-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all shadow-md"
                title="Khởi chạy đánh giá năng lực"
              >
                Kiểm tra trình độ ngay
                <span className="material-symbols-outlined" aria-hidden="true">
                  analytics
                </span>
              </Link>
            </div>
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px]" aria-hidden="true"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[80px]" aria-hidden="true"></div>
          </div>
        </section>

      </div>
    </div>
  );
}
