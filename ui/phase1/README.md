# UI Phase 1 - English Learning Explorer

Tài liệu này mô tả chi tiết các màn hình của Phase 1 cho web học tiếng Anh **English Learning Explorer**.

Mục tiêu Phase 1:

- Nắm Next.js App Router qua route thật.
- Hiểu component flow, data flow, routing flow, render flow, props flow và state flow.
- Dùng fake data có TypeScript type rõ ràng trước khi nối backend.
- Xây UI sạch, dễ đọc, có thể mở rộng.

## Tổng Quan Màn Hình

| Nhóm | Màn hình | Route | File source |
|---|---|---|---|
| Màn chính | Home Page | `/` | `frontend/src/app/page.tsx` |
| Màn tài khoản | Login Page | `/login` | `frontend/src/app/login/page.tsx` |
| Màn tài khoản | Register Page | `/register` | `frontend/src/app/register/page.tsx` |
| Màn chính | Courses Page | `/courses` | `frontend/src/app/courses/page.tsx` |
| Màn chính | Course Detail Page | `/courses/[courseId]` | `frontend/src/app/courses/[courseId]/page.tsx` |
| Màn chính | Lesson Detail Page | `/lessons/[lessonId]` | `frontend/src/app/lessons/[lessonId]/page.tsx` |
| Trạng thái | Global Loading | Theo route đang tải | `frontend/src/app/loading.tsx` |
| Trạng thái | Course Detail Loading | `/courses/[courseId]` | `frontend/src/app/courses/[courseId]/loading.tsx` |
| Trạng thái | Lesson Detail Loading | `/lessons/[lessonId]` | `frontend/src/app/lessons/[lessonId]/loading.tsx` |
| Trạng thái | Not Found Page | Route không tồn tại | `frontend/src/app/not-found.tsx` |
| Trạng thái | Error Page | Route render lỗi | `frontend/src/app/error.tsx` |

## Layout Chung

Route: áp dụng cho toàn bộ app

File source:

```txt
frontend/src/app/layout.tsx
```

Mục đích:

- Tạo khung chung cho toàn bộ web.
- Hiển thị header, nội dung page hiện tại và footer.
- Giúp các page không phải lặp lại navigation và layout cơ bản.

Thành phần UI chính:

- `AppHeader`: logo, link Trang chủ, Khóa học, Đăng nhập, Bắt đầu.
- `children`: page hiện tại được Next.js render vào layout.
- Footer: tên app và phase hiện tại.

Render flow:

```txt
layout.tsx
-> AppHeader
-> children: page hiện tại
-> Footer
```

Kiến thức Phase 1:

- Root layout
- Shared UI
- `children`
- Server Component mặc định

## 1. Home Page

Route:

```txt
/
```

File source:

```txt
frontend/src/app/page.tsx
```

Mục đích:

- Là màn đầu tiên khi user vào web.
- Giới thiệu app học tiếng Anh cho người mới.
- Điều hướng user tới danh sách khóa học hoặc màn đăng nhập học thử.

Thành phần UI chính:

- Hero section.
- Tiêu đề lớn: `Bắt đầu học tiếng Anh từ nền tảng, rồi tiến dần tới TOEIC.`
- Mô tả ngắn về lộ trình học.
- Button `Xem khóa học`.
- Button `Học thử`.
- Panel `Kế hoạch hôm nay`.
- Thống kê nhanh: số lộ trình, số bài học, mục tiêu TOEIC.
- Section `Lộ trình nổi bật`.
- Danh sách 2 `CourseCard` nổi bật.

Data flow:

```txt
HomePage
-> getCourses()
-> courses.slice(0, 2)
-> CourseCard
```

Component flow:

```txt
page.tsx
-> PrimaryButton
-> CourseCard
```

Render flow:

- Page là Server Component.
- Data được lấy từ fake data thông qua `getCourses()`.
- HTML được render từ server trước khi gửi xuống browser.

Props flow:

```txt
CourseCard nhận prop:
course: CourseWithStats
```

Kiến thức Phase 1:

- Server Component
- Render list
- Props
- `slice`
- Reusable component
- Next.js `Link`
- Tailwind layout grid

## 2. Login Page

Route:

```txt
/login
```

