import { PrimaryButton } from "@/components/ui/primary-button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-normal text-primary">
        Không tìm thấy
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
        Trang hoặc bài học này chưa tồn tại
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
        Hãy quay lại danh sách khóa học để chọn lộ trình đang có sẵn.
      </p>
      <div className="mt-8">
        <PrimaryButton href="/courses">Xem khóa học</PrimaryButton>
      </div>
    </div>
  );
}
