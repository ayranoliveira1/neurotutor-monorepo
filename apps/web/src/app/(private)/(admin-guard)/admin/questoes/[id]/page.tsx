import { Suspense } from 'react'
import type { Metadata } from 'next'
import { QuestionDetailPageContent } from '@/components/admin/questoes/question-detail-page-content'

export const metadata: Metadata = {
  title: 'Detalhes da Questão | Admin | NeuroTutor',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminQuestionDetailPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        }
      >
        <QuestionDetailPageContent questionId={id} />
      </Suspense>
    </div>
  )
}
