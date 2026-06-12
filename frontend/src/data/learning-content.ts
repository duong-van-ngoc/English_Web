import type { Course, Lesson } from "@/types/learning";

export const courses = [
  {
    id: "starter-foundation",
    title: "English Starter",
    subtitle: "Lộ trình cho người mất gốc",
    description:
      "Bắt đầu từ phát âm, từ vựng đời sống và câu đơn để người mới có nền trước khi luyện TOEIC.",
    level: "Mat goc",
    targetScore: "TOEIC 250-350",
    duration: "4 tuần",
    accentColor: "primary",
    outcomes: [
      "Đọc được câu tiếng Anh đơn giản",
      "Nghe hiểu câu ngắn tốc độ chậm",
      "Nắm nhóm từ vựng học tập và công việc cơ bản",
    ],
  },
  {
    id: "toeic-vocabulary-core",
    title: "TOEIC Vocabulary Core",
    subtitle: "Từ vựng công việc cơ bản",
    description:
      "Xây vốn từ thường gặp trong văn phòng, email, lịch hẹn, mua sắm và dịch vụ khách hàng.",
    level: "Foundation",
    targetScore: "TOEIC 350-500",
    duration: "5 tuần",
    accentColor: "secondary",
    outcomes: [
      "Nhận diện từ khóa trong câu hỏi TOEIC",
      "Hiểu nghĩa từ theo ngữ cảnh",
      "Ôn từ vựng theo cụm thay vì học rời rạc",
    ],
  },
  {
    id: "toeic-reading-basic",
    title: "TOEIC Reading Basic",
    subtitle: "Ngữ pháp và đọc hiểu nền tảng",
    description:
      "Tập trung vào Part 5, Part 6 và đoạn đọc ngắn để hình thành kỹ năng đọc có chiến lược.",
    level: "TOEIC Starter",
    targetScore: "TOEIC 450-600",
    duration: "6 tuần",
    accentColor: "accent",
    outcomes: [
      "Phân tích loại từ trong câu",
      "Đọc nhanh để tìm thông tin chính",
      "Làm quen câu hỏi TOEIC Reading cơ bản",
    ],
  },
] satisfies Course[];

export const lessons = [
  {
    id: "alphabet-sound-map",
    courseId: "starter-foundation",
    title: "Bảng âm và cách đọc từ cơ bản",
    summary:
      "Làm quen âm tiếng Anh, cách nhìn mặt chữ và phát âm các từ ngắn thường gặp.",
    skill: "Pronunciation",
    order: 1,
    durationMinutes: 18,
    objectives: [
      "Hiểu vì sao tiếng Anh không đọc giống tiếng Việt",
      "Nhận diện nguyên âm và phụ âm cơ bản",
      "Đọc được nhóm từ ngắn trong bài học đầu tiên",
    ],
    sections: [
      {
        title: "Tư duy học phát âm",
        body: "Người mới không cần phát âm hoàn hảo ngay. Mục tiêu đầu tiên là nghe và lặp lại âm đủ rõ để nhận diện từ.",
      },
      {
        title: "Bài tập nhỏ",
        body: "Đọc chậm các từ: job, shop, phone, name, email. Sau đó tự đánh dấu từ nào dễ nhầm âm.",
      },
    ],
  },
  {
    id: "first-workplace-words",
    courseId: "starter-foundation",
    title: "20 từ vựng công việc đầu tiên",
    summary:
      "Học các từ xuất hiện nhiều trong ngữ cảnh văn phòng và câu hỏi TOEIC dễ.",
    skill: "Vocabulary",
    order: 2,
    durationMinutes: 22,
    objectives: [
      "Biết nghĩa nhóm từ văn phòng cơ bản",
      "Ghép từ với hình ảnh hoặc tình huống",
      "Tạo câu đơn với từ mới",
    ],
    sections: [
      {
        title: "Học từ theo tình huống",
        body: "Không học từng từ rời rạc. Hãy gắn từ với nơi xuất hiện: meeting room, office, reception, schedule.",
      },
      {
        title: "Bài tập nhỏ",
        body: "Viết 5 câu đơn dùng các từ: meeting, report, manager, office, customer.",
      },
    ],
  },
  {
    id: "simple-present-for-starter",
    courseId: "starter-foundation",
    title: "Thì hiện tại đơn cho người mới",
    summary:
      "Nắm cấu trúc câu khẳng định, phủ định và câu hỏi thường dùng trong TOEIC nền tảng.",
    skill: "Grammar",
    order: 3,
    durationMinutes: 24,
    objectives: [
      "Biết cấu trúc S + V",
      "Biết khi nào thêm s/es",
      "Đọc được câu mô tả lịch trình đơn giản",
    ],
    sections: [
      {
        title: "Cấu trúc chính",
        body: "Hiện tại đơn dùng để nói về thói quen, sự thật và lịch trình. Ví dụ: The train leaves at 8 a.m.",
      },
      {
        title: "Bài tập nhỏ",
        body: "Chuyển câu 'She work in an office' thành câu đúng và giải thích vì sao.",
      },
    ],
  },
  {
    id: "email-vocabulary",
    courseId: "toeic-vocabulary-core",
    title: "Từ vựng email và thông báo",
    summary:
      "Học nhóm từ thường gặp trong email, memo, announcement và tin nhắn công việc.",
    skill: "Vocabulary",
    order: 1,
    durationMinutes: 26,
    objectives: [
      "Nhận diện mục đích của email",
      "Hiểu các từ liên quan đến lịch hẹn",
      "Phân biệt request, confirm, attach, update",
    ],
    sections: [
      {
        title: "Nhóm từ theo chức năng",
        body: "Từ trong email thường gắn với hành động: request information, confirm a meeting, attach a file, update a schedule.",
      },
      {
        title: "Bài tập nhỏ",
        body: "Đọc một email ngắn và gạch chân động từ thể hiện yêu cầu của người gửi.",
      },
    ],
  },
  {
    id: "part-five-word-forms",
    courseId: "toeic-reading-basic",
    title: "Part 5: Nhận diện loại từ",
    summary:
      "Học cách nhìn vị trí trong câu để chọn danh từ, động từ, tính từ hoặc trạng từ.",
    skill: "Reading",
    order: 1,
    durationMinutes: 30,
    objectives: [
      "Nhận biết vị trí danh từ",
      "Nhận biết tính từ đứng trước danh từ",
      "Loại đáp án sai nhanh hơn",
    ],
    sections: [
      {
        title: "Chiến lược làm bài",
        body: "Trước khi dịch nghĩa toàn câu, hãy nhìn cấu trúc quanh chỗ trống để đoán loại từ cần điền.",
      },
      {
        title: "Bài tập nhỏ",
        body: "Trong cụm 'a ____ report', vị trí trống thường cần tính từ vì nó bổ nghĩa cho danh từ report.",
      },
    ],
  },
] satisfies Lesson[];
