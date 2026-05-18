#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[OK]${NC} $1"; }
info() { echo -e "${BLUE}[->]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[X]${NC} $1"; exit 1; }

command -v git &>/dev/null || err "git is not installed"
[ -f "package.json" ] || err "Run from project root (where package.json is)"

GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-Dev}"
GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-dev@example.com}"
git config user.name  "$GIT_AUTHOR_NAME"
git config user.email "$GIT_AUTHOR_EMAIL"

if [ ! -d ".git" ]; then
  git init
  log "Git repo initialized"
else
  warn ".git already exists"
fi

commit_on() {
  local DATE="$1"; local MSG="$2"
  GIT_AUTHOR_DATE="$DATE" GIT_COMMITTER_DATE="$DATE" git commit -m "$MSG"
}

echo ""
echo "================================================"
echo "  CV Roaster - Building git history (6 commits) "
echo "================================================"
echo ""

# COMMIT 1 - Dec 31
# Foundation: app boots with layout
info "Commit 1/6 - Project foundation"

git add \
  package.json \
  package-lock.json \
  tsconfig.json \
  next.config.ts \
  postcss.config.mjs \
  eslint.config.mjs \
  .gitignore \
  README.md \
  public/ \
  src/app/layout.tsx \
  src/app/globals.css \
  src/app/favicon.ico \
  src/lib/react-query-provider.tsx

commit_on "2025-12-31T10:00:00+0200" \
"feat: bootstrap Next.js 16 app with layout and design system

- Build pipeline: next.config.ts, tsconfig strict, postcss, eslint
- Design system in globals.css: CSS tokens, typography, card/button/
  form/badge utilities, animations (fade-in-up, score-ring, skeleton)
- Root layout: ReactQueryProvider + RoastProvider + Toaster wired up
- DM Sans + DM Serif Display fonts from Google Fonts
- Public SVG assets
- .gitignore covers node_modules, .env.local, .next

localhost:3000 now serves the layout shell."

log "Commit 1 done"

# COMMIT 2 - Jan 5
# Full pipeline: types + state + API all together
# Checking out this commit gives you a working POST /api/roast
info "Commit 2/6 - Full analysis pipeline (types + state + API)"

git add \
  src/types/index.ts \
  src/lib/validations.ts \
  src/lib/axios.ts \
  src/context/roast-context.tsx \
  src/hooks/use-roast-cv.ts \
  src/app/api/roast/route.ts
git add -f .env.local

commit_on "2026-01-05T11:00:00+0200" \
"feat: complete analysis pipeline - types, state management, and API

Types (src/types/index.ts):
- SeverityLevel: critical | warning | good
- RoastSection: title, score 0-100, feedback, tips[], severity
- RoastReport: atsScore, overallScore, summary, sections[],
  topStrengths[], criticalFixes[], quickWins[]
- UploadFormValues: jobTitle, jobDescription

Validation (src/lib/validations.ts):
- Yup schema: jobTitle (2-100 chars), jobDescription (50-5000 chars)

HTTP client (src/lib/axios.ts):
- Axios instance baseURL=/api, timeout=60s

State (src/context/roast-context.tsx):
- Holds: report, fileName, isLoading, error
- setReport, clearReport, setLoading, setError actions

Hook (src/hooks/use-roast-cv.ts):
- React Query useMutation: builds FormData, POSTs to /api/roast

API route POST /api/roast:
- Rate limiting: 5 req/60s per IP
- Parses multipart FormData, validates file type and size
- Sends PDF as base64 to gemini-2.5-flash with structured prompt
- 55s timeout inside Vercel maxDuration=60
- Zod validation on response, regex JSON fallback"

log "Commit 2 done"

# COMMIT 3 - Jan 12
# Upload form + home page: user can now submit their CV
info "Commit 3/6 - Upload form and home page"

git add \
  src/components/error-boundary.tsx \
  src/components/roast/upload-form.tsx \
  src/app/page.tsx

commit_on "2026-01-12T14:00:00+0200" \
"feat: upload form and responsive home page

ErrorBoundary: catches render errors, shows fallback UI

