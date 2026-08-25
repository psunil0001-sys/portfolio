import { useEffect } from 'react'

export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const scrollToHash = () => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    }

    const frame = window.requestAnimationFrame(scrollToHash)
    const timer = window.setTimeout(scrollToHash, 80)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
