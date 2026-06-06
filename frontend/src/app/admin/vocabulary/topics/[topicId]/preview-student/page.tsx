import { PreviewStudentViewPage } from "@/features/admin-vocabulary/pages/preview-student-view-page";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function AdminPreviewStudentRoute({ params }: PageProps) {
  return <PreviewStudentViewPage params={params} />;
}
