# Phase 04 - Ket noi frontend voi backend

## Muc tieu

Next.js frontend goi duoc API tu NestJS backend va hien thi du lieu that tu PostgreSQL.

## Kien thuc can hoc

- `fetch`
- Environment variables
- CORS
- Loading state
- Error state
- API response format
- Client-side fetching va server-side fetching trong Next.js

## Thuc hanh trong project

Them bien moi truong frontend:

```txt
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Thong nhat response backend:

```ts
{
  success: true,
  data: ...
}
```

Ket noi cac trang:

```txt
/courses -> GET /courses
/courses/[courseId] -> GET /courses/:id
/lessons/[lessonId] -> GET /lessons/:id
```

Tao helper API:

```txt
frontend/src/lib/api.ts
```

## Checklist hoan thanh

- [ ] Backend bat CORS cho frontend
- [ ] Frontend doc duoc `NEXT_PUBLIC_API_URL`
- [ ] Trang courses hien du lieu tu backend
- [ ] Trang course detail hien danh sach lesson
- [ ] Co loading state
- [ ] Co error state
- [ ] Khong con dung du lieu gia cho courses

## Ket qua dau ra

Nguoi dung co the xem khoa hoc va bai hoc tu database that thong qua frontend.
