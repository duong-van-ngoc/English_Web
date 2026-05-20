import { getAccessToken } from "@/lib/auth";
import type {
  ApiResponse,
  AdminSummary,
  AuthUser,
  ContentStatus,
  Course,
  CoursePayload,
  LessonPayload,
  Lesson,
  LoginCredentials,
  LoginResult,
  Question,
  QuestionPayload,
  RegisterPayload,
  ToeicAttemptHistoryItem,
  ToeicAttemptResult,
  ToeicAttemptStartResult,
  ToeicAttemptSubmitResult,
  ToeicPart,
  ToeicQuestionSet,
  ToeicQuestionSetSummary,
  Vocabulary,
  VocabularyPayload,
} from "@/types";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL;

if (!apiOrigin) {
  throw new Error("Missing NEXT_PUBLIC_API_URL");
}

const apiBaseUrl = `${apiOrigin.replace(/\/$/, "")}/api`;

type ErrorPayload = {
  message?: string | string[];
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(payload: ErrorPayload | null, status: number): string {
  if (Array.isArray(payload?.message)) {
    return payload.message.join(", ");
  }

  if (typeof payload?.message === "string" && payload.message.length > 0) {
    return payload.message;
  }

  return `API request failed with status ${status}`;
}

function withQuery(
  endpoint: string,
  params: Record<string, string | undefined> = {},
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();

  return queryString ? `${endpoint}?${queryString}` : endpoint;
}

async function request<TData>(
  endpoint: string,
  options: RequestInit = {},
): Promise<TData> {
  const token = getAccessToken();
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: options.cache ?? "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<TData>
    | ErrorPayload
    | null;

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload as ErrorPayload | null, response.status),
      response.status,
    );
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("success" in payload) ||
    payload.success !== true
  ) {
    throw new ApiError("Invalid API response", response.status);
  }

  return payload.data;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export const api = {
  getCourses: () => request<Course[]>("/courses"),
  getCourseById: (courseId: string) => request<Course>(`/courses/${courseId}`),
  getLessonById: (lessonId: string) => request<Lesson>(`/lessons/${lessonId}`),
  getCurrentUser: () => request<AuthUser>("/auth/me"),
  login: (credentials: LoginCredentials) =>
    request<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (payload: RegisterPayload) =>
    request<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAdminSummary: () => request<AdminSummary>("/admin/summary"),
  getAdminCourses: (params?: { search?: string; status?: ContentStatus | "" }) =>
    request<Course[]>(withQuery("/admin/courses", params)),
  getAdminCourse: (courseId: string) =>
    request<Course>(`/admin/courses/${courseId}`),
  createCourse: (payload: CoursePayload) =>
    request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateCourse: (courseId: string, payload: Partial<CoursePayload>) =>
    request<Course>(`/courses/${courseId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteCourse: (courseId: string) =>
    request<Course>(`/courses/${courseId}`, {
      method: "DELETE",
    }),
  updateCourseStatus: (courseId: string, status: ContentStatus) =>
    request<Course>(`/courses/${courseId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getAdminLessons: (params?: {
    search?: string;
    status?: ContentStatus | "";
    courseId?: string;
  }) => request<Lesson[]>(withQuery("/admin/lessons", params)),
  getAdminLesson: (lessonId: string) =>
    request<Lesson>(`/admin/lessons/${lessonId}`),
  createLesson: (courseId: string, payload: LessonPayload) =>
    request<Lesson>(`/courses/${courseId}/lessons`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateLesson: (lessonId: string, payload: Partial<LessonPayload>) =>
    request<Lesson>(`/lessons/${lessonId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteLesson: (lessonId: string) =>
    request<Lesson>(`/lessons/${lessonId}`, {
      method: "DELETE",
    }),
  updateLessonStatus: (lessonId: string, status: ContentStatus) =>
    request<Lesson>(`/lessons/${lessonId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getAdminQuestions: (params?: {
    search?: string;
    status?: ContentStatus | "";
    lessonId?: string;
  }) => request<Question[]>(withQuery("/admin/questions", params)),
  getAdminQuestion: (questionId: string) =>
    request<Question>(`/admin/questions/${questionId}`),
  createQuestion: (lessonId: string, payload: QuestionPayload) =>
    request<Question>(`/lessons/${lessonId}/questions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateQuestion: (questionId: string, payload: Partial<QuestionPayload>) =>
    request<Question>(`/questions/${questionId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteQuestion: (questionId: string) =>
    request<Question>(`/questions/${questionId}`, {
      method: "DELETE",
    }),
  updateQuestionStatus: (questionId: string, status: ContentStatus) =>
    request<Question>(`/questions/${questionId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getAdminVocabulary: (params?: { search?: string; lessonId?: string }) =>
    request<Vocabulary[]>(withQuery("/admin/vocabulary", params)),
  getAdminVocabularyItem: (vocabularyId: string) =>
    request<Vocabulary>(`/admin/vocabulary/${vocabularyId}`),
  createVocabulary: (lessonId: string, payload: VocabularyPayload) =>
    request<Vocabulary>(`/lessons/${lessonId}/vocabulary`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateVocabulary: (
    vocabularyId: string,
    payload: Partial<VocabularyPayload>,
  ) =>
    request<Vocabulary>(`/vocabulary/${vocabularyId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteVocabulary: (vocabularyId: string) =>
    request<Vocabulary>(`/vocabulary/${vocabularyId}`, {
      method: "DELETE",
    }),
  getToeicParts: () => request<ToeicPart[]>("/practice/parts"),
  getToeicQuestionSets: (params?: { part?: string }) =>
    request<ToeicQuestionSetSummary[]>(
      withQuery("/practice/question-sets", params),
    ),
  getToeicQuestionsByPart: (part: string) =>
    request<ToeicQuestionSet>(withQuery("/practice/questions", { part })),
  startToeicAttempt: (questionSetId: string) =>
    request<ToeicAttemptStartResult>("/attempts", {
      method: "POST",
      body: JSON.stringify({ questionSetId }),
    }),
  submitToeicAttempt: (
    attemptId: string,
    answers: Array<{ questionId: string; selectedChoiceId?: string | null }>,
  ) =>
    request<ToeicAttemptSubmitResult>(`/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  getToeicAttemptResult: (attemptId: string) =>
    request<ToeicAttemptResult>(`/attempts/${attemptId}/result`),
  getToeicAttemptHistory: () =>
    request<ToeicAttemptHistoryItem[]>("/attempts/history"),
};
