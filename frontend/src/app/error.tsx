"use client";

import { PrimaryButton } from "@/components/ui/primary-button";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-normal text-error">
        {'Có lỗi xảy ra'}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
        {'Không thể tải nội dung học'}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
        {error.message || "Vui lòng thử tải lại hoặc quay về danh sách khóa học."}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={reset}>{'Thử lại'}</PrimaryButton>
        <PrimaryButton href="/courses" variant="secondary">
          {'Xem khóa học'}
        </PrimaryButton>
      </div>
    </div>
  );
}
