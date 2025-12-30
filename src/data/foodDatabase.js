export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
};

export const FOOD_CATEGORIES = {
  PROTEIN: 'Protein',
  CARBS: 'Carbs',
  VEGETABLES: 'Vegetables',
  FRUITS: 'Fruits',
  DAIRY: 'Dairy',
  SNACKS: 'Snacks',
  BEVERAGES: 'Beverages',
};

// Common foods database (per 100g or standard serving)
export const COMMON_FOODS = [
  // Protein
  {
    id: 'chicken_breast',
    name: 'Chicken Breast',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    serving: '100g',
  },
  {
    id: 'salmon',
    name: 'Salmon',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 208,
    protein: 20,
    carbs: 0,
    fats: 13,
    serving: '100g',
  },
  {
    id: 'eggs',
    name: 'Eggs (2 large)',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 140,
    protein: 12,
    carbs: 1,
    fats: 10,
    serving: '2 eggs',
  },
  {
    id: 'greek_yogurt',
    name: 'Greek Yogurt',
    category: FOOD_CATEGORIES.DAIRY,
    calories: 97,
    protein: 10,
    carbs: 3.6,
    fats: 5,
    serving: '100g',
  },
  {
    id: 'tuna',
    name: 'Tuna (canned)',
    category: FOOD_CATEGORIES.PROTEIN,
    calories: 116,
    protein: 26,
    carbs: 0,
    fats: 1,
    serving: '100g',
  },

  // Carbs
  {
    id: 'brown_rice',
    name: 'Brown Rice',
    category: FOOD_CATEGORIES.CARBS,
    calories: 112,
    protein: 2.6,
    carbs: 24,
    fats: 0.9,
    serving: '100g cooked',
  },
  {
    id: 'white_rice',
    name: 'White Rice',
    category: FOOD_CATEGORIES.CARBS,
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    serving: '100g cooked',
  },
  {
    id: 'oatmeal',
    name: 'Oatmeal',
    category: FOOD_CATEGORIES.CARBS,
    calories: 71,
    protein: 2.5,
    carbs: 12,
    fats: 1.5,
    serving: '100g cooked',
  },
  {
    id: 'whole_wheat_bread',
    name: 'Whole Wheat Bread',
    category: FOOD_CATEGORIES.CARBS,
    calories: 247,
    protein: 13,
    carbs: 41,
    fats: 3.4,
    serving: '100g (3-4 slices)',
  },
  {
    id: 'sweet_potato',
    name: 'Sweet Potato',
    category: FOOD_CATEGORIES.CARBS,
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fats: 0.1,
    serving: '100g',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    category: FOOD_CATEGORIES.CARBS,
    calories: 131,
    protein: 5,
    carbs: 25,
    fats: 1.1,
    serving: '100g cooked',
  },

  // Vegetables
  {
    id: 'broccoli',
    name: 'Broccoli',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fats: 0.4,
    serving: '100g',
  },
  {
    id: 'spinach',
    name: 'Spinach',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fats: 0.4,
    serving: '100g',
  },
  {
    id: 'carrots',
    name: 'Carrots',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 41,
    protein: 0.9,
    carbs: 10,
    fats: 0.2,
    serving: '100g',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    category: FOOD_CATEGORIES.VEGETABLES,
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fats: 0.2,
    serving: '100g',
  },

  // Fruits
  {
    id: 'banana',
    name: 'Banana',
    category: FOOD_CATEGORIES.FRUITS,
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fats: 0.3,
    serving: '1 medium (100g)',
  },
  {
    id: 'apple',
    name: 'Apple',
    category: FOOD_CATEGORIES.FRUITS,
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fats: 0.2,
    serving: '1 medium (100g)',
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    category: FOOD_CATEGORIES.FRUITS,
    calories: 32,
    protein: 0.7,
    carbs: 8,
    fats: 0.3,
    serving: '100g',
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    category: FOOD_CATEGORIES.FRUITS,
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fats: 0.3,
    serving: '100g',
  },

  // Snacks
  {
    id: 'almonds',
    name: 'Almonds',
    category: FOOD_CATEGORIES.SNACKS,
    calories: 579,
    protein: 21,
    carbs: 22,
    fats: 50,
    serving: '100g (about 23 nuts)',
  },
  {
    id: 'peanut_butter',
    name: 'Peanut Butter',
    category: FOOD_CATEGORIES.SNACKS,
    calories: 588,
    protein: 25,
    carbs: 20,
    fats: 50,
    serving: '100g (about 6 tbsp)',
  },
  {
    id: 'protein_bar',
    name: 'Protein Bar',
    category: FOOD_CATEGORIES.SNACKS,
    calories: 200,
    protein: 20,
    carbs: 22,
    fats: 8,
    serving: '1 bar (60g)',
  },

  // Dairy
  {
    id: 'milk',
    name: 'Milk (whole)',
    category: FOOD_CATEGORIES.DAIRY,
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fats: 3.3,
    serving: '100ml',
  },
  {
    id: 'cheese',
    name: 'Cheddar Cheese',
    category: FOOD_CATEGORIES.DAIRY,
    calories: 403,
    protein: 25,
    carbs: 1.3,
    fats: 33,
    serving: '100g',
  },

  // Beverages
  {
    id: 'protein_shake',
    name: 'Protein Shake',
    category: FOOD_CATEGORIES.BEVERAGES,
    calories: 120,
    protein: 24,
    carbs: 3,
    fats: 1.5,
    serving: '1 scoop (30g)',
  },
  {
    id: 'coffee_black',
    name: 'Black Coffee',
    category: FOOD_CATEGORIES.BEVERAGES,
    calories: 2,
    protein: 0.3,
    carbs: 0,
    fats: 0,
    serving: '1 cup (240ml)',
  },
];

// Search foods by name or category
export const searchFoods = (query, customFoods = []) => {
  const allFoods = [...COMMON_FOODS, ...customFoods];
  const lowerQuery = query.toLowerCase();

  return allFoods.filter(food =>
    food.name.toLowerCase().includes(lowerQuery) ||
    food.category.toLowerCase().includes(lowerQuery)
  );
};

// Get foods by category
export const getFoodsByCategory = (category, customFoods = []) => {
  const allFoods = [...COMMON_FOODS, ...customFoods];
  return allFoods.filter(food => food.category === category);
};
