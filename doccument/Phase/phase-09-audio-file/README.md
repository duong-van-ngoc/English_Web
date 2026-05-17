# Phase 09 - Audio va file cho Listening

## Muc tieu

Ho tro audio cho cac bai Listening TOEIC va tao flow upload file trong admin.

## Kien thuc can hoc

- Upload file
- File storage
- Public URL va signed URL
- Metadata file
- Audio player trong HTML
- Validate file type va file size
- Luu file local trong dev, storage cloud trong production

## Thuc hanh trong project

Backend API:

```txt
POST /files/upload
GET /files/:id
DELETE /files/:id
```

Database them:

```txt
FileAsset
```

Lien ket file voi:

```txt
Question.audioFileId
Question.imageFileId
Lesson.audioFileId
```

Frontend admin:

```txt
/admin/files
/admin/questions/:id/audio
```

Nguoi hoc:

```txt
Audio player trong cau hoi Listening
Transcript neu admin co nhap
Nut nghe lai
```

## Checklist hoan thanh

- [ ] Admin upload duoc audio
- [ ] Luu metadata file vao database
- [ ] Gan audio vao cau hoi
- [ ] Frontend phat duoc audio
- [ ] Validate chi cho phep file audio hop le
- [ ] Co gioi han dung luong file
- [ ] Xoa file khong con dung

## Ket qua dau ra

Web co the luyen Listening TOEIC voi audio that.
