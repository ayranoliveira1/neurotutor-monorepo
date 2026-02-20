import { QuestionsService } from './questions.service'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'

const mockPrisma = {
  question: {
    create: vi.fn(),
    createMany: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    groupBy: vi.fn(),
  },
  $queryRawUnsafe: vi.fn(),
}

describe('QuestionsService', () => {
  let service: QuestionsService

  beforeEach(() => {
    service = new QuestionsService(mockPrisma as any)
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('deve criar uma questão', async () => {
      const data = {
        externalId: '123',
        statement: 'Qual a resposta?',
        alternatives: ['A', 'B', 'C', 'D'],
        origin: 'ENEM 2025',
        subject: 'Matemática',
        categories: ['Álgebra'],
        correctAnswer: 0,
      }

      mockPrisma.question.create.mockResolvedValue({ id: 'uuid-1', ...data })

      const result = await service.create(data)

      expect(mockPrisma.question.create).toHaveBeenCalledWith({ data })
      expect(result.externalId).toBe('123')
    })

    it('deve lançar ConflictException quando external_id duplicado', async () => {
      const data = {
        externalId: '123',
        statement: 'Qual a resposta?',
        alternatives: ['A', 'B', 'C', 'D'],
        origin: 'ENEM 2025',
        subject: 'Matemática',
        categories: ['Álgebra'],
        correctAnswer: 0,
      }

      mockPrisma.question.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '7.0.0',
          meta: { target: ['external_id'] },
        }),
      )

      await expect(service.create(data)).rejects.toThrow(ConflictException)
    })
  })

  describe('createMany', () => {
    it('deve importar múltiplas questões', async () => {
      mockPrisma.question.createMany.mockResolvedValue({ count: 3 })

      const result = await service.createMany([
        {
          externalId: '1',
          statement: 'Q1',
          alternatives: ['A', 'B'],
          origin: 'ENEM',
          subject: 'Arte',
          categories: [],
          correctAnswer: 0,
        },
        {
          externalId: '2',
          statement: 'Q2',
          alternatives: ['A', 'B'],
          origin: 'ENEM',
          subject: 'Arte',
          categories: [],
          correctAnswer: 1,
        },
        {
          externalId: '3',
          statement: 'Q3',
          alternatives: ['A', 'B'],
          origin: 'ENEM',
          subject: 'Arte',
          categories: [],
          correctAnswer: 0,
        },
      ])

      expect(result.count).toBe(3)
      expect(mockPrisma.question.createMany).toHaveBeenCalledWith({
        data: expect.any(Array),
        skipDuplicates: true,
      })
    })
  })

  describe('findAll', () => {
    it('deve listar questões com paginação', async () => {
      mockPrisma.question.findMany.mockResolvedValue([{ id: '1' }])
      mockPrisma.question.count.mockResolvedValue(1)

      const result = await service.findAll({ page: 1, perPage: 20 })

      expect(result.questions).toHaveLength(1)
      expect(result.meta.total).toBe(1)
      expect(result.meta.page).toBe(1)
    })

    it('deve filtrar por subject', async () => {
      mockPrisma.question.findMany.mockResolvedValue([])
      mockPrisma.question.count.mockResolvedValue(0)

      await service.findAll({ page: 1, perPage: 20, subject: 'Arte' })

      expect(mockPrisma.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { subject: { equals: 'Arte', mode: 'insensitive' } },
        }),
      )
    })

    it('deve filtrar por year', async () => {
      mockPrisma.question.findMany.mockResolvedValue([])
      mockPrisma.question.count.mockResolvedValue(0)

      await service.findAll({ page: 1, perPage: 20, year: 2025 })

      expect(mockPrisma.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { year: 2025 },
        }),
      )
    })

    it('deve filtrar por difficulty', async () => {
      mockPrisma.question.findMany.mockResolvedValue([])
      mockPrisma.question.count.mockResolvedValue(0)

      await service.findAll({ page: 1, perPage: 20, difficulty: 'EASY' })

      expect(mockPrisma.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { difficulty: 'EASY' },
        }),
      )
    })
  })

  describe('findById', () => {
    it('deve retornar questão por ID', async () => {
      mockPrisma.question.findUnique.mockResolvedValue({
        id: 'uuid-1',
        statement: 'Teste',
      })

      const result = await service.findById('uuid-1')

      expect(result.id).toBe('uuid-1')
    })

    it('deve lançar NotFoundException se não encontrar', async () => {
      mockPrisma.question.findUnique.mockResolvedValue(null)

      await expect(service.findById('invalid')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('findRandom', () => {
    it('deve buscar questões aleatórias', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ])

      const result = await service.findRandom({ count: 2, exclude: [] })

      expect(result).toHaveLength(2)
      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY RANDOM()'),
        2,
      )
    })

    it('deve filtrar por subject e excluir IDs', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValue([])

      await service.findRandom({
        count: 5,
        subject: 'Arte',
        exclude: ['id-1', 'id-2'],
      })

      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(subject) = LOWER($1)'),
        'Arte',
        'id-1',
        'id-2',
        5,
      )
    })

    it('deve filtrar por year', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValue([])

      await service.findRandom({
        count: 5,
        year: 2025,
        exclude: [],
      })

      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('year = $1'),
        2025,
        5,
      )
    })

    it('deve filtrar por difficulty', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValue([])

      await service.findRandom({
        count: 5,
        difficulty: 'EASY',
        exclude: [],
      })

      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('difficulty = $1'),
        'EASY',
        5,
      )
    })

    it('deve combinar subject, year, difficulty e exclude', async () => {
      mockPrisma.$queryRawUnsafe.mockResolvedValue([])

      await service.findRandom({
        count: 3,
        subject: 'Matemática',
        year: 2025,
        difficulty: 'HARD',
        exclude: ['id-1'],
      })

      expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(subject) = LOWER($1)'),
        'Matemática',
        2025,
        'HARD',
        'id-1',
        3,
      )
    })
  })

  describe('update', () => {
    it('deve atualizar uma questão existente', async () => {
      mockPrisma.question.findUnique.mockResolvedValue({ id: 'uuid-1' })
      mockPrisma.question.update.mockResolvedValue({
        id: 'uuid-1',
        statement: 'Atualizado',
      })

      const result = await service.update('uuid-1', {
        statement: 'Atualizado',
      })

      expect(result.statement).toBe('Atualizado')
    })

    it('deve lançar ConflictException quando external_id duplicado no update', async () => {
      mockPrisma.question.findUnique.mockResolvedValue({ id: 'uuid-1' })
      mockPrisma.question.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '7.0.0',
          meta: { target: ['external_id'] },
        }),
      )

      await expect(
        service.update('uuid-1', { externalId: 'duplicado' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('delete', () => {
    it('deve deletar uma questão existente', async () => {
      mockPrisma.question.findUnique.mockResolvedValue({ id: 'uuid-1' })
      mockPrisma.question.delete.mockResolvedValue(undefined)

      await service.delete('uuid-1')

      expect(mockPrisma.question.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      })
    })

    it('deve lançar erro se questão não existir', async () => {
      mockPrisma.question.findUnique.mockResolvedValue(null)

      await expect(service.delete('invalid')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('getSubjects', () => {
    it('deve retornar lista de disciplinas únicas', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { subject: 'Arte' },
        { subject: 'Inglês' },
      ])

      const result = await service.getSubjects()

      expect(result).toEqual(['Arte', 'Inglês'])
    })
  })

  describe('getOrigins', () => {
    it('deve retornar lista de origens únicas', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { origin: 'ENEM 2025' },
        { origin: 'FUVEST 2025' },
      ])

      const result = await service.getOrigins()

      expect(result).toEqual(['ENEM 2025', 'FUVEST 2025'])
    })
  })

  describe('findByIds', () => {
    it('deve retornar questões sem correctAnswer por padrão', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { id: 'uuid-1', statement: 'Q1', subject: 'Arte' },
        { id: 'uuid-2', statement: 'Q2', subject: 'Inglês' },
      ])

      const result = await service.findByIds(['uuid-1', 'uuid-2'])

      expect(result).toHaveLength(2)
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['uuid-1', 'uuid-2'] } },
        select: {
          id: true,
          externalId: true,
          statement: true,
          imageUrl: true,
          alternatives: true,
          origin: true,
          subject: true,
          categories: true,
          year: true,
          difficulty: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    })

    it('deve retornar questões com correctAnswer quando includeAnswers=true', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { id: 'uuid-1', statement: 'Q1', correctAnswer: 0 },
      ])

      const result = await service.findByIds(['uuid-1'], true)

      expect(result).toHaveLength(1)
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['uuid-1'] } },
      })
    })
  })

  describe('getAnswer', () => {
    it('deve retornar a resposta correta de uma questão', async () => {
      mockPrisma.question.findUnique.mockResolvedValue({ correctAnswer: 2 })

      const result = await service.getAnswer('uuid-1')

      expect(result).toEqual({ correctAnswer: 2 })
      expect(mockPrisma.question.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        select: { correctAnswer: true },
      })
    })

    it('deve lançar NotFoundException se questão não existir', async () => {
      mockPrisma.question.findUnique.mockResolvedValue(null)

      await expect(service.getAnswer('invalid')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('getYears', () => {
    it('deve retornar lista de anos distintos em ordem decrescente', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { year: 2026 },
        { year: 2025 },
        { year: 2024 },
      ])

      const result = await service.getYears()

      expect(result).toEqual([2026, 2025, 2024])
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        select: { year: true },
        distinct: ['year'],
        where: { year: { not: null } },
        orderBy: { year: 'desc' },
      })
    })
  })

  describe('getDifficulties', () => {
    it('deve retornar lista de dificuldades distintas', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { difficulty: 'EASY' },
        { difficulty: 'MEDIUM' },
      ])

      const result = await service.getDifficulties()

      expect(result).toEqual(['EASY', 'MEDIUM'])
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        select: { difficulty: true },
        distinct: ['difficulty'],
        where: { difficulty: { not: null } },
      })
    })
  })

  describe('getStats', () => {
    it('deve retornar total e contagem por disciplina', async () => {
      mockPrisma.question.count.mockResolvedValue(150)
      mockPrisma.question.groupBy.mockResolvedValue([
        { subject: 'Matemática', _count: { id: 80 } },
        { subject: 'Português', _count: { id: 70 } },
      ])

      const result = await service.getStats()

      expect(result.total).toBe(150)
      expect(result.bySubject).toEqual([
        { subject: 'Matemática', count: 80 },
        { subject: 'Português', count: 70 },
      ])
      expect(mockPrisma.question.groupBy).toHaveBeenCalledWith({
        by: ['subject'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      })
    })

    it('deve retornar zero quando não há questões', async () => {
      mockPrisma.question.count.mockResolvedValue(0)
      mockPrisma.question.groupBy.mockResolvedValue([])

      const result = await service.getStats()

      expect(result.total).toBe(0)
      expect(result.bySubject).toEqual([])
    })
  })

  describe('getCategories', () => {
    it('deve retornar categorias únicas e ordenadas', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { categories: ['Geometria', 'Álgebra'] },
        { categories: ['Álgebra', 'Trigonometria'] },
        { categories: ['Geometria'] },
      ])

      const result = await service.getCategories()

      expect(result).toEqual(['Geometria', 'Trigonometria', 'Álgebra'])
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: {},
        select: { categories: true },
      })
    })

    it('deve filtrar categorias por subject', async () => {
      mockPrisma.question.findMany.mockResolvedValue([
        { categories: ['Álgebra'] },
      ])

      await service.getCategories('Matemática')

      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: { subject: { equals: 'Matemática', mode: 'insensitive' } },
        select: { categories: true },
      })
    })
  })
})
