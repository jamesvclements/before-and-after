"use client"

import { useState } from "react"
import { Hero, STATE_ORDER, type HeroState } from "@/components/hero"

export default function HeroPage() {
  const [state, setState] = useState<HeroState>("initial")
  const [autoPlay, setAutoPlay] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 gap-8">
      <Hero
        state={state}
        onStateChange={setState}
        autoPlay={autoPlay}
      />

      {/* State switcher */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1">
          {STATE_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                state === s
                  ? "bg-neutral-800 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
            className="w-4 h-4"
          />
          Auto-play
        </label>
      </div>
    </div>
  )
}
