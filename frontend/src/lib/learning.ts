import { courses, lessons } from "@/data/learning-content";
import type { CourseWithStats, Lesson } from "@/types/learning";

export function getCourses(): CourseWithStats[] {
  return courses.map((course) => {
    const courseLessons = getLessonsByCourseId(course.id);

    return {
      ...course,
      lessonCount: courseLessons.length,
      totalDurationMinutes: courseLessons.reduce(
        (total, lesson) => total + lesson.durationMinutes,
        0,
      ),
    };
  });
}

export function getCourseById(courseId: string): CourseWithStats | undefined {
  return getCourses().find((course) => course.id === courseId);
}

export function getLessonsByCourseId(courseId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((firstLesson, secondLesson) => firstLesson.order - secondLesson.order);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getCourseForLesson(lesson: Lesson): CourseWithStats | undefined {
  return getCourseById(lesson.courseId);
}

export function getNextLesson(currentLesson: Lesson): Lesson | undefined {
  const courseLessons = getLessonsByCourseId(currentLesson.courseId);
  const currentIndex = courseLessons.findIndex(
    (lesson) => lesson.id === currentLesson.id,
  );

  return courseLessons[currentIndex + 1];
}
