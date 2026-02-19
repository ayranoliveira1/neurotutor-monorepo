import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { resolve } from 'path'

interface RawQuestion {
  questaoId: string
  enunciado: string
  imagem: string | null
  alternativas: string[]
  origem: string
  ano: number
  dificuldade: string
  dificuldadeNivel: number
  disciplina: string
  categorias: string[]
  respostaCorreta: number
}

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

function mapDifficulty(nivel: number, texto: string): Difficulty {
  if (nivel === 1 || texto === 'Médio') return 'MEDIUM'
  if (nivel === 2 || texto === 'Difícil') return 'HARD'
  return 'EASY'
}

function mapQuestion(q: RawQuestion) {
  return {
    externalId: q.questaoId,
    statement: q.enunciado,
    imageUrl: q.imagem || null,
    alternatives: q.alternativas,
    origin: q.origem,
    subject: q.disciplina,
    categories: q.categorias,
    correctAnswer: q.respostaCorreta,
    year: q.ano,
    difficulty: mapDifficulty(q.dificuldadeNivel, q.dificuldade),
  }
}

async function main() {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const jsonPath = resolve(__dirname, '../../data/bancoQuestoesCompleto.json')
  const raw: RawQuestion[] = JSON.parse(readFileSync(jsonPath, 'utf8'))

  console.log(`Processando ${raw.length} questões...\n`)

  let created = 0
  let updated = 0
  let unchanged = 0

  for (const q of raw) {
    const mapped = mapQuestion(q)

    const existing = await prisma.question.findUnique({
      where: { externalId: mapped.externalId },
    })

    if (!existing) {
      await prisma.question.create({ data: mapped })
      created++
      continue
    }

    const hasChanges =
      existing.statement !== mapped.statement ||
      existing.imageUrl !== mapped.imageUrl ||
      JSON.stringify(existing.alternatives) !==
        JSON.stringify(mapped.alternatives) ||
      existing.origin !== mapped.origin ||
      existing.subject !== mapped.subject ||
      JSON.stringify(existing.categories) !==
        JSON.stringify(mapped.categories) ||
      existing.correctAnswer !== mapped.correctAnswer ||
      existing.year !== mapped.year ||
      existing.difficulty !== mapped.difficulty

    if (hasChanges) {
      await prisma.question.update({
        where: { externalId: mapped.externalId },
        data: mapped,
      })
      updated++
    } else {
      unchanged++
    }
  }

  console.log('Importação concluída:')
  console.log(`  - ${created} questões novas`)
  console.log(`  - ${updated} questões atualizadas`)
  console.log(`  - ${unchanged} questões sem alteração`)
  console.log(`  Total: ${raw.length} questões processadas`)

  await prisma.$disconnect()
  await pool.end()
}

main().catch((e) => {
  console.error('Erro ao importar questões:', e)
  process.exit(1)
})
