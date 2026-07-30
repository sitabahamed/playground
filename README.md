# Avro to Bijoy Converter for WordPress

A powerful, bidirectional converter between Avro and Bijoy Bangla keyboard layouts for WordPress. Convert text instantly with a simple admin interface or use shortcodes on your website.

## Features

✨ **Bidirectional Conversion**
- Convert from Avro to Bijoy
- Convert from Bijoy to Avro
- Real-time conversion as you type

📱 **Multiple Implementation Options**
- Full WordPress Plugin
- Standalone PHP Snippet
- REST API endpoints
- Shortcodes for frontend pages/posts

🎯 **Easy to Use**
- Admin dashboard interface
- One-click copy to clipboard
- Keyboard shortcuts (Ctrl+Enter)
- Responsive design

🔒 **WordPress Native**
- Follows WordPress coding standards
- Proper nonce verification
- Sanitized inputs
- Security-focused implementation

## Installation

### Option 1: As a WordPress Plugin

1. Download the plugin files
2. Upload the `avro-bijoy-converter` folder to `/wp-content/plugins/`
3. Activate the plugin from WordPress admin dashboard
4. Go to **Avro Bijoy** menu in WordPress admin

### Option 2: As a PHP Snippet

If you prefer not to use a plugin:

1. Copy the code from `standalone-snippet.php`
2. Add it to your theme's `functions.php` or create a custom plugin file
3. Use the provided shortcode: `[standalone_avro_bijoy]`

## Usage

### Admin Dashboard

1. Navigate to **Avro Bijoy** in the WordPress admin menu
2. Enter text in either converter
3. Click "Convert" button or use real-time conversion
4. Click "Copy" to copy the result to clipboard

### Shortcode for Frontend

Use the shortcode on any page or post:

```
[avro_bijoy_converter]
```

#### Shortcode Attributes

- `direction="avro_to_bijoy"` - Show only Avro to Bijoy converter
- `direction="bijoy_to_avro"` - Show only Bijoy to Avro converter
- `direction="both"` - Show both converters (default)

**Examples:**

```
[avro_bijoy_converter]                           <!-- Both converters -->
[avro_bijoy_converter direction="avro_to_bijoy"] <!-- Avro to Bijoy only -->
[avro_bijoy_converter direction="bijoy_to_avro"] <!-- Bijoy to Avro only -->
```

### REST API

Access the converter via REST API:

**Endpoint:** `/wp-json/avro-bijoy/v1/convert`
**Method:** POST

**Parameters:**
- `text` (required): The text to convert
- `direction` (optional): `avro_to_bijoy` or `bijoy_to_avro` (default: `avro_to_bijoy`)

**Example Request:**

```bash
curl -X POST https://yoursite.com/wp-json/avro-bijoy/v1/convert \
  -H "Content-Type: application/json" \
  -d '{
    "text": "hello",
    "direction": "avro_to_bijoy"
  }'
```

**Example Response:**

```json
{
  "success": true,
  "original": "hello",
  "converted": "হেলো",
  "direction": "avro_to_bijoy"
}
```

### Programmatic Usage (PHP)

```php
// Using the plugin
$converter = new Avro_Bijoy_Converter();

// Avro to Bijoy
$bijoy_text = $converter->avro_to_bijoy("hello");
echo $bijoy_text; // Output: হেলো

// Bijoy to Avro
$avro_text = $converter->bijoy_to_avro("হেলো");
echo $avro_text; // Output: hello

// Using the convert method with direction
$result = $converter->convert("hello", "avro_to_bijoy");
echo $result; // Output: হেলো
```

## File Structure

```
avro-bijoy-converter/
├── avro-bijoy-converter.php          # Main plugin file
├── includes/
│   ├── class-converter.php           # Core converter class
│   └── class-wp-integration.php      # WordPress integration
├── assets/
│   ├── admin-script.js               # Admin JavaScript
│   ├── admin-style.css               # Admin CSS
│   ├── frontend-script.js            # Frontend JavaScript
│   └── frontend-style.css            # Frontend CSS
├── standalone-snippet.php            # Standalone version
└── README.md                         # Documentation
```

## Supported Characters

The converter supports:

- **Vowels:** অ, আ, ই, ঈ, উ, ঊ, ঋ, এ, ঐ, ও, ঔ
- **Consonants:** All Bengali consonants
- **Vowel signs:** া, ি, ী, ু, ূ, ৃ, ে, ৈ, ো, ৌ
- **Special marks:** ঁ, ঃ, ়
- **Numbers:** ০-৯

## Performance

- Optimized for quick conversions
- Uses efficient character mapping
- Supports large text blocks
- Real-time conversion with debouncing on frontend

## Security

- All inputs are sanitized
- Proper nonce verification
- No database queries
- Security-focused implementation
- Follows WordPress security best practices

## Compatibility

- WordPress 5.0+
- PHP 7.4+
- All modern browsers
- Mobile-friendly interface

## Keyboard Shortcuts

In the admin dashboard:
- **Ctrl + Enter** - Convert text
- **Cmd + Enter** (Mac) - Convert text

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Troubleshooting

### Converter not working
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify WordPress REST API is enabled

### Text not converting properly
- Make sure input is in correct format (Avro or Bijoy)
- Check character encoding is UTF-8
- Refresh the page and try again

### Copy button not working
- Ensure HTTPS is used (recommended)
- Check browser permissions
- Try using Ctrl+C manually

## License

This plugin is licensed under GPL v2 or later.

## Support

For issues or questions, contact: support@monsterclaw.com
