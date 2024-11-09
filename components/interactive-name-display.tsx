'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion'
import Particles from 'react-particles'
import { loadFull } from 'tsparticles'
import type { Engine } from 'tsparticles-engine'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { Sparkles, Wand2 } from 'lucide-react'

export function InteractiveNameDisplay() {
  const controls = useAnimation()
  const textRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [particleDensity, setParticleDensity] = useState(80)
  const [colorScheme, setColorScheme] = useState({ primary: '#8a2be2', secondary: '#ff69b4' })
  const [isRainbowMode, setIsRainbowMode] = useState(false)
  const [isSparkleMode, setIsSparkleMode] = useState(false)
  const [textSize, setTextSize] = useState(6)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: [0, 1],
      rotate: [0, 360],
      transition: { duration: 2 / animationSpeed, ease: 'easeInOut' }
    })

    const interval = setInterval(() => {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 2 / animationSpeed, ease: 'easeInOut', repeat: Infinity }
      })
    }, 2000 / animationSpeed)

    return () => clearInterval(interval)
  }, [controls, animationSpeed])

  useEffect(() => {
    if (isRainbowMode) {
      const rainbowInterval = setInterval(() => {
        setColorScheme({
          primary: `hsl(${Math.random() * 360}, 100%, 50%)`,
          secondary: `hsl(${Math.random() * 360}, 100%, 50%)`
        })
      }, 1000 / animationSpeed)
      return () => clearInterval(rainbowInterval)
    }
  }, [isRainbowMode, animationSpeed, setColorScheme])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left - rect.width / 2)
    y.set(event.clientY - rect.top - rect.height / 2)
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  const getGradient = () => {
    return `from-[${colorScheme.primary}] to-[${colorScheme.secondary}]`
  }

  const getGlowColor = () => {
    return isHovered ? colorScheme.secondary : colorScheme.primary
  }

  const triggerMagicEffect = () => {
    controls.start({
      scale: [1, 1.2, 0.8, 1.1, 1],
      rotate: [0, 10, -10, 5, 0],
      transition: { duration: 0.5 }
    })
    setIsSparkleMode(true)
    setTimeout(() => setIsSparkleMode(false), 1000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden p-4">
      <Particles
        key={`particles-${colorScheme.primary}-${colorScheme.secondary}`}
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true },
          particles: {
            number: { value: particleDensity, density: { enable: true, value_area: 800 } },
            color: { value: getGlowColor() },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1 * animationSpeed, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2 * animationSpeed, size_min: 0.1, sync: false } },
            move: {
              enable: true,
              speed: 1 * animationSpeed,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
              resize: true
            },
          },
          retina_detect: true
        }}
      />
      <motion.div
        ref={textRef}
        className="relative z-10 mb-8"
        animate={controls}
        style={{ x, y, rotateX, rotateY, perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.h1
          className={`text-${textSize}xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${getGradient()}`}
          style={{
            filter: `drop-shadow(0 0 0.75rem ${getGlowColor()})`,
            transition: 'filter 0.3s ease-in-out',
          }}
        >
          Sandesh Poudel
        </motion.h1>
        {isSparkleMode && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Sparkles className="w-full h-full text-yellow-400" />
          </motion.div>
        )}
      </motion.div>
      <div className="relative z-10 space-y-4 w-full max-w-md">
        <div>
          <label htmlFor="animation-speed" className="block text-sm font-medium text-white mb-1">
            Animation Speed
          </label>
          <Slider
            id="animation-speed"
            min={0.5}
            max={2}
            step={0.1}
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            aria-label="Animation Speed"
          />
        </div>
        <div>
          <label htmlFor="particle-density" className="block text-sm font-medium text-white mb-1">
            Particle Density
          </label>
          <Slider
            id="particle-density"
            min={20}
            max={200}
            step={10}
            value={[particleDensity]}
            onValueChange={(value) => setParticleDensity(value[0])}
            aria-label="Particle Density"
          />
        </div>
        <div>
          <label htmlFor="text-size" className="block text-sm font-medium text-white mb-1">
            Text Size
          </label>
          <Slider
            id="text-size"
            min={4}
            max={12}
            step={1}
            value={[textSize]}
            onValueChange={(value) => setTextSize(value[0])}
            aria-label="Text Size"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="rainbow-mode"
              checked={isRainbowMode}
              onCheckedChange={setIsRainbowMode}
            />
            <label htmlFor="rainbow-mode" className="text-sm font-medium text-white">
              Rainbow Mode
            </label>
          </div>
          <Button onClick={triggerMagicEffect} className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4" />
            <span>Magic!</span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex-1" style={{ backgroundColor: colorScheme.primary }}>
                Primary Color
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <HexColorPicker color={colorScheme.primary} onChange={(color) => setColorScheme({ ...colorScheme, primary: color })} />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex-1" style={{ backgroundColor: colorScheme.secondary }}>
                Secondary Color
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <HexColorPicker color={colorScheme.secondary} onChange={(color) => setColorScheme({ ...colorScheme, secondary: color })} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}