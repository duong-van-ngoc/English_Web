import React from "react";
import { AdminStatCard } from "../shared/admin-stat-card";
import type { VocabularyStats } from "../../types/vocabulary-dashboard.type";

interface VocabularyStatsCardsProps {
  stats?: VocabularyStats;
}

export function VocabularyStatsCards({ stats }: VocabularyStatsCardsProps) {
  const data = stats || {
    totalTopics: 15,
    totalWords: 1240,
    draftWords: 186,
    needsAttentionCount: 42,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AdminStatCard
        title="Tổng số chủ đề"
        value={data.totalTopics}
        icon="layers"
        changeText="+2 tuần này"
        trend="up"
        color="primary"
      />
      <AdminStatCard
        title="Tổng số từ vựng"
        value={data.totalWords.toLocaleString()}
        icon="abc"
        changeText="85% Đã đăng"
        trend="neutral"
        color="secondary"
      />
      <AdminStatCard
        title="Từ vựng nháp"
        value={`${data.draftWords} từ`}
        icon="edit_note"
        changeText="12 Bản nháp hoạt động"
        trend="neutral"
        color="tertiary"
      />
      <AdminStatCard
        title="Cần chú ý"
        value={data.needsAttentionCount}
        icon="warning"
        changeText="Mức ưu tiên"
        trend="down"
        color="error"
      />
    </div>
  );
}
export default VocabularyStatsCards;
