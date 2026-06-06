import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CourseCard } from "./course-card";
import type { Course } from "@/types";

describe("CourseCard", () => {
  it("renders course details and computed lesson count", () => {
    const course: Course = {
      id: "course-1",
      title: "English Starter",
      slug: "english-starter",
      description: "Foundational English course",
      level: "beginner",
      status: "PUBLISHED",
      lessons: [
        {
          id: "lesson-1",
          courseId: "course-1",
          title: "Lesson 1",
          content: "Content",
          order: 1,
          status: "PUBLISHED",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "lesson-2",
          courseId: "course-1",
          title: "Lesson 2",
          content: "Content",
          order: 2,
          status: "PUBLISHED",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    render(<CourseCard course={course} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/courses/course-1");
    expect(screen.getByText("English Starter")).toBeInTheDocument();
    expect(screen.getByText("beginner")).toBeInTheDocument();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText("Foundational English course")).toBeInTheDocument();
  });

  it("renders fallback description when description is missing", () => {
    const course: Course = {
      id: "course-2",
      title: "TOEIC Reading",
      slug: "toeic-reading",
      level: "toeic-foundation",
      status: "PUBLISHED",
      lessons: [],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    render(<CourseCard course={course} />);

    expect(
      screen.getByText("Khóa học này đang chờ bổ sung mô tả chi tiết."),
    ).toBeInTheDocument();
    expect(screen.getByText("0 bài học")).toBeInTheDocument();
  });
});
