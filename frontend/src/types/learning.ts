export type CourseLevel = "Mat goc" | "Foundation" | "TOEIC Starter";

export type CourseAccent = "primary" | "secondary" | "accent";

export type LessonSkill =
  | "Pronunciation"
  | "Vocabulary"
  | "Grammar"
  | "Listening"
  | "Reading";

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  level: CourseLevel;
  targetScore: string;
  duration: string;
  accentColor: CourseAccent;
  outcomes: string[];
}

export interface LessonSection {
  title: string;
  body: string;
}

export interface Lesson {
  id: string;
  courseId: Course["id"];
  title: string;
  summary: string;
  skill: LessonSkill;
  order: number;
  durationMinutes: number;
  objectives: string[];
  sections: LessonSection[];
}

export interface CourseWithStats extends Course {
  lessonCount: number;
  totalDurationMinutes: number;
}
