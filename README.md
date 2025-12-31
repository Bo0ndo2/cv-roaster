# CV Roaster 🔥

An AI-powered CV analysis tool that gives brutally honest, actionable feedback — scored, sectioned, and tailored to the job you're targeting.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-orange?style=flat-square&logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

---

## What it does

Upload your CV (PDF) + paste a job description → get a detailed report in 15–30 seconds:

- **ATS Score** — how likely your CV is to pass applicant tracking systems
- **Overall Score** — general quality rating
- **Section-by-section feedback** — Contact, Summary, Experience, Skills, Education, ATS Compatibility
- **Top Strengths / Critical Fixes / Quick Wins** — prioritized, actionable insights
- **Job description match** — analysis tailored to the specific role you're applying for

No signup. No data stored. Free.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| AI Model | Google Gemini 2.5 Flash |
| Styling | Tailwind CSS 4 + CSS custom properties |
| State Management | React Context + TanStack Query v5 |
| Form Handling | Formik + Yup |
| API Validation | Zod |
| HTTP Client | Axios |
| File Upload | react-dropzone |
| Notifications | react-hot-toast |

---

## Project Structure

```
src/
├── app/
│   ├── api/roast/route.ts      # API route — Gemini integration, rate limiting, validation
│   ├── page.tsx                # Home page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Design system (CSS variables, utility classes)
├── components/
│   ├── roast/
│   │   ├── upload-form.tsx     # CV upload + job description form
│   │   ├── roast-results.tsx   # Results container
│   │   ├── scores-overview.tsx # Score rings + section breakdown bars
│   │   ├── key-insights.tsx    # Strengths / fixes / quick wins
│   │   ├── section-cards.tsx   # Expandable per-section feedback cards
│   │   └── analysis-skeleton.tsx # Loading state
│   └── ui/
│       ├── score-ring.tsx      # Circular score indicator
│       ├── score-bar.tsx       # Animated progress bar
│       └── severity-badge.tsx  # Critical / warning / good badge
├── context/
│   └── roast-context.tsx       # Global report state
├── hooks/
│   └── use-roast-cv.ts         # TanStack Query mutation for API call
├── lib/
│   ├── axios.ts                # Axios instance
│   ├── react-query-provider.tsx
│   └── validations.ts          # Yup schema for form
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)

### Installation

```bash
git clone https://github.com/your-username/cv-roaster.git
cd cv-roaster
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Implementation Details

### Server-side Rate Limiting
Each IP is limited to 5 requests per 60 seconds to prevent API abuse. Implemented as an in-memory Map on the server — suitable for single-instance deployments. For multi-instance production, this would be backed by Redis.

### AI Response Validation
Gemini's response is validated at runtime using a Zod schema before it reaches the client. This ensures the UI never receives malformed data, even if the model returns an unexpected format.

### Timeout Handling
A `Promise.race` wrapper aborts the Gemini call after 55 seconds (inside Vercel's 60s `maxDuration` limit), returning a clean error instead of hanging.

### PDF Processing
The PDF is converted to base64 and sent directly to Gemini as inline data — no server-side PDF parsing library needed. File type and size (max 5MB) are validated before the API call.

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repo on Vercel
3. Add `GEMINI_API_KEY` in environment variables
4. Deploy

Make sure to set the `maxDuration` in `route.ts` to match your Vercel plan's function timeout limit.

---

## Known Limitations & Tradeoffs

- **Rate limiting** is in-memory and resets on server restart — not suitable for horizontally scaled deployments
- **No persistence** — reports are held in React state only; refreshing loses the result
- **PDF only** — DOCX and other formats are not supported

---

## License

MIT
