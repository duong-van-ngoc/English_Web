# Phase 03 - PostgreSQL va Prisma

## Muc tieu

Chuyen backend tu du lieu gia sang du lieu that trong PostgreSQL thong qua Prisma.

## Kien thuc can hoc

- Table, column, row
- Primary key va foreign key
- Quan he one-to-many
- Quan he many-to-many
- Prisma schema
- Prisma migration
- Prisma Client
- Seed data

## Thuc hanh trong project

Cai Prisma trong backend va tao cac model dau tien:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Course {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  level       String
  lessons     Lesson[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Lesson {
  id        String   @id @default(cuid())
  courseId  String
  title     String
  content   String
  order     Int
  course    Course   @relation(fields: [courseId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  USER
  ADMIN
}
```

Sau do mo rong them:

```txt
Vocabulary
Question
Answer
Progress
Attempt
AttemptAnswer
```

## Checklist hoan thanh

- [ ] Tao duoc PostgreSQL database
- [ ] Ket noi Prisma voi PostgreSQL
- [ ] Chay duoc migration
- [ ] Tao duoc PrismaService trong NestJS
- [ ] Courses API doc du lieu tu database
- [ ] Viet duoc seed data mau
- [ ] Hieu relation giua Course va Lesson

## Ket qua dau ra

Backend dung database that. Cac API khoa hoc va bai hoc doc ghi du lieu qua Prisma.
