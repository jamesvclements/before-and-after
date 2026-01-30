# before-and-after

Before and after is a tool that adds before and after screenshots to your PRs. Add it as a skill for your agent to call automatically or use it directly from the command line.

![before-and-after](https://jm.sv/before-and-after/opengraph-image.png)

## Install

Install globally to use from anywhere:

```bash
npm i -g @jamesvclements/before-and-after
```

## Basic Use

Capture any two URLs, protocol is optional:

```bash
before-and-after site.com localhost:3000
```

## Add Skill

Show your agent how and when to take before and afters. The skill uses `gh` to detect the associated PR with your branch and (soon) `vercel` to bypass deployment protection when capturing from Vercel preview branches.

```bash
npx skills add jamesvclements/before-and-after
```

## Options

Capture a specific element using a CSS selector:

```bash
before-and-after url1 url2 ".hero"
```

Use different selectors for before and after:

```bash
before-and-after url1 url2 ".old" ".new"
```

Capture at mobile (375×812), tablet (768×1024), or custom viewport:

```bash
before-and-after url1 url2 --mobile
before-and-after url1 url2 --size 1920x1080
```

Capture the entire scrollable page:

```bash
before-and-after url1 url2 --full
```

Output a markdown table for PR descriptions:

```bash
before-and-after url1 url2 --markdown
```

Use existing images instead of capturing URLs:

```bash
before-and-after before.png after.png
```

Mix URLs and images:

```bash
before-and-after before.png localhost:3000
```

Save to a custom location:

```bash
before-and-after url1 url2 --output ./screenshots
```

Upload to a custom image storage service:

```bash
before-and-after url1 url2 --upload my-s3-uploader
```

By default, images are uploaded to [0x0.st](https://0x0.st). For heavy usage or sensitive captures, use your own upload handler.
