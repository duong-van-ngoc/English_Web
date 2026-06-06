import { TopicDetailPage } from "@/features/admin-vocabulary/pages/topic-detail-page";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function AdminTopicDetailRoute({ params }: PageProps) {
  return <TopicDetailPage params={params} />;
}
