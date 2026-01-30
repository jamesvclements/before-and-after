"use client"

import { PullRequest } from "@/components/pull-request"

export default function PullRequestPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-12">
        <h1 className="text-neutral-800 text-lg">Pull Request Component</h1>

        {/* Full width version */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-neutral-500 text-sm">Default (click tabs to switch)</span>
          <div className="w-[400px]">
            <PullRequest />
          </div>
        </div>

        {/* Three column row: Empty, Write, Preview */}
        <div className="flex gap-8 items-start">
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Empty</span>
            <div className="w-[220px]">
              <PullRequest defaultTab="write" markdown="" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Write</span>
            <div className="w-[220px]">
              <PullRequest defaultTab="write" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-neutral-500 text-sm">Preview</span>
            <div className="w-[220px]">
              <PullRequest defaultTab="preview" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
