"use client"

// OG Image Preview - renders same layout as opengraph-image.tsx for easy iteration
// View at /og to see the design at 1200x630

import { PullRequest } from "@/components/pull-request"

const colors = {
  blue: "hsl(208, 100%, 66%)",
  green: "hsl(125, 60%, 64%)",
  purple: "hsl(273, 72%, 73%)",
  red: "hsl(359, 90%, 71%)",
  amber: "hsl(36, 90%, 62%)",
  gray300: "#d4d4d4",
  gray400: "#a3a3a3",
  gray500: "#737373",
  gray600: "#525252",
  gray800: "#262626",
  neutral50: "#fafafa",
  neutral100: "#f5f5f5",
  neutral200: "#e5e5e5",
}

function TrafficLights() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.red }} />
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.amber }} />
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.green }} />
    </div>
  )
}

function BrowserChrome({ url }: { url: string }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5"
      style={{ backgroundColor: colors.neutral50, borderBottom: `1px solid ${colors.neutral200}` }}
    >
      <TrafficLights />
      <div className="flex-1">
        <div
          className="rounded-full px-2.5 h-5 flex items-center"
          style={{ backgroundColor: colors.neutral100 }}
        >
          <span className="text-[10px]" style={{ color: colors.gray400 }}>{url}</span>
        </div>
      </div>
    </div>
  )
}

function ContentA() {
  return (
    <div className="flex flex-col p-2.5 gap-2 h-full">
      <div className="h-2.5 rounded shrink-0" style={{ backgroundColor: colors.purple }} />
      <div className="flex gap-2 flex-1">
        <div className="w-1/4 flex flex-col gap-2">
          <div className="h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.green }} />
          <div className="h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.green }} />
          <div className="h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.green }} />
          <div className="h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.green }} />
        </div>
        <div className="flex-1 flex gap-2">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-2.5 rounded w-full shrink-0" style={{ backgroundColor: colors.gray300 }} />
            <div className="h-2.5 rounded w-3/4 shrink-0" style={{ backgroundColor: colors.gray300 }} />
            <div className="h-2.5 rounded w-[85%] shrink-0" style={{ backgroundColor: colors.gray300 }} />
            <div className="h-2.5 rounded w-2/3 shrink-0" style={{ backgroundColor: colors.gray300 }} />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="h-1/2 rounded" style={{ backgroundColor: colors.blue }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentB() {
  return (
    <div className="flex flex-col p-2.5 gap-2 h-full relative">
      <div className="flex gap-2">
        <div className="flex-1 h-2.5 rounded" style={{ backgroundColor: colors.green }} />
        <div className="flex-1 h-2.5 rounded" style={{ backgroundColor: colors.green }} />
        <div className="flex-1 h-2.5 rounded" style={{ backgroundColor: colors.green }} />
      </div>
      <div className="flex gap-2 flex-1">
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-2.5 rounded w-full shrink-0" style={{ backgroundColor: colors.gray300 }} />
          <div className="h-2.5 rounded w-2/3 shrink-0" style={{ backgroundColor: colors.gray300 }} />
          <div className="h-2.5 rounded w-4/5 shrink-0" style={{ backgroundColor: colors.gray300 }} />
          <div className="h-2.5 rounded w-3/4 shrink-0" style={{ backgroundColor: colors.gray300 }} />
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <div className="flex-1 rounded" style={{ backgroundColor: colors.blue }} />
          <div className="flex-1 rounded" style={{ backgroundColor: colors.blue }} />
        </div>
      </div>
      <div
        className="absolute bottom-2.5 left-[12.5%] right-[12.5%] h-2.5 rounded-full"
        style={{ backgroundColor: colors.purple }}
      />
    </div>
  )
}

function Browser({ variant, url }: { variant: "A" | "B"; url: string }) {
  return (
    <div
      className="flex flex-col w-full rounded-lg overflow-hidden bg-white"
      style={{ border: `1px solid ${colors.neutral200}`, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
    >
      <BrowserChrome url={url} />
      <div className="aspect-video">
        {variant === "A" ? <ContentA /> : <ContentB />}
      </div>
    </div>
  )
}

function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

function OgLogo() {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-[family-name:var(--font-vanilla-cream)] text-[72px] leading-none tracking-wide"
        style={{ color: colors.gray800, WebkitTextStroke: "0.5px #525252" }}
      >
        before
      </span>
      <span className="text-[45px] font-normal" style={{ color: colors.gray600 }}>and</span>
      <span className="relative text-[45px] font-medium" style={{ color: colors.gray800 }}>
        {/* top-left, larger */}
        <span className="absolute -left-3 -top-3">
          <Sparkle size={18} color={colors.gray400} />
        </span>
        {/* top-right, small */}
        <span className="absolute -right-1.5 -top-1.5">
          <Sparkle size={9} color={colors.gray300} />
        </span>
        {/* right side, medium */}
        <span className="absolute -right-4 top-2">
          <Sparkle size={15} color={colors.gray400} />
        </span>
        {/* bottom-left, medium */}
        <span className="absolute -left-1 -bottom-2">
          <Sparkle size={15} color={colors.gray300} />
        </span>
        {/* bottom-right, tiny */}
        <span className="absolute right-6 -bottom-3">
          <Sparkle size={9} color={colors.gray400} />
        </span>
        After
      </span>
    </div>
  )
}

export default function OgPreview() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-neutral-500">OG Image Preview (1200 x 630)</p>

        {/* OG Image Container - exact 1200x630 */}
        <div
          className="relative bg-white overflow-hidden flex"
          style={{ width: 1200, height: 630 }}
        >
          {/* Left half - Text content */}
          <div className="w-1/2 flex flex-col justify-center pl-16 pr-8">
            {/* Logo */}
            <OgLogo />

            {/* Description */}
            <p
              className="mt-4 text-[24px] font-sans"
              style={{ color: colors.gray500 }}
            >
              Automatically add before and after screenshots to PRs
            </p>
          </div>

          {/* Right half - Hero-like grid */}
          <div className="w-1/2 flex items-center justify-center py-8 pr-10">
            <div className="w-full h-full">
              <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-3 h-full">
                {/* Browser A - top left */}
                <Browser variant="A" url="site.com" />

                {/* Browser B - top right */}
                <Browser variant="B" url="localhost" />

                {/* Pull Request - spanning both columns */}
                <div className="col-span-2 flex">
                  <PullRequest tab="preview" interactive={false} className="flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
