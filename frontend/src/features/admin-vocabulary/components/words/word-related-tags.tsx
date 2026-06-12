import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WordRelatedTagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function WordRelatedTags({ tags, onChange }: WordRelatedTagsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      onChange(updated);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-semibold text-text-primary">Thẻ liên quan (Tags)</span>
      <div className="flex gap-2">
        <Input
          placeholder="Nhập tên tag và nhấn Enter hoặc nút Thêm..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="secondary" onClick={handleAddTag} className="h-11" type="button">
          Thêm
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/20"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-text-secondary hover:text-error text-xs flex items-center justify-center font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
export default WordRelatedTags;
