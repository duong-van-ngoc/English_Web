
# TypeScript Foundation For Intern (Bắt buộc học trong Phase 01)

## Vì sao phải học TypeScript?

Dự án thực tế hiện nay đa số dùng:

- TypeScript + React
- TypeScript + Next.js

Nếu không hiểu TypeScript thì:

- Khó đọc code team
- Dễ bug
- Không hiểu props
- Không hiểu API response
- Không hiểu data type

---

# 1. TypeScript là gì?

TypeScript là JavaScript có thêm kiểu dữ liệu (type).

Ví dụ JavaScript:

```js
let name = "Ngoc";
```

TypeScript:

```ts
let name: string = "Ngoc";
```

---

# 2. Các kiểu dữ liệu cơ bản

## string

```ts
let username: string = "Ngoc";
```

---

## number

```ts
let age: number = 20;
```

---

## boolean

```ts
let isLogin: boolean = true;
```

---

## array

```ts
let lessons: string[] = ["Lesson 1", "Lesson 2"];
```

---

## object

```ts
let course: {
  title: string;
  level: string;
} = {
  title: "English Starter",
  level: "Beginner",
};
```

---

# 3. Function Type

## Ví dụ cơ bản

```ts
function sum(a: number, b: number): number {
  return a + b;
}
```

---

## Giải thích

```txt
a: number
=> a phải là số

b: number
=> b phải là số

: number
=> function trả về number
```

---

# 4. Interface là gì?

Interface dùng để định nghĩa cấu trúc object.

---

## Ví dụ

```ts
interface Course {
  id: string;
  title: string;
  level: string;
}
```

---

## Sử dụng

```ts
const course: Course = {
  id: "starter",
  title: "English Starter",
  level: "Beginner",
};
```

---

# 5. Type Props trong React

## Sai cách

```tsx
function CourseCard(props: any) {
  return <div>{props.title}</div>;
}
```

---

## Đúng cách

```tsx
interface CourseCardProps {
  title: string;
  level: string;
}

function CourseCard({
  title,
  level,
}: CourseCardProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{level}</p>
    </div>
  );
}
```

---

# 6. Array Object Type

## Ví dụ thực tế

```ts
interface Lesson {
  id: string;
  title: string;
}

const lessons: Lesson[] = [
  {
    id: "1",
    title: "Greeting",
  },
];
```

---

# 7. Optional Type

## Dấu ?

```ts
interface User {
  name: string;
  avatar?: string;
}
```

---

## Giải thích

```txt
avatar có thể có hoặc không
```

---

# 8. Union Type

## Ví dụ

```ts
let status: "loading" | "success" | "error";
```

---

## Giải thích

status chỉ được phép là:

- loading
- success
- error

---

# 9. Type cho useState

## Sai

```tsx
const [course, setCourse] = useState(null);
```

---

## Đúng

```tsx
interface Course {
  title: string;
}

const [course, setCourse] =
  useState<Course | null>(null);
```

---

# 10. Type cho API Response

## Ví dụ

```ts
interface CourseResponse {
  data: Course[];
  total: number;
}
```

---

# 11. Type cho params trong Next.js

## Dynamic Route

```tsx
export default function CourseDetailPage({
  params,
}: {
  params: {
    courseId: string;
  };
}) {
  return <div>{params.courseId}</div>;
}
```

---

# 12. Type cho map()

## Ví dụ

```tsx
courses.map((course: Course) => {
  return <div>{course.title}</div>;
});
```

---

# 13. any là gì?

## Ví dụ

```ts
const data: any = {};
```

---

## Tại sao không nên lạm dụng any?

Vì:

```txt
TypeScript sẽ mất tác dụng kiểm tra lỗi
```

Intern mới học thường spam any.

Đây là thói quen xấu.

---

# 14. unknown vs any

## any

```ts
const data: any = "hello";
```

TypeScript cho làm mọi thứ.

---

## unknown

```ts
const data: unknown = "hello";
```

Phải kiểm tra type trước khi dùng.

An toàn hơn.

---

# 15. Type Alias

## Ví dụ

```ts
type ButtonVariant =
  | "primary"
  | "secondary";
```

---

# 16. Readonly

## Ví dụ

```ts
interface Course {
  readonly id: string;
}
```

---

# 17. Record Type

## Ví dụ

```ts
const levels: Record<string, string> = {
  starter: "Beginner",
};
```

---

# 18. Generic cơ bản

## Ví dụ

```ts
function getData<T>(data: T): T {
  return data;
}
```

---

# 19. Những thứ intern phải hiểu thật chắc

## Cực kỳ quan trọng

- interface
- props type
- array object type
- function type
- optional type
- useState type
- API response type

---

# 20. Ví dụ thực tế hoàn chỉnh

## types/course.ts

```ts
export interface Lesson {
  id: string;
  title: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  level: string;
  lessons: Lesson[];
}
```

---

## data/courses.ts

```ts
import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "starter",
    title: "English Starter",
    level: "Beginner",
    lessons: [
      {
        id: "lesson-1",
        title: "Greeting",
        duration: "10 phút",
      },
    ],
  },
];
```

---

# 21. Checklist TypeScript cho intern

- [ ] Hiểu string
- [ ] Hiểu number
- [ ] Hiểu boolean
- [ ] Hiểu array type
- [ ] Hiểu object type
- [ ] Hiểu interface
- [ ] Type được props
- [ ] Type được useState
- [ ] Type được API response
- [ ] Biết tránh lạm dụng any

---

# 22. Mindset học TypeScript

Đừng học kiểu:

```txt
Copy type trên mạng
```

Hãy luôn hỏi:

```txt
Data này có cấu trúc gì?
Component này nhận dữ liệu gì?
API này trả về gì?
```

---

# 23. Bài tập thực hành

## Bài 1

Type lại toàn bộ fake data.

---

## Bài 2

Type props cho mọi component.

---

## Bài 3

Type toàn bộ useState.

---

## Bài 4

Tạo folder:

```txt
types/
```

và tách type riêng.

---

# 24. Kết quả sau khi học xong

Sau phần này bạn sẽ:

- Đọc được code TypeScript
- Không sợ interface
- Hiểu props type
- Hiểu data structure
- Viết component chuẩn hơn
- Dễ đọc code team hơn
