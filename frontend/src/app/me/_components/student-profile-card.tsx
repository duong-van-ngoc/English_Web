import type { AuthUser } from "@/types";

export function StudentProfileCard({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout: () => void;
}) {
  const getLevelDisplay = (level?: string | null) => {
    switch (level) {
      case "BEGINNER":
        return "Beginner";
      case "INTERMEDIATE":
        return "Intermediate";
      case "ADVANCED":
        return "Advanced";
      default:
        return "Beginner";
    }
  };

  return (
    <div className="glass-card rounded-[20px] p-6 shadow-sm hover:-translate-y-1 transition-all duration-300 bg-white/55 backdrop-blur-md border border-white/20">
      <div className="flex flex-col items-center text-center">
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#004b5d] to-[#520fbc] mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-100 flex items-center justify-center">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-4xl text-[#004b5d]">
                person
              </span>
            )}
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#181c20]">
          {user.name || "Học viên bí ẩn"}
        </h2>
        <span className="mt-1 px-3 py-1 bg-[#b7eaff] text-[#004b5d] text-xs font-bold rounded-full uppercase tracking-wider">
          LEARNER
        </span>
        <p className="mt-2 text-sm text-[#3f484c]">{user.email}</p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between p-4 bg-[#f1f3f9]/60 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#004b5d]">
              target
            </span>
            <span className="text-sm font-semibold text-[#181c20]">Mục tiêu</span>
          </div>
          <span className="text-sm font-bold text-[#004b5d]">
            {user.toeicGoal ? `TOEIC ${user.toeicGoal}` : "Chưa đặt"}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#f1f3f9]/60 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#004b5d]">
              school
            </span>
            <span className="text-sm font-semibold text-[#181c20]">Trình độ</span>
          </div>
          <span className="text-sm font-bold text-[#3f484c]">
            {getLevelDisplay(user.level)}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#f1f3f9]/60 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#520fbc]">
              local_fire_department
            </span>
            <span className="text-sm font-semibold text-[#181c20]">Streak</span>
          </div>
          <span className="text-sm font-bold text-[#520fbc]">5 ngày</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#f1f3f9]/60 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#00687a]">
              schedule
            </span>
            <span className="text-sm font-semibold text-[#181c20]">Tổng thời gian</span>
          </div>
          <span className="text-sm font-bold text-[#3f484c]">12 giờ</span>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="mt-6 w-full flex items-center justify-center space-x-2 p-3 border border-red-500/30 text-red-600 rounded-xl bg-white/20 hover:bg-red-50 transition-colors text-sm font-semibold cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">logout</span>
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}

