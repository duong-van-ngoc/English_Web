"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "@/components/ui/upload";
import { VOCABULARY_ROUTES } from "../constants/vocabulary-routes";

export function MediaManagementPage() {
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150",
    "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=150",
    "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=150",
  ]);

  const handleUploadImage = (file: File | null) => {
    if (!file) return;
    const mockUrl = "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150";
    setImages((prev) => [mockUrl, ...prev]);
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
          <span>Thư viện đa phương tiện</span>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          Thư viện Ảnh & Âm thanh
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Quản lý các tài nguyên đa phương tiện dùng chung cho từ vựng và chủ đề.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload Zone */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tải tài nguyên mới</CardTitle>
              <CardDescription>Tải ảnh minh họa lên kho lưu trữ đám mây.</CardDescription>
            </CardHeader>
            <CardContent>
              <Upload
                accept="image/*"
                onChange={handleUploadImage}
                placeholder="Kéo thả hoặc nhấp để tải ảnh lên"
              />
            </CardContent>
          </Card>
        </div>

        {/* Gallery */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thư viện tài nguyên</CardTitle>
              <CardDescription>Các tài nguyên ảnh đã được tải lên trước đó.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-border/60 bg-black/5 hover:border-primary/50 transition-all duration-200">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-200">
                    <button
                      className="p-1.5 rounded-full bg-white text-text-primary hover:text-primary transition-colors flex items-center justify-center"
                      onClick={() => navigator.clipboard.writeText(img)}
                      title="Sao chép URL"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default MediaManagementPage;
