import React, { useState, useEffect } from 'react';
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

export default function SettingsScreen({ navigation }) {
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('2000');
  const [proteinGoal, setProteinGoal] = useState('150');
  const [carbsGoal, setCarbsGoal] = useState('200');
  const [fatsGoal, setFatsGoal] = useState('65');
  const [waterGoal, setWaterGoal] = useState('8');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await storage.getUserProfile();
    setDailyCalorieGoal(profile.dailyCalorieGoal.toString());
    setProteinGoal(profile.proteinGoal.toString());
    setCarbsGoal(profile.carbsGoal.toString());
    setFatsGoal(profile.fatsGoal.toString());
    setWaterGoal(profile.waterGoal.toString());
  };

  const handleSave = async () => {
    const profile = {
      dailyCalorieGoal: parseInt(dailyCalorieGoal) || 2000,
      proteinGoal: parseInt(proteinGoal) || 150,
      carbsGoal: parseInt(carbsGoal) || 200,
      fatsGoal: parseInt(fatsGoal) || 65,
      waterGoal: parseInt(waterGoal) || 8,
    };

    const success = await storage.saveUserProfile(profile);
    if (success) {
      Alert.alert('Success', 'Goals updated successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save goals');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Calories (kcal)</Text>
          <TextInput
            style={styles.input}
            value={dailyCalorieGoal}
            onChangeText={setDailyCalorieGoal}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={proteinGoal}
            onChangeText={setProteinGoal}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbsGoal}
            onChangeText={setCarbsGoal}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fats (g)</Text>
          <TextInput
            style={styles.input}
            value={fatsGoal}
            onChangeText={setFatsGoal}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Water (glasses)</Text>
          <TextInput
            style={styles.input}
            value={waterGoal}
            onChangeText={setWaterGoal}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Goals</Text>
      </TouchableOpacity>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About</Text>
        <Text style={styles.infoText}>
          CalorieTracker helps you track your daily food intake and macronutrients.
        </Text>
        <Text style={styles.infoText}>Version 1.0.0</Text>
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
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  saveButton: {
    margin: 20,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
