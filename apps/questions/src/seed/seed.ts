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
  disciplina: string
  categorias: string[]
  respostaCorreta: number
}

async function main() {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  const jsonPath = resolve(__dirname, '../../data/bancoQuestoesCompleto.json')
  const raw: RawQuestion[] = JSON.parse(readFileSync(jsonPath, 'utf8'))

  console.log(`Importando ${raw.length} questões...`)

  const data = raw.map((q) => ({
    externalId: q.questaoId,
    statement: q.enunciado,
    imageUrl: q.imagem || null,
    alternatives: q.alternativas,
    origin: q.origem,
    subject: q.disciplina,
    categories: q.categorias,
    correctAnswer: q.respostaCorreta,
  }))

  const result = await prisma.question.createMany({
    data,
    skipDuplicates: true,
  })

  console.log(`${result.count} questões importadas com sucesso.`)

  await prisma.$disconnect()
  await pool.end()
}

main().catch((e) => {
  console.error('Erro ao importar questões:', e)
  process.exit(1)
})
