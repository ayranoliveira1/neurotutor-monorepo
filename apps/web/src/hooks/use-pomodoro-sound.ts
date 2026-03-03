'use client'

import { useEffect, useRef, useCallback } from 'react'

export type AmbientSound = 'none' | 'rain' | 'cafe' | 'library'

const SOUND_URLS: Record<AmbientSound, string | null> = {
  none: null,
  rain: '/sounds/rain.mp3',
  cafe: '/sounds/cafe.mp3',
  library: '/sounds/library.mp3',
}

export function usePomodoroSound(selectedSound: AmbientSound) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Manage ambient audio when selectedSound changes
  useEffect(() => {
    const url = SOUND_URLS[selectedSound]

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (url && isPlayingRef.current) {
      const audio = new Audio(url)
      audio.loop = true
      audio.volume = 0.4
      audio.play().catch(() => {})
      audioRef.current = audio
    }

    return () => {
      audioRef.current?.pause()
    }
  }, [selectedSound])

  // Close AudioContext on unmount
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [])

  const play = useCallback(() => {
    isPlayingRef.current = true
    const url = SOUND_URLS[selectedSound]
    if (!url) return

    if (!audioRef.current) {
      const audio = new Audio(url)
      audio.loop = true
      audio.volume = 0.4
      audio.play().catch(() => {})
      audioRef.current = audio
    } else {
      audioRef.current.play().catch(() => {})
    }
  }, [selectedSound])

  const pause = useCallback(() => {
    isPlayingRef.current = false
    audioRef.current?.pause()
  }, [])

  const playTransitionBeep = useCallback(() => {
    try {
      // Reuse existing AudioContext to avoid browser limits (~6 concurrent)
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch {
      // Web Audio API not available in this environment
    }
  }, [])

  return { play, pause, playTransitionBeep }
}
