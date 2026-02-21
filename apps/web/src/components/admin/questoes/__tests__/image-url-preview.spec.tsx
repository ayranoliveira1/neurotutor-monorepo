import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageUrlPreview } from '../image-url-preview'

describe('ImageUrlPreview', () => {
  it('não deve renderizar nada quando url é undefined', () => {
    const { container } = render(<ImageUrlPreview url={undefined} />)
    expect(container.innerHTML).toBe('')
  })

  it('não deve renderizar nada quando url é vazia', () => {
    const { container } = render(<ImageUrlPreview url="" />)
    expect(container.innerHTML).toBe('')
  })

  it('deve renderizar img com src correto quando url preenchida', () => {
    render(<ImageUrlPreview url="https://example.com/image.png" />)
    const img = screen.getByAltText('Preview da imagem')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.png')
  })

  it('deve mostrar mensagem de erro quando imagem falha ao carregar', () => {
    render(<ImageUrlPreview url="https://example.com/broken.png" />)
    const img = screen.getByAltText('Preview da imagem')

    fireEvent.error(img)

    expect(
      screen.getByText('Não foi possível carregar a imagem'),
    ).toBeInTheDocument()
  })

  it('deve esconder img durante loading', () => {
    render(<ImageUrlPreview url="https://example.com/image.png" />)
    const img = screen.getByAltText('Preview da imagem')
    expect(img.className).toContain('hidden')
  })

  it('deve mostrar img após carregar', () => {
    render(<ImageUrlPreview url="https://example.com/image.png" />)
    const img = screen.getByAltText('Preview da imagem')

    fireEvent.load(img)

    expect(img.className).not.toContain('hidden')
  })
})
