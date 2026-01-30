import { Browser } from "@/components/browser"

export default function BrowserPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-neutral-800 text-lg">Browser Window Component</h1>

        {/* Large version */}
        <div className="bg-neutral-100 p-12 rounded-lg">
          <div className="w-80">
            <Browser variant="A" />
          </div>
        </div>

        {/* Variant A and B side by side */}
        <div className="flex gap-8 items-start">
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Variant A</span>
            <div className="w-[180px]">
              <Browser variant="A" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Variant B</span>
            <div className="w-[180px]">
              <Browser variant="B" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
