import { ImportVocabularyPage } from "@/features/admin-vocabulary/pages/import-vocabulary-page";

interface PageProps {
  params: Promise<{ topicId: string }>;
}

export default function AdminImportVocabularyRoute({ params }: PageProps) {
  return <ImportVocabularyPage params={params} />;
}
