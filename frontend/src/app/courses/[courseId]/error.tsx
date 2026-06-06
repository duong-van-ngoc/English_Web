"use client";

import { PrimaryButton } from "@/components/ui/primary-button";

interface CourseDetailErrorProps {
  reset: () => void;
}

export default function CourseDetailError({ reset }: CourseDetailErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-normal text-error">
        {'Course error'}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
        Không thể tải chi tiết khóa học
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
        Dữ liệu khóa học không phản hồi đúng từ backend. Bạn có thể thử lại hoặc quay về danh sách khóa học.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={reset}>Thử lại</PrimaryButton>
        <PrimaryButton href="/courses" variant="secondary">
          Xem khóa học
        </PrimaryButton>
      </div>
    </div>
  );
}
