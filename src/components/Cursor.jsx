import React, { useEffect, useRef} from 'react'
import './Cursor.css'

export const Cursor = () => {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const requestRef = useRef(null)
  const previousTimeRef = useRef(null)
  
  const mouse = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const cursorDotPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const prevMouse = useRef({ x: 0, y: 0 })
  const glitchInterval = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0'
    }

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        // Calculate velocity
        velocity.current = {
          x: mouse.current.x - prevMouse.current.x,
          y: mouse.current.y - prevMouse.current.y
        }
        
        prevMouse.current = { ...mouse.current }

        // Smooth follow with different speeds for outer ring and dot
        const speed = 0.15
        const dotSpeed = 0.25
        
        cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * speed
        cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * speed
        
        cursorDotPos.current.x += (mouse.current.x - cursorDotPos.current.x) * dotSpeed
        cursorDotPos.current.y += (mouse.current.y - cursorDotPos.current.y) * dotSpeed

        // Calculate scale based on velocity
        const velocityMagnitude = Math.sqrt(
          velocity.current.x ** 2 + velocity.current.y ** 2
        )
        const scale = Math.min(1 + velocityMagnitude * 0.02, 2)
        
        // Calculate skew based on velocity direction
        const skewX = velocity.current.x * 0.5
        const skewY = velocity.current.y * 0.5

        // Random glitch effect
        const shouldGlitch = Math.random() > 0.95
        const glitchX = shouldGlitch ? (Math.random() - 0.5) * 20 : 0
        const glitchY = shouldGlitch ? (Math.random() - 0.5) * 20 : 0
        const glitchRotate = shouldGlitch ? (Math.random() - 0.5) * 15 : 0

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${cursorPos.current.x + glitchX}px, ${cursorPos.current.y + glitchY}px, 0) scale(${scale}) skew(${skewX}deg, ${skewY}deg) rotate(${glitchRotate}deg)`
          
          // RGB split glitch effect
          if (shouldGlitch) {
            cursorRef.current.style.filter = `drop-shadow(${Math.random() * 3}px 0 red) drop-shadow(${-Math.random() * 3}px 0 cyan)`
          } else {
            cursorRef.current.style.filter = 'none'
          }
        }

        if (cursorDotRef.current) {
          const dotGlitchX = shouldGlitch ? (Math.random() - 0.5) * 10 : 0
          const dotGlitchY = shouldGlitch ? (Math.random() - 0.5) * 10 : 0
          cursorDotRef.current.style.transform = `translate3d(${cursorDotPos.current.x + dotGlitchX}px, ${cursorDotPos.current.y + dotGlitchY}px, 0)`
        }
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    requestRef.current = requestAnimationFrame(animate)

    // Random intense glitch intervals
    glitchInterval.current = setInterval(() => {
      if (Math.random() > 0.7 && cursorRef.current) {
        cursorRef.current.classList.add('cursor-glitch-intense')
        setTimeout(() => {
          if (cursorRef.current) {
            cursorRef.current.classList.remove('cursor-glitch-intense')
          }
        }, 100)
      }
    }, 2000)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      if (glitchInterval.current) {
        clearInterval(glitchInterval.current)
      }
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-dot" ref={cursorDotRef}></div>
    </>
  )
}
