
# Phase 01 — Next.js Foundation (Intern Roadmap)
## Dự án: Web học tiếng Anh

---

# 1. Mục tiêu của Phase 01

Sau phase này bạn phải:

- Hiểu cấu trúc dự án Next.js App Router
- Tự tạo được page mới
- Hiểu component và props
- Hiểu dữ liệu frontend đang đi như thế nào
- Hiểu khi nào dùng `"use client"`
- Làm được giao diện web học tiếng Anh cơ bản
- Tự giải thích được luồng code
- Bắt đầu code theo mindset đi làm thật

---

# 2. Công nghệ sử dụng

## Framework

- Next.js
- React
- TypeScript

## UI

- Tailwind CSS

## IDE

- Visual Studio Code

---

# 3. Kiến thức bắt buộc phải hiểu

## 3.1 Next.js App Router

### App Router là gì?

App Router là hệ thống định tuyến mới của Next.js.

Ví dụ:

```txt
app/
 ├── page.tsx
 ├── login/
 │    └── page.tsx
```

Kết quả:

```txt
/           -> app/page.tsx
/login      -> app/login/page.tsx
```

### page.tsx là gì?

Là file tạo route.

Ví dụ:

```tsx
export default function HomePage() {
  return <h1>Home Page</h1>;
}
```

### layout.tsx là gì?

Là layout dùng chung.

Ví dụ:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <header>Header</header>

        {children}
      </body>
    </html>
  );
}
```

Giải thích:

- Header sẽ xuất hiện ở mọi trang
- children là nội dung page hiện tại

---

# 4. React Component và Props

## Component là gì?

Component là khối UI có thể tái sử dụng.

Ví dụ:

```tsx
function Welcome() {
  return <h1>Hello</h1>;
}
```

---

## Props là gì?

Props là dữ liệu truyền vào component.

Ví dụ cơ bản:

```tsx
function CourseCard(props: { title: string }) {
  return <h1>{props.title}</h1>;
}
```

Sử dụng:

```tsx
<CourseCard title="English Starter" />
```

---

## Ví dụ nâng cao

```tsx
interface CourseCardProps {
  title: string;
  level: string;
  lessonCount: number;
}

function CourseCard({
  title,
  level,
  lessonCount,
}: CourseCardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{level}</p>
      <p>{lessonCount} lessons</p>
    </div>
  );
}
```

---

# 5. Server Component và Client Component

## Server Component

Mặc định trong App Router.

Không dùng:

- useState
- useEffect
- onClick

Ví dụ:

```tsx
export default function CoursesPage() {
  return <h1>Courses</h1>;
}
```

---

## Client Component

Dùng khi có tương tác.

Ví dụ:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

---

# 6. Routing cơ bản

## Route tĩnh

```txt
/login
/register
/courses
```

---

## Dynamic Route

```txt
/courses/[courseId]
```

Ví dụ:

```txt
/courses/starter
/courses/ielts
```

Code:

```tsx
export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  return <h1>{params.courseId}</h1>;
}
```

---

# 7. Dữ liệu giả (Fake Data)

## File data/courses.ts

```ts
export const courses = [
  {
    id: "starter",
    title: "English Starter",
    level: "Mất gốc",
  },
];
```

---

## Giải thích

Đây chưa phải backend.

Hiện tại:

```txt
Frontend -> lấy data trực tiếp từ file ts
```

Sau này:

```txt
Frontend -> gọi API -> backend -> database
```

---

# 8. Render danh sách bằng map()

## Ví dụ cơ bản

```tsx
const numbers = [1, 2, 3];

numbers.map((item) => {
  console.log(item);
});
```

---

## Ví dụ thực tế

```tsx
{
  courses.map((course) => (
    <CourseCard
      key={course.id}
      title={course.title}
      level={course.level}
    />
  ));
}
```

---

# 9. Tìm dữ liệu bằng find()

## Ví dụ

```tsx
const course = courses.find(
  (item) => item.id === courseId
);
```

---

## Giải thích

Code này sẽ:

```txt
Duyệt từng course
→ kiểm tra id
→ nếu trùng thì trả về
```

---

# 10. Tailwind CSS cơ bản

## Flex

```tsx
<div className="flex gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## Grid

```tsx
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

---

## Padding

```tsx
<div className="p-4">
  Content
</div>
```

---

## Hover

```tsx
<button className="hover:bg-blue-500">
  Click
</button>
```

---

# 11. Form UI cơ bản

## Ví dụ Login Form

```tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  );
}
```

---

# 12. Loading State

## Ví dụ

```tsx
if (loading) {
  return <p>Loading...</p>;
}
```

---

# 13. Empty State

## Ví dụ

```tsx
if (!courses.length) {
  return <p>Không có khóa học</p>;
}
```

---

# 14. Cấu trúc thư mục chuẩn

```txt
src/
├── app/
├── components/
├── data/
├── types/
├── lib/
└── styles/
```

---

# 15. Luồng hoạt động của web

## Luồng Courses Page

```txt
courses.ts
→ CoursesPage
→ map()
→ CourseCard
→ render UI
```

---

## Luồng Course Detail

```txt
User click course
→ /courses/starter
→ lấy params
→ find()
→ render detail
```

---

## Luồng Lesson Detail

```txt
User click lesson
→ /lessons/lesson-1
→ lấy lessonId
→ tìm lesson
→ render content
```

---

# 16. Các component cần tạo

```txt
components/
├── AppHeader.tsx
├── CourseCard.tsx
├── LessonList.tsx
├── LessonContent.tsx
└── PrimaryButton.tsx
```

---

# 17. Ví dụ component hoàn chỉnh

## PrimaryButton.tsx

```tsx
interface PrimaryButtonProps {
  text: string;
}

export default function PrimaryButton({
  text,
}: PrimaryButtonProps) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
      {text}
    </button>
  );
}
```

---

# 18. Checklist hoàn thành

## Next.js

- [ ] Hiểu App Router
- [ ] Hiểu page.tsx
- [ ] Hiểu layout.tsx
- [ ] Hiểu dynamic route

---

## React

- [ ] Hiểu component
- [ ] Hiểu props
- [ ] Hiểu state

---

## TypeScript

- [ ] Biết interface
- [ ] Biết type props

---

## Tailwind

- [ ] Flex
- [ ] Grid
- [ ] Responsive

---

# 19. Quy tắc học cho intern

Sau mỗi file phải trả lời:

```txt
1. File này dùng để làm gì?
2. Data lấy từ đâu?
3. Props truyền qua đâu?
4. User click thì chuyện gì xảy ra?
5. Nếu data rỗng thì sao?
```

---

# 20. Bài tập cuối Phase 01

## Yêu cầu

Làm web học tiếng Anh gồm:

- Home Page
- Login
- Register
- Courses
- Course Detail
- Lesson Detail

---

# 21. Kết quả sau Phase 01

Sau phase này bạn sẽ:

- Hiểu App Router
- Hiểu component
- Hiểu props
- Hiểu data flow
- Hiểu dynamic route
- Biết tổ chức project
- Có mindset frontend thực tế
