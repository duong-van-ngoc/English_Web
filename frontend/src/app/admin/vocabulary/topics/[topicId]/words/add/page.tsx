import { AddWordPage } from "@/features/admin-vocabulary/pages/add-word-page";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function AdminAddWordRoute({ params }: PageProps) {
  return <AddWordPage params={params} />;
}
