"use client";

import { useState, useMemo } from "react";
import type { Course } from "@/types";
import { CourseCard, type CourseWithStats } from "@/features/course/components/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_COURSES } from "@/data/mock-courses";

// Import sub-components
import { CoursesHero } from "./components/courses-hero";
import { CoursesFilterSearch, type LevelFilter, type SkillFilter } from "./components/courses-filter-search";
import { CoursesRoadmap } from "./components/courses-roadmap";
import { CoursesFeatures } from "./components/courses-features";
import { CoursesCta } from "./components/courses-cta";

interface CoursesListClientProps {
  initialCourses: Course[];
}

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
        <CoursesHero />

        {/* Section 2: Search & Filter Bar */}
        <CoursesFilterSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          skillFilter={skillFilter}
          setSkillFilter={setSkillFilter}
        />

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
        <CoursesRoadmap />

        {/* Section 5: Tại sao nên học theo khóa học */}
        <CoursesFeatures />

        {/* Section 6: Final CTA */}
        <CoursesCta />

      </div>
    </div>
  );
}
