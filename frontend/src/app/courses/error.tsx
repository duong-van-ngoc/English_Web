"use client";

import { PrimaryButton } from "@/components/ui/primary-button";

interface CoursesErrorProps {
  reset: () => void;
}

export default function CoursesError({ reset }: CoursesErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-normal text-error">
        {'Courses error'}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-normal text-text-primary">
        {'Không thể tải danh sách khóa học'}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
        {'Hãy kiểm tra backend, CORS và NEXT_PUBLIC_API_URL rồi thử lại.'}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <PrimaryButton onClick={reset}>{'Thử lại'}</PrimaryButton>
        <PrimaryButton href="/" variant="secondary">
          {'Về trang chủ'}
        </PrimaryButton>
      </div>
    </div>
  );
}
