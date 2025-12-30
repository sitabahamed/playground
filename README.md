# CalorieTracker - React Native Fitness App

A comprehensive calorie and macro tracking app built with React Native and Expo.

## Features

### Core Functionality
- **Daily Calorie Tracking**: Track your daily calorie intake with a visual progress ring
- **Macro Tracking**: Monitor protein, carbs, and fats with progress bars
- **Meal Categorization**: Organize foods by breakfast, lunch, dinner, and snacks
- **Food Database**: Pre-populated with 25+ common foods
- **Custom Foods**: Create and save your own food items
- **History**: View past daily logs with complete nutrition information
- **Goal Setting**: Customize your daily calorie and macro goals

### User Interface
- Clean, modern design with intuitive navigation
- Bottom tab navigation for easy access to main features
- Pull-to-refresh on dashboard and history screens
- Real-time progress visualization
- Category-based food search

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs + Stack Navigator)
- **Storage**: AsyncStorage for persistent local data
- **State Management**: React Hooks (useState, useEffect, useFocusEffect)

## Project Structure

```
calorie-tracker/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FoodItem.js      # Food entry display
│   │   ├── MacroBar.js      # Macro progress bar
│   │   └── ProgressRing.js  # Calorie progress ring
│   ├── data/                # Static data
│   │   └── foodDatabase.js  # Food database with 25+ items
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js  # Main navigation setup
│   ├── screens/             # App screens
│   │   ├── DashboardScreen.js    # Main tracking screen
│   │   ├── AddFoodScreen.js      # Food search/selection
│   │   ├── CustomFoodScreen.js   # Custom food creation
│   │   ├── HistoryScreen.js      # Past logs
│   │   └── SettingsScreen.js     # Goal management
│   └── utils/               # Helper functions
│       ├── storage.js       # AsyncStorage wrapper
│       └── calculations.js  # Nutrition calculations
├── App.js                   # Main app component
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your platform:
```bash
npm run android  # For Android
npm run ios      # For iOS (requires macOS)
npm run web      # For web browser
```

### Using Expo Go
1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal
3. The app will load on your device

## Usage

### Setting Up Goals
1. Navigate to the Settings tab
2. Enter your daily goals:
   - Calorie target (default: 2000 kcal)
   - Protein goal (default: 150g)
   - Carbs goal (default: 200g)
   - Fats goal (default: 65g)
3. Tap "Save Goals"

### Logging Food
1. On the Dashboard, tap "+ Add Food" under any meal
2. Search for foods or browse by category
3. Tap a food to add it to your log
4. Or create a custom food with your own nutritional values

### Viewing Progress
- The main dashboard shows:
  - Calorie progress ring
  - Macro progress bars
  - Foods organized by meal
  - Total calories per meal

### Checking History
- Navigate to the History tab
- View all past daily logs
- See calorie totals and macro breakdowns
- Track your progress over time

## Food Database

The app includes 25+ common foods across categories:
- **Protein**: Chicken, salmon, eggs, tuna
- **Carbs**: Rice, pasta, oats, bread, sweet potato
- **Vegetables**: Broccoli, spinach, carrots, tomato
- **Fruits**: Banana, apple, strawberries, blueberries
- **Dairy**: Milk, cheese, Greek yogurt
- **Snacks**: Almonds, peanut butter, protein bars
- **Beverages**: Protein shake, black coffee

## Future Enhancements

Potential features for future versions:
- [ ] Barcode scanner for packaged foods
- [ ] Water intake tracking widget
- [ ] Weekly/monthly analytics with charts
- [ ] Export data to CSV
- [ ] Cloud sync across devices
- [ ] Meal planning and recipes
- [ ] Weight tracking integration
- [ ] Integration with fitness trackers
- [ ] Photo logging for meals
- [ ] Favorite foods quick access

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

MIT License