File source:

```txt
frontend/src/app/login/page.tsx
```

Mục đích:

- Cung cấp UI đăng nhập cho người học.
- Phase 1 chưa nối backend, chỉ dựng form và state flow.

Thành phần UI chính:

- Intro section.
- Tiêu đề: `Đăng nhập để tiếp tục lộ trình học`.
- Mô tả lợi ích: lưu tiến độ học, tiếp tục bài đang học, quay lại danh sách cần ôn.
- Form đăng nhập.
- Link sang Register.

Form fields:

- Email
- Mật khẩu
- Button `Đăng nhập`

Component flow:

```txt
LoginPage
-> AuthForm mode="login"
```

State flow:

```txt
AuthForm
-> useState(formState)
-> user nhập email/password
-> updateField()
-> validate isValid
-> submit
-> hiển thị feedback mẫu
```

Props flow:

```txt
AuthForm nhận prop:
mode: "login"
```

Kiến thức Phase 1:

- Client Component
- `useState`
- `useMemo`
- Controlled input
- Form submit
- Props để điều khiển UI

## 3. Register Page

Route:

```txt
/register
```

File source:

```txt
frontend/src/app/register/page.tsx
```

Mục đích:

- Cung cấp UI tạo tài khoản học thử.
- Tái sử dụng `AuthForm` với mode khác để học component reuse.

Thành phần UI chính:

- Intro section.
- Tiêu đề: `Tạo tài khoản học thử`.
- Mô tả: tạo hồ sơ học để bắt đầu với lộ trình phù hợp.
- Form đăng ký.
- Link sang Login.

Form fields:

- Họ tên
- Email
- Mật khẩu
- Button `Tạo tài khoản`

Component flow:

```txt
RegisterPage
-> AuthForm mode="register"
```

Props flow:

```txt
AuthForm nhận mode="register"
-> hiện thêm field Họ tên
```

State flow:

```txt
formState.name
formState.email
formState.password
-> validate
-> feedback
```

Kiến thức Phase 1:

- Component reuse
- Conditional rendering
- Form state
- Props
- Validation đơn giản

## 4. Courses Page

Route:

```txt
/courses
```

File source:

```txt
frontend/src/app/courses/page.tsx
```

Mục đích:

- Hiển thị toàn bộ lộ trình học.
- Là màn chính để học `map()` và render danh sách.

Thành phần UI chính:

- Page heading.
- Tiêu đề: `Lộ trình học tiếng Anh cho người mới`.
- Mô tả ngắn về khóa học.
- Course grid.
- Empty state nếu không có khóa học.

Data flow:

```txt
CoursesPage
-> getCourses()
-> courses.map()
-> CourseCard
```

Component flow:

```txt
CoursesPage
-> CourseCard
-> EmptyState nếu courses.length === 0
```

Props flow:

```txt
CourseCard nhận:
course: CourseWithStats
```

Empty state flow:

```txt
Nếu courses.length > 0
-> render course grid

Nếu courses.length === 0
-> render EmptyState
```

Kiến thức Phase 1:

- Render list
- `map()`
- Empty state
- Props
- Grid layout
- Fake data selector

## 5. Course Detail Page

Route:

```txt
/courses/[courseId]
```

Ví dụ route thật:

```txt
/courses/starter-foundation
/courses/toeic-vocabulary-core
/courses/toeic-reading-basic
```

File source:

```txt
frontend/src/app/courses/[courseId]/page.tsx
```

Mục đích:

- Hiển thị chi tiết một khóa học.
- Hiển thị danh sách bài học thuộc khóa đó.
- Là màn chính để học dynamic route trong App Router.

Thành phần UI chính:

- Back link về `/courses`.
- Course overview.
- Course level.
- Course title.
- Course subtitle.
- Course description.
- Button `Bắt đầu bài đầu tiên`.
- Panel `Kết quả sau khóa học`.
- Course stats: mục tiêu, số bài học.
- Section `Danh sách bài học`.
- `LessonList`.

Routing flow:

```txt
User click CourseCard
-> /courses/[courseId]
-> Next.js lấy params
-> await params
-> courseId
```

Data flow:

