export interface ApiResponse<TData> {
  success: boolean;
  data: TData;
  message?: string;
}

export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  toeicGoal?: number | null;
  level?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

export type ContentStatus = "DRAFT" | "PUBLISHED";

export type FileKind = "AUDIO" | "IMAGE";

export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "TRUE_FALSE";

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vocabulary {
  id: string;
  lessonId: string;
  word: string;
  meaning: string;
  phonetic?: string | null;
  example?: string | null;
  audioUrl?: string | null;
  lesson?: Lesson & {
    course?: Course;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  lessonId: string;
  title: string;
  type: QuestionType;
  explanation?: string | null;
  status: ContentStatus;
  publishedAt?: string | null;
  order: number;
  answers?: Answer[];
  lesson?: Lesson & {
    course?: Course;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId?: string | null;
  title: string;
  content: string;
  order: number;
  status: ContentStatus;
  publishedAt?: string | null;
  course?: Course;
  vocabulary?: Vocabulary[];
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  level: string;
  status: ContentStatus;
  publishedAt?: string | null;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface FileAsset {
  id: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  kind: FileKind;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileAssetListResult {
  items: FileAsset[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string | null;
  completed: boolean;
  score?: number | null;
  course?: Course;
  lesson?: Lesson | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecentContent {
  id: string;
  title: string;
  type: "COURSE" | "LESSON" | "VOCABULARY" | "QUESTION";
  status?: ContentStatus;
  updatedAt: string;
}

export interface AdminSummary {
  totalCourses: number;
  totalLessons: number;
  totalVocabulary: number;
  totalQuestions: number;
  draftCount: number;
  publishedCount: number;
  recentUpdatedContent: RecentContent[];
}

export interface CoursePayload {
  title: string;
  slug?: string;
  level: string;
  description?: string;
}

export interface LessonPayload {
  title: string;
  content: string;
  order: number;
  moduleId?: string | null;
}

export interface VocabularyPayload {
  word: string;
  meaning: string;
  phonetic?: string;
  example?: string;
  audioUrl?: string;
}

export interface AnswerPayload {
  content: string;
  isCorrect?: boolean;
}

export interface QuestionPayload {
  title: string;
  type?: QuestionType;
  explanation?: string;
  order?: number;
  answers?: AnswerPayload[];
}

export interface ToeicPart {
  part: number;
  title: string;
  description: string;
}

export interface ToeicQuestionSetSummary {
  id: string;
  title: string;
  description?: string | null;
  part: number;
  type: "PRACTICE" | "MOCK_TEST";
  duration?: number | null;
  version: number;
}

export interface ToeicChoice {
  id: string;
  label: string;
  content: string;
  isCorrect?: boolean;
}

export interface ToeicQuestion {
  id: string;
  content: string;
  explanation?: string | null;
  choices: ToeicChoice[];
  userAnswer?: {
    selectedChoiceId: string | null;
    isCorrect: boolean;
  };
}

export interface ToeicQuestionGroup {
  id: string;
  title?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  passageContent?: string | null;
  transcript?: string | null;
  questions: ToeicQuestion[];
}

export interface ToeicQuestionSet {
  id: string;
  title: string;
  description?: string | null;
  part: number;
  type: "PRACTICE" | "MOCK_TEST";
  duration?: number | null;
  version: number;
  groups: ToeicQuestionGroup[];
}

export interface AdminToeicQuestionSet {
  id: string;
  title: string;
  description?: string | null;
  part: number;
  type: "PRACTICE" | "MOCK_TEST";
  duration?: number | null;
  version: number;
  _count: {
    groups: number;
  };
}

export interface AdminToeicQuestionGroup {
  id: string;
  questionSetId: string;
  title?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
  passageContent?: string | null;
  transcript?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  questionSet: {
    id: string;
    title: string;
    part: number;
    type: "PRACTICE" | "MOCK_TEST";
  };
  questions: Array<{
    id: string;
    content: string;
    order: number;
  }>;
  _count: {
    questions: number;
  };
}

export type ToeicAttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";

export interface ToeicAttemptStartResult {
  id: string;
  questionSetId: string;
  status: ToeicAttemptStatus;
  totalQuestions: number;
  startedAt: string;
}

export interface ToeicAttemptSubmitResult {
  id: string;
  status: ToeicAttemptStatus;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  submittedAt: string | null;
}

export interface ToeicAttemptResult {
  attemptId: string;
  questionSetTitle: string;
  part: number;
  status: ToeicAttemptStatus;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  submittedAt: string | null;
  groups: ToeicQuestionGroup[];
}

export interface ToeicAttemptHistoryItem {
  id: string;
  status: ToeicAttemptStatus;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  submittedAt: string | null;
  questionSet: {
    title: string;
    part: number;
  };
}

export interface DashboardSummary {
  profile: {
    userId: string;
    name: string | null;
    email: string;
  };
  learning: {
    totalCourses: number;
    totalLessons: number;
    completedLessons: number;
    completionRate: number;
    lastStudiedAt: string | null;
  };
  toeic: {
    totalAttempts: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    totalWrongAnswers: number;
    accuracyRate: number;
    weakestPart: {
      part: number;
      title: string;
      wrongRate: number;
      answeredQuestions: number;
    } | null;
  };
  review: {
    dueVocabularyCount: number;
    wrongQuestionCount: number;
  };
  recommendation: {
    type:
      | "LESSON"
      | "TOEIC_PART"
      | "VOCABULARY_REVIEW"
      | "WRONG_QUESTION_REVIEW";
    title: string;
    href: string;
    reason: string;
  } | null;
}

export interface StatsSummary {
  byPart: Array<{
    part: number;
    title: string;
    attempts: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    accuracyRate: number;
    lastSubmittedAt: string | null;
  }>;
  recentAttempts: Array<{
    attemptId: string;
    questionSetTitle: string;
    part: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    submittedAt: string | null;
  }>;
}

export interface ReviewQueue {
  vocabulary: Array<{
    id: string;
    vocabularyId: string;
    word: string;
    meaning: string;
    example: string | null;
    reviewCount: number;
    nextReviewAt: string;
  }>;
  toeicWrongQuestions: Array<{
    id: string;
    questionId: string;
    part: number;
    questionSetTitle: string;
    content: string;
    wrongCount: number;
    lastWrongAt: string;
    choices: Array<{
      id: string;
      label: string;
      content: string;
      isCorrect: boolean;
    }>;
    explanation: string | null;
  }>;
}

export interface VocabularyReviewResult {
  id: string;
  vocabularyId: string;
  status: "DUE" | "LEARNING" | "MASTERED";
  easeLevel: number;
  reviewCount: number;
  lastReviewedAt: string | null;
  nextReviewAt: string;
}

export type ModuleType =
  | "GRAMMAR"
  | "VOCABULARY"
  | "LISTENING"
  | "READING"
  | "WRITING"
  | "SPEAKING"
  | "MOCK_TESTS";

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description?: string | null;
  type: ModuleType;
  icon?: string | null;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseModulePayload {
  title: string;
  slug: string;
  description?: string;
  type: ModuleType;
  icon?: string;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateCourseModulePayload {
  title?: string;
  slug?: string;
  description?: string;
  type?: ModuleType;
  icon?: string;
  order?: number;
  isPublished?: boolean;
}
