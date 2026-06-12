# English Learning Backend

NestJS backend for Phase 03 of the English Learning project.

## Scope

Phase 03 completes the PostgreSQL + Prisma foundation:

- Prisma schema for `User`, `Course`, `Lesson`, `Vocabulary`, `Question`, `Answer`, `Progress`, `Attempt`, and `AttemptAnswer`
- PostgreSQL migrations
- Seed data for courses, lessons, vocabulary, questions, progress, and attempts
- CRUD APIs backed by Prisma Client

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```powershell
Copy-Item .env.example .env
```

3. Update `DATABASE_URL` in `.env` to match your PostgreSQL instance.

4. Generate Prisma Client:

```bash
npm run prisma:generate
```

5. Run migrations:

```bash
npm run prisma:migrate
```

6. Seed sample data:

```bash
npm run prisma:seed
```

## Run

```bash
npm run start:dev
```

API base URL:

```txt
http://localhost:8000/api
```

Production startup:

```bash
npm run build
npm run start:prod
```

## Main Endpoints

- `GET /api/health`
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses`
- `PATCH /api/courses/:id`
- `DELETE /api/courses/:id`
- `GET /api/courses/:courseId/lessons`
- `GET /api/lessons/:id`
- `POST /api/courses/:courseId/lessons`
- `PATCH /api/lessons/:id`
- `DELETE /api/lessons/:id`
- `GET /api/lessons/:lessonId/vocabulary`
- `POST /api/lessons/:lessonId/vocabulary`
- `PATCH /api/vocabulary/:id`
- `DELETE /api/vocabulary/:id`
- `GET /api/lessons/:lessonId/questions`
- `GET /api/questions/:id`
- `POST /api/lessons/:lessonId/questions`
- `PATCH /api/questions/:id`
- `DELETE /api/questions/:id`
- `GET /api/users/:userId/progress`
- `POST /api/users/:userId/progress`
- `PATCH /api/progress/:id`
- `DELETE /api/progress/:id`
- `GET /api/users/:userId/attempts`
- `GET /api/attempts/:id`
- `POST /api/users/:userId/attempts`
- `DELETE /api/attempts/:id`

## Verification

```bash
npm run lint
npm test
npm run test:e2e
npx prisma validate
```
