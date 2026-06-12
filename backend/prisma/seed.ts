import {
  ContentStatus,
  PrismaClient,
  QuestionType,
  UserRole,
  ModuleType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createPrismaAdapter } from '../src/prisma/prisma-adapter';


const prisma = new PrismaClient({
  adapter: createPrismaAdapter(),
});

type CourseSeed = {
  title: string;
  slug: string;
  level: string;
  description: string;
  lessons: LessonSeed[];
};

type LessonSeed = {
  title: string;
  content: string;
  order: number;
  vocabulary: VocabularySeed[];
  questions: QuestionSeed[];
};

type VocabularySeed = {
  word: string;
  meaning: string;
  phonetic?: string;
  example?: string;
};

type QuestionSeed = {
  title: string;
  type: QuestionType;
  explanation?: string;
  answers: AnswerSeed[];
};

type AnswerSeed = {
  content: string;
  isCorrect: boolean;
};

type ToeicQuestionSeed = {
  content: string;
  explanation: string;
  choices: Array<{
    label: string;
    content: string;
    isCorrect: boolean;
  }>;
};

type ToeicQuestionGroupSeed = {
  title: string;
  passageContent?: string;
  questions: ToeicQuestionSeed[];
};

const toeicSeedSetTitles = [
  'Part 5 - Practice Set 01',
  'Part 7 - Reading Set 01',
];

const toeicPart5Questions: ToeicQuestionSeed[] = [
  {
    content: 'The manager _____ the quarterly report before the meeting.',
    explanation:
      'The sentence describes a completed past action, so the past tense "reviewed" is correct.',
    choices: [
      { label: 'A', content: 'review', isCorrect: false },
      { label: 'B', content: 'reviewed', isCorrect: true },
      { label: 'C', content: 'reviewing', isCorrect: false },
      { label: 'D', content: 'reviews', isCorrect: false },
    ],
  },
  {
    content: 'Please contact the front desk if you need _____ assistance.',
    explanation:
      '"Additional" naturally modifies "assistance" and means extra help.',
    choices: [
      { label: 'A', content: 'addition', isCorrect: false },
      { label: 'B', content: 'additional', isCorrect: true },
      { label: 'C', content: 'additionally', isCorrect: false },
      { label: 'D', content: 'adds', isCorrect: false },
    ],
  },
  {
    content: 'The new software will be installed _____ Friday afternoon.',
    explanation:
      'Use "by" to mean no later than a deadline.',
    choices: [
      { label: 'A', content: 'by', isCorrect: true },
      { label: 'B', content: 'to', isCorrect: false },
      { label: 'C', content: 'at', isCorrect: false },
      { label: 'D', content: 'of', isCorrect: false },
    ],
  },
  {
    content: 'Employees are encouraged to submit their travel expenses _____.',
    explanation:
      'An adverb is needed to describe how employees should submit expenses.',
    choices: [
      { label: 'A', content: 'prompt', isCorrect: false },
      { label: 'B', content: 'promptness', isCorrect: false },
      { label: 'C', content: 'promptly', isCorrect: true },
      { label: 'D', content: 'prompts', isCorrect: false },
    ],
  },
  {
    content: 'The client was impressed by the team\'s _____ response.',
    explanation:
      'An adjective is needed before the noun "response"; "professional" is the correct form.',
    choices: [
      { label: 'A', content: 'profession', isCorrect: false },
      { label: 'B', content: 'professional', isCorrect: true },
      { label: 'C', content: 'professionally', isCorrect: false },
      { label: 'D', content: 'professionalism', isCorrect: false },
    ],
  },
];

