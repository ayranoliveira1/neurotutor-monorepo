import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthBrandingPanel } from '../auth-branding-panel'

describe('AuthBrandingPanel', () => {
  it('should render the brand name', () => {
    render(<AuthBrandingPanel />)

    expect(screen.getByText('NeuroTutor')).toBeInTheDocument()
  })

  it('should render the tagline badge', () => {
    render(<AuthBrandingPanel />)

    expect(screen.getByText('Potencializado por IA')).toBeInTheDocument()
  })

  it('should render the hero heading', () => {
    render(<AuthBrandingPanel />)

    expect(screen.getByText(/Seu cérebro merece/)).toBeInTheDocument()
    expect(screen.getByText(/a melhor estratégia\./)).toBeInTheDocument()
  })

  it('should render all four feature highlights', () => {
    render(<AuthBrandingPanel />)

    expect(screen.getByText('Repetição Espaçada')).toBeInTheDocument()
    expect(screen.getByText('Planos Personalizados')).toBeInTheDocument()
    expect(screen.getByText('Métricas de Progresso')).toBeInTheDocument()
    expect(screen.getByText('Flashcards com IA')).toBeInTheDocument()
  })

  it('should render feature descriptions', () => {
    render(<AuthBrandingPanel />)

    expect(
      screen.getByText(
        /Algoritmos inteligentes que otimizam seus intervalos de revisão/
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Cronogramas adaptados ao seu ritmo, metas e estilo/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Acompanhe sua evolução com relatórios detalhados/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Geração automática de cards inteligentes/)
    ).toBeInTheDocument()
  })

  it('should render the social proof stats', () => {
    render(<AuthBrandingPanel />)

    expect(screen.getByText('50mil+')).toBeInTheDocument()
    expect(screen.getByText('Estudantes ativos')).toBeInTheDocument()
    expect(screen.getByText('98%')).toBeInTheDocument()
    expect(screen.getByText('Aprovação')).toBeInTheDocument()
  })

  it('should render the testimonial', () => {
    render(<AuthBrandingPanel />)

    expect(screen.getByText('Marina Lima')).toBeInTheDocument()
    expect(
      screen.getByText(/Aprovada em Medicina - UNICAMP/)
    ).toBeInTheDocument()
  })

  it('should render the copyright footer', () => {
    render(<AuthBrandingPanel />)

    const year = new Date().getFullYear()
    expect(
      screen.getByText(`© ${year} NeuroTutor. Todos os direitos reservados.`)
    ).toBeInTheDocument()
  })
})
