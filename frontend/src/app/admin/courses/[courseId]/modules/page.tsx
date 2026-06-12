"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Edit2, Trash2, Plus, ArrowLeft } from "lucide-react";
import {
  AdminButton,
  AdminInput,
  AdminPageTitle,
  AdminSelect,
  AdminTextarea,
  InlineMessage,
  ConfirmPanel,
} from "@/features/admin/components/admin-ui";
import { api, isApiError } from "@/lib/api";
import type { Course, CourseModule, ModuleType } from "@/types";

const moduleTypes: ModuleType[] = [
  "GRAMMAR",
  "VOCABULARY",
  "LISTENING",
  "READING",
  "WRITING",
  "SPEAKING",
  "MOCK_TESTS",
];

const moduleTypeLabels: Record<ModuleType, string> = {
  GRAMMAR: "Ngữ pháp (GRAMMAR)",
  VOCABULARY: "Từ vựng (VOCABULARY)",
  LISTENING: "Nghe (LISTENING)",
  READING: "Đọc (READING)",
  WRITING: "Viết (WRITING)",
  SPEAKING: "Nói (SPEAKING)",
  MOCK_TESTS: "Thi thử (MOCK_TESTS)",
};

const defaultIcons: Record<ModuleType, string> = {
  GRAMMAR: "book-open",
  VOCABULARY: "text",
  LISTENING: "headphones",
  READING: "book",
  WRITING: "pen-tool",
  SPEAKING: "mic",
  MOCK_TESTS: "clipboard-check",
};

interface FormState {
  title: string;
  slug: string;
  description: string;
  type: ModuleType;
  icon: string;
  isPublished: boolean;
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  type: "GRAMMAR",
  icon: "book-open",
  isPublished: true,
};

