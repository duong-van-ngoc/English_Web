"use client";

import React from "react";
import { useVocabularyDashboard } from "../hooks/use-vocabulary-dashboard";
import { VocabularyStatsCards } from "../components/dashboard/vocabulary-stats-cards";
import { ContentInsightsPanel } from "../components/dashboard/content-insights-panel";
import { RecentlyUpdatedTopics } from "../components/dashboard/recently-updated-topics";
import { QuickActionsPanel } from "../components/dashboard/quick-actions-panel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function VocabularyDashboardPage() {
  const { dashboardData, isLoading } = useVocabularyDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-semibold text-text-secondary">Đang tải dữ liệu dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Quản trị Từ vựng
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Tổng quan nội dung học tập, theo dõi sức khỏe nội dung và các chủ đề từ vựng.
          </p>
        </div>
      </div>

      {/* Stats Cards Bento Grid */}
      <VocabularyStatsCards stats={dashboardData?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vocabulary Growth SVG Line Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle>Biểu đồ tăng trưởng từ vựng</CardTitle>
                <CardDescription>Số lượng từ được tạo và bổ sung trong 30 ngày qua.</CardDescription>
              </div>
              <Select value="30" onChange={() => {}} className="w-40 min-h-9 py-1 px-3">
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
              </Select>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] relative flex items-end gap-2 pb-6 px-4">
              <svg className="absolute inset-0 w-full h-full p-6" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,70 100,75 T200,40 T300,50 T400,20 L400,100 L0,100 Z" fill="url(#chartGradient)" />
                <path d="M0,80 Q50,70 100,75 T200,40 T300,50 T400,20" fill="none" stroke="#0891b2" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div className="absolute bottom-0 left-6 right-6 flex justify-between text-[10px] text-text-secondary/60 uppercase font-bold tracking-widest">
                <span>Tuần 1</span>
                <span>Tuần 2</span>
                <span>Tuần 3</span>
                <span>Tuần 4</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Health */}
        <ContentInsightsPanel alerts={dashboardData?.healthAlerts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Updated */}
        <div className="lg:col-span-2">
          <RecentlyUpdatedTopics topics={dashboardData?.recentTopics} />
        </div>

        {/* Quick Actions */}
        <QuickActionsPanel />
      </div>
    </div>
  );
}
export default VocabularyDashboardPage;
