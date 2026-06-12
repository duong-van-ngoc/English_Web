import { EditWordPage } from "@/features/admin-vocabulary/pages/edit-word-page";

interface PageProps {
  params: Promise<{ topicId: string; wordId: string }>;
}

export default function AdminEditWordRoute({ params }: PageProps) {
  return <EditWordPage params={params} />;
}
