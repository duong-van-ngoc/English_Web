import type { Metadata } from "next";

import { api } from "@/lib/api";
import type { Course } from "@/types";

// Import route-specific split sections
import { HomeHero } from "./_components/home-hero";
import { HomeProblems } from "./_components/home-problems";
import { HomeSolutions } from "./_components/home-solutions";
import { HomeRoadmap } from "./_components/home-roadmap";
import { HomeFeaturedCourses } from "./_components/home-featured-courses";
import { HomeFeaturesGrid } from "./_components/home-features-grid";
import { HomeStats } from "./_components/home-stats";
import { HomeCta } from "./_components/home-cta";

// 1. Configure Incremental Static Regeneration (ISR) with a 1-hour revalidation time
export const revalidate = 3600;

// 2. Define SEO Metadata according to search engine optimization guidelines
export const metadata: Metadata = {
  title: "EnglishTobi - Lộ trình học tiếng Anh trực tuyến & Luyện thi TOEIC",
  description: "Nền tảng học tiếng Anh trực tuyến từ mất gốc đến mục tiêu TOEIC 450 - 500. Học từ vựng theo chủ đề, ngữ pháp, flashcard và bài quiz tương tác.",
  alternates: {
    canonical: "https://englishtobi.edu.vn",
  },
  openGraph: {
    title: "EnglishTobi - Lộ trình học tiếng Anh trực tuyến & Luyện thi TOEIC",
    description: "Học tiếng Anh dễ dàng hơn mỗi ngày với lộ trình cá nhân hóa, phương pháp Flashcard thông minh và ngân hàng câu hỏi thi thử TOEIC/VSTEP.",
    url: "https://englishtobi.edu.vn",
    siteName: "EnglishTobi",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "EnglishTobi E-Learning Platform",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnglishTobi - Lộ trình học tiếng Anh trực tuyến & Luyện thi TOEIC",
    description: "Nền tảng học tiếng Anh trực tuyến từ mất gốc đến mục tiêu TOEIC 450 - 500.",
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"],
  },
};

/**
 * HomePage is a Server Component. It fetches data on the server during build
 * or ISR regeneration, then passes it down to presentation components.
 * This pattern optimizes loading speed (LCP) and SEO indexing.
 */
export default async function HomePage() {
  let courses: Course[] = [];

  try {
    // Fetch all courses from the backend database
    courses = await api.getCourses();
  } catch {
    courses = [];
  }

  // Get first 3 courses to showcase on the home page
  const featuredCourses = courses.slice(0, 3);

  // Compute total lessons count across all courses
  const totalLessons = courses.reduce(
    (sum, course) => sum + (course.lessons?.length ?? 0),
    0,
  );

  // Define Structured Data (JSON-LD) for Search Snippets (WebSite and CourseList)
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EnglishTobi",
    "url": "https://englishtobi.edu.vn",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://englishtobi.edu.vn/courses?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const courseListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": featuredCourses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": "EnglishTobi",
          "sameAs": "https://englishtobi.edu.vn"
        }
      }
    }))
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Injection of JSON-LD scripts for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {featuredCourses.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListJsonLd) }}
        />
      )}

      {/* Hero section */}
      <HomeHero />

      {/* Problem list validation */}
      <HomeProblems />

      {/* Solution values of the platform */}
      <HomeSolutions />

      {/* 3-step structured learning roadmap */}
      <HomeRoadmap />

      {/* Dynamically fetched featured courses grid */}
      <HomeFeaturedCourses featuredCourses={featuredCourses} />

      {/* Platform features grid (Bento Grid) */}
      <HomeFeaturesGrid />

      {/* Interactive counters/statistics */}
      <HomeStats coursesCount={courses.length} totalLessons={totalLessons} />

      {/* Final Call to Action */}
      <HomeCta />
    </div>
  );
}
