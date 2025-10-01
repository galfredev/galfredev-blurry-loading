import { useEffect, useMemo, useState } from 'react'

type Props = {
  intervalMs?: number
  maxBlurPx?: number
  respectReducedMotion?: boolean
}

export default function BlurryLoader({
  intervalMs = 25,          // un poquito más rápido
  maxBlurPx = 24,           // blur inicial (px)
  respectReducedMotion = true,
}: Props) {
  // URL segura para Pages: base + nombre del archivo
  const bgUrl = import.meta.env.BASE_URL + 'program.png'

  // Si querés forzar animación para probar, poné respectReducedMotion={false} desde App.tsx
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // si respetamos reduced motion y el SO lo pide, mostramos directo
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const reduce = respectReducedMotion && media?.matches

    if (reduce) {
      setProgress(100)
      return
    }

    const id = setInterval(() => {
      setProgress(p => (p >= 100 ? 100 : p + 1))
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, respectReducedMotion])

  // 0..100 → maxBlurPx..0
  const blurPx = useMemo(
    () => Math.round(maxBlurPx * (1 - progress / 100)),
    [progress, maxBlurPx]
  )
  const overlayOpacity = useMemo(() => 1 - progress / 100, [progress])

  return (
    <section className="relative w-[min(90vw,800px)] aspect-[16/9] rounded-2xl overflow-hidden shadow">
      {/* Imagen de fondo que se va desenfocando */}
      <img
        src={bgUrl}
        alt=""                // decorativa
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: `blur(${blurPx}px)` }}
      />

      {/* Sutil overlay para legibilidad del porcentaje */}
      <div
        className="absolute inset-0 bg-black/25 transition-opacity"
        style={{ opacity: overlayOpacity }}
      />

      {/* Porcentaje centrado */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          role="progressbar"
          aria-labelledby="progress-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="text-white text-5xl font-extrabold drop-shadow"
        >
          <span id="progress-label" className="sr-only">Progreso de carga</span>
          {progress}%
        </div>
      </div>

      {/* Anuncio para lectores de pantalla */}
      <p className="sr-only" aria-live="polite">Carga {progress}%.</p>

      {/* Botón para saltar animación manualmente */}
      {progress < 100 && (
        <div className="absolute right-3 bottom-3">
          <button
            className="focus-ring rounded-lg bg-white/90 text-slate-900 px-3 py-1 text-sm"
            onClick={() => setProgress(100)}
          >
            Saltar animación
          </button>
        </div>
      )}
    </section>
  )
}
