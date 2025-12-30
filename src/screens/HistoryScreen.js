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
import { storage } from '../utils/storage';
import { calculations } from '../utils/calculations';

export default function HistoryScreen() {
  const [logs, setLogs] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const allLogs = await storage.getAllLogs();
    const profile = await storage.getUserProfile();
    setLogs(allLogs);
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

  const sortedDates = Object.keys(logs).sort((a, b) => new Date(b) - new Date(a));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {sortedDates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>Start logging your meals!</Text>
          </View>
        ) : (
          sortedDates.map(date => {
            const log = logs[date];
            const totalCalories = calculations.getTotalCalories(log.foods);
            const totalMacros = calculations.getTotalMacros(log.foods);
            const calorieGoal = userProfile?.dailyCalorieGoal || 2000;
            const percentage = calculations.getProgressPercentage(totalCalories, calorieGoal);

            return (
              <View key={date} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View>
                    <Text style={styles.logDate}>{calculations.formatDate(date)}</Text>
                    <Text style={styles.logDateFull}>{date}</Text>
                  </View>
                  <View style={styles.calorieContainer}>
                    <Text style={styles.calorieText}>{totalCalories}</Text>
                    <Text style={styles.calorieGoal}>/ {calorieGoal} kcal</Text>
                  </View>
                </View>

                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${percentage}%`,
                        backgroundColor: percentage > 100 ? '#ff4444' : '#4CAF50',
                      },
                    ]}
                  />
                </View>

                <View style={styles.macrosRow}>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={styles.macroValue}>{Math.round(totalMacros.protein)}g</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={styles.macroValue}>{Math.round(totalMacros.carbs)}g</Text>
                  </View>
                  <View style={styles.macroItem}>
                    <Text style={styles.macroLabel}>Fats</Text>
                    <Text style={styles.macroValue}>{Math.round(totalMacros.fats)}g</Text>
                  </View>
                </View>

                <View style={styles.mealCount}>
                  <Text style={styles.mealCountText}>{log.foods.length} foods logged</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  logCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logDateFull: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  calorieContainer: {
    alignItems: 'flex-end',
  },
  calorieText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calorieGoal: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealCount: {
    marginTop: 8,
    alignItems: 'center',
  },
  mealCountText: {
    fontSize: 12,
    color: '#666',
  },
});
