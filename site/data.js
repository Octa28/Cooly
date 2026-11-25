// Curated data for the Cooly prototype.
// Prices are example prices, not live offers. `was` marks an item that is on offer.

const STORES = {
  ah: 'Albert Heijn',
  jumbo: 'Jumbo',
};

const ALLERGENS = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'lactose', label: 'Lactose' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'soy', label: 'Soy' },
  { id: 'fish', label: 'Fish' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'shellfish', label: 'Shellfish' },
];

const DIETS = [
  { id: 'any', label: 'No preference' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'halal', label: 'Halal' },
  { id: 'pescatarian', label: 'Pescatarian' },
];

const EQUIPMENT = [
  { id: 'stove', label: 'Stove' },
  { id: 'oven', label: 'Oven' },
  { id: 'microwave', label: 'Microwave' },
  { id: 'airfryer', label: 'Air fryer' },
  { id: 'blender', label: 'Blender' },
  { id: 'kettle', label: 'Kettle' },
];

// kind: plant | dairy | egg | fish | meat | pork (used for diet filters)
const INGREDIENTS = {
  pasta:           { name: 'Pasta',            emoji: '🍝', unit: 'g',      kind: 'plant', allergens: ['gluten'],         prices: { ah: { size: 500, price: 1.09 }, jumbo: { size: 500, price: 0.99 } } },
  rice:            { name: 'Rice',             emoji: '🍚', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 1000, price: 1.79 }, jumbo: { size: 1000, price: 1.59 } } },
  noodles:         { name: 'Noodles',          emoji: '🍜', unit: 'g',      kind: 'plant', allergens: ['gluten'],         prices: { ah: { size: 250, price: 1.29 }, jumbo: { size: 250, price: 1.19 } } },
  bread:           { name: 'Bread',            emoji: '🍞', unit: 'g',      kind: 'plant', allergens: ['gluten'],         prices: { ah: { size: 800, price: 1.39 }, jumbo: { size: 800, price: 1.29 } } },
  tortillas:       { name: 'Tortilla wraps',   emoji: '🌯', unit: 'pcs',    kind: 'plant', allergens: ['gluten'],         prices: { ah: { size: 8, price: 1.49 }, jumbo: { size: 8, price: 1.39 } } },
  flour:           { name: 'Flour',            emoji: '🌾', unit: 'g',      kind: 'plant', allergens: ['gluten'],         prices: { ah: { size: 1000, price: 0.89 }, jumbo: { size: 1000, price: 0.79 } } },
  oats:            { name: 'Oats',             emoji: '🥣', unit: 'g',      kind: 'plant', allergens: ['gluten'],         prices: { ah: { size: 500, price: 0.99 }, jumbo: { size: 500, price: 0.89 } } },
  potatoes:        { name: 'Potatoes',         emoji: '🥔', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 1500, price: 1.99 }, jumbo: { size: 1500, price: 1.79 } } },
  sweet_potato:    { name: 'Sweet potato',     emoji: '🍠', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 500, price: 1.69 }, jumbo: { size: 500, price: 1.49 } } },
  tomatoes:        { name: 'Tomatoes',         emoji: '🍅', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 500, price: 1.49 }, jumbo: { size: 500, price: 1.29 } } },
  canned_tomatoes: { name: 'Canned tomatoes',  emoji: '🥫', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 400, price: 0.65 }, jumbo: { size: 400, price: 0.59 } } },
  spinach:         { name: 'Spinach',          emoji: '🥬', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 300, price: 1.79 }, jumbo: { size: 300, price: 1.49, was: 1.79 } } },
  onion:           { name: 'Onion',            emoji: '🧅', unit: 'pcs',    kind: 'plant', allergens: [],                 prices: { ah: { size: 3, price: 0.89 }, jumbo: { size: 3, price: 0.85 } } },
  garlic:          { name: 'Garlic',           emoji: '🧄', unit: 'cloves', kind: 'plant', allergens: [],                 prices: { ah: { size: 10, price: 0.45 }, jumbo: { size: 10, price: 0.49 } } },
  bell_pepper:     { name: 'Bell pepper',      emoji: '🫑', unit: 'pcs',    kind: 'plant', allergens: [],                 prices: { ah: { size: 3, price: 1.99 }, jumbo: { size: 3, price: 1.79 } } },
  carrot:          { name: 'Carrots',          emoji: '🥕', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 1000, price: 0.99 }, jumbo: { size: 1000, price: 0.89 } } },
  mushrooms:       { name: 'Mushrooms',        emoji: '🍄', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 250, price: 0.99, was: 1.29 }, jumbo: { size: 250, price: 1.19 } } },
  frozen_veg:      { name: 'Frozen mixed veg', emoji: '🥦', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 450, price: 1.29 }, jumbo: { size: 450, price: 1.15 } } },
  banana:          { name: 'Bananas',          emoji: '🍌', unit: 'pcs',    kind: 'plant', allergens: [],                 prices: { ah: { size: 5, price: 1.29 }, jumbo: { size: 5, price: 1.19 } } },
  chickpeas:       { name: 'Chickpeas',        emoji: '🫘', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 400, price: 0.79 }, jumbo: { size: 400, price: 0.69 } } },
  black_beans:     { name: 'Black beans',      emoji: '🫘', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 400, price: 0.89 }, jumbo: { size: 400, price: 0.79 } } },
  lentils:         { name: 'Red lentils',      emoji: '🥣', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 500, price: 1.69 }, jumbo: { size: 500, price: 1.49 } } },
  tofu:            { name: 'Tofu',             emoji: '🧈', unit: 'g',      kind: 'plant', allergens: ['soy'],            prices: { ah: { size: 375, price: 2.19 }, jumbo: { size: 375, price: 1.99 } } },
  coconut_milk:    { name: 'Coconut milk',     emoji: '🥥', unit: 'ml',     kind: 'plant', allergens: [],                 prices: { ah: { size: 400, price: 1.49 }, jumbo: { size: 400, price: 1.39 } } },
  curry_paste:     { name: 'Curry paste',      emoji: '🍛', unit: 'g',      kind: 'plant', allergens: [],                 prices: { ah: { size: 100, price: 1.99 }, jumbo: { size: 100, price: 1.79 } } },
  soy_sauce:       { name: 'Soy sauce',        emoji: '🍶', unit: 'ml',     kind: 'plant', allergens: ['soy', 'gluten'],  prices: { ah: { size: 150, price: 1.49 }, jumbo: { size: 150, price: 1.29 } } },
  peanut_butter:   { name: 'Peanut butter',    emoji: '🥜', unit: 'g',      kind: 'plant', allergens: ['nuts'],           prices: { ah: { size: 350, price: 2.29 }, jumbo: { size: 350, price: 1.99 } } },
  eggs:            { name: 'Eggs',             emoji: '🥚', unit: 'pcs',    kind: 'egg',   allergens: ['eggs'],           prices: { ah: { size: 6, price: 1.89 }, jumbo: { size: 10, price: 2.79 } } },
  milk:            { name: 'Milk',             emoji: '🥛', unit: 'ml',     kind: 'dairy', allergens: ['lactose'],        prices: { ah: { size: 1000, price: 1.15 }, jumbo: { size: 1000, price: 1.09 } } },
  butter:          { name: 'Butter',           emoji: '🧈', unit: 'g',      kind: 'dairy', allergens: ['lactose'],        prices: { ah: { size: 250, price: 2.49 }, jumbo: { size: 250, price: 2.29 } } },
  cooking_cream:   { name: 'Cooking cream',    emoji: '🥛', unit: 'ml',     kind: 'dairy', allergens: ['lactose'],        prices: { ah: { size: 200, price: 0.89 }, jumbo: { size: 200, price: 0.85 } } },
  grated_cheese:   { name: 'Grated cheese',    emoji: '🧀', unit: 'g',      kind: 'dairy', allergens: ['lactose'],        prices: { ah: { size: 150, price: 1.99 }, jumbo: { size: 150, price: 1.29, was: 1.89 } } },
  tuna:            { name: 'Canned tuna',      emoji: '🐟', unit: 'g',      kind: 'fish',  allergens: ['fish'],           prices: { ah: { size: 145, price: 1.39 }, jumbo: { size: 145, price: 1.19 } } },
  chicken:         { name: 'Chicken breast',   emoji: '🍗', unit: 'g',      kind: 'meat',  allergens: [],                 prices: { ah: { size: 300, price: 3.99 }, jumbo: { size: 300, price: 3.49, was: 3.99 } } },
  bacon:           { name: 'Bacon',            emoji: '🥓', unit: 'g',      kind: 'pork',  allergens: [],                 prices: { ah: { size: 125, price: 1.99 }, jumbo: { size: 125, price: 1.89 } } },
};

