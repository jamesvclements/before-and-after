---
name: before-and-after
description: Captures before/after screenshots of web pages or elements for visual comparison. Use when user says "take before and after", "screenshot comparison", "visual diff", "PR screenshots". Accepts two URLs (file:// or https://) and saves timestamped screenshots to ~/Downloads.
allowed-tools:
  - Bash(npx before-and-after *)
  - Bash(*/upload-and-copy.sh *)
  - Bash(node *)
  - Bash(curl *)
  - Bash(gh pr view *)
  - Bash(gh pr edit *)
  - Bash(vercel ls *)
  - Bash(vercel inspect *)
  - Bash(vercel whoami)
  - Bash(which vercel)
  - Bash(which gh)
---

# Before-After Screenshot Skill

Simple before/after screenshot capture powered by the `before-and-after` package.

## Capabilities

- **Screenshot capture** from any URL (file://, http://, https://)
- **HiDPI support** — 2x scale by default for crisp retina screenshots
- **Capture modes** — viewport (visible area) or fullpage (scrollable)
- **Element-specific screenshots** via CSS selectors
- **Multiple viewports** — desktop, tablet, mobile, or custom sizes
- **Markdown output** — GitHub-flavored tables for PR descriptions

## Quick Start

```bash
# URLs (protocol optional - https:// added automatically)
npx before-and-after google.com facebook.com
npx before-and-after "https://old.site.com" "https://new.site.com"

# Images (auto-detected by file extension)
npx before-and-after before.png after.png --markdown

# With selectors (same for both)
npx before-and-after url1 url2 ".hero-section"

# With different selectors for before/after
npx before-and-after url1 url2 ".old-hero" ".new-hero"
```

### CLI Options

| Flag | Description |
|------|-------------|
| `-m, --mobile` | Mobile viewport (375x812) |
| `-t, --tablet` | Tablet viewport (768x1024) |
| `--size <WxH>` | Custom viewport (e.g., 1920x1080) |
| `-f, --fullpage` | Capture full scrollable page |
| `-s, --selector <css>` | Scroll element into view before capture |
| `-o, --output <dir>` | Output directory (default: ~/Downloads) |
| `--markdown` | Output GitHub-flavored markdown table |

## Workflow Scenarios

### Scenario 1: Simple URL comparison

```bash
npx before-and-after old.example.com new.example.com
```

### Scenario 2: Full page capture

```bash
npx before-and-after url1 url2 --fullpage
```

### Scenario 3: Same selector for both

```bash
npx before-and-after url1 url2 ".hero-section"
```

### Scenario 4: Different selectors

```bash
npx before-and-after url1 url2 ".old-card" ".new-card"
```

### Scenario 5: Mobile viewport

```bash
npx before-and-after url1 url2 --mobile
```

### Scenario 6: Generate markdown for PR

```bash
npx before-and-after url1 url2 --markdown
```

### Scenario 7: Use existing images (auto-detected)

```bash
npx before-and-after before.png after.png --markdown
```

## Output Modes

### Local Save (default)
Screenshots saved to output directory with semantic filenames and timestamps.

### PR Markdown Table
```bash
npx before-and-after "<url1>" "<url2>" --markdown
```

Generates:
```markdown
| Before | After |
|:------:|:-----:|
| ![Before](path/to/before.png) | ![After](path/to/after.png) |
```

### With Image Upload
```bash
./scripts/upload-and-copy.sh ~/Downloads/before.png ~/Downloads/after.png --markdown
```

## Image Storage Adapters

| Adapter | Description | Setup |
|---------|-------------|-------|
| `0x0st` | Free, no-signup hosting (default) | None |
| `gist` | GitHub Gist via `gh` CLI | `gh auth login` |
| `blob` | Custom endpoint | `export BLOB_UPLOAD_URL=...` |

```bash
IMAGE_ADAPTER=gist ./scripts/upload-and-copy.sh before.png after.png --markdown
```

---

## Agent Integration Features

### Handling .vercel.app URLs with Deployment Protection

**IMPORTANT:** Only attempt Vercel protection bypass if the URL actually fails with deployment protection. Do NOT preemptively check for Vercel CLI on every `.vercel.app` URL.

#### Detection Flow

1. **First, attempt normal capture** - try to screenshot the URL without any special handling

2. **Detect protection ONLY if capture fails** with these indicators:
   - HTTP 401 or 403 status code
   - Page content contains "deployment protection", "protected deployment", or "vercel.*authentication"
   - Browser shows Vercel authentication/login page instead of expected content

3. **If protection IS detected** (and only then):
   ```bash
   # Check for Vercel CLI access
   which vercel && vercel whoami
   ```

4. **If Vercel CLI is available and authenticated:**
   - Use `vercel inspect <deployment-url>` to get deployment details
   - Extract the protection bypass secret if available
   - Retry capture with bypass token as query param or cookie

5. **If Vercel CLI is NOT available or bypass fails:**
   - Inform the user: "This deployment has protection enabled. Options:
     - Provide the protection bypass token (found in Vercel dashboard)
     - Take screenshots manually and use image mode: `npx before-and-after before.png after.png`
     - Temporarily disable protection in Vercel dashboard"

#### Example Detection Code

```bash
# Function to check if URL has Vercel deployment protection
check_vercel_protection() {
    local url="$1"

    # Only check .vercel.app URLs
    [[ ! "$url" =~ \.vercel\.app ]] && return 1

    # Check HTTP status
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    [[ "$status" == "401" || "$status" == "403" ]] && return 0

    # Check page content for protection indicators
    curl -s "$url" | grep -qi "deployment protection" && return 0

    return 1  # No protection detected
}
```

### Appending Markdown to PR Description

When the user wants to add screenshots to a PR description:

1. **Check for GitHub CLI access:**
   ```bash
   which gh
   ```

2. **If `gh` CLI is available:**
   ```bash
   # Get current PR for the branch
   gh pr view --json number,body

   # After generating markdown, append to PR body
   gh pr edit <number> --body "<existing-body>

   ## Before and After

   <generated-markdown>"
   ```

3. **If `gh` CLI is NOT available:**
   - Output the markdown table
   - Copy to clipboard if possible
   - Tell the user: "The markdown has been copied to your clipboard. Paste it into your PR description on GitHub."

### Complete Workflow Example

When user says "take before/after screenshots for my PR":

```bash
# 1. Capture screenshots
npx before-and-after "<before-url>" "<after-url>" -o ~/Downloads

# 2. Upload to get public URLs
./scripts/upload-and-copy.sh ~/Downloads/*before*.png ~/Downloads/*after*.png --markdown

# 3. If gh CLI available, offer to append to PR
gh pr view --json number
# Then append if user confirms:
# gh pr edit <number> --body-file -
```

### Handling Errors

| Error | Resolution |
|-------|------------|
| URL timeout | Increase timeout, check if server is running |
| Element not found | Verify selector exists on page |
| Deployment protected | See Vercel protection section above |
| Permission denied | Check file permissions on output directory |

## Test Fixtures

Local fixtures for testing:

| Test | Description |
|------|-------------|
| `css-card` | Card styling differences |
| `tailwind-button` | Button styling differences |
| `responsive-layout` | Layout differences |
| `identical` | Same page for match testing |
