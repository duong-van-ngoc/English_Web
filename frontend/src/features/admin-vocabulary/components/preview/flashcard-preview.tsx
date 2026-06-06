import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface FlashcardPreviewProps {
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export function FlashcardPreview({
  word,
  phonetic,
  meaning,
  example,
  imageUrl,
  audioUrl,
}: FlashcardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-6">
      {/* 3D Flashcard container */}
      <div
        className="w-full h-80 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="relative w-full h-full duration-500 transition-transform transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Card Front */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-[#cffafe] bg-white/70 backdrop-blur-md shadow-lg flex flex-col items-center justify-center p-6 text-center select-none"
            style={{ backfaceVisibility: "hidden" }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={word}
                className="w-24 h-24 rounded-2xl object-cover mb-4 border border-border/50"
              />
            )}
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
              {word}
            </h2>
            {phonetic && (
              <p className="text-sm font-semibold text-primary mt-1 font-mono tracking-wide">
                {phonetic}
              </p>
            )}
            {audioUrl && (
              <button
                onClick={playAudio}
                className="mt-4 w-10 h-10 rounded-full primary-gradient-btn text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                title="Nghe phát âm"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </button>
            )}
            <p className="absolute bottom-4 text-[10px] text-text-secondary/50 uppercase font-bold tracking-widest">
              Nhấp để xem nghĩa
            </p>
          </div>

          {/* Card Back */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-[#cffafe] bg-white/80 backdrop-blur-md shadow-lg flex flex-col items-center justify-center p-6 text-center select-none"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xs uppercase font-extrabold tracking-widest text-primary mb-2">
              Nghĩa tiếng Việt
            </p>
            <h3 className="text-xl font-bold text-text-primary mb-4 leading-normal">
              {meaning}
            </h3>

            {example && (
              <div className="w-full p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
                <p className="text-[10px] uppercase font-bold text-text-secondary/50 tracking-wider mb-1">
                  Ví dụ minh họa
                </p>
                <p className="text-xs text-text-secondary leading-relaxed italic">
                  "{example}"
                </p>
              </div>
            )}
            <p className="absolute bottom-4 text-[10px] text-text-secondary/50 uppercase font-bold tracking-widest">
              Nhấp để lật lại
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FlashcardPreview;
