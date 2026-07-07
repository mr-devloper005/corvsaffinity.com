'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/*
  IntersectionObserver-driven fade+slide-up. The hidden state is applied only
  after mount so visitors without JS see fully-rendered content immediately.
  Stagger is per-item via inline transitionDelay.
*/

type Props = {
  children: ReactNode
  index?: number
  as?: keyof React.JSX.IntrinsicElements
  className?: string
  style?: CSSProperties
  delayMs?: number
  once?: boolean
}

export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  style,
  delayMs,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [once])

  const Tag = as as unknown as React.ElementType
  const delay = delayMs ?? Math.min(index * 90, 640)
  const state = !mounted ? '' : visible ? 'is-visible' : 'is-hidden'

  return (
    <Tag
      ref={ref as never}
      className={`editable-reveal ${state} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}
