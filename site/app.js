(function () {
  'use strict';

  // ---------- State ----------

  const STORAGE_KEY = 'cooly-state-v1';
  const SAMPLE_FRIDGE = { spinach: 100, tomatoes: 200, pasta: 150, eggs: 2, rice: 300, onion: 2, soy_sauce: 100 };
  const DEFAULTS = {
    onboarded: false,
    allergies: [],
    diet: 'any',
    equipment: ['stove', 'microwave', 'kettle'],
    fridge: SAMPLE_FRIDGE,
    budget: 5,
    shopping: [], // [{ id, qty, checked, from: [recipe names] }]
    liked: [],
    theme: 'system',
    textSize: 0,
  };
  const TEXT_SIZES = ['100%', '112.5%', '125%'];

  let state = load();
  const ui = { screen: state.onboarded ? 'fridge' : 'onboarding', step: 0, recipeId: null, back: 'recipes', query: '' };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) return Object.assign({}, DEFAULTS, saved);
    } catch (e) { /* storage unavailable: start fresh */ }
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- Helpers ----------

  const euro = (n) => '€' + n.toFixed(2);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const qty = (id, q) => `${q} ${INGREDIENTS[id].unit}`;
  const step = (id) => (['g', 'ml'].includes(INGREDIENTS[id].unit) ? 50 : 1);
  const label = (list, id) => (list.find((x) => x.id === id) || {}).label || id;
  const toggle = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : arr.concat(id));

  // ---------- Recommendation logic ----------

  function quote(id, amount, store) {
    const p = INGREDIENTS[id].prices[store];
    const packs = Math.ceil(amount / p.size);
    return { store, packs, size: p.size, cost: packs * p.price, offer: !!p.was };
  }

  // Cheapest way to buy `amount` of an ingredient across all stores.
  function cheapest(id, amount) {
    return Object.keys(STORES).map((s) => quote(id, amount, s)).sort((a, b) => a.cost - b.cost)[0];
  }

  function fitsDiet(recipe, diet) {
    const kinds = recipe.ingredients.map(([id]) => INGREDIENTS[id].kind);
    switch (diet) {
      case 'vegan': return kinds.every((k) => k === 'plant');
      case 'vegetarian': return !kinds.some((k) => ['fish', 'meat', 'pork'].includes(k));
      case 'pescatarian': return !kinds.some((k) => ['meat', 'pork'].includes(k));
      case 'halal': return !kinds.includes('pork');
      default: return true;
    }
  }

  // Hard constraints: a recipe that breaks one is never recommended.
  function blockReason(recipe) {
    const allergen = recipe.ingredients.flatMap(([id]) => INGREDIENTS[id].allergens).find((a) => state.allergies.includes(a));
    if (allergen) return 'allergy';
    if (!fitsDiet(recipe, state.diet)) return 'diet';
    if (!recipe.equipment.every((e) => state.equipment.includes(e))) return 'equipment';
    return null;
  }

  function analyse(recipe) {
    const items = recipe.ingredients.map(([id, need]) => {
      const have = state.fridge[id] || 0;
      const short = Math.max(0, need - have);
      return { id, need, have, short, buy: short > 0 ? cheapest(id, short) : null };
    });
    const missing = items.filter((i) => i.short > 0);
    const cost = missing.reduce((s, i) => s + i.buy.cost, 0);
    const status = missing.length === 0 ? 'green' : missing.length <= 3 ? 'yellow' : 'red';
    const usage = items.reduce((s, i) => s + Math.min(i.have, i.need) / i.need, 0) / items.length;
    return { recipe, items, missing, cost, status, usage, overBudget: cost > state.budget };
  }

  function visibleRecipes() {
    return RECIPES.filter((r) => !blockReason(r)).map(analyse);
  }

  // k-NN: each recipe becomes a feature vector (ingredients + diet + nutrition + time),
  // and similar recipes are the k nearest by cosine similarity.
  const ING_IDS = Object.keys(INGREDIENTS);
  const FEATURES = {};
  RECIPES.forEach((r) => {
    const n = r.nutrition;
    FEATURES[r.id] = ING_IDS.map((id) => (r.ingredients.some(([i]) => i === id) ? 1 : 0)).concat(
      fitsDiet(r, 'vegan') ? 1 : 0,
      fitsDiet(r, 'vegetarian') ? 1 : 0,
      0.5 * n.kcal / 800, 0.5 * n.protein / 40, 0.5 * n.carbs / 100, 0.5 * n.fat / 40, 0.5 * r.time / 60
    );
  });

  function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  function similar(recipe, k) {
    return RECIPES.filter((r) => r.id !== recipe.id && !blockReason(r))
      .map((r) => ({ a: analyse(r), sim: cosine(FEATURES[recipe.id], FEATURES[r.id]) }))
      .sort((x, y) => y.sim - x.sim)
      .slice(0, k || 3);
  }

  // ---------- Icons ----------

  const ICON_PATHS = {
    fridge: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 10h14M9 6v2M9 13v3"/>',
    recipes: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3"/>',
    cart: '<circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M2.5 3h3l2.4 11.5h10.6l2-8H7"/>',
    settings: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.01"/>',
  };
  const icon = (name, cls) =>
    `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`;

  const STATUS = {
    green: { label: 'Ready to cook', hint: 'You have everything', icon: 'check' },
    yellow: { label: 'Missing a few', hint: '1–3 missing', icon: 'plus' },
    red: { label: 'Missing many', hint: '4+ missing', icon: 'alert' },
  };

  // ---------- Shared pieces ----------

  function brand() {
    return '<p class="brand">cooly <span aria-hidden="true">/</span></p>';
  }

  function chips(list, selected, action, multi) {
    return `<div class="chips" role="group">${list
      .map((x) => {
        const on = multi ? selected.includes(x.id) : selected === x.id;
        return `<button type="button" class="chip" aria-pressed="${on}" data-action="${action}" data-id="${x.id}" data-key="${action}-${x.id}">
          ${on ? icon('check', 'icon-sm') : ''}<span>${x.label}</span></button>`;
      })
      .join('')}</div>`;
  }

  function statusChip(status) {
    const s = STATUS[status];
    return `<span class="status status-${status}">${icon(s.icon, 'icon-sm')}${s.label}</span>`;
  }

  function recipeCard(a, extra) {
    const r = a.recipe;
    const missingText = a.missing.length === 0 ? 'Nothing missing' : `${a.missing.length} missing`;
    return `<li>
      <button type="button" class="recipe-card" data-action="open-recipe" data-id="${r.id}">
        <span class="thumb thumb-${a.status}" aria-hidden="true">${r.emoji}</span>
        <span class="recipe-card-body">
          <span class="recipe-card-title">${r.name}</span>
          <span class="meta">${r.time} min · ${missingText}${extra ? ` · ${extra}` : ''}</span>
          <span class="cost ${a.overBudget ? 'cost-over' : ''}">${euro(a.cost)} to complete${a.overBudget ? ' · over budget' : ''}</span>
        </span>
      </button>
    </li>`;
  }

  function nav() {
    const tabs = [
      ['fridge', 'Fridge', 'fridge'],
      ['recipes', 'Recipes', 'recipes'],
      ['shopping', 'Shopping list', 'cart'],
      ['settings', 'Settings', 'settings'],
    ];
    const active = ui.screen === 'detail' ? 'recipes' : ui.screen;
    const count = state.shopping.filter((i) => !i.checked).length;
    return `<nav class="tabbar" aria-label="Main">${tabs
      .map(([id, name, ic]) => `<button type="button" class="tab" data-action="go" data-id="${id}" ${active === id ? 'aria-current="page"' : ''}>
        <span class="tab-icon">${icon(ic)}${id === 'shopping' && count ? `<span class="badge" aria-hidden="true">${count}</span>` : ''}</span>
        <span>${name}${id === 'shopping' && count ? `<span class="sr-only">, ${count} items</span>` : ''}</span></button>`)
      .join('')}</nav>`;
  }

  // ---------- Screens ----------

  function onboarding() {
    const steps = [
      {
        title: 'Food that fits you.',
        text: 'Any allergies or intolerances? We’ll keep them out of your matches.',
        section: 'Allergies & intolerances',
        body: chips(ALLERGENS, state.allergies, 'toggle-allergy', true),
        note: 'Always check food labels. Recipe matches aren’t a medical safety guarantee.',
        cta: 'Continue',
      },
      {
        title: 'Your plate, your way.',
        text: 'Choose how you like to eat. Good on a budget, good for you.',
        section: 'Dietary preference',
        body: chips(DIETS, state.diet, 'set-diet', false),
        note: 'You can change all of this in Settings.',
        cta: 'Continue',
      },
      {
        title: 'What’s in your kitchen?',
        text: 'No fancy kitchen needed. We’ll work with what you’ve got.',
        section: 'Available equipment',
        body: chips(EQUIPMENT, state.equipment, 'toggle-equipment', true),
        note: 'Only recipes you can make with your equipment will be recommended.',
        cta: 'Open my fridge',
      },
    ];
    const s = steps[ui.step];
    return `<header class="topbar">${brand()}<button type="button" class="link" data-action="finish-onboarding">Skip</button></header>
      <main class="screen onboarding">
        <p class="eyebrow">A quick hello · ${ui.step + 1} of 3</p>
        <div class="progress" role="progressbar" aria-label="Setup progress" aria-valuemin="1" aria-valuemax="3" aria-valuenow="${ui.step + 1}"><span style="width:${((ui.step + 1) / 3) * 100}%"></span></div>
        <h1 tabindex="-1">${s.title}</h1>
        <p class="lead">${s.text}</p>
        <h2 class="section-label">${s.section}</h2>
        ${s.body}
        <p class="note">${s.note}</p>
        <div class="bottom-actions">
          ${ui.step > 0 ? `<button type="button" class="btn btn-ghost" data-action="onboarding-back">${icon('back')}Back</button>` : ''}
          <button type="button" class="btn btn-primary" data-action="onboarding-next">${s.cta}${icon('arrow')}</button>
        </div>
        <p class="tagline">Less waste. More dinner.</p>
      </main>`;
  }

  function fridge() {
    const ids = Object.keys(state.fridge);
    const ready = visibleRecipes().filter((a) => a.status === 'green').length;
    const banner = ids.length
      ? ready
        ? `<button type="button" class="banner" data-action="go" data-id="recipes"><strong>${ready === 1 ? 'A good meal is' : `${ready} meals are`} ready to cook.</strong><span>Use what you have — it won’t wait.</span></button>`
        : `<div class="banner"><strong>Nothing fully ready yet.</strong><span>See what you could make with a small shop.</span></div>`
      : '';
    const list = ids.length
      ? `<ul class="list fridge-list">${ids
          .map((id) => {
            const ing = INGREDIENTS[id];
            return `<li class="fridge-item">
              <div class="fridge-item-head"><span class="emoji" aria-hidden="true">${ing.emoji}</span><span class="fridge-name" id="name-${id}">${ing.name}</span>
                <button type="button" class="icon-btn" data-action="remove-item" data-id="${id}" aria-label="Remove ${ing.name}">${icon('close')}</button></div>
              <div class="stepper">
                <button type="button" class="icon-btn" data-action="dec" data-id="${id}" data-key="dec-${id}" aria-label="Less ${ing.name}">${icon('minus')}</button>
                <input type="number" inputmode="decimal" min="0" step="${step(id)}" value="${state.fridge[id]}" data-action="set-qty" data-id="${id}" aria-labelledby="name-${id}" aria-describedby="unit-${id}">
                <span class="unit" id="unit-${id}">${ing.unit}</span>
                <button type="button" class="icon-btn" data-action="inc" data-id="${id}" data-key="inc-${id}" aria-label="More ${ing.name}">${icon('plus')}</button>
              </div>
            </li>`;
          })
          .join('')}</ul>`
      : `<div class="empty"><p>Your fridge is empty.</p><button type="button" class="link" data-action="sample-fridge">Load a sample fridge</button></div>`;

    return `<header class="topbar">${brand()}</header>
      <main class="screen">
        <h1 tabindex="-1">My fridge</h1>
        <p class="lead">Good food starts with what you have.</p>
        ${banner}
        <button type="button" class="search-btn" data-action="go" data-id="add">${icon('search')}Search and add an ingredient</button>
        <section class="card budget" aria-labelledby="budget-label">
          <div><h2 id="budget-label" class="card-title">Budget per recipe</h2><p class="meta">Max to spend on missing items</p></div>
          <div class="stepper">
            <button type="button" class="icon-btn" data-action="budget-dec" data-key="budget-dec" aria-label="Lower budget">${icon('minus')}</button>
            <output class="budget-value" aria-live="polite">${euro(state.budget)}</output>
            <button type="button" class="icon-btn" data-action="budget-inc" data-key="budget-inc" aria-label="Raise budget">${icon('plus')}</button>
          </div>
        </section>
        <h2 class="section-label">In your fridge</h2>
        ${list}
        ${ids.length ? `<button type="button" class="link small" data-action="clear-fridge">Clear fridge</button>` : ''}
        <div class="sticky-cta"><button type="button" class="btn btn-primary" data-action="go" data-id="recipes">Find recipes${icon('arrow')}</button></div>
      </main>`;
  }

  function addResults() {
    const q = ui.query.trim().toLowerCase();
    const ids = ING_IDS.filter((id) => INGREDIENTS[id].name.toLowerCase().includes(q)).sort((a, b) => INGREDIENTS[a].name.localeCompare(INGREDIENTS[b].name));
    if (!ids.length) return `<p class="empty">No ingredient called “${esc(ui.query)}” yet.</p>`;
    return `<ul class="list">${ids
      .map((id) => {
        const ing = INGREDIENTS[id];
        const inFridge = state.fridge[id] !== undefined;
        return `<li><button type="button" class="row-btn" data-action="add-item" data-id="${id}" data-key="add-${id}" ${inFridge ? 'aria-disabled="true"' : ''}>
          <span class="emoji" aria-hidden="true">${ing.emoji}</span>
          <span class="row-main"><span>${ing.name}</span><span class="meta">from ${euro(cheapest(id, 1).cost)} / pack</span></span>
          ${inFridge ? `<span class="pill">${icon('check', 'icon-sm')}${qty(id, state.fridge[id])}</span>` : `<span class="pill pill-add">${icon('plus', 'icon-sm')}Add</span>`}
        </button></li>`;
      })
      .join('')}</ul>`;
  }

  function add() {
    return `<header class="topbar"><button type="button" class="icon-btn" data-action="go" data-id="fridge" aria-label="Back to my fridge">${icon('back')}</button>${brand()}<span></span></header>
      <main class="screen">
        <h1 tabindex="-1">Add ingredients</h1>
        <p class="lead">A little stock-taking goes a long way.</p>
        <label class="search">${icon('search')}<span class="sr-only">Search ingredients</span>
          <input type="search" id="search" placeholder="e.g. chickpeas" value="${esc(ui.query)}" data-action="search" autocomplete="off"></label>
        <h2 class="section-label">Suggestions</h2>
        <div id="add-results" aria-live="polite">${addResults()}</div>
        <p class="note">Start small. Add what’s there — you can adjust quantities in your fridge.</p>
        <div class="sticky-cta"><button type="button" class="btn btn-primary" data-action="go" data-id="fridge">Done — back to my fridge</button></div>
      </main>`;
  }

  function recipes() {
    const all = visibleRecipes();
    const hidden = RECIPES.length - all.length;
    const order = (a, b) => a.overBudget - b.overBudget || a.cost - b.cost || b.usage - a.usage;
    const groups = ['green', 'yellow', 'red'].map((s) => [s, all.filter((a) => a.status === s).sort(order)]);
    const lastLiked = RECIPES.find((r) => r.id === state.liked[state.liked.length - 1] && !blockReason(r));

    const liked = lastLiked
      ? `<section aria-labelledby="liked-h"><h2 class="section-label" id="liked-h">Because you liked ${lastLiked.name}</h2>
          <ul class="list">${similar(lastLiked, 2).map((x) => recipeCard(x.a)).join('')}</ul></section>`
      : '';

    return `<header class="topbar">${brand()}</header>
      <main class="screen">
        <h1 tabindex="-1">Your recipes</h1>
        <p class="lead">A little AI. A lot less food waste.</p>
        <div class="toolbar">
          <p class="meta">Budget ${euro(state.budget)} · ${all.length} matches</p>
          <button type="button" class="btn btn-small" data-action="go" data-id="filters">${icon('filter')}Filters</button>
        </div>
        ${liked}
        ${groups
          .map(([s, list]) => `<section aria-labelledby="h-${s}">
            <h2 class="group-title group-${s}" id="h-${s}">${icon(STATUS[s].icon, 'icon-sm')}${STATUS[s].label}<span class="meta">${list.length} · ${STATUS[s].hint}</span></h2>
            ${list.length ? `<ul class="list">${list.map((a) => recipeCard(a)).join('')}</ul>` : '<p class="empty small">No recipes here right now.</p>'}
          </section>`)
          .join('')}
        ${hidden ? `<p class="note">${hidden} recipe${hidden === 1 ? '' : 's'} hidden by your allergy, diet or equipment filters.</p>` : ''}
        <p class="note">Example prices from Albert Heijn and Jumbo, not live offers. Check in store.</p>
      </main>`;
  }

  function detail() {
    const r = RECIPES.find((x) => x.id === ui.recipeId);
    const a = analyse(r);
    const have = a.items.filter((i) => i.short === 0);
    const liked = state.liked.includes(r.id);
    const n = r.nutrition;
    const block = blockReason(r);

    return `<header class="topbar"><button type="button" class="icon-btn" data-action="go" data-id="${ui.back}" aria-label="Back">${icon('back')}</button>
        <p class="eyebrow">Recipe</p>
        <button type="button" class="icon-btn like" data-action="like" data-id="${r.id}" data-key="like" aria-pressed="${liked}" aria-label="Like this recipe">${icon('heart')}</button></header>
      <main class="screen detail">
        <div class="hero thumb-${a.status}" aria-hidden="true">${r.emoji}</div>
        ${statusChip(a.status)}
        <h1 tabindex="-1">${r.name}</h1>
        <p class="meta">${icon('clock', 'icon-sm')} ${r.time} min · ${r.servings} serving${r.servings > 1 ? 's' : ''} · ${r.equipment.map((e) => label(EQUIPMENT, e)).join(' + ')}</p>
        ${block ? `<p class="warning">${icon('alert', 'icon-sm')}This recipe doesn’t match your ${block} settings.</p>` : ''}

        <h2>What you’ll need</h2>
        ${have.length ? `<h3 class="sub sub-green">${icon('check', 'icon-sm')}You have</h3>
          <ul class="ing-list">${have.map((i) => `<li><span>${qty(i.id, i.need)} ${INGREDIENTS[i.id].name.toLowerCase()}</span></li>`).join('')}</ul>` : ''}
        ${a.missing.length ? `<h3 class="sub sub-${a.status}">${icon('plus', 'icon-sm')}Missing · ${a.missing.length} ingredient${a.missing.length > 1 ? 's' : ''}</h3>
          <ul class="ing-list">${a.missing
            .map((i) => `<li><span>${qty(i.id, i.short)} ${INGREDIENTS[i.id].name.toLowerCase()}${i.have ? ` <span class="meta">(you have ${qty(i.id, i.have)})</span>` : ''}</span>
              <span class="price">${STORES[i.buy.store]} · ${i.buy.packs} × ${qty(i.id, i.buy.size)} · ${euro(i.buy.cost)}${i.buy.offer ? ' <span class="offer">Offer</span>' : ''}</span></li>`)
            .join('')}</ul>
          <p class="total">Cheapest way to complete: <strong>${euro(a.cost)}</strong>${a.overBudget ? ' <span class="cost-over">· over your budget</span>' : ''}</p>
          <button type="button" class="btn btn-primary no-print" data-action="add-missing" data-id="${r.id}">${icon('cart')}Add missing to shopping list</button>`
          : `<p class="banner"><strong>Dinner without a grocery run.</strong><span>You have everything you need.</span></p>`}

        <h2>Method</h2>
        <ol class="steps">${r.steps.map((s) => `<li>${s}</li>`).join('')}</ol>

        <h2>Nutrition <span class="meta">per serving</span></h2>
        <table class="nutrition">
          <tr><th scope="row">Energy</th><td>${n.kcal} kcal</td></tr>
          <tr><th scope="row">Protein</th><td>${n.protein} g</td></tr>
          <tr><th scope="row">Carbohydrates</th><td>${n.carbs} g</td></tr>
          <tr><th scope="row">Fat</th><td>${n.fat} g</td></tr>
          <tr><th scope="row">Fibre</th><td>${n.fibre} g</td></tr>
        </table>

        <section class="no-print" aria-labelledby="similar-h">
          <h2 id="similar-h">Similar recipes</h2>
          <p class="meta">Found with k-nearest neighbours on ingredients, diet and nutrition.</p>
          <ul class="list">${similar(r, 3).map((x) => recipeCard(x.a, `${Math.round(x.sim * 100)}% similar`)).join('')}</ul>
        </section>

        <div class="bottom-actions no-print">
          <button type="button" class="btn btn-ghost" data-action="export-pdf">${icon('download')}Export as PDF</button>
          <button type="button" class="btn btn-ghost" data-action="go" data-id="${ui.back}">Back to recipes</button>
        </div>
        <p class="print-only note">Exported from Cooly. Example prices, not live offers.</p>
      </main>`;
  }

  function shopping() {
    const items = state.shopping.map((it) => ({ it, buy: cheapest(it.id, it.qty) }));
    const stores = Object.keys(STORES).filter((s) => items.some((x) => x.buy.store === s));
    const open = items.filter((x) => !x.it.checked);
    const total = open.reduce((s, x) => s + x.buy.cost, 0);
    const anyChecked = items.some((x) => x.it.checked);

    const body = items.length
      ? `<section class="card summary" aria-live="polite">
          <p class="meta">${open.length} item${open.length === 1 ? '' : 's'} · ${stores.length} store${stores.length === 1 ? '' : 's'}</p>
          <p class="big">${euro(total)} <span class="meta">to complete your recipes</span></p>
        </section>
        <p class="meta">${[...new Set(state.shopping.flatMap((i) => i.from))].join(' · ')}</p>
        ${stores
          .map((s) => `<section aria-labelledby="store-${s}"><h2 class="store" id="store-${s}">${STORES[s]}</h2>
            <ul class="list">${items
              .filter((x) => x.buy.store === s)
              .map(({ it, buy }) => `<li class="shop-item ${it.checked ? 'checked' : ''}">
                <label><input type="checkbox" data-action="check-item" data-id="${it.id}" data-key="check-${it.id}" ${it.checked ? 'checked' : ''}>
                  <span class="row-main"><span class="shop-name">${INGREDIENTS[it.id].name}</span>
                  <span class="meta">Need ${qty(it.id, it.qty)} · buy ${buy.packs} × ${qty(it.id, buy.size)}${buy.offer ? ' <span class="offer">Offer</span>' : ''}</span></span>
                  <span class="price-strong">${euro(buy.cost)}</span></label>
              </li>`)
              .join('')}</ul></section>`)
          .join('')}
        <p class="note">Example prices, not live offers. Each item is placed at the store where it’s cheapest. Check availability and prices before shopping.</p>
        <div class="bottom-actions">
          ${anyChecked ? `<button type="button" class="btn btn-primary" data-action="bought-to-fridge">${icon('fridge')}Put bought items in my fridge</button>` : ''}
          <button type="button" class="btn btn-ghost" data-action="clear-list">Clear list</button>
        </div>`
      : `<div class="empty"><p>Nothing here yet.</p><p class="meta">Open a recipe and add its missing ingredients.</p>
          <button type="button" class="btn btn-primary" data-action="go" data-id="recipes">Browse recipes</button></div>`;

    return `<header class="topbar">${brand()}</header>
      <main class="screen">
        <h1 tabindex="-1">Shopping list</h1>
        <p class="lead">Small list. Smarter spending.</p>
        ${body}
      </main>`;
  }

  function settings() {
    const themes = [['light', 'Light'], ['dark', 'Dark'], ['system', 'System']];
    const prefs = [
      state.allergies.length ? state.allergies.map((x) => label(ALLERGENS, x)).join(', ') : 'No allergies',
      label(DIETS, state.diet),
      state.equipment.map((x) => label(EQUIPMENT, x)).join(', ') || 'No equipment',
    ].join(' · ');
    return `<header class="topbar">${brand()}</header>
      <main class="screen">
        <h1 tabindex="-1">Settings</h1>
        <p class="lead">Make yourself at home.</p>
        <h2 class="section-label" id="appearance">Appearance</h2>
        <div class="segmented" role="group" aria-labelledby="appearance">${themes
          .map(([id, name]) => `<button type="button" data-action="set-theme" data-id="${id}" data-key="theme-${id}" aria-pressed="${state.theme === id}">${name}</button>`)
          .join('')}</div>
        <h2 class="section-label">Text size</h2>
        <div class="card">
          <label for="text-size" class="card-title">Make cooking steps easy to read</label>
          <div class="range-row"><span aria-hidden="true" class="small-a">A</span>
            <input type="range" id="text-size" min="0" max="2" step="1" value="${state.textSize}" data-action="set-text-size" aria-valuetext="${['Default', 'Large', 'Larger'][state.textSize]}">
            <span aria-hidden="true" class="big-a">A</span></div>
          <p class="meta center">${['Default', 'Large', 'Larger'][state.textSize]}</p>
        </div>
        <h2 class="section-label">Your food preferences</h2>
        <button type="button" class="card row-btn" data-action="go" data-id="filters">
          <span class="row-main"><span class="card-title">Edit preferences</span><span class="meta">${prefs}</span></span>${icon('arrow')}</button>
        <div class="card soft"><p class="card-title">Smart matches, not perfect guesses.</p>
          <p class="meta">Check ingredients and food labels, especially if you have an allergy.</p></div>
        <button type="button" class="link small danger" data-action="reset">Reset all app data</button>
        <p class="note">Cooly · a course prototype · made for student life</p>
      </main>`;
  }

  function filters() {
    const count = visibleRecipes().filter((a) => !a.overBudget).length;
    return `<header class="topbar"><span></span><p class="eyebrow">Filters</p>
        <button type="button" class="icon-btn" data-action="go" data-id="${ui.back}" aria-label="Close filters">${icon('close')}</button></header>
      <main class="screen">
        <h1 tabindex="-1">Make your meal</h1>
        <h2 class="section-label">Allergies</h2>
        ${chips(ALLERGENS, state.allergies, 'toggle-allergy', true)}
        <h2 class="section-label">Diet</h2>
        ${chips(DIETS, state.diet, 'set-diet', false)}
        <h2 class="section-label">Kitchen equipment</h2>
        ${chips(EQUIPMENT, state.equipment, 'toggle-equipment', true)}
        <h2 class="section-label"><label for="max-cost">Maximum cost to complete</label></h2>
        <div class="range-row"><input type="range" id="max-cost" min="0" max="15" step="0.5" value="${state.budget}" data-action="set-budget" aria-valuetext="${euro(state.budget)}">
          <output for="max-cost" class="budget-value">${euro(state.budget)}</output></div>
        <div class="sticky-cta"><button type="button" class="btn btn-primary" data-action="go" data-id="recipes" aria-live="polite">Show ${count} matching recipe${count === 1 ? '' : 's'}</button></div>
      </main>`;
  }

  const SCREENS = { onboarding, fridge, add, recipes, detail, shopping, settings, filters };
  const WITH_NAV = ['fridge', 'recipes', 'detail', 'shopping', 'settings'];

  // ---------- Rendering ----------

  const root = document.getElementById('app');

  function applyPrefs() {
    const html = document.documentElement;
    if (state.theme === 'system') delete html.dataset.theme;
    else html.dataset.theme = state.theme;
    html.style.fontSize = TEXT_SIZES[state.textSize];
  }

  function render(screenChanged) {
    const key = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.key : null;
    applyPrefs();
    root.innerHTML = SCREENS[ui.screen]() + (WITH_NAV.includes(ui.screen) ? nav() : '');
    root.classList.toggle('has-nav', WITH_NAV.includes(ui.screen));
    if (screenChanged) {
      window.scrollTo(0, 0);
      const h1 = root.querySelector('h1');
      if (h1) h1.focus({ preventScroll: true });
    } else if (key) {
      const el = root.querySelector(`[data-key="${key}"]`);
      if (el) el.focus({ preventScroll: true });
    }
  }

  function go(screen) {
    if (screen === 'filters' || screen === 'detail') {
      if (ui.screen !== 'filters' && ui.screen !== 'detail') ui.back = ui.screen;
    }
    if (screen === 'add') ui.query = '';
    ui.screen = screen;
    render(true);
  }

  function update() {
    save();
    render(false);
  }

  // ---------- Actions ----------

  const actions = {
    go: (el) => go(el.dataset.id),
    'toggle-allergy': (el) => { state.allergies = toggle(state.allergies, el.dataset.id); update(); },
    'set-diet': (el) => { state.diet = el.dataset.id; update(); },
    'toggle-equipment': (el) => { state.equipment = toggle(state.equipment, el.dataset.id); update(); },
    'onboarding-next': () => { if (ui.step < 2) { ui.step++; render(true); } else actions['finish-onboarding'](); },
    'onboarding-back': () => { ui.step--; render(true); },
    'finish-onboarding': () => { state.onboarded = true; save(); go('fridge'); },
    inc: (el) => { const id = el.dataset.id; state.fridge[id] += step(id); update(); },
    dec: (el) => { const id = el.dataset.id; state.fridge[id] = Math.max(0, state.fridge[id] - step(id)); update(); },
    'set-qty': (el) => { state.fridge[el.dataset.id] = Math.max(0, Number(el.value) || 0); update(); },
    'remove-item': (el) => { delete state.fridge[el.dataset.id]; save(); render(true); },
    'clear-fridge': () => { state.fridge = {}; update(); },
    'sample-fridge': () => { state.fridge = Object.assign({}, SAMPLE_FRIDGE); update(); },
    'budget-inc': () => { state.budget = Math.min(50, state.budget + 0.5); update(); },
    'budget-dec': () => { state.budget = Math.max(0, state.budget - 0.5); update(); },
    'set-budget': (el) => { state.budget = Number(el.value); update(); },
    search: (el) => { ui.query = el.value; document.getElementById('add-results').innerHTML = addResults(); },
    'add-item': (el) => {
      const id = el.dataset.id;
      if (state.fridge[id] !== undefined) return;
      state.fridge[id] = { g: 100, ml: 100, pcs: 1, cloves: 2 }[INGREDIENTS[id].unit];
      save();
      document.getElementById('add-results').innerHTML = addResults();
      const btn = root.querySelector(`[data-key="add-${id}"]`);
      if (btn) btn.focus();
    },
    'open-recipe': (el) => { ui.recipeId = el.dataset.id; go('detail'); },
    like: (el) => { state.liked = toggle(state.liked, el.dataset.id); update(); },
    'add-missing': (el) => {
      const r = RECIPES.find((x) => x.id === el.dataset.id);
      analyse(r).missing.forEach((m) => {
        const existing = state.shopping.find((i) => i.id === m.id);
        if (existing) {
          existing.qty += m.short;
          if (!existing.from.includes(r.name)) existing.from.push(r.name);
        } else {
          state.shopping.push({ id: m.id, qty: m.short, checked: false, from: [r.name] });
        }
      });
      save();
      go('shopping');
    },
    'check-item': (el) => { state.shopping.find((i) => i.id === el.dataset.id).checked = el.checked; update(); },
    'bought-to-fridge': () => {
      state.shopping.filter((i) => i.checked).forEach((i) => {
        const buy = cheapest(i.id, i.qty);
        state.fridge[i.id] = (state.fridge[i.id] || 0) + buy.packs * buy.size;
      });
      state.shopping = state.shopping.filter((i) => !i.checked);
      update();
    },
    'clear-list': () => { state.shopping = []; update(); },
    'export-pdf': () => window.print(),
    'set-theme': (el) => { state.theme = el.dataset.id; update(); },
    'set-text-size': (el) => { state.textSize = Number(el.value); update(); },
    reset: () => {
      if (!window.confirm('Reset all Cooly data on this device?')) return;
      state = JSON.parse(JSON.stringify(DEFAULTS));
      ui.step = 0;
      save();
      go('onboarding');
    },
  };

  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.tagName === 'INPUT') return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el);
  });

  root.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.action && el.dataset.action !== 'search' && actions[el.dataset.action]) actions[el.dataset.action](el);
  });

  root.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.action === 'search') actions.search(el);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyPrefs());

  render(true);
})();
