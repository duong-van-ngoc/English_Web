import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { topicFormSchema, type TopicFormValues } from "../../schemas/topic.schema";
import { api } from "@/lib/api";
import type { CourseModule } from "@/types";

interface TopicFormProps {
  initialValues?: Partial<TopicFormValues>;
  onSubmit: (values: TopicFormValues) => void;
  isLoading?: boolean;
}

export function TopicForm({ initialValues, onSubmit, isLoading = false }: TopicFormProps) {
  const [modules, setModules] = useState<CourseModule[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      imageUrl: initialValues?.imageUrl || "",
      status: initialValues?.status || "DRAFT",
      moduleId: initialValues?.moduleId || "",
    },
  });

  useEffect(() => {
    async function loadModules() {
      try {
        const data = await api.getAdminCourseModules("on-thi-vstep-b1");
        // Filter modules to only show VOCABULARY type modules
        const vocabModules = data.filter((m) => m.type === "VOCABULARY");
        setModules(vocabModules);
        
        // Pre-select the first vocabulary module if creating new
        if (!initialValues?.moduleId && vocabModules.length > 0) {
          setValue("moduleId", vocabModules[0].id);
        }
      } catch (err) {
        console.error("Failed to load VSTEP modules for vocabulary topic form", err);
      }
    }
    void loadModules();
  }, [setValue, initialValues?.moduleId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Tên chủ đề từ vựng *"
        placeholder="Ví dụ: Environment, Business Travel..."
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-sm font-semibold text-text-primary">Mô tả chi tiết</span>
        <textarea
          rows={4}
          placeholder="Mô tả tóm tắt nội dung chủ đề..."
          className="input-glass rounded-xl px-4 py-2 text-sm font-medium text-text-primary placeholder:text-text-secondary/50 focus:outline-none w-full leading-relaxed"
          {...register("description")}
        />
        {errors.description && (
          <span className="text-xs text-error font-medium">
            {errors.description.message}
          </span>
        )}
      </div>

      <Input
        label="Đường dẫn ảnh bìa (Image URL)"
        placeholder="https://example.com/image.png"
        error={errors.imageUrl?.message}
        {...register("imageUrl")}
      />

      <Select
        label="Module trực thuộc (Không bắt buộc)"
        error={errors.moduleId?.message}
        {...register("moduleId")}
      >
        <option value="">Không thuộc Module nào (Mặc định)</option>
        {modules.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </Select>

      <Select
        label="Trạng thái xuất bản"
        error={errors.status?.message}
        {...register("status")}
      >
        <option value="DRAFT">Bản nháp (Draft)</option>
        <option value="PUBLISHED">Công khai (Published)</option>
        <option value="LOCKED">Khóa (Locked)</option>
      </Select>

      <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        <Button variant="secondary" type="button" onClick={() => window.history.back()}>
          Quay lại
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Lưu chủ đề"}
        </Button>
      </div>
    </form>
  );
}
export default TopicForm;
