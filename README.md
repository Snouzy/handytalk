<div align="center">
<h1>🤙 handytalk</h1>
<h3><em>AI-powered Instagram comment generator — Chrome Extension</em></h3>
<p>
<img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white" alt="Chrome Extension">
<img src="https://img.shields.io/badge/Manifest-V3-green?style=flat" alt="Manifest V3">
<img src="https://img.shields.io/badge/Powered%20by-Claude%20AI-cc785c?style=flat&logo=anthropic&logoColor=white" alt="Claude AI">
<img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
</p>
</div>

## About

handytalk is a Chrome extension that generates authentic, engaging Instagram comments using Claude AI. It extracts the post content directly from the page, lets you pick a comment style, edit the prompt, and gives you GIF keyword suggestions — all from a clean popup.

## Features

- **Smart extraction** — Pulls post caption + image descriptions, not comments
- **6 comment styles** — Chill, Controversial, Expert, Funny, Curious, Hype
- **Editable prompt** — Tweak the prompt before sending to Claude
- **GIF keywords** — Get relevant GIF search terms, click to copy
- **GenZ French tone** — Natural slang, lowercase, no spam patterns
- **Include comments toggle** — Optionally feed existing comments as context

## Quick Start

### Prerequisites

- Google Chrome
- [pnpm](https://pnpm.io/) (v9+)
- Node.js 22+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/m6b9/handytalk.git
cd handytalk
pnpm install
pnpm build
```

Then load `apps/extension/dist/` as an unpacked extension in Chrome:

1. Go to `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `apps/extension/dist/` folder

### Development

```bash
pnpm dev   # Vite HMR for popup
```

## Monorepo Structure

```
apps/
  extension/   # Chrome Extension (React + Vite + CRXJS)
  api/         # Express API scaffold (future)
packages/
  shared/      # Shared TypeScript types
```

### Tech Stack

- **pnpm** workspaces + **Turborepo**
- **React 19** + **Vite 6** + **TypeScript 5.7**
- **@crxjs/vite-plugin** v2 for Chrome extension bundling
- Content script: vanilla TypeScript (no React)

## Comment Styles

| Badge | Style | Description |
|---|---|---|
| 😎 **Chill** | Relaxed & authentic | Casual vibe, like a friend scrolling |
| 🔥 **Controversial** | Strong opinion | Challenges the post, asks hard questions |
| 🧠 **Expert** | Value-add | Technical insight, corrects or completes |
| 😂 **Funny** | Punchline | Observational humor, unexpected angles |
| 🤔 **Curious** | Sincere question | Specific question that invites a reply |
| 🚀 **Hype** | Enthusiastic | Fanboy energy on a specific detail |

## How It Works

1. **content.ts** extracts the post caption, image alt texts, and optionally comments from the Instagram DOM
2. **App.tsx** builds a prompt with the selected style and injects the extracted content
3. The prompt is sent to Claude API (`claude-opus-4-5-20251101`) with a 200 token limit
4. The response is parsed into a comment + GIF keywords

## License

This project is licensed under the MIT License.
