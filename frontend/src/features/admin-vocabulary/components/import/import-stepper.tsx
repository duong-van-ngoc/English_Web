import React from "react";

interface ImportStepperProps {
  currentStep: 1 | 2 | 3;
}

export function ImportStepper({ currentStep }: ImportStepperProps) {
  const steps = [
    { num: 1, label: "Tải file Excel/CSV" },
    { num: 2, label: "Xem trước & Xác thực" },
    { num: 3, label: "Nhập hoàn tất" },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8 bg-surface-strong/30 p-4 border border-border/40 rounded-2xl">
      {steps.map((s, idx) => {
        const isActive = currentStep === s.num;
        const isDone = currentStep > s.num;

        return (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive
                    ? "primary-gradient-btn text-white"
                    : isDone
                    ? "bg-green-100 border border-green-200 text-green-700"
                    : "bg-surface border border-border text-text-secondary/50"
                }`}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-sm font-extrabold">check</span>
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`text-xs font-bold transition-all duration-300 ${
                  isActive ? "text-primary" : "text-text-secondary/60"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-border/50 mx-4" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
export default ImportStepper;
