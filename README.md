# Passly AI

Free, educational U.S. visa eligibility analysis for international professionals. Built with Next.js 16, Tailwind CSS v4, and next-intl.

---

## What It Does

1. User answers a short questionnaire (5–8 steps depending on intent)
2. A scoring engine evaluates their profile against USCIS eligibility criteria for 7 visa categories
3. Results show top 3 visa matches with scores, strengths, weaknesses, and next steps
4. Optional lead capture (name, email, WhatsApp) saves results and connects interested users with immigration attorneys

**Not legal advice.** Educational tool only.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 (`@theme inline`, no config file) |
| i18n | next-intl v4 (`en` + `es`, `localePrefix: "always"`) |
| Animations | Framer Motion v12 |
| Database | Supabase (PostgreSQL) — mocked without credentials |
| OG Images | Next.js `ImageResponse` (built-in, no extra package) |
| Deployment | Vercel |

---

## Project Structure

```
passly-ai/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # Landing page
│   │   ├── quiz/                 # Original quiz flow (sessionStorage)
│   │   ├── check/                # Second questionnaire (localStorage)
│   │   │   ├── CheckContext.tsx
│   │   │   ├── [step]/page.tsx
│   │   │   └── results/page.tsx
│   │   ├── results/
│   │   │   ├── page.tsx          # Quiz results
│   │   │   └── [assessmentId]/   # Shareable results page
│   │   ├── visas/[slug]/         # New SEO pages (15 slugs)
│   │   └── [visa-slug]/          # Legacy SEO pages (21 slugs)
│   ├── api/
│   │   ├── analyze/route.ts      # POST — run scoring engine
│   │   ├── leads/route.ts        # POST — capture lead (rate limited)
│   │   ├── assessments/route.ts  # POST — save assessment to DB
│   │   ├── assessments/[id]/     # GET — fetch assessment by ID
│   │   ├── consultations/route.ts # POST — attorney consultation request
│   │   └── og/route.tsx          # GET — OG image generation
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── landing/                  # Hero, Navbar, Footer, Testimonials, FAQ
│   ├── quiz/                     # Quiz-specific step components
│   ├── questionnaire/            # Check-flow step components
│   ├── results/                  # ResultCard, VisaScoreBadge
│   ├── seo/                      # SEOPageTemplate, FAQAccordion
│   └── ui/                       # CTAButton, DisclaimerBanner
├── lib/
│   ├── types.ts                  # All TypeScript types
│   ├── scoring/engine.ts         # Scoring engine + 7 visa scorers
│   ├── check/checkState.ts       # Check flow state machine
│   ├── quiz/quizState.ts         # Quiz flow state machine
│   ├── seo/
│   │   ├── slugManifest.ts       # Legacy 21-slug manifest
│   │   ├── generateVisaPageData.ts # New 15-slug content + helpers
│   │   └── structuredData.ts     # JSON-LD schema builders
│   ├── supabase/
│   │   ├── client.ts             # Browser client (with mock fallback)
│   │   └── server.ts             # Server client (with mock fallback)
│   └── ai/
│       ├── analyze.ts            # AI abstraction layer
│       └── analyzer.ts           # AIAnalysisInput/Output types + mockAnalysis
├── messages/
│   ├── en.json
│   └── es.json
├── supabase/
│   └── migrations/001_initial.sql
└── vercel.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in Supabase and OpenAI credentials (optional — app works without them)

# Run development server
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL for canonical links and OG images |
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | Supabase service role key (server-only) |
| `OPENAI_API_KEY` | No | Enables AI-enhanced results (future) |
| `ENABLE_OPENAI` | No | Set to `true` to enable AI analysis |

*Without Supabase credentials, the app falls back to console logging (mock mode).

---

## Database Setup

Run the migration against your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or paste supabase/migrations/001_initial.sql into the Supabase SQL editor
```

Tables created:
- `leads` — email, name, WhatsApp, locale, utm_source
- `assessments` — answers + scored results, linked to lead
- `attorney_consultations` — consultation requests, linked to lead + assessment
- `seo_pages` — page view tracking (optional)

---

## Visa Categories

| Visa | Type | Scorer |
|------|------|--------|
| O-1 | Extraordinary Ability | `lib/scoring/o1.ts` |
| H-1B | Specialty Occupation | `lib/scoring/h1b.ts` |
| EB-2 NIW | National Interest Waiver | `lib/scoring/eb2niw.ts` |
| F-1 | Student Visa | `lib/scoring/f1.ts` |
| L-1 | Intracompany Transferee | `lib/scoring/l1.ts` |
| E-2 | Treaty Investor | `lib/scoring/e2.ts` |
| B-1/B-2 | Visitor Visa | `lib/scoring/b1b2.ts` |

---

## Questionnaire Flows

### `/quiz` — Original flow
- State: `sessionStorage`
- Lead capture: email only
- Steps: up to 10 (with conditional GreenCard pathway step)

### `/check` — Second flow
- State: `localStorage` (persists across reloads)
- Lead capture: name + email + WhatsApp
- Conditional steps by intent:
  - Tourism: 5 steps (INTENT → PROFILE → US_TIES → HOME_TIES → GOALS)
  - Study: 6 steps (adds EDUCATION + PROFESSIONAL)
  - Work/GC/Business: 8 steps (adds ACHIEVEMENTS + DEPENDENTS)

---

## SEO Pages

Two overlapping SEO page systems:

| Route | Slugs | Description |
|-------|-------|-------------|
| `/[locale]/[visa-slug]` | 21 slugs | Original visa guide pages |
| `/[locale]/visas/[slug]` | 15 slugs | New deep-content pages with full bilingual content |

New `/visas/` pages include: eligibility factors, common mistakes, 4 FAQs per page, related links, OG image, JSON-LD (FAQ + Article schema), and hreflang alternates.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/analyze` | Run scoring engine, return AnalysisResponse |
| POST | `/api/leads` | Save lead (rate limited: 10/IP/hour) |
| POST | `/api/assessments` | Save assessment + answers to DB |
| GET | `/api/assessments/[id]` | Fetch assessment by ID (for shareable links) |
| POST | `/api/consultations` | Create attorney consultation request |
| GET | `/api/og` | Generate OG image (edge, cached 24h) |

---

## Localization

All UI strings are in `messages/en.json` and `messages/es.json`. The URL always includes the locale prefix (`/en/...` or `/es/...`).

Namespaces: `meta`, `nav`, `landing`, `quiz`, `results`, `leads`, `visas`, `seo`, `common`, `disclaimer`, `check`.

---

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel automatically handles Next.js App Router and edge functions

Security headers and cache policies are configured in `vercel.json`.

---

## Disclaimer

Passly AI provides educational information about U.S. immigration pathways based on publicly available USCIS and State Department criteria. It does not constitute legal advice and does not create an attorney-client relationship. Always consult a licensed immigration attorney before making immigration decisions.
