import React from "react";
import { StatusBadge } from "../shared/status-badge";
import type { TopicStatus } from "../../types/vocabulary-topic.type";

export function TopicStatusBadge({ status }: { status: TopicStatus }) {
  return <StatusBadge status={status} />;
}
export default TopicStatusBadge;
