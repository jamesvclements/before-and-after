"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useAnimationControls } from "motion/react"
import { Browser } from "@/components/browser"
import { PullRequest, DEFAULT_MARKDOWN, DEFAULT_TITLE } from "@/components/pull-request"
import { FolderDefs, FolderBack, FolderFront } from "@/components/folder"

export type HeroState =
  | "initial"
  | "capture"
  | "upload"
  | "preview"

export const STATE_ORDER: HeroState[] = [
  "initial",
  "capture",
  "upload",
  "preview",
]

const STATE_DURATIONS: Record<HeroState, number> = {
  initial: 500,
  capture: 1000,
  upload: 1600,
  preview: 1800,
}

function getNextState(state: HeroState): HeroState {
  const index = STATE_ORDER.indexOf(state)
  return STATE_ORDER[(index + 1) % STATE_ORDER.length]
}

interface HeroProps {
  state?: HeroState
  onStateChange?: (state: HeroState) => void
  autoPlay?: boolean
  isReplay?: boolean
}

export function Hero({ state: controlledState, onStateChange, autoPlay = true, isReplay = false }: HeroProps) {
  // Use controlled state if provided, otherwise internal
  const state = controlledState ?? "initial"

  // Handle exit animation completion - triggers next cycle immediately
  const handleCapturesExitComplete = () => {
    if (state === "initial" && isReplay && onStateChange) {
      onStateChange("capture")
    }
  }

  useEffect(() => {
    if (!autoPlay || !onStateChange) return

    // During replay initial state, the timer is not used - onExitComplete handles the transition
    if (state === "initial" && isReplay) return

    const timer = setTimeout(() => {
      onStateChange(getNextState(state))
    }, STATE_DURATIONS[state])

    return () => clearTimeout(timer)
  }, [state, autoPlay, onStateChange, isReplay])

  // Derived state
  const showCaptures = state !== "initial"
  const capturePosition = state === "capture" ? "browser" : state === "preview" ? "folder" : "center"
  const showUploading = state === "upload"
  const capturesOpacity = state === "upload" ? 0.8 : 1
  // On replay, keep preview tab visible during initial state while captures exit
  const isInitialReplay = state === "initial" && isReplay
  const githubTab = (state === "preview" || isInitialReplay) ? "preview" : "write"
  // Show full markdown during upload (text appears) and preview states
  const showFullMarkdown = state === "upload" || state === "preview" || isInitialReplay

  return (
    <div className="mx-auto w-full max-w-[540px] px-3 sm:px-4">
      <div className="grid grid-cols-[1fr_1fr] gap-0.5 sm:gap-1 relative">
        {/* Browser A */}
        <Browser variant="A" url="site.com" />

        {/* Browser B */}
        <Browser variant="B" url="localhost" />

        {/* GitHub PR spanning both columns */}
        <div className="col-span-2 relative">
          <PullRequest
            tab={githubTab}
            markdown={showFullMarkdown ? DEFAULT_MARKDOWN : DEFAULT_TITLE}
            interactive={state === "preview"}
          />
          {/* Downloads folder - back layer */}
          <div className="absolute -bottom-4 -right-4 scale-[0.6] origin-bottom-right z-[30]">
            <FolderLayer layer="back" />
          </div>
          {/* Downloads folder - front layer (renders on top of captures) */}
          <div className="absolute -bottom-4 -right-4 scale-[0.6] origin-bottom-right z-[45]">
            <FolderLayer layer="front" />
          </div>
        </div>

        {/* Animated captures */}
        <AnimatePresence onExitComplete={handleCapturesExitComplete}>
          {showCaptures && (
            <>
              <Capture
                variant="A"
                position={capturePosition}
                opacity={capturesOpacity}
                style={{ zIndex: 35 }}
              />
              <Capture
                variant="B"
                position={capturePosition}
                opacity={capturesOpacity}
                delay={0.05}
                style={{ zIndex: 38 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Single centered uploading spinner */}
        <AnimatePresence>
          {showUploading && <CenteredUploadSpinner />}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface CaptureProps {
  variant: "A" | "B"
  position: "browser" | "center" | "folder"
  opacity?: number
  delay?: number
  style?: React.CSSProperties
}

function Capture({ variant, position, opacity = 1, delay = 0, style }: CaptureProps) {
  const isA = variant === "A"
  const controls = useAnimationControls()
  const prevPosition = useRef(position)

  // Position exactly over the browser (slightly scaled up with subtle rotation)
  const browserPosition = {
    left: isA ? "25%" : "75%",
    top: 0,
    x: "-50%",
    y: 0,
    scale: 1.02,
    rotate: isA ? -1 : 1,
  }

  // Center position - captures sized to match folder width
  const centerPosition = {
    left: "50%",
    top: "50%",
    x: isA ? "-60%" : "-40%",
    y: isA ? "-50%" : "-55%",
    scale: 0.65,
    rotate: isA ? -5 : 3,
  }

  // Folder position - captures sized to match download icon width, stacked on top of each other
  const folderPosition = {
    left: "90%",
    top: isA ? "90%" : "88%",
    x: "-50%",
    y: "-50%",
    scale: 0.42,
    rotate: isA ? -6 : 4,
  }

  const positions = {
    browser: browserPosition,
    center: centerPosition,
    folder: folderPosition,
  }

  const showFlash = position === "browser"

  // Handle position changes - use set() for instant reset, animate() otherwise
  useEffect(() => {
    const isResetting = prevPosition.current === "folder" && position === "browser"
    prevPosition.current = position

    if (isResetting) {
      // Instant jump back to start
      controls.set({ ...positions[position], opacity })
    } else {
      // Normal animated transition
      controls.start({ ...positions[position], opacity })
    }
  }, [position, opacity, controls])

  return (
    <motion.div
      className="absolute"
      style={{ ...style, width: "calc(50% - 2px)", willChange: "transform" }}
      initial={{
        left: isA ? "25%" : "75%",
        top: 0,
        x: "-50%",
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
      }}
      animate={controls}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        type: "spring",
        bounce: 0.2,
        duration: 0.6,
        delay,
      }}
    >
      <div
        className="relative rounded-lg border-[3px] border-white overflow-hidden"
        style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}
      >
        <Browser variant={variant} url={variant === "A" ? "site.com" : "localhost"} />
        {/* Camera flash overlay - white that fades out */}
        <motion.div
          className="absolute inset-0 bg-white rounded-lg pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: showFlash ? [1, 0] : 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: delay + 0.05 }}
        />
      </div>
    </motion.div>
  )
}

function CenteredUploadSpinner() {
  return (
    <motion.div
      className="absolute z-[60]"
      style={{ left: "calc(50% - 12px)", top: "calc(50% - 20px)", transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32">
        <motion.circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="75"
          initial={{ strokeDashoffset: 75 }}
          animate={{ strokeDashoffset: [56, 19, 56], rotate: [0, 360, 720] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
        />
      </svg>
    </motion.div>
  )
}

const FOLDER_SIZE = 220
const FOLDER_ASPECT_RATIO = 0.82
const FOLDER_VIEWBOX = "0 0 512 420"

function FolderLayer({ layer }: { layer: "back" | "front" }) {
  const height = Math.round(FOLDER_SIZE * FOLDER_ASPECT_RATIO)
  const id = "hero-folder"

  return (
    <div className="relative" style={{ width: FOLDER_SIZE, height }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={FOLDER_VIEWBOX}
        fill="none"
        style={{ filter: layer === "back" ? "drop-shadow(0 8px 20px rgba(0,0,0,0.12))" : undefined }}
      >
        <defs>
          <FolderDefs id={id} />
        </defs>
        {layer === "back" ? <FolderBack id={id} /> : <FolderFront id={id} />}
      </svg>
    </div>
  )
}

// Standalone auto-playing hero
export function AutoPlayHero() {
  const [state, setState] = useState<HeroState>("initial")
  const [hasPlayed, setHasPlayed] = useState(false)

  const handleStateChange = (newState: HeroState) => {
    // Mark as played once we leave initial for the first time
    if (state === "initial" && !hasPlayed) {
      setHasPlayed(true)
    }
    setState(newState)
  }

  return <Hero state={state} onStateChange={handleStateChange} autoPlay isReplay={hasPlayed} />
}
