import React from "react";
import { Card } from "@/components/ui/card";

interface ImportValidationSummaryProps {
  total: number;
  valid: number;
  invalid: number;
}

export function ImportValidationSummary({ total, valid, invalid }: ImportValidationSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-secondary/70 mb-0.5">Tổng số dòng đã quét</p>
          <p className="text-xl font-black text-text-primary">{total}</p>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2 rounded-xl">
          barcode_reader
        </span>
      </Card>

      <Card className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-secondary/70 mb-0.5">Dòng hợp lệ</p>
          <p className="text-xl font-black text-success">{valid}</p>
        </div>
        <span className="material-symbols-outlined text-success text-3xl bg-green-100 p-2 rounded-xl">
          check_circle
        </span>
      </Card>

      <Card className="p-4 flex items-center justify-between border-error/20">
        <div>
          <p className="text-xs font-semibold text-text-secondary/70 mb-0.5">Dòng không hợp lệ</p>
          <p className="text-xl font-black text-error">{invalid}</p>
        </div>
        <span className="material-symbols-outlined text-error text-3xl bg-red-100 p-2 rounded-xl">
          cancel
        </span>
      </Card>
    </div>
  );
}
export default ImportValidationSummary;
