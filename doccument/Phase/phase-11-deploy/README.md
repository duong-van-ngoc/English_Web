# Phase 11 - Deploy san pham

## Muc tieu

Dua web len internet de nguoi khac co the dang ky, hoc bai va luyen TOEIC.

## Kien thuc can hoc

- Environment variables production
- Build frontend
- Build backend
- Database production
- Prisma migration production
- CORS production
- Domain
- HTTPS
- Log va monitoring co ban

## Huong deploy goi y

```txt
Frontend: Vercel
Backend: Render / Railway / Fly.io
Database: Supabase Postgres / Neon
Storage: Supabase Storage / Cloudflare R2
```

Bien moi truong can co:

```txt
Frontend:
NEXT_PUBLIC_API_URL=

Backend:
DATABASE_URL=
JWT_SECRET=
CORS_ORIGIN=
```

Checklist truoc deploy:

```txt
Khong commit file .env
JWT_SECRET du manh
CORS chi mo domain frontend
Database production da migrate
Admin account duoc tao an toan
```

## Checklist hoan thanh

- [ ] Build frontend thanh cong
- [ ] Build backend thanh cong
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Tao database production
- [ ] Chay migration production
- [ ] Frontend goi duoc backend production
- [ ] Dang ky dang nhap tren production thanh cong
- [ ] Admin tao duoc course va lesson tren production

## Ket qua dau ra

San pham co ban chay online va co the cho nguoi dung dau tien dung thu.
