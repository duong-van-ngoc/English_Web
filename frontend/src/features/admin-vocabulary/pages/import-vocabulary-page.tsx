"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useTopicDetail } from "../hooks/use-topic-detail";
import { useImportVocabulary } from "../hooks/use-import-vocabulary";
import { ImportStepper } from "../components/import/import-stepper";
import { ImportUploadZone } from "../components/import/import-upload-zone";
import { ImportPreviewTable } from "../components/import/import-preview-table";
import { ImportValidationSummary } from "../components/import/import-validation-summary";
import { ImportConfirmPanel } from "../components/import/import-confirm-panel";
import { ImportResultPanel } from "../components/import/import-result-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

interface ImportVocabularyPageProps {
  params: Promise<{ topicId: string }>;
}

export function ImportVocabularyPage({ params }: ImportVocabularyPageProps) {
  const { topicId } = use(params);
  const { topic } = useTopicDetail(topicId);
  const {
    validateFile,
    isValidating,
    validationData,
    inMemoryRows,
    commitImport,
    isCommitting,
    imageProgress,
  } = useImportVocabulary(topicId);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleFileSelected = async (file: File) => {
    try {
      await validateFile(file);
      setStep(2);
    } catch (err) {
      console.error("Failed to read file", err);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationData) return;
    try {
      await commitImport(validationData.id);
      setStep(3);
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  const handleFinish = () => {
    window.location.href = VOCABULARY_ROUTES.TOPIC_WORDS(topicId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2">
          <Link href={VOCABULARY_ROUTES.TOPICS_LIST} className="hover:text-primary">
            Chủ đề từ vựng
          </Link>
          <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
          <Link href={VOCABULARY_ROUTES.TOPIC_WORDS(topicId)} className="hover:text-primary">
            {topic?.name || "Danh sách từ"}
          </Link>
          <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
          <span>Nhập dữ liệu</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Nhập từ vựng bằng Excel/CSV/ZIP
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Nhập hàng loạt từ vựng vào chủ đề <strong>{topic?.name}</strong>.
          Hỗ trợ file CSV, Excel hoặc ZIP kèm ảnh minh họa.
        </p>
      </div>

      {/* Stepper progress indicator */}
      <ImportStepper currentStep={step} />

      {/* Step 1 — Upload */}
      {step === 1 && (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <ImportUploadZone onFileSelected={handleFileSelected} isLoading={isValidating} />
          </CardContent>
        </Card>
      )}

      {/* Step 2 — Preview & Confirm */}
      {step === 2 && validationData && (
        <div className="space-y-6">
          {/* Stats */}
          <ImportValidationSummary
            total={validationData.totalRows}
            valid={validationData.validRows}
            invalid={validationData.invalidRows}
          />

          {/* Image count badge if ZIP was uploaded */}
          {validationData.rowsWithImages > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 w-fit">
              <span className="material-symbols-outlined text-[18px] text-blue-600">photo_library</span>
              <span className="text-sm font-semibold text-blue-800">
                {validationData.rowsWithImages} ảnh sẽ được tải lên
              </span>
              <span className="text-xs text-blue-600">
                ({validationData.validRows - validationData.rowsWithImages} từ không có ảnh)
              </span>
            </div>
          )}

          {/* Table Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước dữ liệu tải lên</CardTitle>
              <CardDescription>
                Các dòng tô đỏ biểu thị thông tin không hợp lệ.
                {validationData.rowsWithImages > 0 && " Cột Ảnh hiển thị ảnh minh họa được nhận dạng từ ZIP."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-border/40">
              <ImportPreviewTable rows={inMemoryRows} />
            </CardContent>
          </Card>

          {/* Progress bar when committing with images */}
          {isCommitting && imageProgress.total > 0 && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm font-semibold text-blue-800">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  Đang tải ảnh lên...
                </span>
                <span>
                  {imageProgress.uploaded} / {imageProgress.total} ảnh
                </span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round((imageProgress.uploaded / imageProgress.total) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-blue-600">
                Vui lòng không đóng tab trong quá trình tải lên ảnh.
              </p>
            </div>
          )}

          {/* Action Confirm */}
          <ImportConfirmPanel
            isValid={validationData.invalidRows === 0}
            isLoading={isCommitting}
            onConfirm={handleConfirmImport}
            onCancel={() => setStep(1)}
          />
        </div>
      )}

      {/* Step 3 — Success */}
      {step === 3 && (
        <Card className="max-w-xl mx-auto">
          <CardContent className="pt-6">
            <ImportResultPanel
              totalImported={validationData?.validRows || 0}
              onFinish={handleFinish}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default ImportVocabularyPage;
