# Cooly

**An AI-driven recipe recommender for students on a strict budget, built as a mobile web application.**

Cooly helps students cook with what they already have. You tell it what's in your fridge (with quantities) and how much you're willing to spend, and it recommends recipes from a curated set that best match your ingredients. When something is missing, it uses current offers from Dutch supermarkets to show the cheapest way to complete the recipe, so you waste less food and spend less on groceries.

| | |
|---|---|
| **Domain** | Budget cooking / grocery sharing |
| **Target users** | Students on a strict budget |
| **System goal** | AI-driven recommendation |
| **Platform** | Mobile web application |

---

## How it works

1. **Tell Cooly about yourself.** A short onboarding asks for allergies and intolerances, dietary preferences and the kitchen equipment you have.
2. **Fill your fridge.** Add the ingredients you have, with quantities (e.g. spinach 100 g, tomatoes 200 g, pasta 150 g).
3. **Set your budget.** Choose the maximum you're willing to spend to complete a recipe.
4. **Get recipes, grouped by how ready you are to cook them:**

   | List | Meaning |
   |---|---|
   | 🟢 **Ready to cook** | You have everything. Cook right away. |
   | 🟡 **Missing a few** | A few ingredients missing (about 1–3). |
   | 🔴 **Missing many** | Many ingredients missing (4+). |

5. **Complete a recipe cheaply.** For missing ingredients, Cooly checks current offers at supermarkets such as **Albert Heijn** and **Jumbo** and shows the cheapest way to buy them. Missing items can be added to a shopping list grouped by store.
6. **Discover alternatives.** A **k-nearest-neighbours (k-NN)** model suggests recipes similar to the ones you like.

## Features

- Ingredient-based recipe matching with quantities
- Budget-aware results: each recipe shows the cost to complete it
- Colour-coded result lists (green / yellow / red)
- Cheapest completion using Albert Heijn and Jumbo offers
- Shopping list grouped by supermarket, with a running total
- Similar-recipe suggestions using k-NN
- Filters for **allergies**, **dietary preferences** (e.g. vegan, vegetarian, halal, pescatarian) and **available kitchen equipment** (e.g. stove, oven, microwave, air fryer, blender, kettle)
- **Nutritional values** for every recipe
- **Recipe export as PDF**
- **Dark theme** (light, dark or follow system)
- **Accessible design** following the WCAG guidelines, including adjustable text size for cooking steps

## Screens

The UI is designed in light and dark variants for every screen.

| # | Screen | Purpose |
|---|---|---|
| 01 | Allergies | Onboarding: allergies and intolerances |
| 02 | Diet | Onboarding: dietary preference |
| 03 | Kitchen | Onboarding: available equipment |
| 04 | My fridge | Ingredients you have, with quantities |
| 05 | Add ingredients | Search and add ingredients to the fridge |
| 06 | Recipe results | Green / yellow / red recipe lists |
| 07 | Recipe detail | Ingredients you have vs. missing, cost to complete, similar recipes |
| 08 | Shopping list | Missing ingredients grouped by store, total cost |
| 09 | Settings | Appearance, text size, food preferences |
| 10 | Filters | Allergies, diet, equipment, maximum cost |

Main navigation: **Fridge · Recipes · Shopping list · Settings**

## Recommendation approach

- **Matching:** each recipe in the curated set is scored against the user's fridge, taking ingredient quantities into account, and placed in the green, yellow or red list depending on how many ingredients are missing.
- **Budget:** the cost of the missing ingredients is calculated from supermarket offers, and recipes over the user's budget are filtered out or ranked lower.
- **Similar recipes:** recipes are represented as feature vectors (ingredients, diet, equipment, nutrition), and a k-NN model returns the closest recipes to one the user likes.
- **Filters:** allergies, diet and equipment are hard constraints, so a recipe that doesn't fit is never recommended.

> Cooly is a helper, not a safety tool. Always check food labels; recipe matches are not a medical guarantee for allergies.

## Repository structure

```
Cooly/
├── main.ipynb       # Data exploration and model prototyping (pandas, NumPy)
├── site/
│   └── index.html   # Mobile web app
└── README.md
```

## Getting started

```bash
git clone https://github.com/Octa28/Cooly.git
cd Cooly
```

- **Web app:** open `site/index.html` in a browser (use your browser's mobile view for the intended layout).
- **Notebook:** open `main.ipynb` in Jupyter or VS Code with Python 3.11 and install the dependencies:

```bash
pip install pandas numpy jupyter
```

## Why this target group

We chose budget-conscious students because we can easily reach them on campus for interviews and prototype testing.

## Team

We are six Romanian students from different cities, with different backgrounds, interests and budgets, and one team member has ADHD. Although we share a nationality, these differences helped us question our assumptions about who will use the system and what they can afford or manage.

## Status

Early development, as a course project.
