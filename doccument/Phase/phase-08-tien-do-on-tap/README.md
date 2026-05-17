# Phase 08 - Tien do hoc va on tap

## Muc tieu

Bien web thanh san pham hoc tap that su bang cach luu tien do, thong ke diem manh diem yeu va goi y on tap.

## Kien thuc can hoc

- Progress tracking
- Learning dashboard
- Statistics co ban
- Review queue
- Spaced repetition co ban
- Query tong hop du lieu

## Thuc hanh trong project

Database them:

```txt
UserProgress
LessonCompletion
ReviewItem
VocabularyReview
QuestionReview
```

Backend API:

```txt
GET /dashboard
POST /lessons/:id/complete
GET /review
POST /review/:id/mark
GET /stats
```

Frontend pages:

```txt
/dashboard
/review
/stats
```

Thong tin nen hien:

```txt
So bai da hoc
So cau da lam
Ty le dung
Part TOEIC sai nhieu nhat
Tu vung can on
Cau hoi can lam lai
```

## Checklist hoan thanh

- [ ] Danh dau bai hoc da hoan thanh
- [ ] Luu tien do theo user
- [ ] Hien dashboard hoc tap
- [ ] Hien cau hoi sai can on
- [ ] Hien tu vung can on
- [ ] Co thong ke ty le dung theo part
- [ ] Co goi y viec can hoc tiep theo

## Ket qua dau ra

Nguoi hoc biet hom nay nen hoc gi, minh dang tien bo ra sao va can on lai noi dung nao.
