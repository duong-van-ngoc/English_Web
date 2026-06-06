import { TopicWordsManagementPage } from "@/features/admin-vocabulary/pages/topic-words-management-page";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function AdminTopicWordsRoute({ params }: PageProps) {
  return <TopicWordsManagementPage params={params} />;
}
