import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  DAILY_LOGS: '@calorie_tracker:daily_logs',
  USER_PROFILE: '@calorie_tracker:user_profile',
  CUSTOM_FOODS: '@calorie_tracker:custom_foods',
};

export const storage = {
  // Daily logs management
  async getDailyLog(date) {
    try {
      const logs = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
      const allLogs = logs ? JSON.parse(logs) : {};
      return allLogs[date] || { date, foods: [], water: 0 };
    } catch (error) {
      console.error('Error loading daily log:', error);
      return { date, foods: [], water: 0 };
    }
  },

  async saveDailyLog(date, logData) {
    try {
      const logs = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
      const allLogs = logs ? JSON.parse(logs) : {};
      allLogs[date] = logData;
      await AsyncStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(allLogs));
      return true;
    } catch (error) {
      console.error('Error saving daily log:', error);
      return false;
    }
  },

  async getAllLogs() {
    try {
      const logs = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
      return logs ? JSON.parse(logs) : {};
    } catch (error) {
      console.error('Error loading all logs:', error);
      return {};
    }
  },

  // User profile management
  async getUserProfile() {
    try {
      const profile = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : {
        dailyCalorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 200,
        fatsGoal: 65,
        waterGoal: 8,
      };
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  },

  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  },

  // Custom foods management
  async getCustomFoods() {
    try {
      const foods = await AsyncStorage.getItem(KEYS.CUSTOM_FOODS);
      return foods ? JSON.parse(foods) : [];
    } catch (error) {
      console.error('Error loading custom foods:', error);
      return [];
    }
  },

  async saveCustomFood(food) {
    try {
      const foods = await this.getCustomFoods();
      foods.push({ ...food, id: Date.now().toString(), isCustom: true });
      await AsyncStorage.setItem(KEYS.CUSTOM_FOODS, JSON.stringify(foods));
      return true;
    } catch (error) {
      console.error('Error saving custom food:', error);
      return false;
    }
  },
};
