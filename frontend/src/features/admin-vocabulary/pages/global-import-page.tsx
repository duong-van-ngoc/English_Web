"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTopics } from "../hooks/use-topics";
import { useImportVocabulary } from "../hooks/use-import-vocabulary";
import { ImportStepper } from "../components/import/import-stepper";
import { ImportUploadZone } from "../components/import/import-upload-zone";
import { ImportPreviewTable } from "../components/import/import-preview-table";
import { ImportValidationSummary } from "../components/import/import-validation-summary";
import { ImportConfirmPanel } from "../components/import/import-confirm-panel";
import { ImportResultPanel } from "../components/import/import-result-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

export function GlobalImportPage() {
  const { topics, isLoading: isTopicsLoading } = useTopics();
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const { validateFile, isValidating, validationData, commitImport, isCommitting } = useImportVocabulary(selectedTopicId);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handleFileSelected = async (file: File) => {
    if (!selectedTopicId) {
      alert("Vui lòng chọn một chủ đề trước khi tải file.");
      return;
    }
    try {
      await validateFile(file);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationData) return;
    try {
      await commitImport(validationData.id);
      setStep(3);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinish = () => {
    window.location.href = VOCABULARY_ROUTES.TOPIC_WORDS(selectedTopicId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary mb-2">
          <Link href={VOCABULARY_ROUTES.DASHBOARD} className="hover:text-primary">
            Quản trị Từ vựng
          </Link>
          <span className="material-symbols-outlined text-[10px]">arrow_forward_ios</span>
          <span>Nhập dữ liệu Excel/CSV</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Nhập từ vựng toàn cục
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Chọn chủ đề từ vựng và nhập dữ liệu hàng loạt từ file Excel/CSV.
        </p>
      </div>

      <ImportStepper currentStep={step} />

      {step === 1 && (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Cấu hình nhập dữ liệu</CardTitle>
            <CardDescription>Chọn chủ đề đích và tải tệp tin chứa danh sách từ vựng lên.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select
              label="Chọn chủ đề từ vựng cần nhập dữ liệu *"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              disabled={isTopicsLoading}
            >
              <option value="">-- Vui lòng chọn một chủ đề --</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.wordCount} từ)
                </option>
              ))}
            </Select>

            {selectedTopicId && (
              <ImportUploadZone onFileSelected={handleFileSelected} isLoading={isValidating} />
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && validationData && (
        <div className="space-y-6">
          <ImportValidationSummary
            total={validationData.totalRows}
            valid={validationData.validRows}
            invalid={validationData.invalidRows}
          />

          <Card>
            <CardHeader>
              <CardTitle>Xem trước dữ liệu tải lên</CardTitle>
              <CardDescription>Xác thực tính hợp lệ của thông tin trước khi lưu.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t border-border/40">
              <ImportPreviewTable rows={validationData.rows} />
            </CardContent>
          </Card>

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
export default GlobalImportPage;