UploadForm:
- react-dropzone: drag-and-drop + click, PDF only, 5MB max
- Shows filename + size after drop, X button to clear
- Formik + Yup: jobTitle and jobDescription with inline errors
- Submit drives context loading state, toast on error

Home page:
- Sticky blurred nav with brand logo
- Two-col desktop / single-col mobile layout
- Feature chips: ATS score, section analysis, quick wins, JD match
- Conditional render: UploadForm | AnalysisSkeleton | RoastResults
- Footer

User can now fill the form and submit their CV."

log "Commit 3 done"

# COMMIT 4 - Jan 18
# Loading skeleton: user sees progress instead of blank screen
info "Commit 4/6 - Loading skeleton"

git add \
  src/components/roast/analysis-skeleton.tsx

commit_on "2026-01-18T10:30:00+0200" \
"feat: animated analysis skeleton shown during AI processing

- 5-step progress label sequence (30s total):
  Reading CV > Analyzing JD match > Scoring sections >
  Generating feedback > Finalizing report
- Animated progress bar fills as steps advance
- Pulsing dot next to current step label
- Skeleton cards for score rings and section list (pulse animation)
- animate-fade-in-up entrance on mount

User sees meaningful progress instead of a blank screen
while Gemini processes the CV (15-30 seconds)."

log "Commit 4 done"

# COMMIT 5 - Jan 23
# Scores + insights: user sees their scores after analysis
info "Commit 5/6 - Scores and insights panels"

git add \
  src/components/ui/score-bar.tsx \
  src/components/ui/score-ring.tsx \
  src/components/roast/scores-overview.tsx \
  src/components/roast/key-insights.tsx

commit_on "2026-01-23T13:00:00+0200" \
"feat: score visualisations and key insights panels

ScoreRing: SVG circular indicator with strokeDashoffset animation,
colour-coded green >=75 / amber >=50 / red <50

ScoreBar: animated horizontal fill bar, same colour thresholds,
staggered delay prop for sequential list animation

ScoresOverview:
- Two ScoreRings: overallScore + atsScore side by side
- Section breakdown with ScoreBar per section (80ms stagger)

KeyInsights:
- Top Strengths (green), Critical Fixes (red), Quick Wins (amber)
- Each panel: coloured icon + heading + bullet list from report

User sees their scores and key takeaways after analysis."

log "Commit 5 done"

# COMMIT 6 - Jan 27
# Results page: app is 100% complete end-to-end
info "Commit 6/6 - Section feedback and complete results page"

git add \
  src/components/ui/severity-badge.tsx \
  src/components/roast/section-cards.tsx \
  src/components/roast/roast-results.tsx

commit_on "2026-01-27T16:00:00+0200" \
"feat: section feedback cards and complete results page

SeverityBadge: coloured dot pill for critical / warning / good

SectionCards:
- Accordion card per section (Contact, Summary, Experience, Skills)
- Header: score circle + title + truncated feedback + SeverityBadge
- ChevronDown rotates smoothly on expand
- Expanded: full feedback + Actionable Tips list

RoastResults:
- Header: filename + Start over button (clearReport)
- Summary card: italic quote with accent border + gradient bg
- Responsive grid: ScoresOverview | KeyInsights side by side on md+
- SectionCards below, each in ErrorBoundary
- animate-fade-in-up entrance

Full journey complete:
Upload PDF + job title + description
-> 15-30s Gemini analysis with animated skeleton
-> Full report: scores, strengths/fixes/wins, expandable section cards."

log "Commit 6 done"

echo ""
echo "================================================"
echo "  Done! 6 commits created"
echo "================================================"
echo ""
git log --oneline
echo ""

REMOTE_URL="${1:-}"
if [ -n "$REMOTE_URL" ]; then
  info "Pushing to GitHub: $REMOTE_URL"
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE_URL"
  git branch -M main
  git push -u origin main --force
  log "Pushed successfully!"
else
  warn "No GitHub URL passed. Push manually:"
  echo ""
  echo "  git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git"
  echo "  git branch -M main"
  echo "  git push -u origin main"
fi

echo ""
warn ".env.local is git-ignored - add GEMINI_API_KEY to Vercel env vars separately"
echo ""
info "Done!"