import { PreviewFlashcardPage } from "@/features/admin-vocabulary/pages/preview-flashcard-page";

interface PageProps {
  params: Promise<{ topicId: string; wordId: string }>;
}

export default function AdminPreviewWordRoute({ params }: PageProps) {
  return <PreviewFlashcardPage params={params} />;
}
