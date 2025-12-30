import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ProgressRing from '../components/ProgressRing';
import MacroBar from '../components/MacroBar';
import FoodItem from '../components/FoodItem';
import { storage } from '../utils/storage';
import { calculations } from '../utils/calculations';
import { MEAL_TYPES } from '../data/foodDatabase';

export default function DashboardScreen({ navigation }) {
  const [todayLog, setTodayLog] = useState({ foods: [], water: 0 });
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const today = calculations.getTodayDate();
    const log = await storage.getDailyLog(today);
    const profile = await storage.getUserProfile();
    setTodayLog(log);
    setUserProfile(profile);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const deleteFood = async (index) => {
    const updatedFoods = todayLog.foods.filter((_, i) => i !== index);
    const updatedLog = { ...todayLog, foods: updatedFoods };
    await storage.saveDailyLog(calculations.getTodayDate(), updatedLog);
    setTodayLog(updatedLog);
  };

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const totalCalories = calculations.getTotalCalories(todayLog.foods);
  const totalMacros = calculations.getTotalMacros(todayLog.foods);

  const breakfastFoods = calculations.getFoodsByMeal(todayLog.foods, MEAL_TYPES.BREAKFAST);
  const lunchFoods = calculations.getFoodsByMeal(todayLog.foods, MEAL_TYPES.LUNCH);
  const dinnerFoods = calculations.getFoodsByMeal(todayLog.foods, MEAL_TYPES.DINNER);
  const snackFoods = calculations.getFoodsByMeal(todayLog.foods, MEAL_TYPES.SNACK);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.date}>{calculations.formatDate(new Date())}</Text>
      </View>

      <View style={styles.ringContainer}>
        <ProgressRing
          current={totalCalories}
          goal={userProfile.dailyCalorieGoal}
          size={160}
        />
      </View>

      <View style={styles.macrosContainer}>
        <Text style={styles.sectionTitle}>Macros</Text>
        <MacroBar
          label="Protein"
          current={totalMacros.protein}
          goal={userProfile.proteinGoal}
          color="#FF6B6B"
        />
        <MacroBar
          label="Carbs"
          current={totalMacros.carbs}
          goal={userProfile.carbsGoal}
          color="#4ECDC4"
        />
        <MacroBar
          label="Fats"
          current={totalMacros.fats}
          goal={userProfile.fatsGoal}
          color="#FFE66D"
        />
      </View>

      <View style={styles.mealsContainer}>
        <MealSection
          title="Breakfast"
          foods={breakfastFoods}
          allFoods={todayLog.foods}
          onAddPress={() =>
            navigation.navigate('AddFood', { mealType: MEAL_TYPES.BREAKFAST })
          }
          onDelete={deleteFood}
        />
        <MealSection
          title="Lunch"
          foods={lunchFoods}
          allFoods={todayLog.foods}
          onAddPress={() =>
            navigation.navigate('AddFood', { mealType: MEAL_TYPES.LUNCH })
          }
          onDelete={deleteFood}
        />
        <MealSection
          title="Dinner"
          foods={dinnerFoods}
          allFoods={todayLog.foods}
          onAddPress={() =>
            navigation.navigate('AddFood', { mealType: MEAL_TYPES.DINNER })
          }
          onDelete={deleteFood}
        />
        <MealSection
          title="Snacks"
          foods={snackFoods}
          allFoods={todayLog.foods}
          onAddPress={() =>
            navigation.navigate('AddFood', { mealType: MEAL_TYPES.SNACK })
          }
          onDelete={deleteFood}
        />
      </View>
    </ScrollView>
  );
}

function MealSection({ title, foods, allFoods, onAddPress, onDelete }) {
  const mealCalories = calculations.getTotalCalories(foods);

  return (
    <View style={styles.mealSection}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{title}</Text>
        <Text style={styles.mealCalories}>{mealCalories} kcal</Text>
      </View>
      {foods.map((food, index) => (
        <FoodItem
          key={index}
          food={food}
          onDelete={() => {
            const globalIndex = allFoods.indexOf(food);
            onDelete(globalIndex);
          }}
        />
      ))}
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+ Add Food</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  macrosContainer: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mealsContainer: {
    marginTop: 10,
  },
  mealSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealCalories: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  addButton: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
