# AI log: Octavian Oprescu

Append-only. Format: CLAUDE.md section 14.1.

### 2026-11-25 ~20:50 · main (moved to feature/search-home later)
- **Tool:** Claude Code (Claude Opus 5.5)
- **Type:** UI scaffolding
- **Core prompt for slides:** yes (a good example of AI working from an outdated project guide)
- **Prompt (verbatim):**
  > am updatat acum si claude.md din repo.
  > vreau sa incep implementarea cu asta (cateva notite facute)
  >
  > FRONTEND
  >
  > un ecran principal concentrat pe o bara de cautare. dai mai jos, popular reciepes. cand incep sa adaugi lucuri pe search, ai autocomplete/sugestii si rezultatele (retetele, care sunt mai jos dupa scroll) se schimba dinamic pe baza a ce adaugi. se schimba rosu/verde/galben tot dinamic.
  >
  > pe prima pagina, retete populare cu un start prepping. trebuie sa fie si filtre principale gen vegan, etc.
  >
  > in timp ce dai scroll, ele apar, deci scroll ul sa fie foarte vizual si dinamic
  >
  > FOARTE IMPORTANT: INCEPE DE LA 0. DISCARD COMPLET LA VERSIUNEA CARE EXISTA DEJA
- **Prompt (English):** I just updated CLAUDE.md in the repo too. I want to start the implementation with this (some notes). Frontend: a main screen focused on a search bar. Scrolling down, popular recipes. When you start adding things in the search, you get autocomplete/suggestions, and the results (the recipes, further down after scrolling) change dynamically based on what you add, turning red/green/yellow dynamically too. On the first page, popular recipes with a "start prepping". There must also be main filters like vegan, etc. While you scroll they appear, so scrolling should be very visual and dynamic. VERY IMPORTANT: start from 0. Completely discard the existing version.
- **AI output:** deleted the old `site/` files; wrote a new static `site/index.html`, `styles.css`, `data.js` (18 example recipes, ~40 ingredients) and `app.js`: search with autocomplete, filter chips, live green/yellow/red grouping with animated reordering, scroll-reveal and parallax effects, a "Start prepping" dialog. Updated the structure section of `README.md`.
- **Human in the loop:** the teammate asked whether the AI had followed CLAUDE.md, which triggered an audit (next entry), and then pointed out that the local CLAUDE.md was outdated (entry 3). Pending PR review.
- **AI issues found:** the AI did not `git pull` first, so it built against the old 784-line course knowledge base instead of the team's 897-line project guide. As a result it used the wrong stack (static HTML instead of Next.js), banned visuals (emoji, gradients, blur, parallax, indigo accent), worked on `main`, and skipped the lo-fi step. Also: a CSS specificity bug made the status badges grey (caught in its own browser check). See `docs/ai-limitations.md`.
- **Requirements:** none yet (no `docs/requirements.md`)
- **Commit / PR:** not committed

### 2026-11-25 ~21:05 · main
- **Tool:** Claude Code (Claude Opus 5.5)
- **Type:** debugging
- **Core prompt for slides:** no
- **Prompt (verbatim):**
  > did you read the claude.md file and make sure to include all the instructions from it?
- **AI output:** measured contrast and target sizes. Fixed control borders (1.3–1.5:1 → ≥ 3.6:1), the chip remove button (32 → 44 px), added undo for removing ingredients and "Clear all", and improved autocomplete ranking. Created a root `AI_LOG.md` (later moved here).
- **Human in the loop:** the teammate questioned the AI's compliance instead of accepting the result.
- **AI issues found:** the AI had claimed compliance without measuring; four real violations were found once it did.
- **Requirements:** none yet
- **Commit / PR:** not committed

### 2026-11-25 21:21 · feature/search-home
- **Tool:** Claude Code (Claude Opus 5.5)
- **Type:** git
- **Core prompt for slides:** no
- **Prompt (verbatim):**
  > ai dat pull la claude.md-ul nou? ar trebui sa aiba 897 linii de cod
- **Prompt (English):** Did you pull the new CLAUDE.md? It should have 897 lines.
- **AI output:** fast-forward pull of `7b44f7d` (new CLAUDE.md); moved the uncommitted work from `main` to `feature/search-home`; moved the AI log to this file; started `docs/ai-limitations.md`; compared the build with the new rules and proposed a text wireframe for a rebuild.
- **Human in the loop:** the teammate caught that the AI was working from an outdated CLAUDE.md.
- **AI issues found:** see the first entry.
- **Requirements:** none yet
- **Commit / PR:** not committed

### 2026-11-25 21:24 · feature/search-home
- **Tool:** Claude Code (Claude Opus 5.5)
- **Type:** UI scaffolding, logic, data
- **Core prompt for slides:** yes (first screen of the real app; also shows the AI's earlier work being thrown away)
- **Prompt (verbatim):** clicked the reply button "Yes, rebuild", which sent:
  > Yes, rebuild it in Next.js following the wireframe and your recommendations (no stagger/parallax, default quantity).
- **AI output:**
  - Next.js 16 + TypeScript + Tailwind 4 app at the repo root, using the CLAUDE.md tokens, fonts and status marks.
  - `/recipes`: search with autocomplete that adds ingredient chips; diet filter; popular list when the fridge is empty; Ready to cook / Missing a few / Missing many lists that update and reorder (200 ms) as you add; undo toast.
  - `/recipes/[id]`: You need / You have, steps and the safety disclaimer.
  - Placeholder pages for the other three tabs.
  - `lib/recommender/` (hard filters and matching) with 29 Vitest tests, including allergen exclusion for every allergen.
  - `data/*.json` (example data), and docs: decisions, requirements, third-party, data notes, architecture.
- **Human in the loop:** Octavian approved the text wireframe and picked the AI's recommendations on motion (no scroll effects) and default quantities. Pending PR review.
- **AI issues found:**
  - The first build used a `redirect()` page for `/`, which Next 16's instant-navigation check flagged; moved to a config redirect.
  - Reading `params` outside `<Suspense>` on the recipe page caused a dev error; wrapped it.
  - A global focus style was unlayered, so it beat Tailwind's `outline-none` and drew a second box inside the search bar; moved it into `@layer base`.
  - Cards faded in on every page load, which is motion CLAUDE.md doesn't allow; now only reorders animate.
  - All recipe, allergen and amount data is AI-written and unchecked (see `docs/data-notes.md`).
- **Requirements:** FR-01, FR-02, FR-03, FR-04 (logic only), FR-05, NFR-01 to NFR-05
- **Commit / PR:** see `git log` on feature/search-home
