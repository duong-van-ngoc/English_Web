import React from "react";
import { Badge } from "@/components/ui/badge";
import { TOPIC_STATUS_LABELS, WORD_STATUS_LABELS } from "../../constants/vocabulary-status";

interface StatusBadgeProps {
  status: "DRAFT" | "PUBLISHED" | "LOCKED" | "ARCHIVED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case "PUBLISHED":
        return {
          variant: "success" as const,
          label: TOPIC_STATUS_LABELS.PUBLISHED,
        };
      case "DRAFT":
        return {
          variant: "info" as const,
          label: TOPIC_STATUS_LABELS.DRAFT,
        };
      case "LOCKED":
        return {
          variant: "danger" as const,
          label: TOPIC_STATUS_LABELS.LOCKED,
        };
      case "ARCHIVED":
        return {
          variant: "warning" as const,
          label: WORD_STATUS_LABELS.ARCHIVED,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
export default StatusBadge;
