import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function FoodItem({ food, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContent}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.serving}>{food.serving}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.calories}>{food.calories} kcal</Text>
        <Text style={styles.macros}>
          P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serving: {
    fontSize: 12,
    color: '#999',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  calories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  macros: {
    fontSize: 10,
    color: '#666',
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 24,
    color: '#ff4444',
    fontWeight: 'bold',
  },
});
