'use client'

import { useState, useEffect } from 'react'
import { ImageOff } from 'lucide-react'

interface ImageUrlPreviewProps {
  url: string | undefined
}

export function ImageUrlPreview({ url }: ImageUrlPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [url])

  if (!url) return null

  return (
    <div className="mt-2">
      {hasError ? (
        <div className="flex items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          <ImageOff className="h-4 w-4 shrink-0" />
          <span>Não foi possível carregar a imagem</span>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="h-32 w-full animate-pulse rounded-md border bg-muted" />
          )}
          <img
            src={url}
            alt="Preview da imagem"
            className={`max-h-64 rounded-md border object-contain ${isLoading ? 'hidden' : ''}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        </>
      )}
    </div>
  )
}
