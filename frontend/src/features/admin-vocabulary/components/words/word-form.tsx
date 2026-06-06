import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { wordFormSchema, type WordFormValues } from "../../schemas/word.schema";
import { PART_OF_SPEECH_OPTIONS } from "../../constants/part-of-speech-options";
import { WordMediaUpload } from "./word-media-upload";
import { WordRelatedTags } from "./word-related-tags";

interface WordFormProps {
  initialValues?: Partial<WordFormValues>;
  onSubmit: (values: WordFormValues) => void;
  isLoading?: boolean;
}

export function WordForm({ initialValues, onSubmit, isLoading = false }: WordFormProps) {
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || "");
  const [audioUrl, setAudioUrl] = useState(initialValues?.audioUrl || "");
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WordFormValues>({
    resolver: zodResolver(wordFormSchema),
    defaultValues: {
      word: initialValues?.word || "",
      phonetic: initialValues?.phonetic || "",
      meaning: initialValues?.meaning || "",
      example: initialValues?.example || "",
      partOfSpeech: initialValues?.partOfSpeech || "noun",
      status: initialValues?.status || "DRAFT",
      imageUrl: initialValues?.imageUrl || "",
      audioUrl: initialValues?.audioUrl || "",
      tags: initialValues?.tags || [],
    },
  });

  const handleFormSubmit = (data: WordFormValues) => {
    onSubmit({
      ...data,
      imageUrl,
      audioUrl,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Từ vựng *"
          placeholder="Ví dụ: climate, biodiversity..."
          error={errors.word?.message}
          {...register("word")}
        />

        <Input
          label="Phiên âm (Phonetic)"
          placeholder="Ví dụ: /ˈklaɪ.mət/"
          error={errors.phonetic?.message}
          {...register("phonetic")}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Nghĩa tiếng Việt *"
          placeholder="Ví dụ: khí hậu, đa dạng sinh học..."
          error={errors.meaning?.message}
          {...register("meaning")}
        />

        <Select
          label="Từ loại *"
          error={errors.partOfSpeech?.message}
          {...register("partOfSpeech")}
        >
          {PART_OF_SPEECH_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-sm font-semibold text-text-primary">Ví dụ minh họa (Ví dụ tiếng Anh)</span>
        <textarea
          rows={3}
          placeholder="Ví dụ: The climate is changing rapidly."
          className="input-glass rounded-xl px-4 py-2 text-sm font-medium text-text-primary placeholder:text-text-secondary/50 focus:outline-none w-full leading-relaxed"
          {...register("example")}
        />
        {errors.example && (
          <span className="text-xs text-error font-medium">
            {errors.example.message}
          </span>
        )}
      </div>

      {/* Media Uploader */}
      <WordMediaUpload
        initialImageUrl={imageUrl}
        initialAudioUrl={audioUrl}
        onImageChange={(url) => {
          setImageUrl(url);
          setValue("imageUrl", url);
        }}
        onAudioChange={(url) => {
          setAudioUrl(url);
          setValue("audioUrl", url);
        }}
      />

      {/* Tags manager */}
      <WordRelatedTags
        tags={tags}
        onChange={(newTags) => {
          setTags(newTags);
          setValue("tags", newTags);
        }}
      />

      <Select
        label="Trạng thái xuất bản từ"
        error={errors.status?.message}
        {...register("status")}
      >
        <option value="DRAFT">Bản nháp (Draft)</option>
        <option value="PUBLISHED">Đã xuất bản (Published)</option>
        <option value="ARCHIVED">Lưu trữ (Archived - Không xóa cứng)</option>
      </Select>

      <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
        <Button variant="secondary" type="button" onClick={() => window.history.back()}>
          Hủy bỏ
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Lưu từ vựng"}
        </Button>
      </div>
    </form>
  );
}
export default WordForm;
