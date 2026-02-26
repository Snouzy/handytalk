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
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/m6b9/handytalk.git
   cd handytalk
   ```

2. **Load in Chrome**

   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `handytalk` folder

3. **Set up your API key**

   - Click the handytalk extension icon
   - Enter your Anthropic API key
   - Done

### Usage

1. Navigate to any Instagram post
2. Click the handytalk icon
3. Pick a style badge (😎 Chill, 🔥 Controversial, 🧠 Expert, etc.)
4. Click **Generate** — the post content is extracted and the prompt is shown
5. Edit the prompt if needed, then click **Send**
6. Copy the comment or grab a GIF keyword

## Comment Styles

| Badge | Style | Description |
|---|---|---|
| 😎 **Chill** | Relaxed & authentic | Casual vibe, like a friend scrolling |
| 🔥 **Controversial** | Strong opinion | Challenges the post, asks hard questions |
| 🧠 **Expert** | Value-add | Technical insight, corrects or completes |
| 😂 **Funny** | Punchline | Observational humor, unexpected angles |
| 🤔 **Curious** | Sincere question | Specific question that invites a reply |
| 🚀 **Hype** | Enthusiastic | Fanboy energy on a specific detail |

## Project Structure

```
handytalk/
├── manifest.json    # Chrome extension config (Manifest V3)
├── popup.html       # Extension popup UI
├── popup.js         # Prompt building, API calls, style system
├── content.js       # Instagram DOM extraction (caption, images, comments)
├── styles.css       # UI styling
└── icon*.png        # Extension icons
```

## How It Works

1. **content.js** extracts the post caption (`li._a9z5 h1`), image alt texts, and optionally comments (`ul._a9ym`)
2. **popup.js** builds a prompt with the selected style and injects the extracted content
3. The prompt is sent to Claude API (`claude-opus-4-5-20251101`) with a 200 token limit
4. The response is parsed into a comment + GIF keywords

## License

This project is licensed under the MIT License.
