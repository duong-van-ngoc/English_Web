import React from "react";
import { ActionDropdown } from "../shared/action-dropdown";

interface WordActionMenuProps {
  onPublish: () => void;
  onArchive: () => void;
  onEdit: () => void;
  onPreview: () => void;
}

export function WordActionMenu({ onPublish, onArchive, onEdit, onPreview }: WordActionMenuProps) {
  return (
    <ActionDropdown
      items={[
        { label: "Xem trước Flashcard", icon: "visibility", onClick: onPreview },
        { label: "Chỉnh sửa từ vựng", icon: "edit", onClick: onEdit },
        { label: "Xuất bản công khai", icon: "publish", onClick: onPublish },
        { label: "Lưu trữ nội dung", icon: "archive", variant: "danger", onClick: onArchive },
      ]}
    />
  );
}
export default WordActionMenu;
