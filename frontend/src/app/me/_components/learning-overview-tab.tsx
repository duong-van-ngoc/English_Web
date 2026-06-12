import { useLearningDashboard } from "@/hooks/use-dashboard";
import { useMe } from "@/hooks/use-me";
import Link from "next/link";

export function LearningOverviewTab() {
  const { data: dashboard, error, isLoading } = useLearningDashboard();
  const { data: user } = useMe();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center bg-white/20 backdrop-blur-md rounded-[20px] border border-white/10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#004b5d] border-t-transparent" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-[20px] bg-red-50 border border-red-200 p-6 text-center text-red-600">
        <p className="font-semibold">Không thể tải dữ liệu tiến độ học tập.</p>
      </div>
    );
  }

  const { learning, toeic, review, recommendation } = dashboard;
  const targetGoal = user?.toeicGoal ? `TOEIC ${user.toeicGoal}` : "TOEIC 500";
  const completionRatePercent = Math.round(learning.completionRate);

  // Compute accuracy rate representation
  const accuracyRatePercent = Math.round(toeic.accuracyRate);
  const activeSegments = Math.round((toeic.accuracyRate || 0) / 25); // 0 to 4 segments (e.g. 80 / 25 = 3.2 -> 3)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI 1: Completed lessons */}
        <div className="glass-card rounded-[20px] p-6 hover:-translate-y-1 transition-all bg-white/55 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#b7eaff]/30 rounded-lg">
              <span className="material-symbols-outlined text-[#004b5d]">
                book
              </span>
            </div>
            <span className="text-xs text-[#3f484c] font-semibold">
              {completionRatePercent}% Hoàn thành
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#181c20] mb-1">
            Bài học hoàn thành
          </h3>
          <div className="flex items-end space-x-1 mb-3">
            <span className="text-2xl font-bold text-[#181c20]">
              {learning.completedLessons}
            </span>
            <span className="text-xs text-[#3f484c] mb-1">
              / {learning.totalLessons} bài học
            </span>
          </div>
          <div className="w-full h-2 bg-[#004b5d]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#004b5d] rounded-full transition-all duration-500"
              style={{ width: `${completionRatePercent}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 2: Accurate rate */}
        <div className="glass-card rounded-[20px] p-6 hover:-translate-y-1 transition-all bg-white/55 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#e9ddff]/30 rounded-lg">
              <span className="material-symbols-outlined text-[#520fbc]">
                check_circle
              </span>
            </div>
            <span className="text-xs text-[#520fbc] font-bold">
              Độ chính xác
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#181c20] mb-1">
            Tỉ lệ đúng TOEIC
          </h3>
          <div className="text-2xl font-bold text-[#181c20] mb-3">
            {accuracyRatePercent}%
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className={`h-1 flex-1 rounded-full transition-all ${
                  seg <= activeSegments ? "bg-[#520fbc]" : "bg-[#520fbc]/20"
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* KPI 3: Quizattempts */}
        <div className="glass-card rounded-[20px] p-6 hover:-translate-y-1 transition-all bg-white/55 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#abedff]/30 rounded-lg">
              <span className="material-symbols-outlined text-[#00687a]">
                assignment
              </span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-[#181c20] mb-1">
            Lượt làm bài thi
          </h3>
          <div className="text-2xl font-bold text-[#181c20]">
            {toeic.totalAttempts}
          </div>
          <p className="text-xs text-[#3f484c] mt-1">
            Hoàn thành luyện đề thi thử
          </p>
        </div>

        {/* KPI 4: Vocab Review */}
        <div className="glass-card rounded-[20px] p-6 hover:-translate-y-1 transition-all bg-white/55 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100/60 rounded-lg">
              <span className="material-symbols-outlined text-red-600">
                style
              </span>
            </div>
            <Link
              href="/review"
              className="text-xs text-[#004b5d] font-bold underline hover:text-[#00687a]"
            >
              Ôn tập ngay
            </Link>
          </div>
          <h3 className="text-sm font-semibold text-[#181c20] mb-1">
            Từ vựng cần ôn
          </h3>
          <div className="text-2xl font-bold text-red-600">
            {review?.dueVocabularyCount || 0}
          </div>
          <p className="text-xs text-[#3f484c] mt-1">
            Từ vựng đến hạn cần ghi nhớ
          </p>
        </div>
      </div>

      {/* Progress Road Map Card */}
      <div className="glass-card rounded-[20px] p-6 relative overflow-hidden group bg-white/55 backdrop-blur-md border border-white/20">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#181c20]">
                Tiến độ lộ trình {targetGoal}
              </h3>
              <p className="text-sm text-[#3f484c]">
                Bạn đang đi đúng hướng để đạt mục tiêu.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#004b5d]">
                {completionRatePercent}%
              </span>
            </div>
          </div>
          <div className="w-full h-4 bg-[#f1f3f9] rounded-full overflow-hidden p-[2px]">
            <div
              className="h-full bg-gradient-to-r from-[#004b5d] via-[#00687a] to-[#520fbc] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRatePercent}%` }}
            ></div>
          </div>
          <div className="mt-4 flex justify-between text-xs font-semibold text-[#3f484c]">
            <span>Giai đoạn 1: Mất gốc</span>
            <span>Giai đoạn 2: Bứt phá</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#004b5d]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
      </div>

      {/* Recommendation Card */}
      {recommendation ? (
        <div className="glass-card rounded-[20px] p-6 border-2 border-[#b7eaff]/50 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white/60 to-[#b7eaff]/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-[#f1f3f9]">
              <span className="material-symbols-outlined text-[#520fbc] !text-4xl">
                auto_awesome
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#181c20]">
                Gợi ý học tiếp theo
              </h3>
              <p className="text-sm text-[#3f484c] font-semibold">{recommendation.title}</p>
              <p className="text-xs text-[#3f484c]/80 mt-0.5">{recommendation.reason}</p>
            </div>
          </div>
          <Link
            href={recommendation.href || "#"}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#004b5d] to-[#00687a] hover:from-[#00687a] hover:to-[#004b5d] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#004b5d]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Học ngay</span>
            <span className="material-symbols-outlined !text-md">play_arrow</span>
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-[20px] p-6 border border-white/20 bg-white/55 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-[#f1f3f9]">
              <span className="material-symbols-outlined text-[#004b5d] !text-4xl">
                school
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#181c20]">
                Bạn đã hoàn thành bài học
              </h3>
              <p className="text-sm text-[#3f484c]">Hãy chọn khóa học khác để tiếp tục hành trình học tập.</p>
            </div>
          </div>
          <Link
            href="/courses"
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#004b5d] to-[#00687a] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#004b5d]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Xem khóa học</span>
            <span className="material-symbols-outlined !text-md">arrow_forward</span>
          </Link>
        </div>
      )}
    </div>
  );
}

