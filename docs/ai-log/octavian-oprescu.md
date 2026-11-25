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

### 2026-11-25 21:54 · feature/search-home
- **Tool:** Claude Code (Claude Opus 5.5)
- **Type:** UI scaffolding, logic, data
- **Core prompt for slides:** yes (custom two-handle slider and pricing logic)
- **Prompt (verbatim):**
  > filtrele trebuie sa fie selectate cu un hamburger menu, iar butonul de hambruger sa fie pus sub bara de search. langa butonul de hamburger sa se afle un alt buton pe care sa user-ul poate apasa pentru a sleecta modul de sortare a retetlor.
  > sortarile sunt:
  > -pret, timp preparare, vino tu cu alte idei.
  > sub aceste 2 butoate, adauga un slider de pret. el trebuie sa aiba 2 capete: minim si maxim. trebuie sa fie afisat intervalul astfel incat user-ul sa poata vedea usor pretul, user-ul trebuie sa poata selecta intervalul de pret si cu input de text. pretul maxim trebuie pus in functie de pretul maxim de care mai avem nevoie pentru a face reteta cea mai scumpa.
- **Prompt (English):** Filters should be selected through a hamburger menu, with the hamburger button under the search bar. Next to it, another button lets the user choose how recipes are sorted. Sort options: price, preparation time, and come up with other ideas. Under these two buttons, add a price slider with two ends, minimum and maximum. The range must be shown so the user can easily see the price, and the user must also be able to set the range by typing. The maximum must be based on the most we still need to spend to make the most expensive recipe.
- **AI output:**
  - Filters button (☰ + "Filters · N") opening a Radix bottom sheet with diet, the 14 EU allergens and equipment, and a live "Show N recipes" button.
  - Sort button opening a sheet with Best match, Price, Cooking time, Uses most of your fridge and Fewest ingredients (the last two are the AI's suggestions).
  - Two-handle price slider with From/To fields. Its top end is the most expensive cost to finish; recipes outside the range sit behind a "Show N recipes outside …" button.
  - `lib/recommender/pricing.ts` (cheapest single store or mix, whole packs) and `ranking.ts` (sorting and price range), with tests: 53 in total.
  - Example prices in `data/offers.json`; prices on cards ("€2.13 to finish at Jumbo") and on the recipe page.
- **Human in the loop:** Octavian specified the controls and their placement. The AI's interpretations still need review: the ☰ icon for filters (D-11), the two extra sort options (D-12), and the From price also hiding ready recipes (D-14). Pending PR review.
- **AI issues found:**
  - There were no prices to build a price slider on, so the AI invented example prices; they are marked as examples in the data and in the UI (D-15).
  - Reading today's date during server rendering broke Next 16's prerender rules; it is now read only in the browser.
  - The sort sheet first closed on arrow-key presses, which would trap keyboard users in a loop; now only taps and clicks close it.
  - Focus didn't return to the Filters button after closing the sheet; fixed by letting Radix own the trigger.
  - "Sort: Uses most of your fridge" didn't fit at 390 px; the button now shows short labels.
  - The summary said "Nothing is ready yet" when a ready recipe was only hidden by the From price; it now says "in this price range".
- **Requirements:** FR-03, FR-04, FR-06, FR-07, FR-08
- **Commit / PR:** see `git log` on feature/search-home