```txt
CourseDetailPage
-> await params
-> getCourseById(courseId)
-> getLessonsByCourseId(course.id)
-> LessonList
```

Component flow:

```txt
CourseDetailPage
-> PrimaryButton
-> LessonList
```

Props flow:

```txt
LessonList nhận:
lessons: Lesson[]
```

Not found flow:

```txt
Nếu không tìm thấy course
-> notFound()
-> app/not-found.tsx
```

Build flow:

```txt
generateStaticParams()
-> getCourses()
-> sinh danh sách courseId
-> Next.js prerender các route detail
```

Kiến thức Phase 1:

- Dynamic route
- `params: Promise<...>`
- `await params`
- `find()`
- `filter()`
- `generateStaticParams`
- `notFound()`
- Props xuống child component

## 6. Lesson Detail Page

Route:

```txt
/lessons/[lessonId]
```

Ví dụ route thật:

```txt
/lessons/alphabet-sound-map
/lessons/first-workplace-words
/lessons/simple-present-for-starter
```

File source:

```txt
frontend/src/app/lessons/[lessonId]/page.tsx
```

Mục đích:

- Hiển thị nội dung chi tiết của một bài học.
- Cho user học từng bài nhỏ.
- Có nút chuyển sang bài tiếp theo.

Thành phần UI chính:

- Back link về khóa học.
- `LessonContent`.
- Skill badge.
- Course title.
- Lesson duration.
- Lesson title.
- Lesson summary.
- Objectives.
- Lesson sections.
- CTA bài tiếp theo.

Routing flow:

```txt
User click lesson
-> /lessons/[lessonId]
-> await params
-> lessonId
```

Data flow:

```txt
LessonDetailPage
-> getLessonById(lessonId)
-> getCourseForLesson(lesson)
-> getNextLesson(lesson)
-> LessonContent
```

Component flow:

```txt
LessonDetailPage
-> LessonContent
-> PrimaryButton
```

Props flow:

```txt
LessonContent nhận:
course: CourseWithStats
lesson: Lesson
```

Next lesson flow:

```txt
Nếu có bài tiếp theo
-> button href="/lessons/[nextLesson.id]"

Nếu không có bài tiếp theo
-> button href="/courses/[course.id]"
```

Not found flow:

```txt
Nếu không tìm thấy lesson
-> notFound()

Nếu lesson có courseId nhưng không tìm thấy course
-> notFound()
```

Build flow:

```txt
generateStaticParams()
-> lessons.map()
-> sinh danh sách lessonId
-> Next.js prerender lesson detail pages
```

Kiến thức Phase 1:

- Dynamic route
- Relationship data
- `find()`
- Next item logic
- Conditional button
- Props flow
- Static generation

## 7. Global Loading Screen

Route:

```txt
Áp dụng khi route đang tải
```

File source:

```txt
frontend/src/app/loading.tsx
```

Mục đích:

- Hiển thị skeleton khi route chung đang loading.
- Tránh màn hình trắng trong lúc Next.js render route.

Thành phần UI chính:

- Hero skeleton.
- Course card skeleton.
- Layout giả giống page thật.

Render flow:

```txt
Route đang tải
-> Next.js render loading.tsx gần nhất
-> route sẵn sàng
-> thay skeleton bằng page thật
```

Kiến thức Phase 1:

- `loading.tsx`
- Skeleton UI
- Route-level loading
- UX state

## 8. Course Detail Loading

Route:

```txt
/courses/[courseId]
```

File source:

```txt
frontend/src/app/courses/[courseId]/loading.tsx
```

Mục đích:

- Loading riêng cho màn chi tiết khóa học.
- Giúp dynamic route có phản hồi nhanh hơn.

Thành phần UI chính:

- Back link skeleton.
- Course detail skeleton.
- Outcomes box skeleton.
- Lesson list skeleton.

Render flow:

```txt
User vào /courses/[courseId]
-> render loading skeleton
-> CourseDetailPage có data
-> render detail thật
```

Kiến thức Phase 1:

- Segment loading
- Dynamic route UX
- Skeleton theo layout thật

## 9. Lesson Detail Loading

Route:

```txt
/lessons/[lessonId]
```

File source:

```txt
frontend/src/app/lessons/[lessonId]/loading.tsx
```