export default function AdminCourseModulesPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Form State
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load course details and modules
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [courseData, modulesData] = await Promise.all([
        api.getAdminCourse(courseId),
        api.getAdminCourseModules(courseId),
      ]);
      setCourse(courseData);
      setModules(modulesData);
    } catch (err) {
      setError(isApiError(err) ? err.message : "Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      void loadData();
    }
  }, [courseId]);

  // Slug auto-generation helper
  const slugify = (text: string) => {
    return text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setForm((current) => ({
      ...current,
      title: val,
      slug: editingId ? current.slug : slugify(val),
    }));
  };

  const handleTypeChange = (typeVal: ModuleType) => {
    setForm((current) => ({
      ...current,
      type: typeVal,
      icon: defaultIcons[typeVal] || current.icon,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Tiêu đề không được để trống.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug không được để trống.");
      return;
    }

    setError("");
    setToast("");
    setIsSaving(true);

    try {
      if (editingId) {
        // Update Module
        const updated = await api.updateModule(courseId, editingId, {
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          type: form.type,
          icon: form.icon.trim(),
          isPublished: form.isPublished,
        });
        setModules((curr) => curr.map((m) => (m.id === editingId ? updated : m)));
        setToast("Cập nhật Module thành công.");
      } else {
        // Create Module
        const created = await api.createModule(courseId, {
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          type: form.type,
          icon: form.icon.trim(),
          isPublished: form.isPublished,
        });
        setModules((curr) => [...curr, created]);
        setToast("Thêm Module mới thành công.");
      }

      // Reset form
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(isApiError(err) ? err.message : "Lỗi khi lưu Module.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (moduleItem: CourseModule) => {
    setError("");
    setToast("");
    setEditingId(moduleItem.id);
    setForm({
      title: moduleItem.title,
      slug: moduleItem.slug,
      description: moduleItem.description ?? "",
      type: moduleItem.type,
      icon: moduleItem.icon ?? "book-open",
      isPublished: moduleItem.isPublished,
    });
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsSaving(true);
    setError("");
    setToast("");
    try {
      await api.deleteModule(courseId, deletingId);
      setModules((curr) => curr.filter((m) => m.id !== deletingId));
      setToast("Xóa Module thành công.");
      setDeletingId(null);
      if (editingId === deletingId) {
        handleCancelEdit();
      }
    } catch (err) {
      setError(isApiError(err) ? err.message : "Lỗi khi xóa Module.");
    } finally {
      setIsSaving(false);
    }
  };

  // Move Module Up / Down and Save
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    setError("");
    setToast("");

    const newModules = [...modules];
    const temp = newModules[index];
    newModules[index] = newModules[targetIndex];
    newModules[targetIndex] = temp;

    // optimistic update
    setModules(newModules);

    try {
      const ids = newModules.map((m) => m.id);
      await api.reorderModules(courseId, ids);
      setToast("Sắp xếp thứ tự Module thành công.");
    } catch (err) {
      setError(isApiError(err) ? err.message : "Không thể cập nhật thứ tự.");
      // Rollback on error
      await loadData();
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <Link
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition mb-6"
        href={`/admin/courses/${courseId}/edit`}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại chỉnh sửa khóa học
      </Link>

      <AdminPageTitle
        title={`Quản lý Modules - ${course?.title || "Đang tải..."}`}
        description="Thêm, sửa, xóa hoặc sắp xếp lộ trình các module học tập của khóa học."
      />

      {error ? <InlineMessage message={error} tone="error" /> : null}
      {toast ? <InlineMessage message={toast} tone="success" /> : null}

      {deletingId ? (
        <div className="mb-6">
          <ConfirmPanel
            message="Bạn có chắc chắn muốn xóa module này? Tất cả học viên sẽ không thể xem nội dung này nữa."
            onConfirm={handleDelete}
            onCancel={() => setDeletingId(null)}
            pending={isSaving}
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="text-center py-12 text-sm text-text-secondary font-medium">
          Đang tải dữ liệu modules...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          {/* Module List Panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel rounded-2xl overflow-hidden border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th className="px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase">Thứ tự</th>
                    <th className="px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase">Module</th>
                    <th className="px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase">Kiểu / Slug</th>
                    <th className="px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase">Trạng thái</th>
                    <th className="px-5 py-3.5 font-semibold text-text-secondary text-xs uppercase text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {modules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-text-secondary font-medium">
                        Chưa có module nào. Hãy thêm module đầu tiên ở khung bên phải.
                      </td>
                    </tr>
                  ) : (
                    modules.map((moduleItem, index) => (
                      <tr key={moduleItem.id} className="hover:bg-surface-strong/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-text-primary text-center w-12">{index + 1}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-text-primary">{moduleItem.title}</p>
                          <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{moduleItem.description || "Không có mô tả."}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {moduleItem.type}
                          </span>
                          <p className="text-xs font-semibold text-text-secondary mt-1">/{moduleItem.slug}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                              moduleItem.isPublished
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-warning/10 text-warning border-warning/20"
                            }`}
                          >
                            {moduleItem.isPublished ? "Đã bật" : "Đang ẩn"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reorder actions */}
                            <button
                              disabled={index === 0}
                              onClick={() => void handleMove(index, "up")}
                              className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Di chuyển lên"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              disabled={index === modules.length - 1}
                              onClick={() => void handleMove(index, "down")}
                              className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>

                            {/* Edit/Delete actions */}
                            <button
                              onClick={() => handleStartEdit(moduleItem)}
                              className="p-1.5 rounded hover:bg-primary/10 border border-transparent hover:border-primary/20 text-primary"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(moduleItem.id)}
                              className="p-1.5 rounded hover:bg-red-50 border border-transparent hover:border-red-100 text-error"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Create/Edit Panel */}
          <div className="lg:col-span-5">
            <div className="glass-panel border border-border rounded-2xl p-6 space-y-4 bg-white/70">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-1.5 border-b border-border pb-3">
                <Plus className="h-5 w-5 text-primary" />
                {editingId ? "Cập nhật Module" : "Thêm Module mới"}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <AdminInput
                  label="Tiêu đề Module"
                  placeholder="Ví dụ: Luyện nghe cơ bản"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />

                <AdminInput
                  label="Slug"
                  placeholder="Ví dụ: listening-basic"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  required
                />

                <AdminSelect
                  label="Loại Module (Type)"
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value as ModuleType)}
                >
                  {moduleTypes.map((type) => (
                    <option key={type} value={type}>
                      {moduleTypeLabels[type]}
                    </option>
                  ))}
                </AdminSelect>

                <AdminInput
                  label="Icon (Lucide)"
                  placeholder="Ví dụ: headphones, book-open, mic..."
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />

                <AdminSelect
                  label="Trạng thái hiển thị"
                  value={form.isPublished ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.value === "true" })}
                >
                  <option value="true">Hiển thị cho học viên (Published)</option>
                  <option value="false">Ẩn (Draft)</option>
                </AdminSelect>

                <AdminTextarea
                  label="Mô tả Module"
                  placeholder="Nhập mô tả ngắn về mục tiêu học tập của module này..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div className="flex gap-2.5 pt-2">
                  <AdminButton disabled={isSaving} type="submit" className="flex-1">
                    {editingId ? "Cập nhật" : "Tạo Module"}
                  </AdminButton>
                  {editingId ? (
                    <AdminButton
                      disabled={isSaving}
                      onClick={handleCancelEdit}
                      tone="ghost"
                      type="button"
                    >
                      Hủy chỉnh sửa
                    </AdminButton>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
