import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const browserVariants = cva("", {
  variants: {
    variant: {
      A: "",
      B: "",
    },
  },
  defaultVariants: {
    variant: "A",
  },
})

interface BrowserProps extends VariantProps<typeof browserVariants> {
  url?: string
  className?: string
}

function BrowserChrome({ url = "localhost:3000" }: { url?: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-neutral-50 border-b border-neutral-200">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-[--geist-red-600]" />
        <div className="w-2 h-2 rounded-full bg-[--geist-amber-600]" />
        <div className="w-2 h-2 rounded-full bg-[--geist-green-600]" />
      </div>
      <div className="flex-1">
        <div className="bg-neutral-100 rounded-full px-2 h-4 flex items-center">
          <span className="text-[8px] leading-none text-neutral-400">{url}</span>
        </div>
      </div>
    </div>
  )
}

function ContentA() {
  return (
    <div className="pt-2 px-2 h-full flex flex-col overflow-hidden">
      <div className="h-2 shrink-0 bg-[--geist-purple-600] rounded mb-2" />
      <div className="flex gap-2 flex-1 min-h-0">
        <div className="w-1/4 flex flex-col gap-2 overflow-hidden">
          <div className="h-2 shrink-0 bg-[--geist-green-600] rounded-full" />
          <div className="h-2 shrink-0 bg-[--geist-green-600] rounded-full" />
          <div className="h-2 shrink-0 bg-[--geist-green-600] rounded-full" />
          <div className="h-2 shrink-0 bg-[--geist-green-600] rounded-full" />
          <div className="h-2 shrink-0 bg-[--geist-green-600] rounded-full" />
          <div className="h-2 shrink-0 bg-[--geist-green-600] rounded-full" />
        </div>
        <div className="flex-1 flex gap-2">
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <div className="h-2 shrink-0 bg-neutral-300 rounded w-full" />
            <div className="h-2 shrink-0 bg-neutral-300 rounded w-3/4" />
            <div className="h-2 shrink-0 bg-neutral-300 rounded w-5/6" />
            <div className="h-2 shrink-0 bg-neutral-300 rounded w-2/3" />
            <div className="h-2 shrink-0 bg-neutral-300 rounded w-4/5" />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="h-1/2 bg-[--geist-blue-600] rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentB() {
  return (
    <div className="pt-2 px-2 h-full flex flex-col relative overflow-hidden">
      <div className="flex gap-2 mb-2">
        <div className="h-2 shrink-0 flex-1 bg-[--geist-green-600] rounded" />
        <div className="h-2 shrink-0 flex-1 bg-[--geist-green-600] rounded" />
        <div className="h-2 shrink-0 flex-1 bg-[--geist-green-600] rounded" />
      </div>
      <div className="flex-1 flex gap-2 min-h-0">
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <div className="h-2 shrink-0 bg-neutral-300 rounded w-full" />
          <div className="h-2 shrink-0 bg-neutral-300 rounded w-2/3" />
          <div className="h-2 shrink-0 bg-neutral-300 rounded w-4/5" />
          <div className="h-2 shrink-0 bg-neutral-300 rounded w-3/4" />
          <div className="h-2 shrink-0 bg-neutral-300 rounded w-5/6" />
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <div className="flex-1 bg-[--geist-blue-600] rounded" />
          <div className="flex-1 bg-[--geist-blue-600] rounded" />
        </div>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4">
        <div className="h-2 bg-[--geist-purple-600] rounded-full" />
      </div>
    </div>
  )
}

export function Browser({ variant = "A", url, className }: BrowserProps) {
  const defaultUrl = variant === "A" ? "site.com" : "localhost:3000"

  return (
    <div
      className={cn(
        "w-full rounded-lg overflow-hidden bg-white border border-neutral-200",
        browserVariants({ variant }),
        className
      )}
    >
      <BrowserChrome url={url ?? defaultUrl} />
      <div className="bg-white" style={{ aspectRatio: "16 / 9" }}>
        {variant === "A" ? <ContentA /> : <ContentB />}
      </div>
    </div>
  )
}
