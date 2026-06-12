import React from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatusBadge } from "../shared/status-badge";
import { VOCABULARY_ROUTES } from "../../constants/vocabulary-routes";
import type { RecentlyUpdatedTopicSummary } from "../../types/vocabulary-dashboard.type";

interface RecentlyUpdatedTopicsProps {
  topics?: RecentlyUpdatedTopicSummary[];
}

export function RecentlyUpdatedTopics({ topics }: RecentlyUpdatedTopicsProps) {
  const list = topics || [
    {
      id: "space-exploration",
      name: "Space Exploration",
      wordCount: 84,
      status: "PUBLISHED" as const,
      updatedAt: "2 giờ trước",
    },
    {
      id: "genetic-engineering",
      name: "Genetic Engineering",
      wordCount: 112,
      status: "DRAFT" as const,
      updatedAt: "5 giờ trước",
    },
    {
      id: "urban-planning",
      name: "Urban Planning",
      wordCount: 67,
      status: "PUBLISHED" as const,
      updatedAt: "Hôm qua",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
        <div>
          <CardTitle>Chủ đề mới cập nhật</CardTitle>
          <CardDescription>Các hoạt động chỉnh sửa nội dung gần đây của bạn.</CardDescription>
        </div>
        <Link href={VOCABULARY_ROUTES.TOPICS_LIST} passHref legacyBehavior>
          <Button variant="link" size="sm" className="flex items-center gap-1">
            Xem tất cả
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Tên chủ đề</TableHead>
              <TableHead className="whitespace-nowrap">Số lượng từ</TableHead>
              <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
              <TableHead className="whitespace-nowrap">Cập nhật lần cuối</TableHead>
              <TableHead className="text-right whitespace-nowrap">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((topic) => (
              <TableRow key={topic.id}>
                <TableCell className="font-bold whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary/30 flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined text-sm">rocket_launch</span>
                    </div>
                    <span>{topic.name}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">{topic.wordCount} từ</TableCell>
                <TableCell className="whitespace-nowrap">
                  <StatusBadge status={topic.status} />
                </TableCell>
                <TableCell className="text-text-secondary/80 text-xs whitespace-nowrap">{topic.updatedAt}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Link href={VOCABULARY_ROUTES.TOPIC_DETAIL(topic.id)} passHref legacyBehavior>
                    <Button variant="ghost" size="sm" className="whitespace-nowrap">
                      Quản lý
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
export default RecentlyUpdatedTopics;
