import type { Metadata } from "next";
import { api } from "@/lib/api";
import { CoursesListClient } from "./courses-list-client";

// 1. Enable ISR (Incremental Static Regeneration) with 1-hour cache
export const revalidate = 3600;

// 2. Define SEO Metadata for the courses route
export const metadata: Metadata = {
  title: "Danh sách Khóa học | EnglishTobi",
  description: "Khám phá danh sách khóa học tiếng Anh trực tuyến chất lượng cao từ mất gốc đến mục tiêu TOEIC 450 - 500+ và VSTEP tại EnglishTobi.",
  alternates: {
    canonical: "https://englishtobi.edu.vn/courses",
  },
};

export default async function CoursesPage() {
  let courses = [];

  try {
    courses = await api.getCourses();
  } catch {
    courses = [];
  }

  return <CoursesListClient initialCourses={courses} />;
}
