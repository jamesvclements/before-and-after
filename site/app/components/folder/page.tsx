import { Folder } from "@/components/folder"

export default function FolderPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-neutral-800 text-lg">Download Folder Icon</h1>

        {/* Large version for comparison */}
        <div className="bg-neutral-100 p-12 rounded-lg">
          <Folder size={220} />
        </div>

        {/* Reference size comparison */}
        <div className="flex gap-8 items-end">
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Current (220px)</span>
            <Folder size={220} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Small (120px)</span>
            <Folder size={120} />
          </div>
        </div>
      </div>
    </div>
  )
}
