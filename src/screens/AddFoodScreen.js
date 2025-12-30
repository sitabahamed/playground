import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FoodItem from '../components/FoodItem';
import { storage } from '../utils/storage';
import { calculations } from '../utils/calculations';
import { COMMON_FOODS, searchFoods, FOOD_CATEGORIES } from '../data/foodDatabase';

export default function AddFoodScreen({ route, navigation }) {
  const { mealType } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(COMMON_FOODS);
  const [customFoods, setCustomFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCustomFoods();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchFoods(searchQuery, customFoods);
      setFilteredFoods(results);
    } else if (selectedCategory) {
      const allFoods = [...COMMON_FOODS, ...customFoods];
      setFilteredFoods(allFoods.filter(food => food.category === selectedCategory));
    } else {
      setFilteredFoods([...COMMON_FOODS, ...customFoods]);
    }
  }, [searchQuery, selectedCategory, customFoods]);

  const loadCustomFoods = async () => {
    const foods = await storage.getCustomFoods();
    setCustomFoods(foods);
  };

  const addFoodToLog = async (food) => {
    const today = calculations.getTodayDate();
    const log = await storage.getDailyLog(today);

    const foodEntry = {
      ...food,
      mealType,
      timestamp: new Date().toISOString(),
    };

    log.foods.push(foodEntry);
    await storage.saveDailyLog(today, log);

    Alert.alert('Success', `${food.name} added to ${mealType}!`);
    navigation.goBack();
  };

  const categories = Object.values(FOOD_CATEGORIES);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add to {mealType}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        <TouchableOpacity
          style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.foodList}>
        {filteredFoods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No foods found</Text>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => navigation.navigate('CustomFood', { mealType })}
            >
              <Text style={styles.customButtonText}>+ Add Custom Food</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {filteredFoods.map(food => (
              <FoodItem key={food.id} food={food} onPress={() => addFoodToLog(food)} />
            ))}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.customFoodButton}
        onPress={() => navigation.navigate('CustomFood', { mealType })}
      >
        <Text style={styles.customFoodButtonText}>+ Create Custom Food</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    textTransform: 'capitalize',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  categoryScroll: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  foodList: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  customButton: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  customFoodButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  customFoodButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