const toeicPart7Groups: ToeicQuestionGroupSeed[] = [
  {
    title: 'Questions 1-3 refer to the following e-mail.',
    passageContent: `From: Maya Lopez, Office Manager
To: All Staff
Subject: Printer Maintenance

Please be advised that the printers on the third floor will be unavailable this Friday from 2:00 P.M. to 4:00 P.M. while technicians replace several worn parts. Employees who need to print urgent documents during this time should use the printers near the reception desk on the first floor.

The maintenance team expects normal service to resume by 4:30 P.M. If the work takes longer than expected, another notice will be sent by e-mail.`,
    questions: [
      {
        content: 'Why will the third-floor printers be unavailable?',
        explanation:
          'The e-mail says technicians will replace several worn parts.',
        choices: [
          { label: 'A', content: 'They are being moved to reception.', isCorrect: false },
          { label: 'B', content: 'They will be repaired by technicians.', isCorrect: true },
          { label: 'C', content: 'They are no longer used by employees.', isCorrect: false },
          { label: 'D', content: 'They will be upgraded next month.', isCorrect: false },
        ],
      },
      {
        content: 'Where should employees print urgent documents during the maintenance?',
        explanation:
          'The e-mail directs employees to the printers near the reception desk on the first floor.',
        choices: [
          { label: 'A', content: 'In the conference room', isCorrect: false },
          { label: 'B', content: 'On the third floor', isCorrect: false },
          { label: 'C', content: 'Near the first-floor reception desk', isCorrect: true },
          { label: 'D', content: 'At the maintenance office', isCorrect: false },
        ],
      },
      {
        content: 'What will happen if the maintenance is delayed?',
        explanation:
          'The notice says another e-mail will be sent if the work takes longer than expected.',
        choices: [
          { label: 'A', content: 'Staff will receive another e-mail.', isCorrect: true },
          { label: 'B', content: 'The printers will be removed.', isCorrect: false },
          { label: 'C', content: 'The reception desk will close.', isCorrect: false },
          { label: 'D', content: 'Employees must cancel print jobs.', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'Questions 4-6 refer to the following notice.',
    passageContent: `Brighton Training Center
Workshop Registration Notice

Registration is now open for the "Effective Business Writing" workshop on June 14. The workshop will cover e-mail structure, concise reporting, and techniques for writing clear project updates. It is designed for employees who regularly communicate with clients or internal teams.

The fee is $80 per participant and includes lunch and printed materials. To reserve a seat, complete the online registration form by June 7. Because space is limited to 25 participants, early registration is recommended.`,
    questions: [
      {
        content: 'What is the main purpose of the notice?',
        explanation:
          'The notice announces registration for an Effective Business Writing workshop.',
        choices: [
          { label: 'A', content: 'To announce a workshop registration period', isCorrect: true },
          { label: 'B', content: 'To explain a new company policy', isCorrect: false },
          { label: 'C', content: 'To request client feedback', isCorrect: false },
          { label: 'D', content: 'To cancel a training session', isCorrect: false },
        ],
      },
      {
        content: 'What is included in the workshop fee?',
        explanation:
          'The notice says the $80 fee includes lunch and printed materials.',
        choices: [
          { label: 'A', content: 'Hotel accommodation', isCorrect: false },
          { label: 'B', content: 'Lunch and printed materials', isCorrect: true },
          { label: 'C', content: 'Transportation to the center', isCorrect: false },
          { label: 'D', content: 'A private consultation', isCorrect: false },
        ],
      },
      {
        content: 'Why is early registration recommended?',
        explanation:
          'The notice states that space is limited to 25 participants.',
        choices: [
          { label: 'A', content: 'The fee will increase after June 7.', isCorrect: false },
          { label: 'B', content: 'The workshop begins early in the morning.', isCorrect: false },
          { label: 'C', content: 'Only 25 seats are available.', isCorrect: true },
          { label: 'D', content: 'Printed materials must be mailed.', isCorrect: false },
        ],
      },
    ],
  },
];

const courseSeeds: CourseSeed[] = [
  {
    title: 'English Starter',
    slug: 'starter-foundation',
    level: 'beginner',
    description: 'Lo trinh nhap mon cho nguoi moi bat dau hoc tieng Anh.',
    lessons: [
      {
        title: 'Alphabet and Greetings',
        content:
          'Learn the alphabet, basic greetings, and simple introductions.',
        order: 1,
        vocabulary: [
          {
            word: 'hello',
            meaning: 'xin chao',
            example: 'Hello, my name is Linh.',
          },
          {
            word: 'goodbye',
            meaning: 'tam biet',
            example: 'Goodbye, see you tomorrow.',
          },
        ],
        questions: [
          {
            title: 'Which word means "xin chao"?',
            type: QuestionType.SINGLE_CHOICE,
            explanation: 'Hello is used when greeting someone.',
            answers: [
              {
                content: 'Hello',
                isCorrect: true,
              },
              {
                content: 'Goodbye',
                isCorrect: false,
              },
              {
                content: 'Thanks',
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Present Simple Basics',
        content: 'Build short daily-routine sentences with the present simple.',
        order: 2,
        vocabulary: [
          {
            word: 'study',
            meaning: 'hoc',
            example: 'I study English every day.',
          },
          {
            word: 'practice',
            meaning: 'luyen tap',
            example: 'She practices speaking after class.',
          },
        ],
        questions: [
          {
            title: 'Choose the correct present simple sentence.',
            type: QuestionType.SINGLE_CHOICE,
            explanation: 'Use the base verb after I, you, we, and they.',
            answers: [
              {
                content: 'I studies English every day.',
                isCorrect: false,
              },
              {
                content: 'I study English every day.',
                isCorrect: true,
              },
              {
                content: 'I studying English every day.',
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'TOEIC Vocabulary Core',
    slug: 'toeic-vocabulary-core',
    level: 'elementary',
    description: 'Cum tu va mau cau TOEIC co ban theo ngu canh cong viec.',
    lessons: [
      {
        title: 'Office Communication',
        content: 'Key workplace vocabulary for emails, calls, and meetings.',
        order: 1,
        vocabulary: [
          {
            word: 'meeting',
            meaning: 'cuoc hop',
            example: 'The meeting starts at 9 a.m.',
          },
          {
            word: 'agenda',
            meaning: 'chuong trinh hop',
            example: 'Please read the agenda before the meeting.',
          },
        ],
        questions: [
          {
            title: 'What is an agenda?',
            type: QuestionType.SINGLE_CHOICE,
            explanation: 'An agenda lists topics or tasks for a meeting.',
            answers: [
              {
                content: 'A list of meeting topics',
                isCorrect: true,
              },
              {
                content: 'A phone number',
                isCorrect: false,
              },
              {
                content: 'A job title',
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Schedules and Arrangements',
        content:
          'Vocabulary used for planning, rescheduling, and confirming tasks.',
        order: 2,
        vocabulary: [
          {
            word: 'schedule',
            meaning: 'lich trinh',
            example: 'The schedule is full this week.',
          },
          {
            word: 'confirm',
            meaning: 'xac nhan',
            example: 'Please confirm your appointment.',
          },
        ],
        questions: [
          {
            title: 'Which word means "xac nhan"?',
            type: QuestionType.SINGLE_CHOICE,
            answers: [
              {
                content: 'Cancel',
                isCorrect: false,
              },
              {
                content: 'Confirm',
                isCorrect: true,
              },
              {
                content: 'Delay',
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'TOEIC Reading Basic',
    slug: 'toeic-reading-basic',
    level: 'toeic-foundation',
    description: 'Luyen doc hieu va ngu phap nen tang cho TOEIC Reading.',
    lessons: [
      {
        title: 'Sentence Completion',
        content:
          'Practice identifying grammar patterns in short TOEIC prompts.',
        order: 1,
        vocabulary: [
          {
            word: 'complete',
            meaning: 'hoan thanh',
            example: 'Complete the sentence with the best answer.',
          },
          {
            word: 'option',
            meaning: 'lua chon',
            example: 'Choose the best option.',
          },
        ],
        questions: [
          {
            title: 'The report ___ ready tomorrow.',
            type: QuestionType.SINGLE_CHOICE,
            explanation: 'Use "will be" for a future state.',
            answers: [
              {
                content: 'will be',
                isCorrect: true,
              },
              {
                content: 'is be',
                isCorrect: false,
              },
              {
                content: 'are',
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        title: 'Short Reading Passages',
        content: 'Read small workplace passages and answer direct questions.',
        order: 2,
        vocabulary: [
          {
            word: 'passage',
            meaning: 'doan van',
            example: 'Read the passage and answer the questions.',
          },
          {
            word: 'detail',
            meaning: 'chi tiet',
            example: 'Find the detail in the email.',
          },
        ],
        questions: [
          {
            title: 'What should you read before answering?',
            type: QuestionType.SINGLE_CHOICE,
            answers: [
              {
                content: 'The passage',
                isCorrect: true,
              },
              {
                content: 'The clock',
                isCorrect: false,
              },
              {
                content: 'The room number',
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
];

async function main(): Promise<void> {
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const publishedAt = new Date();

  const user = await prisma.user.upsert({
    where: {
      email: 'student@example.com',
    },
    update: {
      name: 'Demo Student',
      password: studentPassword,
      role: UserRole.USER,
    },
    create: {
      email: 'student@example.com',
      password: studentPassword,
      name: 'Demo Student',
      role: UserRole.USER,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    update: {
      name: 'Demo Admin',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Demo Admin',
      role: UserRole.ADMIN,
    },
  });

  await prisma.attempt.deleteMany({
    where: {
      userId: user.id,
    },
  });
  await prisma.toeicAttempt.deleteMany({
    where: {
      OR: [
        {
          userId: user.id,
        },
        {
          questionSet: {
            title: {
              in: toeicSeedSetTitles,
            },
          },
        },
      ],
    },
  });
  await prisma.toeicQuestionSet.deleteMany({
    where: {
      title: {
        in: toeicSeedSetTitles,
      },
    },
  });
  await prisma.vocabularyReview.deleteMany({
    where: {
      userId: user.id,
    },
  });
  await prisma.progress.deleteMany({
    where: {
      userId: user.id,
    },
  });

  for (const courseSeed of courseSeeds) {
    await prisma.course.upsert({
      where: {
        slug: courseSeed.slug,
      },
      update: {
        title: courseSeed.title,
        level: courseSeed.level,
        description: courseSeed.description,
        status: ContentStatus.PUBLISHED,
        publishedAt,
        lessons: {
          deleteMany: {},
          create: courseSeed.lessons.map((lessonSeed) => ({
            title: lessonSeed.title,
            content: lessonSeed.content,
            order: lessonSeed.order,
            status: ContentStatus.PUBLISHED,
            publishedAt,
            vocabulary: {
              create: lessonSeed.vocabulary,
            },
            questions: {
              create: lessonSeed.questions.map((questionSeed) => ({
                title: questionSeed.title,
                type: questionSeed.type,
                explanation: questionSeed.explanation,
                status: ContentStatus.PUBLISHED,
                publishedAt,
                answers: {
                  create: questionSeed.answers,
                },
              })),
            },
          })),
        },
      },
      create: {
        title: courseSeed.title,
        slug: courseSeed.slug,
        level: courseSeed.level,
        description: courseSeed.description,
        status: ContentStatus.PUBLISHED,
        publishedAt,
        lessons: {
          create: courseSeed.lessons.map((lessonSeed) => ({
            title: lessonSeed.title,
            content: lessonSeed.content,
            order: lessonSeed.order,
            status: ContentStatus.PUBLISHED,
            publishedAt,
            vocabulary: {
              create: lessonSeed.vocabulary,
            },
            questions: {
              create: lessonSeed.questions.map((questionSeed) => ({
                title: questionSeed.title,
                type: questionSeed.type,
                explanation: questionSeed.explanation,
                status: ContentStatus.PUBLISHED,
                publishedAt,
                answers: {
                  create: questionSeed.answers,
                },
              })),
            },
          })),
        },
      },
    });
  }

  // Seed VSTEP Course and Topics
  const vstepCourse = await prisma.course.upsert({
    where: { slug: 'on-thi-vstep-b1' },
    update: {
      title: 'Ôn thi VSTEP B1',
      level: 'vstep',
      description: 'Khóa học luyện thi VSTEP B1 đầy đủ 4 kỹ năng',
      status: ContentStatus.PUBLISHED,
      publishedAt,
    },
    create: {
      title: 'Ôn thi VSTEP B1',
      slug: 'on-thi-vstep-b1',
      level: 'vstep',
      description: 'Khóa học luyện thi VSTEP B1 đầy đủ 4 kỹ năng',
      status: ContentStatus.PUBLISHED,
      publishedAt,
    },
  });

  // Seed VSTEP Modules
  const defaultModules = [
    {
      title: 'Grammar Foundation',
      slug: 'grammar',
      description: 'Học nền tảng ngữ pháp quan trọng cho kỳ thi VSTEP.',
      type: ModuleType.GRAMMAR,
      icon: 'book-open',
      order: 1,
    },
    {
      title: 'Vocabulary Builder',
      slug: 'vocabulary',
      description: 'Học từ vựng theo chủ đề thường gặp trong VSTEP.',
      type: ModuleType.VOCABULARY,
      icon: 'text',
      order: 2,
    },
    {
      title: 'Listening Practice',
      slug: 'listening',
      description: 'Luyện nghe theo cấu trúc đề thi VSTEP.',
      type: ModuleType.LISTENING,
      icon: 'headphones',
      order: 3,
    },
    {
      title: 'Reading Practice',
      slug: 'reading',
      description: 'Luyện đọc hiểu và kỹ năng xử lý bài đọc.',
      type: ModuleType.READING,
      icon: 'book',
      order: 4,
    },
    {
      title: 'Writing Practice',
      slug: 'writing',
      description: 'Luyện viết thư, bài luận và các dạng Writing VSTEP.',
      type: ModuleType.WRITING,
      icon: 'pen-tool',
      order: 5,
    },
    {
      title: 'Speaking Practice',
      slug: 'speaking',
      description: 'Luyện nói theo Part 1, Part 2 và Part 3 của VSTEP.',
      type: ModuleType.SPEAKING,
      icon: 'mic',
      order: 6,
    },
    {
      title: 'Mock Tests',
      slug: 'mock-tests',
      description: 'Làm đề thi thử mô phỏng cấu trúc VSTEP thật.',
      type: ModuleType.MOCK_TESTS,
      icon: 'clipboard-check',
      order: 7,
    },
  ];

  for (const moduleItem of defaultModules) {
    await prisma.module.upsert({
      where: {
        courseId_slug: {
          courseId: vstepCourse.id,
          slug: moduleItem.slug,
        },
      },
      update: {
        title: moduleItem.title,
        description: moduleItem.description,
        type: moduleItem.type,
        icon: moduleItem.icon,
        order: moduleItem.order,
        isPublished: true,
      },
      create: {
        courseId: vstepCourse.id,
        title: moduleItem.title,
        slug: moduleItem.slug,
        description: moduleItem.description,
        type: moduleItem.type,
        icon: moduleItem.icon,
        order: moduleItem.order,
        isPublished: true,
      },
    });
  }

  // 1. Get Grammar & Vocabulary module IDs for migration/seeding
  const grammarModule = await prisma.module.findFirst({
    where: {
      courseId: vstepCourse.id,
      type: ModuleType.GRAMMAR,
    },
  });

  const vocabModule = await prisma.module.findFirst({
    where: {
      courseId: vstepCourse.id,
      type: ModuleType.VOCABULARY,
    },
  });

  // 2. Migrate existing lessons to Grammar module
  if (grammarModule) {
    await prisma.lesson.updateMany({
      where: {
        courseId: vstepCourse.id,
        moduleId: null,
      },
      data: {
        moduleId: grammarModule.id,
      },
    });
  }



  const firstCourse = await prisma.course.findUniqueOrThrow({
    where: {
      slug: courseSeeds[0].slug,
    },
    include: {
      lessons: {
        include: {
          questions: {
            include: {
              answers: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
  const firstLesson = firstCourse.lessons[0];
  const firstQuestion = firstLesson.questions[0];
  const correctAnswer = firstQuestion.answers.find(
    (answer) => answer.isCorrect,
  );
  const reviewVocabulary = await prisma.vocabulary.findMany({
    where: {
      lesson: {
        course: {
          slug: {
            in: ['starter-foundation', 'toeic-vocabulary-core'],
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 4,
  });

  await prisma.progress.create({
    data: {
      userId: user.id,
      courseId: firstCourse.id,
      lessonId: firstLesson.id,
      completed: true,
      score: 100,
    },
  });

  if (correctAnswer) {
    await prisma.attempt.create({
      data: {
        userId: user.id,
        score: 1,
        total: 1,
        answers: {
          create: {
            questionId: firstQuestion.id,
            answerId: correctAnswer.id,
            isCorrect: true,
          },
        },
      },
    });
  }

  for (const [index, vocabulary] of reviewVocabulary.entries()) {
    await prisma.vocabularyReview.create({
      data: {
        userId: user.id,
        vocabularyId: vocabulary.id,
        status: index % 2 === 0 ? 'DUE' : 'LEARNING',
        easeLevel: 2,
        nextReviewAt: new Date(Date.now() - (index + 1) * 60 * 60 * 1000),
      },
    });
  }

  await prisma.toeicQuestionSet.create({
    data: {
      title: 'Part 5 - Practice Set 01',
      description: 'Short TOEIC Part 5 grammar and vocabulary practice.',
      part: 5,
      type: 'PRACTICE',
      duration: 600,
      version: 1,
      groups: {
        create: {
          title: 'Incomplete Sentences',
          order: 1,
          questions: {
            create: toeicPart5Questions.map((question, index) => ({
              content: question.content,
              explanation: question.explanation,
              order: index + 1,
              choices: {
                create: question.choices,
              },
            })),
          },
        },
      },
    },
  });

  await prisma.toeicQuestionSet.create({
    data: {
      title: 'Part 7 - Reading Set 01',
      description: 'TOEIC Part 7 reading comprehension with short workplace passages.',
      part: 7,
      type: 'PRACTICE',
      duration: 900,
      version: 1,
      groups: {
        create: toeicPart7Groups.map((group, groupIndex) => ({
          title: group.title,
          passageContent: group.passageContent,
          order: groupIndex + 1,
          questions: {
            create: group.questions.map((question, questionIndex) => ({
              content: question.content,
              explanation: question.explanation,
              order: questionIndex + 1,
              choices: {
                create: question.choices,
              },
            })),
          },
        })),
      },
    },
  });

  console.log(
    `Seeded ${courseSeeds.length} courses, TOEIC Part 5, TOEIC Part 7, and demo user`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
