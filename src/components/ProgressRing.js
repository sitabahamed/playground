import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressRing({ current, goal, size = 120 }) {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.ring}>
        <View style={styles.innerCircle}>
          <Text style={styles.currentText}>{current}</Text>
          <Text style={styles.goalText}>/ {goal}</Text>
          <Text style={styles.labelText}>kcal</Text>
        </View>
      </View>
      <View style={styles.remainingContainer}>
        <Text style={styles.remainingText}>{remaining} remaining</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 8,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  goalText: {
    fontSize: 14,
    color: '#666',
  },
  labelText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  remainingContainer: {
    marginTop: 8,
  },
  remainingText: {
    fontSize: 14,
    color: '#666',
  },
});
