# Phase 06 - Admin quan ly noi dung hoc

## Muc tieu

Tao khu vuc admin de quan ly khoa hoc, bai hoc, tu vung va cau hoi TOEIC. Day la phan quan trong vi chat luong san pham phu thuoc vao cach quan ly noi dung.

## Kien thuc can hoc

- CRUD day du
- Form validation
- Protected admin routes
- Table UI
- Modal hoac page form
- Pagination co ban
- Search va filter co ban

## Thuc hanh trong project

Frontend admin pages:

```txt
/admin
/admin/courses
/admin/lessons
/admin/vocabulary
/admin/questions
```

Backend modules:

```txt
src/
├── courses/
├── lessons/
├── vocabulary/
└── questions/
```

Chuc nang can co:

```txt
Course: tao, sua, xoa, xem danh sach
Lesson: tao, sua, xoa, gan vao course
Vocabulary: tao, sua, xoa, gan vao lesson
Question: tao, sua, xoa, gan part TOEIC
Answer: tao dap an va danh dau dap an dung
```

## Checklist hoan thanh

- [ ] Chi ADMIN vao duoc `/admin`
- [ ] CRUD duoc Course
- [ ] CRUD duoc Lesson
- [ ] CRUD duoc Vocabulary
- [ ] CRUD duoc Question va Answer
- [ ] Form co validate
- [ ] API co validate DTO
- [ ] Co thong bao thanh cong va that bai

## Ket qua dau ra

Ban co the tu nhap va quan ly noi dung hoc ma khong can sua code.
