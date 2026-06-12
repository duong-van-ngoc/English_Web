import React from "react";
import { StatusBadge } from "../shared/status-badge";
import type { WordStatus } from "../../types/vocabulary-word.type";

export function WordStatusBadge({ status }: { status: WordStatus }) {
  return <StatusBadge status={status} />;
}
export default WordStatusBadge;
