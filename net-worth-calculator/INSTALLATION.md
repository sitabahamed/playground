# Net Worth Calculator - Installation & Setup Guide

## Quick Start (3 Steps)

### Step 1: Upload Plugin Files
- Copy the `net-worth-calculator` folder to `/wp-content/plugins/` on your WordPress site
- Via FTP, SFTP, or File Manager in your hosting control panel

### Step 2: Activate Plugin
1. Log into WordPress Admin Dashboard
2. Navigate to **Plugins** → **Installed Plugins**
3. Find "Net Worth Calculator"
4. Click **Activate**

### Step 3: Add to Your Site
- Create or edit a page/post
- Add this shortcode: `[net-worth-calculator]`
- Publish the page
- Visit the page to see the calculator in action

## File Structure

```
net-worth-calculator/
├── net-worth-calculator.php        # Main plugin file
├── README.md                       # Documentation
├── LICENSE                         # GPL v2 License
├── INSTALLATION.md                 # This file
├── .gitignore
└── assets/
    ├── css/
    │   └── calculator.css          # Styling (1000+ lines)
    └── js/
        └── calculator.js           # Core functionality (600+ lines)
└── templates/
    └── calculator.php              # HTML template
```

## Dependencies

The plugin loads external libraries from CDN:
- **Bootstrap 5.3** - Responsive framework
- **Chart.js 4.4** - Interactive charts
- **jsPDF 2.5** - PDF generation
- **html2canvas 1.4** - HTML to image conversion

All libraries are minified and loaded from reputable CDNs with integrity checks.

## Configuration

### No Configuration Required
The plugin works out-of-the-box with sensible defaults. No settings page or database setup needed.

### Optional Customizations

#### 1. Change Colors
Edit `/assets/css/calculator.css` and modify the `:root` CSS variables:

```css
:root {
    --nwc-primary: #2563eb;      /* Primary blue */
    --nwc-success: #10b981;      /* Green for assets */
    --nwc-danger: #ef4444;       /* Red for liabilities */
    --nwc-warning: #f59e0b;      /* Amber (unused) */
}
```

#### 2. Add Custom Categories
Edit `/assets/js/calculator.js` and modify:

```javascript
this.assetCategories = {
    'cash': { label: 'Cash', icon: '💵' },
    'your_category': { label: 'Your Label', icon: '📦' }
};
```

#### 3. Change Chart Colors
Search in `/assets/js/calculator.js` for `backgroundColor` values in the `updateCharts()` method.

## Troubleshooting

### Issue: Calculator doesn't appear on page
**Solution**: 
- Verify shortcode is exactly: `[net-worth-calculator]`
- Clear WordPress cache if using a cache plugin
- Check browser console for JavaScript errors (F12 → Console tab)

### Issue: Data doesn't save between sessions
**Solution**:
- Ensure browser localStorage is not disabled
- Check if you're in private/incognito mode (data won't persist)
- Try a different browser

### Issue: Charts not displaying
**Solution**:
- Check internet connection (CDN libraries need to load)
- Verify Chart.js CDN is accessible
- Clear browser cache and reload

### Issue: Export not working
**Solution**:
- PDF export requires jsPDF library (loaded from CDN)
- Check firewall/proxy isn't blocking external resources
- Try a different browser

## Performance Optimization

The plugin is already optimized for performance:

✅ Minified CSS (1000+ lines)
✅ Minified JavaScript (600+ lines)
✅ No database queries
✅ Client-side calculations only
✅ Lazy-loaded Chart.js library
✅ Emoji icons (no image files)

No additional optimization needed in most cases.

## Security Notes

- **No Server Data**: All data stays in user's browser (localStorage)
- **No External API Calls**: No data is sent to external services
- **No User Tracking**: No analytics or telemetry
- **No Ads**: 100% ad-free
- **WPNONCE Verification**: AJAX handlers include WordPress nonce checks

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Chrome | Latest | ✅ Full |
| Mobile Safari | Latest | ✅ Full |

## Mobile Responsiveness

The calculator is fully responsive:
- **Desktop** (1200px+): Side-by-side layout
- **Tablet** (768px-1199px): Stacked layout
- **Mobile** (<768px): Single column, optimized touch targets

## Accessibility

- WCAG 2.1 AA compliant color contrast
- Keyboard navigable
- Screen reader friendly labels
- Reduced motion support for animations

## Uninstallation

1. Go to **Plugins** → **Installed Plugins** in WordPress Admin
2. Click **Deactivate** next to "Net Worth Calculator"
3. Click **Delete** to remove plugin files
4. Plugin data in localStorage is automatically cleared when you clear browser data

## Support & Updates

For issues, feature requests, or improvements:
- Check the README.md for full documentation
- Review the source code (well-commented and clean)
- Test in a staging environment before production use

## License

This plugin is released under the GPL v2 license - see LICENSE file for details.

---

**Happy Calculating!** 💰📊
