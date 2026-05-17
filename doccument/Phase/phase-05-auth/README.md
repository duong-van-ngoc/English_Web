# Phase 05 - Auth dang ky, dang nhap, phan quyen

## Muc tieu

Xay dung he thong tai khoan: dang ky, dang nhap, xem thong tin nguoi dung hien tai va phan quyen admin.

## Kien thuc can hoc

- Password hashing voi `bcrypt`
- JWT access token
- Guard trong NestJS
- Custom decorator `@CurrentUser`
- Role-based access control
- Cookie vs Authorization header
- Bao ve route trong Next.js

## Thuc hanh trong project

Backend API:

```txt
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout
```

Backend modules:

```txt
src/
├── auth/
├── users/
└── common/
    ├── guards/
    └── decorators/
```

Frontend pages:

```txt
/login
/register
/me
```

Quy tac phan quyen:

```txt
USER  -> hoc bai, lam bai, xem tien do
ADMIN -> quan ly khoa hoc, bai hoc, cau hoi
```

## Checklist hoan thanh

- [ ] Dang ky user moi
- [ ] Hash password truoc khi luu database
- [ ] Dang nhap tra ve JWT
- [ ] `GET /auth/me` lay duoc user tu token
- [ ] Bao ve API can dang nhap
- [ ] Bao ve API chi admin
- [ ] Frontend luu va gui token dung cach
- [ ] UI logout hoat dong

## Ket qua dau ra

Web co tai khoan nguoi hoc va nen tang phan quyen de lam admin dashboard.