// Quantities are for the whole recipe; nutrition is per serving.
// Basics (oil, salt, pepper, spices) are assumed to be in every student kitchen.
const RECIPES = [
  {
    id: 'fried-rice', name: 'Egg & tomato fried rice', emoji: '🍳', time: 15, servings: 2, equipment: ['stove'],
    ingredients: [['rice', 250], ['eggs', 2], ['tomatoes', 200], ['onion', 1], ['soy_sauce', 15]],
    nutrition: { kcal: 520, protein: 17, carbs: 92, fat: 9, fibre: 3 },
    steps: ['Cook the rice and let it cool a little (day-old rice works best).', 'Fry the chopped onion in a little oil until soft.', 'Add the diced tomatoes and cook for 3 minutes.', 'Push everything aside, scramble the eggs in the pan.', 'Stir in the rice and soy sauce and fry for 3 more minutes.'],
  },
  {
    id: 'creamy-pasta', name: 'Creamy tomato & spinach pasta', emoji: '🍝', time: 20, servings: 2, equipment: ['stove'],
    ingredients: [['pasta', 150], ['tomatoes', 200], ['spinach', 100], ['cooking_cream', 200], ['grated_cheese', 100], ['garlic', 2]],
    nutrition: { kcal: 640, protein: 22, carbs: 64, fat: 32, fibre: 5 },
    steps: ['Boil the pasta in salted water.', 'Fry the garlic, then add the chopped tomatoes for 5 minutes.', 'Pour in the cream and let it bubble gently.', 'Stir in the spinach until wilted, then the cheese.', 'Mix with the drained pasta.'],
  },
  {
    id: 'chickpea-curry', name: 'Chickpea & sweet potato curry', emoji: '🍛', time: 30, servings: 3, equipment: ['stove'],
    ingredients: [['chickpeas', 400], ['sweet_potato', 400], ['coconut_milk', 400], ['curry_paste', 50], ['onion', 1], ['rice', 150]],
    nutrition: { kcal: 590, protein: 15, carbs: 78, fat: 24, fibre: 11 },
    steps: ['Start the rice.', 'Fry the onion, then the curry paste for 1 minute.', 'Add diced sweet potato and coconut milk; simmer 15 minutes.', 'Add the drained chickpeas and cook 5 more minutes.', 'Serve over the rice.'],
  },
  {
    id: 'shakshuka', name: 'Shakshuka with bread', emoji: '🍳', time: 25, servings: 2, equipment: ['stove'],
    ingredients: [['eggs', 4], ['canned_tomatoes', 400], ['bell_pepper', 1], ['onion', 1], ['garlic', 2], ['bread', 200]],
    nutrition: { kcal: 470, protein: 23, carbs: 58, fat: 15, fibre: 7 },
    steps: ['Fry onion, pepper and garlic until soft.', 'Add the canned tomatoes and simmer 10 minutes.', 'Make 4 wells and crack in the eggs.', 'Cover and cook until the whites are set.', 'Serve with bread for dipping.'],
  },
  {
    id: 'lentil-dal', name: 'Red lentil dal', emoji: '🥣', time: 30, servings: 3, equipment: ['stove'],
    ingredients: [['lentils', 200], ['canned_tomatoes', 400], ['onion', 1], ['garlic', 3], ['curry_paste', 30], ['rice', 150]],
    nutrition: { kcal: 430, protein: 19, carbs: 76, fat: 5, fibre: 10 },
    steps: ['Start the rice.', 'Fry onion and garlic, then the curry paste.', 'Add lentils, tomatoes and 500 ml water.', 'Simmer 20 minutes, stirring now and then, until thick.', 'Serve with the rice.'],
  },
  {
    id: 'tuna-bake', name: 'Tuna pasta bake', emoji: '🐟', time: 35, servings: 3, equipment: ['stove', 'oven'],
    ingredients: [['pasta', 250], ['tuna', 145], ['canned_tomatoes', 400], ['grated_cheese', 75], ['onion', 1]],
    nutrition: { kcal: 520, protein: 30, carbs: 70, fat: 12, fibre: 5 },
    steps: ['Heat the oven to 200 °C and boil the pasta.', 'Fry the onion, add the tomatoes and simmer 5 minutes.', 'Mix in the tuna and the drained pasta.', 'Put it in a dish, top with cheese.', 'Bake 15 minutes until golden.'],
  },
  {
    id: 'omelette', name: 'Veggie omelette', emoji: '🍳', time: 10, servings: 1, equipment: ['stove'],
    ingredients: [['eggs', 3], ['spinach', 50], ['mushrooms', 100], ['grated_cheese', 30]],
    nutrition: { kcal: 390, protein: 28, carbs: 4, fat: 28, fibre: 2 },
    steps: ['Fry the sliced mushrooms until golden.', 'Add the spinach until wilted.', 'Pour over the beaten eggs.', 'Sprinkle cheese, fold and serve.'],
  },
  {
    id: 'tofu-noodles', name: 'Tofu stir-fry noodles', emoji: '🍜', time: 20, servings: 2, equipment: ['stove'],
    ingredients: [['noodles', 200], ['tofu', 200], ['bell_pepper', 1], ['carrot', 150], ['soy_sauce', 30], ['garlic', 2]],
    nutrition: { kcal: 560, protein: 24, carbs: 82, fat: 14, fibre: 6 },
    steps: ['Cook the noodles and drain.', 'Fry cubed tofu until crispy, set aside.', 'Stir-fry pepper, carrot and garlic for 4 minutes.', 'Add noodles, tofu and soy sauce; toss well.'],
  },
  {
    id: 'bean-wraps', name: 'Black bean wraps', emoji: '🌯', time: 20, servings: 2, equipment: ['stove'],
    ingredients: [['tortillas', 4], ['black_beans', 400], ['bell_pepper', 1], ['rice', 100], ['grated_cheese', 50], ['onion', 1]],
    nutrition: { kcal: 610, protein: 25, carbs: 92, fat: 15, fibre: 14 },
    steps: ['Cook the rice.', 'Fry onion and pepper, add the drained beans and mash a little.', 'Warm the wraps in a dry pan.', 'Fill with rice, beans and cheese, then roll up.'],
  },
  {
    id: 'pb-oats', name: 'Peanut butter banana oats', emoji: '🥣', time: 5, servings: 1, equipment: ['microwave'],
    ingredients: [['oats', 80], ['milk', 250], ['banana', 1], ['peanut_butter', 20]],
    nutrition: { kcal: 560, protein: 20, carbs: 80, fat: 19, fibre: 9 },
    steps: ['Mix oats and milk in a bowl.', 'Microwave 2 minutes, stir, then 1 more minute.', 'Top with sliced banana and peanut butter.'],
  },
  {
    id: 'airfryer-potatoes', name: 'Crispy potatoes & fried eggs', emoji: '🥔', time: 25, servings: 2, equipment: ['airfryer', 'stove'],
    ingredients: [['potatoes', 500], ['eggs', 2], ['onion', 1]],
    nutrition: { kcal: 410, protein: 14, carbs: 50, fat: 16, fibre: 6 },
    steps: ['Cut the potatoes into cubes and toss with oil and salt.', 'Air fry at 200 °C for 18–20 minutes, shaking halfway.', 'Fry the sliced onion until golden.', 'Fry the eggs and serve on top.'],
  },
  {
    id: 'chicken-rice', name: 'Chicken & veggie rice', emoji: '🍗', time: 25, servings: 3, equipment: ['stove'],
    ingredients: [['chicken', 300], ['rice', 200], ['frozen_veg', 200], ['soy_sauce', 20], ['garlic', 2]],
    nutrition: { kcal: 480, protein: 33, carbs: 64, fat: 8, fibre: 4 },
    steps: ['Cook the rice.', 'Fry diced chicken until cooked through.', 'Add garlic and frozen veg for 5 minutes.', 'Stir in rice and soy sauce.'],
  },
  {
    id: 'bacon-pasta', name: 'Bacon & egg pasta', emoji: '🥓', time: 15, servings: 2, equipment: ['stove'],
    ingredients: [['pasta', 200], ['bacon', 125], ['eggs', 2], ['grated_cheese', 50]],
    nutrition: { kcal: 690, protein: 32, carbs: 74, fat: 28, fibre: 3 },
    steps: ['Boil the pasta.', 'Fry the bacon until crispy.', 'Beat eggs with the cheese.', 'Off the heat, mix pasta, bacon and egg mix quickly so it turns creamy.'],
  },
  {
    id: 'mushroom-risotto', name: 'Easy mushroom risotto', emoji: '🍄', time: 30, servings: 2, equipment: ['stove'],
    ingredients: [['rice', 200], ['mushrooms', 250], ['onion', 1], ['garlic', 2], ['grated_cheese', 40], ['butter', 20]],
    nutrition: { kcal: 560, protein: 15, carbs: 84, fat: 17, fibre: 3 },
    steps: ['Fry onion and garlic in the butter.', 'Add mushrooms and cook until golden.', 'Add the rice, then hot water a ladle at a time, stirring, for 18 minutes.', 'Stir in the cheese and season.'],
  },
  {
    id: 'banana-pancakes', name: 'Banana pancakes', emoji: '🥞', time: 15, servings: 2, equipment: ['stove'],
    ingredients: [['flour', 150], ['milk', 250], ['eggs', 1], ['banana', 1], ['butter', 10]],
    nutrition: { kcal: 420, protein: 13, carbs: 70, fat: 10, fibre: 3 },
    steps: ['Mash the banana, whisk in egg and milk.', 'Stir in the flour until smooth.', 'Melt a little butter in a pan.', 'Fry small pancakes about 2 minutes per side.'],
  },
  {
    id: 'tomato-soup', name: 'Tomato soup with toast', emoji: '🍅', time: 25, servings: 3, equipment: ['stove', 'blender'],
    ingredients: [['canned_tomatoes', 800], ['onion', 1], ['garlic', 2], ['carrot', 150], ['bread', 150]],
    nutrition: { kcal: 260, protein: 8, carbs: 46, fat: 4, fibre: 7 },
    steps: ['Fry onion, garlic and grated carrot until soft.', 'Add tomatoes and 300 ml water; simmer 15 minutes.', 'Blend until smooth and season.', 'Serve with toasted bread.'],
  },
];
