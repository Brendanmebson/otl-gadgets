import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Disable automatic browser scroll restoration so new pages render at (0, 0) immediately
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    // Instantly reset scroll to top before browser paint (no scroll motion/animation)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, search])

  return null
}
