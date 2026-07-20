# Net Worth Calculator - WordPress Plugin

A professional, feature-rich Net Worth Calculator plugin for WordPress with stunning UI/UX, interactive charts, and export capabilities.

## Features

✨ **Premium User Experience**
- Modern, responsive design with gradient backgrounds and smooth animations
- Mobile-optimized interface works perfectly on all devices
- Dark mode aware with accessible color schemes

📊 **Comprehensive Asset & Liability Tracking**
- 9 Asset categories: Cash, Savings, Checking, Investments, Retirement Accounts, Real Estate, Vehicles, Cryptocurrency, Other
- 8 Liability categories: Mortgage, Home Equity Loan, Auto Loan, Student Loan, Credit Card Debt, Personal Loan, Medical Debt, Other
- Add unlimited items within each category
- Real-time calculations and updates

📈 **Interactive Visualizations**
- Net Worth Breakdown (Doughnut Chart)
- Assets by Category (Horizontal Bar Chart)
- Liabilities by Category (Horizontal Bar Chart)
- Chart.js powered with responsive design

💾 **Data Persistence**
- Automatic localStorage storage (browser-based, no server required)
- Data persists across browser sessions
- Users can reset all data anytime

📥 **Export Functionality**
- Export to PDF with formatted report
- Export to CSV for spreadsheet analysis
- Print-friendly layout

🎯 **User-Friendly Interface**
- One-click add/remove items
- Category-based organization
- Quick-add buttons for each category
- Confirmation dialogs to prevent accidental deletions
- Toast notifications for all actions

## Installation

1. Download or clone this plugin to your WordPress `/wp-content/plugins/` directory
2. Activate the plugin through the WordPress admin panel
3. Add the calculator to any page/post using: `[net-worth-calculator]`

## Usage

### Shortcode
Simply add this shortcode to any page or post:
```
[net-worth-calculator]
```

### How It Works

1. **Add Assets**: Click "Add New Asset" to add income-generating or valuable items
   - Enter the item name (e.g., "Toyota Camry")
   - Enter the current value in dollars
   - Select the category
   - Item appears immediately with real-time calculation update

2. **Add Liabilities**: Click "Add New Liability" to track debts
   - Same process as assets
   - Automatically deducted from net worth

3. **View Results**: The summary card on the right shows:
   - Total Assets (sum of all assets)
   - Total Liabilities (sum of all debts)
   - **Net Worth** = Assets - Liabilities
   - Color-coded: Green for positive, Red for negative

4. **Charts**: Three interactive charts provide insights:
   - Overall breakdown of assets vs liabilities
   - Which asset categories hold the most value
   - Which liability categories represent the most debt

5. **Export**: Download your report as PDF or CSV for:
   - Personal record keeping
   - Financial planning
   - Sharing with advisors

## Categories Included

### Assets
- Cash (loose cash/emergency fund)
- Savings Account (savings accounts, money market)
- Checking Account (checking accounts)
- Investments (stocks, bonds, mutual funds)
- Retirement Accounts (401k, IRA, Roth IRA, SEP IRA)
- Real Estate (primary home, rental properties, land)
- Vehicles (cars, trucks, motorcycles)
- Cryptocurrency (Bitcoin, Ethereum, other crypto)
- Other Assets (collectibles, jewelry, art, etc.)

### Liabilities
- Mortgage (home loan)
- Home Equity Loan (HELOC, second mortgage)
- Auto Loan (car/truck financing)
- Student Loan (federal and private)
- Credit Card Debt (all credit cards)
- Personal Loan (unsecured loans)
- Medical Debt (hospital bills, medical financing)
- Other Debts (any other liabilities)

## Technical Details

- **Framework**: Bootstrap 5 for responsive layout
- **Charts**: Chart.js for interactive visualizations
- **Export**: jsPDF and html2canvas for PDF export
- **Storage**: Browser localStorage (client-side)
- **Compatibility**: WordPress 5.0+, PHP 7.2+

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy

All data is stored locally in the user's browser using localStorage. No data is sent to any server or external service.

## Performance

- Lightweight and fast
- No database queries needed
- All calculations done client-side
- Optimized images and icons (emoji-based)

## Customization

### Modify Colors
Edit `/assets/css/calculator.css` - look for `:root` CSS variables:
```css
:root {
    --nwc-primary: #2563eb;
    --nwc-success: #10b981;
    --nwc-danger: #ef4444;
}
```

### Add Custom Categories
Edit `/assets/js/calculator.js` and modify the `assetCategories` or `liabilityCategories` objects.

## Roadmap

- [ ] User accounts and cloud sync
- [ ] Financial goal tracking
- [ ] Net worth trend charts
- [ ] Budget integration
- [ ] Tax optimization suggestions
- [ ] Multi-currency support

## Support

For issues or feature requests, contact support or check documentation.

## License

GPL v2 or later - See LICENSE file for details

## Credits

Built with inspiration from leading net worth calculators:
- Ramsey Solutions
- NerdWallet
- Bankrate
- Sun Life
- MoneyMart

---

**Version**: 1.0.0  
**Last Updated**: 2024
