import { QuestionsService } from './questions.service'
import { NotFoundException } from '@nestjs/common'

const mockPrisma = {
  question: {
    create: vi.fn(),
    createMany: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
})
