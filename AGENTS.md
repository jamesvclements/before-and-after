# AGENTS.md

Guidelines for AI agents working on this project.

## Project Overview

Before-After is a library and Claude Code skill for capturing visual comparisons of web pages. It screenshots two URLs (before/after states), runs visual/DOM diffs, and generates PR-ready markdown tables with uploaded images.

## Directory Structure

This is a pnpm workspace monorepo with two packages:

```
before-and-after/
├── src/                       # Core library (npm package: before-and-after)
│   ├── index.ts              # Main exports, BeforeAndAfter class
│   ├── types.ts              # TypeScript types
│   ├── capture.ts            # Screenshot capture
│   ├── batch.ts              # Multi-page batch processing
│   ├── browser.ts            # Playwright browser management
│   ├── viewport.ts           # Viewport presets
│   ├── bin/cli.ts            # CLI entry point
│   ├── compare/              # Comparison algorithms
│   │   ├── visual-diff.ts    # Pixel-level diff (pixelmatch)
│   │   └── dom-diff.ts       # DOM structure diff
│   └── detect/               # Detection utilities
│       ├── page-diff.ts      # Page difference regions
│       ├── interaction.ts    # Interactive element discovery
│       └── git-changes.ts    # Git change analysis
├── tests/                     # Library tests (Vitest)
│   ├── unit/                 # Unit tests (no browser)
│   ├── browser/              # Browser-based tests
│   ├── integration/          # Full workflow tests
│   └── fixtures/             # Test data
│       ├── pages/            # HTML test pages (before/after pairs)
│       └── apps/             # Sample apps (Next.js)
├── skill/                     # Claude Code skill definition
│   ├── SKILL.md              # Skill instructions
│   ├── scripts/              # Upload and adapter scripts
│   └── tests/                # Skill-specific tests
├── site/                      # Marketing website (Next.js)
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # React components (shadcn/ui)
│   ├── hooks/                # React hooks
│   ├── lib/                  # Utilities
│   ├── styles/               # CSS
│   ├── public/               # Static assets
│   ├── e2e/                  # Site-specific Playwright tests
│   └── package.json          # Site dependencies
├── .claude/                   # Claude Code settings
├── package.json               # Root package (library)
└── pnpm-workspace.yaml        # Workspace configuration
```

## Key Workflows

### Taking Screenshots

The skill uses `agent-browser` CLI:
```bash
agent-browser open "<url>"
agent-browser screenshot ~/Downloads/screenshot.png
```

### Uploading for PR Comments

```bash
./skill/scripts/upload-and-copy.sh before.png after.png --markdown
```

Outputs centered markdown table and copies to clipboard.

### Adding New Storage Adapters

1. Create `skill/scripts/adapters/<name>.sh`
2. Script must:
   - Accept file path as `$1`
   - Print uploaded URL to stdout
   - Exit 0 on success, non-zero on failure
3. Use via `IMAGE_ADAPTER=<name>`

## Testing

```bash
# Run all library tests
pnpm test

# Run specific test suites
pnpm test:unit       # Unit tests (no browser)
pnpm test:browser    # Browser-based tests
pnpm test:integration # Full workflow tests

# Run site e2e tests
cd site && pnpm test:e2e
```

Test pages are in `tests/fixtures/pages/`. Each has `before.html` and `after.html`.

### Next.js Test App Scenarios

The test app at `tests/fixtures/apps/nextjs-sample` has 8 progressive scenarios:

| Route | Scenario | Description |
|-------|----------|-------------|
| `/1/*` | Entirely different | Light vs dark theme, different layouts |
| `/2/*` | Only h1 differs | Same page, different headline text |
| `/3/*` | Below the fold | Different testimonial (requires scroll) |
| `/4/*` | Modal content | Different content inside modal (requires click) |
| `/5/*` | Subtle button color | Blue vs indigo button |
| `/6/*` | Different image | Same layout, different product image |
| `/7/*` | Added badge | New badge element appears in nav |
| `/8/*` | Viewport-specific | Different content on mobile vs desktop |

Legacy routes `/before` and `/after` still work (same as scenario 1).

## Development

```bash
# Install all dependencies
pnpm install

# Build the library
pnpm build

# Run the site dev server
cd site && pnpm dev
```

## Conventions

- Screenshots saved to `~/Downloads/` with `YYYYMMDD-HHMMSS-` prefix
- PR markdown uses centered alignment (`|:------:|`) for GitHub compatibility
- Adapters are standalone bash scripts with no dependencies beyond curl/gh
