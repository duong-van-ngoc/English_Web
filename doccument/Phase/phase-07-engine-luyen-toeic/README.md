# Phase 07 - Engine luyen TOEIC

## Muc tieu

Xay dung chuc nang luyen cau hoi TOEIC, nop bai, cham diem, hien dap an va luu lich su lam bai.

## Kien thuc can hoc

- Question type
- Attempt va attempt answer
- Score calculation
- Transaction co ban
- Luu lich su lam bai
- Xu ly cau dung, cau sai
- Giai thich dap an

## Thuc hanh trong project

TOEIC parts can ho tro:

```txt
Part 1 - Photographs
Part 2 - Question Response
Part 3 - Conversations
Part 4 - Talks
Part 5 - Incomplete Sentences
Part 6 - Text Completion
Part 7 - Reading Comprehension
```

Backend API:

```txt
GET /practice/parts
GET /practice/questions?part=5
POST /attempts
POST /attempts/:id/submit
GET /attempts/:id/result
```

Database them:

```txt
QuestionSet
Question
Answer
Attempt
AttemptAnswer
UserWrongQuestion
```

Frontend pages:

```txt
/practice
/practice/part/[part]
/attempts/[attemptId]/result
```

## Checklist hoan thanh

- [ ] Chon duoc part de luyen
- [ ] Hien cau hoi va cac dap an
- [ ] User chon dap an
- [ ] Nop bai va cham diem
- [ ] Hien cau dung, cau sai
- [ ] Hien giai thich dap an
- [ ] Luu lich su lam bai
- [ ] Luu cau sai de on lai

## Ket qua dau ra

Nguoi hoc co the luyen TOEIC that su, biet minh sai o dau va xem ket qua sau moi lan lam bai.
