# Phase 1 QA Checklist - English Learning Explorer

Checklist này dùng để đóng Phase 1 sau khi đã build UI. Mục tiêu là kiểm tra bằng mắt, bằng route thật và bằng khả năng tự giải thích flow.

## 1. Route Checklist

Chạy frontend:

```powershell
cd D:\Projects\EngLish-Web\frontend
cmd /c npm run dev
```

Mở các route sau:

| Trạng thái | Route | Kỳ vọng |
|---|---|---|
| [ ] | `/` | Home hiển thị hero, kế hoạch hôm nay và khóa học nổi bật |
| [ ] | `/courses` | Hiển thị danh sách 3 khóa học |
| [ ] | `/courses/starter-foundation` | Hiển thị chi tiết English Starter và danh sách bài học |
| [ ] | `/courses/toeic-vocabulary-core` | Hiển thị chi tiết TOEIC Vocabulary Core |
| [ ] | `/courses/toeic-reading-basic` | Hiển thị chi tiết TOEIC Reading Basic |
| [ ] | `/lessons/alphabet-sound-map` | Hiển thị nội dung lesson và nút bài tiếp theo |
| [ ] | `/lessons/first-workplace-words` | Hiển thị nội dung lesson đúng course |
| [ ] | `/login` | Hiển thị form đăng nhập |
| [ ] | `/register` | Hiển thị form đăng ký có field Họ tên |
| [ ] | `/abc-sai-route` | Hiển thị Not Found Page |

## 2. Responsive Checklist

Kiểm tra bằng DevTools hoặc resize browser.

| Trạng thái | Viewport | Kỳ vọng |
|---|---|---|
| [ ] | Mobile 375px | Header không vỡ, có nav mobile Trang chủ/Khóa học |
| [ ] | Mobile 375px | Course card xuống 1 cột |
| [ ] | Mobile 375px | Login/Register form không tràn ngang |
| [ ] | Tablet 768px | Courses grid hiển thị 2 cột khi đủ rộng |
| [ ] | Desktop 1280px | Layout có max-width, không kéo quá rộng |

## 3. Interaction Checklist

| Trạng thái | Hành động | Kỳ vọng |
|---|---|---|
| [ ] | Click `Xem khóa học` ở Home | Đi tới `/courses` |
| [ ] | Click `Học thử` ở Home | Đi tới `/login` |
| [ ] | Click một `CourseCard` | Đi tới đúng Course Detail |
| [ ] | Click `Bắt đầu bài đầu tiên` | Đi tới lesson đầu tiên của course |
| [ ] | Click `Bài tiếp theo` | Đi tới lesson kế tiếp nếu có |
| [ ] | Submit Login với email/password hợp lệ | Hiển thị feedback mẫu |
| [ ] | Submit Register với name/email/password hợp lệ | Hiển thị feedback mẫu |

## 4. Code Understanding Checklist

Sau Phase 1, bạn cần tự trả lời được:

| Trạng thái | Câu hỏi |
|---|---|
| [ ] | `layout.tsx` dùng để làm gì? |
| [ ] | Route `/courses/[courseId]` lấy `courseId` ở đâu? |
| [ ] | Data khóa học nằm ở file nào? |
| [ ] | Vì sao page không đọc trực tiếp mảng data mà gọi hàm trong `lib/learning.ts`? |
| [ ] | `CourseCard` nhận props gì? |
| [ ] | `LessonList` render list bằng cách nào? |
| [ ] | Component nào có `"use client"` và vì sao? |
| [ ] | Khi user vào course không tồn tại thì flow đi đâu? |
| [ ] | Theme màu được khai báo ở đâu? |

## 5. Command Checklist

Trước khi đóng Phase 1:

```powershell
cd D:\Projects\EngLish-Web\frontend
cmd /c npm run lint
cmd /c npm run build
```

Kỳ vọng:

```txt
lint  -> pass
build -> pass
```
