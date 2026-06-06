import { useChangePassword } from "@/hooks/use-me";
import { isApiError } from "@/lib/api";
import { useState } from "react";

export function SecurityTab() {
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setSuccessMsg("Đổi mật khẩu thành công!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err) => {
          setErrorMsg(isApiError(err) ? err.message : "Có lỗi xảy ra");
        },
      },
    );
  };

  return (
    <div className="glass-card rounded-[20px] p-6 sm:p-8 bg-white/55 backdrop-blur-md border border-white/20 shadow-sm duration-500 animate-in fade-in">
      <div className="mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#004b5d] text-3xl">
          shield
        </span>
        <h2 className="text-xl font-bold text-[#181c20]">Đổi mật khẩu</h2>
      </div>

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
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f484c]">
            Mật khẩu mới
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-[#3f484c]">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-2.5 bg-white/35 border border-[#bfc8cd]/60 text-[#181c20] focus:outline-none focus:ring-2 focus:ring-[#004b5d]/20 focus:border-[#004b5d] transition-all"
            required
            minLength={6}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#004b5d] hover:bg-[#00687a] text-white font-bold rounded-xl transition-all shadow-md shadow-[#004b5d]/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {changePassword.isPending ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}

