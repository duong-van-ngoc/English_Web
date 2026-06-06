"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Volume2,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Award,
  CheckCircle,
  HelpCircle,
  Check,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  type: "meaning" | "fill" | "listening";
  questionText: string;
  wordId: string;
  wordText: string;
  options: QuestionOption[];
  correctAnswerId: string;
  explanation: string;
  exampleEn?: string;
  exampleVi?: string;
}

export default function TopicQuizPage() {
  const params = useParams();
  const router = useRouter();
  
  const courseId = (params?.courseId as string) || "on-thi-vstep-b1";
  const topicId = (params?.topicId as string) || "environment";

  const [topic, setTopic] = useState<any | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuizData() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await api.getTopicWords(courseId, topicId);
        if (result && result.topic) {
          setTopic(result.topic);
          
          const mappedWords = (result.words || []).map((w: any) => ({
            id: w.id,
            word: w.word,
            ipa: w.phonetic || "",
            partOfSpeech: w.partOfSpeech || "noun",
            meaningVi: w.meaning || "",
            exampleEn: w.example || "",
            exampleVi: w.exampleVi || "",
            synonyms: w.synonyms || [],
            collocations: w.collocations || [],
            wordFamily: w.wordFamily || [],
            commonMistakes: w.commonMistakes || []
          }));
          
          generateQuiz(result.topic, mappedWords);
        } else {
          router.push(`/courses/${courseId}/modules/vocabulary-by-topics`);
        }
      } catch (err: any) {
        console.error("Failed to load quiz data:", err);
        setError(err.message || "Không thể tải từ vựng cho bài kiểm tra.");
      } finally {
        setIsLoading(false);
      }
    }
    loadQuizData();
  }, [topicId, courseId, router]);

  // Generate quiz questions
  const generateQuiz = (currentTopic: any, topicWords: any[]) => {
    if (topicWords.length === 0) return;

    const generated: QuizQuestion[] = [];

    // We will generate 10 questions. If there are fewer words, we repeat or adjust.
    const numQuestions = Math.min(10, topicWords.length);
    
    // Shuffle words to select distinct words for questions
    const shuffledWords = [...topicWords].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numQuestions; i++) {
      const targetWord = shuffledWords[i];
      
      // Determine question type cyclically
      const types: Array<"meaning" | "fill" | "listening"> = ["meaning", "fill", "listening"];
      const qType = types[i % types.length];

      // Get distractors (3 other random words from this topic)
      const distractors = topicWords
        .filter((w) => w.id !== targetWord.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Construct options
      const correctText = qType === "meaning" ? targetWord.meaningVi : targetWord.word;
      const wrongTexts = distractors.map((d) => qType === "meaning" ? d.meaningVi : d.word);
      
      const optionTexts = [correctText, ...wrongTexts].sort(() => Math.random() - 0.5);
      const options: QuestionOption[] = optionTexts.map((txt, idx) => ({
        id: String.fromCharCode(97 + idx), // a, b, c, d
        text: txt,
      }));

      const correctOption = options.find((o) => o.text === correctText);
      const correctAnswerId = correctOption ? correctOption.id : "a";

      let questionText = "";
      let explanation = "";

      if (qType === "meaning") {
        questionText = `Chọn nghĩa tiếng Việt chính xác của từ: "${targetWord.word}"`;
        explanation = `"${targetWord.word}" (${targetWord.partOfSpeech}) nghĩa là "${targetWord.meaningVi}". Ví dụ: ${targetWord.exampleEn}`;
      } else if (qType === "fill") {
        // Mask the target word in example sentence
        const regex = new RegExp(`\\b${targetWord.word}\\b`, "i");
        const masked = targetWord.exampleEn.replace(regex, "_______");
        questionText = `Điền từ thích hợp vào chỗ trống:\n"${masked}"`;
        explanation = `Câu hoàn chỉnh: "${targetWord.exampleEn}" - dịch nghĩa: "${targetWord.exampleVi}".`;
      } else if (qType === "listening") {
        questionText = "Nhấp vào nút loa để nghe phát âm và chọn từ bạn nghe được:";
        explanation = `Từ phát âm là "${targetWord.word}" /${targetWord.ipa}/ (${targetWord.partOfSpeech}) - nghĩa là: "${targetWord.meaningVi}".`;
      }

      generated.push({
        id: `q-${i + 1}`,
        type: qType,
        questionText,
        wordId: targetWord.id,
        wordText: targetWord.word,
        options,
        correctAnswerId,
        explanation,
        exampleEn: targetWord.exampleEn,
        exampleVi: targetWord.exampleVi,
      });
    }

    setQuestions(generated);
    setIsGenerated(true);
  };

  if (isLoading || !isGenerated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0fdff]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fdff] gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-bold text-text-primary">{error || "Không thể tải từ vựng cho bài kiểm tra."}</p>
        <Link href={`/courses/${courseId}/modules/vocabulary-by-topics`} className="px-4 py-2 bg-[#004b5d] text-white rounded-xl text-xs font-bold hover:bg-[#00687a]">Quay lại</Link>
      </div>
    );
  }

  const playTTS = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionId,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Check if any questions are unanswered
    const unansweredCount = questions.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Bạn vẫn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài không?`
      );
      if (!confirmSubmit) return;
    }

    // Process attempt results
    let correctCount = 0;
    const wrongAnswersList: any[] = [];

    questions.forEach((q, idx) => {
      const selectedOptId = selectedAnswers[idx];
      const isCorrect = selectedOptId === q.correctAnswerId;
      
      const selectedText = q.options.find((o) => o.id === selectedOptId)?.text || "(Chưa trả lời)";
      const correctText = q.options.find((o) => o.id === q.correctAnswerId)?.text || "";

      if (isCorrect) {
        correctCount++;
      } else {
        wrongAnswersList.push({
          questionText: q.questionText,
          selectedAnswer: selectedText,
          correctAnswer: correctText,
          explanation: q.explanation,
        });
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const isPassed = score >= 70;
    const attemptId = `attempt-${Date.now()}`;

    const newAttempt = {
      attemptId,
      topicId,
      topicName: topic.name,
      score,
      correctCount,
      wrongCount: questions.length - correctCount,
      isPassed,
      wrongAnswers: wrongAnswersList,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    if (typeof window !== "undefined") {
      const storedAttempts = localStorage.getItem("vocab_quiz_attempts");
      const attemptsList = storedAttempts ? JSON.parse(storedAttempts) : [];
      attemptsList.push(newAttempt);
      localStorage.setItem("vocab_quiz_attempts", JSON.stringify(attemptsList));
    }

    // Redirect to result page
    router.push(`/courses/${courseId}/modules/vocabulary-by-topics/quiz-attempts/${attemptId}/result`);
  };

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = selectedAnswers[currentIndex];

  // Auto-play TTS on loading a listening question
  if (currentQuestion && currentQuestion.type === "listening" && typeof window !== "undefined") {
    // Only play if this question just became active
    // We can handle this inside a useEffect, but since this is client-side, let's add a button and a simple ref
  }

  return (
    <div className="relative min-h-screen bg-[#f0fdff]/90 bg-grid flex flex-col justify-between pb-12">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="w-full bg-white/40 backdrop-blur-md border-b border-slate-200/50 py-4 px-6 flex justify-between items-center">
        <Link
          href={`/courses/${courseId}/modules/vocabulary-by-topics/topics/${topic.slug}`}
          className="flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Hủy thi kiểm tra
        </Link>
        <span className="text-xs font-bold text-text-secondary bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Quiz: {topic.name}
        </span>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-lg flex flex-col gap-6">
          
          {/* Quiz Progress Tracker */}
          <div className="w-full flex items-center justify-between text-xs font-bold text-text-secondary">
            <span>Câu hỏi: {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card Container */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-md space-y-6">
            
            {/* Question Text */}
            <div className="space-y-3">
              <span className="px-2 py-0.5 rounded bg-violet-100 border border-violet-200 text-[10px] text-violet-800 font-extrabold uppercase tracking-wider">
                {currentQuestion.type === "meaning" && "Tìm nghĩa từ"}
                {currentQuestion.type === "fill" && "Điền từ phù hợp"}
                {currentQuestion.type === "listening" && "Nghe phát âm"}
              </span>
              <p className="text-base font-bold text-text-primary leading-relaxed whitespace-pre-line">
                {currentQuestion.questionText}
              </p>

              {/* Special UI for Listening Question */}
              {currentQuestion.type === "listening" && (
                <div className="flex justify-center py-4">
                  <button
                    onClick={() => playTTS(currentQuestion.wordText)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all transform hover:scale-102 cursor-pointer"
                  >
                    <Volume2 className="h-5 w-5" />
                    Bấm để nghe âm thanh
                  </button>
                </div>
              )}
            </div>

            {/* Answer Options Card Grid */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-cyan-50 border-primary text-primary shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100/50 border-slate-200 text-text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] uppercase font-bold shrink-0 ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-slate-300 text-text-secondary"
                      }`}>
                        {option.id}
                      </span>
                      <span>{option.text}</span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Navigation Controls & Submit */}
          <div className="w-full flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white/60 hover:bg-white text-text-secondary text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Câu trước
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:shadow active:scale-98 transition-all cursor-pointer"
              >
                Nộp bài kiểm tra
                <CheckCircle className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!selectedOptionId}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white/60 hover:bg-white text-text-secondary text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Câu tiếp theo
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>
      </main>

      <div className="h-4" />
    </div>
  );
}
