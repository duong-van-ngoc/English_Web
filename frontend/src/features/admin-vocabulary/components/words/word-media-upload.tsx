import React, { useState } from "react";
import { Upload } from "@/components/ui/upload";
import { Button } from "@/components/ui/button";

interface WordMediaUploadProps {
  onImageChange: (url: string) => void;
  onAudioChange: (url: string) => void;
  initialImageUrl?: string;
  initialAudioUrl?: string;
}

export function WordMediaUpload({
  onImageChange,
  onAudioChange,
  initialImageUrl = "",
  initialAudioUrl = "",
}: WordMediaUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl);

  const handleImageFile = (file: File | null) => {
    if (!file) return;
    // Mock upload service
    const mockUrl = `https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80`;
    setImageUrl(mockUrl);
    onImageChange(mockUrl);
  };

  const handleAudioFile = (file: File | null) => {
    if (!file) return;
    // Mock upload service
    const mockUrl = `/audio/mock-${Date.now()}.mp3`;
    setAudioUrl(mockUrl);
    onAudioChange(mockUrl);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 border border-border/40 rounded-2xl p-6 bg-surface/20">
      <div>
        <h4 className="text-sm font-bold text-text-primary mb-3">Ảnh minh họa từ vựng</h4>
        {imageUrl ? (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border mb-3 bg-black/5">
            <img src={imageUrl} alt="Word Preview" className="w-full h-full object-cover" />
            <Button
              variant="danger"
              size="sm"
              className="absolute top-2 right-2 p-1.5 rounded-full"
              onClick={() => {
                setImageUrl("");
                onImageChange("");
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </Button>
          </div>
        ) : (
          <Upload
            accept="image/*"
            onChange={handleImageFile}
            placeholder="Kéo thả hoặc nhấp để tải lên ảnh bìa"
          />
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-text-primary mb-3">Âm thanh phát âm (Audio)</h4>
        {audioUrl ? (
          <div className="flex flex-col gap-3 p-4 bg-surface rounded-xl border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary truncate max-w-[200px]">
                {audioUrl}
              </span>
              <Button
                variant="danger"
                size="sm"
                className="p-1 rounded-full"
                onClick={() => {
                  setAudioUrl("");
                  onAudioChange("");
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </Button>
            </div>
            <audio controls src={audioUrl} className="w-full h-8" />
          </div>
        ) : (
          <Upload
            accept="audio/*"
            onChange={handleAudioFile}
            placeholder="Kéo thả hoặc nhấp để tải lên file audio phát âm"
          />
        )}
      </div>
    </div>
  );
}
export default WordMediaUpload;
