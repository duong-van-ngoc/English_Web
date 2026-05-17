# Phase 10 - Testing va code quality

## Muc tieu

Lam code on dinh hon khi project lon dan, dac biet cac phan auth, nop bai va tinh diem.

## Kien thuc can hoc

- Unit test
- Integration test co ban
- E2E test API
- Mocking
- ESLint
- Prettier
- Error handling chuan
- Logging co ban

## Thuc hanh trong project

Backend test uu tien:

```txt
AuthService
CoursesService
AttemptsService
Submit attempt API
Score calculation
Role guard
```

Frontend test uu tien:

```txt
Login form
Course list render
Practice question interaction
Result page render
```

Chuan hoa error response:

```ts
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input"
  }
}
```

## Checklist hoan thanh

- [ ] Chay duoc lint frontend
- [ ] Chay duoc lint backend
- [ ] Format code thong nhat
- [ ] Test duoc auth service
- [ ] Test duoc tinh diem attempt
- [ ] Test duoc API nop bai
- [ ] Co error response thong nhat
- [ ] Co logging loi backend co ban

## Ket qua dau ra

Codebase co nen tang de phat trien tiep ma it bi vo cac tinh nang quan trong.
