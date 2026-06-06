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
  const { validateFile, isValidating, validationData, commitImport, isCommitting } = useImportVocabulary(topicId);

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
          Nhập từ vựng bằng Excel/CSV
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Nhập hàng loạt từ vựng cùng lúc vào chủ đề **{topic?.name}**.
        </p>
      </div>

      {/* Stepper progress indicator */}
      <ImportStepper currentStep={step} />

      {/* Step Contents */}
      {step === 1 && (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <ImportUploadZone onFileSelected={handleFileSelected} isLoading={isValidating} />
          </CardContent>
        </Card>
      )}

      {step === 2 && validationData && (
        <div className="space-y-6">
          {/* Validation indicators */}
          <ImportValidationSummary
            total={validationData.totalRows}
            valid={validationData.validRows}
            invalid={validationData.invalidRows}
          />

          {/* Table Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước dữ liệu tải lên</CardTitle>
              <CardDescription>Các dòng được tô đỏ biểu thị thông tin không hợp lệ.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-border/40">
              <ImportPreviewTable rows={validationData.rows} />
            </CardContent>
          </Card>

          {/* Action Confirm */}
          <ImportConfirmPanel
            isValid={validationData.invalidRows === 0}
            isLoading={isCommitting}
            onConfirm={handleConfirmImport}
            onCancel={() => setStep(1)}
          />
        </div>
      )}

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
