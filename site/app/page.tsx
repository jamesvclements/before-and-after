import { AutoPlayHero } from "@/components/hero";
import { Code } from "@/components/code";
import { Logo } from "@/components/logo";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-neutral-500">
      <main className="py-10 sm:py-16">
        {/* Header - constrained width */}
        <div className="max-w-[540px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <a href="/before-and-after" className="text-neutral-800 hover:text-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm">
              <h1>
                <Logo />
              </h1>
            </a>
            <nav className="flex items-center gap-2.5 sm:gap-4 text-[13px] sm:text-sm">
              <a
                href="#install"
                className="text-neutral-500 hover:text-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Install
              </a>
              <a
                href="#skill"
                className="text-neutral-500 hover:text-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Skill
              </a>
              <a
                href="#options"
                className="text-neutral-500 hover:text-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
              >
                Options
              </a>
              <a
                href="https://github.com/jamesvclements/before-and-after"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-neutral-500 hover:text-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </nav>
          </div>
          <p className="mb-8 sm:mb-12 text-[14px] sm:text-[15px]">
            Before and after is a tool that adds before and after screenshots to
            your PRs. Add it as a skill for your agent to call automatically or
            use it directly from the command line.
          </p>
        </div>

        {/* Animation - wider, extra padding on mobile for transformed elements */}
        <div className="mb-10 sm:mb-16 px-8 sm:px-0">
          <AutoPlayHero />
        </div>

        {/* Content - constrained width */}
        <div className="max-w-[540px] mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
          <section id="install" className="scroll-mt-8 space-y-3">
            <h2 className="text-neutral-800">Install</h2>
            <p className="text-sm">Install globally to use from anywhere</p>
            <Code>npm i -g @jamesvclements/before-and-after</Code>
          </section>

          <section className="space-y-3">
            <h2 className="text-neutral-800">Basic Use</h2>
            <p className="text-sm">
              Capture any two URLs, protocol is optional
            </p>
            <Code>before-and-after site.com localhost:3000</Code>
          </section>

          <hr className="border-neutral-100" />

          <section id="skill" className="scroll-mt-8 space-y-3">
            <h2 className="text-neutral-800">Add Skill</h2>
            <p className="text-sm">
              Show your agent how and when to take before and afters. The skill
              uses <code className="text-neutral-800 bg-neutral-50 px-1 sm:px-1.5 py-0.5 rounded font-mono text-[12px] sm:text-[14px]">gh</code> to
              detect the associated PR with your branch and (soon) <code className="text-neutral-800 bg-neutral-50 px-1 sm:px-1.5 py-0.5 rounded font-mono text-[12px] sm:text-[14px]">vercel</code> to
              bypass deployment protection when capturing from Vercel preview branches
            </p>
            <Code>npx skills add jamesvclements/before-and-after</Code>
          </section>

          <hr className="border-neutral-100" />

          <section id="options" className="scroll-mt-8 space-y-6">
            <h2 className="text-neutral-800">Options</h2>

            <div className="space-y-2">
              <p className="text-sm">
                Capture a specific element using a CSS selector
              </p>
              <Code>before-and-after url1 url2 &quot;.hero&quot;</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Use different selectors for before and after
              </p>
              <Code>
                before-and-after url1 url2 &quot;.old&quot; &quot;.new&quot;
              </Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Capture at mobile (375×812), tablet (768×1024), or custom
                viewport
              </p>
              <Code>before-and-after url1 url2 --mobile</Code>
              <Code>before-and-after url1 url2 --size 1920x1080</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">Capture the entire scrollable page</p>
              <Code>before-and-after url1 url2 --full</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Output a markdown table for PR descriptions
              </p>
              <Code>before-and-after url1 url2 --markdown</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Use existing images instead of capturing URLs
              </p>
              <Code>before-and-after before.png after.png</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">Mix URLs and images</p>
              <Code>before-and-after before.png localhost:3000</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">Save to a custom location</p>
              <Code>before-and-after url1 url2 --output ./screenshots</Code>
            </div>

            <div className="space-y-2">
              <p className="text-sm">
                Upload to a custom image storage service
              </p>
              <Code>before-and-after url1 url2 --upload my-s3-uploader</Code>
              <p className="text-sm mt-3">
                By default, images are uploaded to{" "}
                <a href="https://0x0.st" target="_blank" rel="noopener noreferrer" className="text-neutral-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm">
                  0x0.st
                </a>
                . For heavy usage or sensitive captures, use your own upload handler.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="max-w-[540px] mx-auto px-4 sm:px-6 mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center">
            <span className="inline-flex items-center gap-1.5">
              Made by{" "}
              <a
                href="https://x.com/jamesvclements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-800 hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-sm"
              >
                <img
                  src="https://avatars.githubusercontent.com/u/20052710?v=4"
                  alt=""
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 rounded-full"
                />
                James
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
              <span className="hidden sm:inline">.</span>
              <span className="sm:hidden">Zero-dependency except</span>
              <span className="hidden sm:inline">Zero-dependency except one on</span>{" "}
              <a
                href="https://agent-browser.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-800 bg-neutral-50 px-1.5 py-0.5 rounded font-mono text-[12px] sm:text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 whitespace-nowrap"
              >
                agent-browser <span className="text-[9px]">▲</span>
              </a>
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
