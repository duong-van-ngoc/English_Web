export type ModuleStatus = "in-progress" | "not-started" | "locked" | "completed";

export interface VstepModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: number;
  quizzes: number;
  progress: number;
  status: ModuleStatus;
  iconName: "Grammar" | "Vocabulary" | "Listening" | "Reading" | "Writing" | "Speaking" | "MockTests";
  slug: string;
}

export const VSTEP_MODULES: VstepModule[] = [
  {
    id: "module-1",
    title: "Grammar Foundation",
    subtitle: "Nền tảng ngữ pháp",
    description: "Nắm chắc cấu trúc câu, thì, mệnh đề và các điểm ngữ pháp quan trọng trong VSTEP.",
    lessons: 12,
    quizzes: 3,
    progress: 60,
    status: "in-progress",
    iconName: "Grammar",
    slug: "grammar-foundation",
  },
  {
    id: "module-2",
    title: "Vocabulary by Topics",
    subtitle: "Từ vựng theo chủ đề",
    description: "Học từ vựng theo các chủ đề thường gặp trong bài thi VSTEP B1-B2.",
    lessons: 15,
    quizzes: 5,
    progress: 30,
    status: "in-progress",
    iconName: "Vocabulary",
    slug: "vocabulary-by-topics",
  },
  {
    id: "module-3",
    title: "Listening",
    subtitle: "Luyện nghe",
    description: "Luyện kỹ năng nghe theo từng dạng bài: hội thoại ngắn, hội thoại dài và bài nói học thuật.",
    lessons: 10,
    quizzes: 4,
    progress: 15,
    status: "in-progress",
    iconName: "Listening",
    slug: "listening",
  },
  {
    id: "module-4",
    title: "Reading",
    subtitle: "Luyện đọc",
    description: "Rèn kỹ năng đọc hiểu, tìm ý chính, tìm thông tin chi tiết và suy luận.",
    lessons: 10,
    quizzes: 4,
    progress: 20,
    status: "in-progress",
    iconName: "Reading",
    slug: "reading",
  },
  {
    id: "module-5",
    title: "Writing",
    subtitle: "Luyện viết",
    description: "Luyện viết email, thư, bài luận và cách triển khai ý trong bài thi VSTEP.",
    lessons: 12,
    quizzes: 3,
    progress: 0,
    status: "not-started",
    iconName: "Writing",
    slug: "writing",
  },
  {
    id: "module-6",
    title: "Speaking",
    subtitle: "Luyện nói",
    description: "Luyện nói theo 3 phần của bài thi VSTEP: tương tác xã hội, thảo luận giải pháp và phát triển chủ đề.",
    lessons: 12,
    quizzes: 3,
    progress: 0,
    status: "not-started",
    iconName: "Speaking",
    slug: "speaking",
  },
  {
    id: "module-7",
    title: "Mock Tests",
    subtitle: "Đề thi thử",
    description: "Luyện đề thi VSTEP hoàn chỉnh với đầy đủ Listening, Reading, Writing và Speaking.",
    lessons: 8,
    quizzes: 8,
    progress: 0,
    status: "locked",
    iconName: "MockTests",
    slug: "mock-tests",
  },
];
