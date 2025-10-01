import { useEffect, useMemo, useState } from 'react'

type Props = {
  intervalMs?: number
  maxBlurPx?: number
  respectReducedMotion?: boolean
}

export default function FullScreenBlurry({
  intervalMs = 20,
  maxBlurPx = 24,
  respectReducedMotion = true,
}: Props) {
  const [progress, setProgress] = useState(0)
  const url = import.meta.env.BASE_URL + 'program.png'

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const reduce = !!(respectReducedMotion && mq?.matches)

    if (reduce) {
      setProgress(100)
      return
    }
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1))
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, respectReducedMotion])

  const blurPx = useMemo(
    () => Math.round(maxBlurPx * (1 - progress / 100)),
    [progress, maxBlurPx]
  )
  const overlayOpacity = useMemo(() => 1 - progress / 100, [progress])

  return (
    <section className="relative min-h-dvh w-full">
      {/* Imagen de fondo fullscreen */}
      <img
        src={url}
        alt="Fondo relacionado con programación"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: `blur(${blurPx}px)` }}
      />

      {/* Overlay oscuro que se desvanece */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        style={{ opacity: overlayOpacity }}
      />

      {/* Texto de progreso */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          role="progressbar"
          aria-labelledby="progress-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="text-white text-6xl font-extrabold drop-shadow-lg"
        >
          <span id="progress-label" className="sr-only">Progreso de carga</span>
          {progress}%
        </div>
      </div>

      <p className="sr-only" aria-live="polite">Carga {progress}%.</p>
    </section>
  )
}
