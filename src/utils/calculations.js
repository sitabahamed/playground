export const calculations = {
  // Calculate total calories from foods
  getTotalCalories(foods) {
    return foods.reduce((total, food) => total + (food.calories || 0), 0);
  },

  // Calculate total macros
  getTotalMacros(foods) {
    return foods.reduce(
      (totals, food) => ({
        protein: totals.protein + (food.protein || 0),
        carbs: totals.carbs + (food.carbs || 0),
        fats: totals.fats + (food.fats || 0),
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );
  },

  // Calculate percentage of goal
  getProgressPercentage(current, goal) {
    if (!goal) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  },

  // Get foods by meal type
  getFoodsByMeal(foods, mealType) {
    return foods.filter(food => food.mealType === mealType);
  },

  // Calculate calories from macros
  calculateCaloriesFromMacros(protein, carbs, fats) {
    return protein * 4 + carbs * 4 + fats * 9;
  },

  // Format date for display
  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  },

  // Get today's date in YYYY-MM-DD format
  getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },

  // Get date string for any date
  getDateString(date) {
    return new Date(date).toISOString().split('T')[0];
  },
};
