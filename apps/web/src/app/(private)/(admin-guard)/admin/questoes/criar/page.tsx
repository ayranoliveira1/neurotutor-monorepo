import type { Metadata } from 'next'
import { CreateQuestionPageContent } from '@/components/admin/create-question-page-content'

export const metadata: Metadata = {
  title: 'Criar Questão | Admin | NeuroTutor',
}

export default function CreateQuestionPage() {
  return (
    <div className="space-y-6">
      <CreateQuestionPageContent />
    </div>
  )
}
