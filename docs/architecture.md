# Architecture (current state)

Written so anyone on the team can explain it at the exam. The target architecture is in CLAUDE.md section 9.1; this file says what exists **now**.

## Right now: everything runs in the browser

```
Phone browser ──HTTP GET──► Next.js (dev server now, Vercel later)
   │                           sends back the HTML, JS and the recipe data (data/*.json, bundled in)
   │
   └── all matching happens on the phone, in lib/recommender/
       the fridge and diet are saved in the browser (localStorage)
```

1. You open `/recipes`. The browser sends an **HTTP GET request**, and the server replies with HTML plus the JavaScript bundle. The recipe and ingredient lists are small, so they are part of the bundle.
2. When you add an ingredient, **no request goes to a server**. The page runs `recommend()` from `lib/recommender/matching.ts` on your phone and redraws the lists.
3. Your fridge is saved in `localStorage`, a small key-value store inside your browser. It survives a refresh but stays on that one phone and browser.

## Next: a REST endpoint and a database
- `POST /api/recommend` (a **Route Handler**) will receive the fridge, budget and filters as **JSON** and return the three lists as JSON. This is a REST endpoint: one URL, one HTTP method, JSON in and out.
- **Supabase** (PostgreSQL) will store each user's fridge, likes and shopping list. **Row Level Security** means the database itself only lets a user read their own rows.

## Where the code is
| Folder | What it does |
|---|---|
| `app/` | Pages (one folder per URL) and the root layout with fonts, theme and tab bar |
| `components/ui/` | Shared pieces: TabBar, StatusMark, UndoToast |
| `components/recipes/` | The Recipes screen: search, cards, recipe ingredients |
| `lib/recommender/` | Hard filters and matching, with unit tests |
| `lib/` | Types, data loading, formatting, browser storage |
| `data/` | The recipe, ingredient and staple data (JSON) |
