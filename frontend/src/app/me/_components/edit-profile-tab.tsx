import { useState } from "react";
import { useMe, useUpdateProfile } from "@/hooks/use-me";
import { isApiError } from "@/lib/api";
import type { AuthUser } from "@/types";

export function EditProfileTab() {
  const { data: user, isLoading } = useMe();

  if (isLoading || !user) {
    return (
      <div className="flex h-48 items-center justify-center bg-white/20 backdrop-blur-md rounded-[20px] border border-white/10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#004b5d] border-t-transparent" />
      </div>
    );
  }

  return <EditProfileForm user={user} />;
}

function EditProfileForm({ user }: { user: AuthUser }) {
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState(user.name || "");
  const [toeicGoal, setToeicGoal] = useState<string>(
    user.toeicGoal?.toString() || "",
  );
  const [level, setLevel] = useState(user.level || "BEGINNER");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    updateProfile.mutate(
      {
        name,
        toeicGoal: toeicGoal ? parseInt(toeicGoal, 10) : undefined,
        level,
        avatarUrl: avatarUrl || undefined,
      },
      {
        onSuccess: () => setSuccessMsg("Cập nhật thông tin thành công!"),
        onError: (err) => {
          setErrorMsg(isApiError(err) ? err.message : "Có lỗi xảy ra");
        },
      },
    );
  };

  return (
    <div className="glass-card rounded-[20px] p-6 sm:p-8 bg-white/55 backdrop-blur-md border border-white/20 shadow-sm duration-500 animate-in fade-in">
      <h2 className="mb-6 text-xl font-bold text-[#181c20]">
        Chỉnh sửa thông tin
      </h2>

      {errorMsg ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 font-semibold">
          {errorMsg}
        </div>
      ) : null}
      {successMsg ? (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-600 font-semibold">
          {successMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f484c]">
            Họ và tên
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
            required
            minLength={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#3f484c]">
              Mục tiêu TOEIC
            </label>
            <input
              type="number"
              value={toeicGoal}
              onChange={(e) => setToeicGoal(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
              placeholder="Ví dụ: 600"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#3f484c]">
              Trình độ hiện tại
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f484c]">
            Đường dẫn ảnh đại diện (Tùy chọn)
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
            placeholder="https://..."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#004b5d] hover:bg-[#00687a] text-white font-bold rounded-xl transition-all shadow-md shadow-[#004b5d]/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

