import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VOCABULARY_ROUTES } from "../../constants/vocabulary-routes";
import type { ContentHealthAlert } from "../../types/vocabulary-dashboard.type";

interface ContentInsightsPanelProps {
  alerts?: ContentHealthAlert[];
}

export function ContentInsightsPanel({ alerts }: ContentInsightsPanelProps) {
  const defaultAlerts: ContentHealthAlert[] = alerts || [
    {
      topicId: "business-travel",
      topicName: "Business Travel",
      type: "image",
      missingCount: 12,
    },
    {
      topicId: "culinary-arts",
      topicName: "Culinary Arts",
      type: "audio",
      missingCount: 8,
    },
    {
      topicId: "global-politics",
      topicName: "Global Politics",
      type: "translation",
      missingCount: 4,
    },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "image":
        return {
          icon: "image_not_supported",
          color: "text-error bg-error/10 border-error/20",
          desc: "ảnh bị thiếu",
        };
      case "audio":
        return {
          icon: "volume_off",
          color: "text-accent bg-accent/10 border-accent/20",
          desc: "file âm thanh bị thiếu",
        };
      default:
        return {
          icon: "translate",
          color: "text-primary bg-primary/10 border-primary/20",
          desc: "bản dịch đang chờ",
        };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <span className="material-symbols-outlined text-error">health_and_safety</span>
        <div>
          <CardTitle>Sức khỏe nội dung</CardTitle>
          <CardDescription>Cần bổ sung các tài nguyên đa phương tiện bị thiếu.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {defaultAlerts.map((alert, idx) => {
          const config = renderIcon(alert.type);
          return (
            <div
              key={idx}
              className="p-4 bg-surface/30 border border-border/60 rounded-xl flex items-center gap-4 hover:bg-surface-strong/40 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                <span className="material-symbols-outlined">{config.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-primary leading-tight">
                  {alert.topicName}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {alert.missingCount} {config.desc}
                </p>
              </div>
              <Link href={VOCABULARY_ROUTES.TOPIC_DETAIL(alert.topicId)} passHref legacyBehavior>
                <Button variant="ghost" size="sm" className="p-1 rounded-full text-text-secondary hover:text-primary">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
              </Link>
            </div>
          );
        })}
        <Button variant="ghost" className="w-full text-xs font-bold border border-border mt-2">
          Xem Báo cáo Sức khỏe Chi tiết
        </Button>
      </CardContent>
    </Card>
  );
}
export default ContentInsightsPanel;