Mục đích:

- Loading riêng cho màn chi tiết bài học.
- Giữ layout ổn định khi bài học đang được render.

Thành phần UI chính:

- Back link skeleton.
- Lesson content skeleton.
- Next lesson CTA skeleton.

Render flow:

```txt
User vào /lessons/[lessonId]
-> render LessonDetailLoading
-> LessonDetailPage có data
-> render LessonContent
```

Kiến thức Phase 1:

- Route segment loading
- Skeleton UI
- Dynamic lesson page

## 10. Not Found Page

Route:

```txt
Route không tồn tại hoặc data không tìm thấy
```

File source:

```txt
frontend/src/app/not-found.tsx
```

Mục đích:

- Hiển thị khi user vào route không tồn tại.
- Hiển thị khi course hoặc lesson không tồn tại trong fake data.

Thành phần UI chính:

- Label `Không tìm thấy`.
- Tiêu đề: `Trang hoặc bài học này chưa tồn tại`.
- Mô tả ngắn.
- Button `Xem khóa học`.

Flow:

```txt
Page không tìm thấy data
-> gọi notFound()
-> Next.js render not-found.tsx
```

Kiến thức Phase 1:

- `notFound()`
- `not-found.tsx`
- Fallback UI
- Error-safe routing

## 11. Error Page

Route:

```txt
Khi route render bị lỗi
```

File source:

```txt
frontend/src/app/error.tsx
```

Mục đích:

- Hiển thị khi route render gặp lỗi.
- Cho user thử lại hoặc quay về danh sách khóa học.

Thành phần UI chính:

- Label `Có lỗi xảy ra`.
- Tiêu đề: `Không thể tải nội dung học`.
- Error message.
- Button `Thử lại`.
- Button `Xem khóa học`.

Error flow:

```txt
Route render lỗi
-> Next.js render error.tsx
-> user click Thử lại
-> reset()
```

Component rule:

```txt
error.tsx phải là Client Component
vì cần nhận và gọi reset()
```

Kiến thức Phase 1:

- Error boundary
- Client Component
- `reset()`
- Fallback UI
- Recovery action

## Component Dùng Chung Trong Phase 1

| Component | File source | Vai trò |
|---|---|---|
| `AppHeader` | `frontend/src/components/app-header.tsx` | Header và navigation chính |
| `PrimaryButton` | `frontend/src/components/primary-button.tsx` | Button/link dùng lại |
| `CourseCard` | `frontend/src/components/course-card.tsx` | Card hiển thị thông tin khóa học |
| `LessonList` | `frontend/src/components/lesson-list.tsx` | Danh sách bài học |
| `LessonContent` | `frontend/src/components/lesson-content.tsx` | Nội dung chi tiết bài học |
| `AuthForm` | `frontend/src/components/auth-form.tsx` | Form login/register có state |
| `EmptyState` | `frontend/src/components/empty-state.tsx` | UI khi không có data |

## Data Và Type Liên Quan

| Nhóm | File source | Vai trò |
|---|---|---|
| Type | `frontend/src/types/learning.ts` | Định nghĩa `Course`, `Lesson`, `CourseWithStats` |
| Fake data | `frontend/src/data/learning-content.ts` | Dữ liệu mẫu cho courses và lessons |
| Selector | `frontend/src/lib/learning.ts` | Hàm đọc, tìm, lọc data |

Data flow tổng quát:

```txt
learning-content.ts
-> lib/learning.ts
-> page.tsx
-> component
-> UI
```

## Kết Luận Phase 1

Phase 1 gồm:

```txt
Màn học chính:
1. Home
2. Courses
3. Course Detail
4. Lesson Detail

Màn tài khoản:
5. Login
6. Register

Màn trạng thái:
7. Global Loading
8. Course Detail Loading
9. Lesson Detail Loading
10. Not Found
11. Error
```

Sau khi hoàn thành toàn bộ UI này, intern cần giải thích được:

- Route nào render page nào.
- Data lấy từ đâu.
- Component nào nhận props nào.
- Khi user click thì điều hướng đi đâu.
- Khi không có data thì UI xử lý thế nào.
- Component nào là Server Component.
- Component nào cần `"use client"` và vì sao.
