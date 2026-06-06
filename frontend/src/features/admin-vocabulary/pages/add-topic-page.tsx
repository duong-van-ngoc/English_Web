"use client";

import React from "react";
import { useTopics } from "../hooks/use-topics";
import { TopicForm } from "../components/topics/topic-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ModuleInfoBanner } from "../components/shared/module-info-banner";

export function AddTopicPage() {
  const { createTopic, isCreating } = useTopics();

  const handleFormSubmit = async (values: any) => {
    try {
      await createTopic(values);
      window.location.href = "/admin/vocabulary/topics";
    } catch (err) {
      console.error("Failed to create topic:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Tạo chủ đề từ vựng
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Tạo bộ sưu tập từ vựng mới cho học viên.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form component */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chủ đề</CardTitle>
              <CardDescription>Điền đầy đủ thông tin bên dưới để cấu hình chủ đề học tập.</CardDescription>
            </CardHeader>
            <CardContent>
              <TopicForm onSubmit={handleFormSubmit} isLoading={isCreating} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar help guidelines */}
        <div className="space-y-6">
          <ModuleInfoBanner
            title="Quy tắc thiết lập chủ đề"
            description="Chủ đề ban đầu được khởi tạo dưới trạng thái DRAFT (Nháp). Bạn chỉ nên chuyển sang trạng thái PUBLISHED (Đã đăng) sau khi đã thêm đủ từ vựng và tài nguyên đa phương tiện cần thiết."
          />

          <Card className="bg-white/40 border border-border/80 p-5 rounded-2xl text-xs text-text-secondary leading-relaxed">
            <h4 className="font-bold text-text-primary mb-2">Ảnh minh họa chuẩn</h4>
            <p>
              Nên dùng link ảnh Unsplash hoặc các nguồn ảnh chất lượng cao để hiển thị đẹp mắt nhất trên app của học viên. Tỉ lệ ảnh khuyên dùng là 16:9 hoặc 4:3.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default AddTopicPage;
