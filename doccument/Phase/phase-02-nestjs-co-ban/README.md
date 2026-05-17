# Phase 02 - NestJS co ban

## Muc tieu

Hieu cach NestJS xu ly request va tao duoc API dau tien cho web TOEIC.

## Kien thuc can hoc

- Module
- Controller
- Service
- DTO
- Validation Pipe
- REST API
- HTTP method: `GET`, `POST`, `PATCH`, `DELETE`
- HTTP status code
- Exception handling co ban

## Thuc hanh trong project

Tao module `courses`:

```txt
src/
├── courses/
│   ├── courses.module.ts
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── dto/
│       ├── create-course.dto.ts
│       └── update-course.dto.ts
└── app.module.ts
```

API can co:

```txt
GET /health
GET /courses
GET /courses/:id
POST /courses
PATCH /courses/:id
DELETE /courses/:id
```

O phase nay co the dung mang du lieu tam trong service, chua can database.

## Checklist hoan thanh

- [ ] Hieu Controller nhan request
- [ ] Hieu Service xu ly logic
- [ ] Tao duoc module bang Nest CLI
- [ ] Tao duoc DTO
- [ ] Validate duoc body request
- [ ] Tra ve response dung status code
- [ ] Test API bang Postman, Insomnia hoac Thunder Client

## Ket qua dau ra

Backend co API khoa hoc co ban va ban hieu flow request trong NestJS.
