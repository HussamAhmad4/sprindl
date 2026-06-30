# Community Resource Navigator

An AI-powered web app that helps people find public benefits and local resources — food assistance, healthcare, housing, childcare, and more — through a simple, plain-English conversation. Built for people who don't have time to dig through government websites or aren't comfortable with technical jargon.

**Tech stack:** React (Vite) on the frontend, a small Node/Express + Vercel serverless backend, and the Claude API for conversation.

## How it works

1. The user describes their situation in their own words (e.g. *"I just lost my job and I'm worried about rent"*).
2. The request goes to a backend endpoint (`/api/chat`) that keeps the Anthropic API key private — it's never exposed to the browser.
3. The backend calls Claude with a system prompt that includes a curated catalog of real public benefit programs (`src/data/resources.js`) and instructs the model to:
   - respond in plain, warm, jargon-free English,
   - ask one short clarifying question at a time when it needs more context, and
   - return a small structured object naming the specific programs that fit, instead of inventing links or details.
4. The frontend renders Claude's reply as a chat bubble and shows the matched programs as resource cards with a plain description, who it's for, and a link/phone number to apply.

```
React (Vite) UI  -->  /api/chat  -->  Claude API
                         |
                         v
            src/data/resources.js (resource catalog)
```

## Project structure

```
src/
  components/      Chat UI: header, message bubbles, resource cards, input, footer
  hooks/useChat.js  Chat state + calls to /api/chat
  data/resources.js Curated catalog of public benefit programs (the "knowledge base")
  App.jsx, main.jsx React entry points
lib/
  chatHandler.js    Calls the Claude API and parses its structured response
  systemPrompt.js   Builds the system prompt + resource catalog for Claude
api/chat.js         Vercel serverless function (production)
server/index.js     Express server that does the same thing, for local dev
```

`api/chat.js` and `server/index.js` both call the same `lib/chatHandler.js`, so the chat logic only exists in one place.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

Copy the example env file and add your own key from the [Anthropic Console](https://console.anthropic.com/settings/keys):

```bash
cp .env.example .env
```

```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
CLAUDE_MODEL=claude-sonnet-4-6
PORT=8787
```

`.env` is git-ignored — never commit a real API key.

### 3. Run it locally

```bash
npm run dev:all
```

This starts the Vite dev server (frontend) and a small Express server (backend) together, with the frontend proxying `/api/*` requests to the backend — so it behaves just like it will in production. Open the URL Vite prints (usually `http://localhost:5173`).

You can also run them separately:

```bash
npm run dev       # frontend only
npm run dev:api   # backend only, on http://localhost:8787
```

## Deploying

This app is set up to deploy on [Vercel](https://vercel.com) with zero extra config:

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add an environment variable `ANTHROPIC_API_KEY` (and optionally `CLAUDE_MODEL`) in the Vercel project settings.
4. Deploy. Vercel automatically builds the Vite frontend and turns `api/chat.js` into a serverless function — `server/index.js` is only used for local development.

## About the resource data

The resources in `src/data/resources.js` are real, well-established U.S. federal programs (SNAP, Medicaid, LIHEAP, 211, SSI, and others) with accurate program names and general eligibility rules, used here as a demo catalog. Program details, links, and phone numbers can change and vary by state, so the app always tells users to confirm specifics with the official program — this is informational, not legal or professional advice.

## Possible next steps

- Let users filter/search the resource catalog directly, not just through chat
- Add state-specific program variants and links
- Persist conversations so users can pick up where they left off
- Add automated tests around `lib/chatHandler.js`'s response parsing

## License

MIT — see [LICENSE](LICENSE).
