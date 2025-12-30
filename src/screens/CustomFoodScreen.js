import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { storage } from '../utils/storage';
import { calculations } from '../utils/calculations';

export default function CustomFoodScreen({ route, navigation }) {
  const { mealType } = route.params;
  const [name, setName] = useState('');
  const [serving, setServing] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const handleSaveAndAdd = async () => {
    if (!name || !calories) {
      Alert.alert('Error', 'Please enter at least food name and calories');
      return;
    }

    const food = {
      name,
      serving: serving || '1 serving',
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
      category: 'Custom',
    };

    await storage.saveCustomFood(food);

    const today = calculations.getTodayDate();
    const log = await storage.getDailyLog(today);

    const foodEntry = {
      ...food,
      mealType,
      timestamp: new Date().toISOString(),
    };

    log.foods.push(foodEntry);
    await storage.saveDailyLog(today, log);

    Alert.alert('Success', `${name} created and added to ${mealType}!`);
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Custom Food</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Food Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Homemade Smoothie"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Serving Size</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1 cup, 100g"
            value={serving}
            onChangeText={setServing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Calories (kcal) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.macroRow}>
          <View style={styles.macroInput}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.macroInput}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.macroInput}>
            <Text style={styles.label}>Fats (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={fats}
              onChangeText={setFats}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndAdd}>
          <Text style={styles.saveButtonText}>Save & Add to {mealType}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
