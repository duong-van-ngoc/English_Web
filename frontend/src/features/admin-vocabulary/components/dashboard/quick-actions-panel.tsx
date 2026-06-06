import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VOCABULARY_ROUTES } from "../../constants/vocabulary-routes";

export function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
        <CardDescription>Các công cụ thường dùng để cập nhật tài liệu.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Link href={VOCABULARY_ROUTES.ADD_TOPIC} passHref legacyBehavior>
          <Button variant="primary" className="w-full justify-start gap-2">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Thêm chủ đề mới
          </Button>
        </Link>
        
        <Link href={VOCABULARY_ROUTES.GLOBAL_IMPORT} passHref legacyBehavior>
          <Button variant="secondary" className="w-full justify-start gap-2">
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Nhập dữ liệu Excel/CSV
          </Button>
        </Link>

        <Link href={VOCABULARY_ROUTES.MEDIA} passHref legacyBehavior>
          <Button variant="ghost" className="w-full justify-start gap-2 border border-border">
            <span className="material-symbols-outlined text-lg">photo_library</span>
            Thư viện Ảnh & Âm thanh
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
export default QuickActionsPanel;
