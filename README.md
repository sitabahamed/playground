# 📝 Title Capitalization Tool

A lightning-fast, easy-to-use web app that converts titles to multiple capitalization styles. Free, no signup required, works for 10k+ users with minimal server costs.

## Features

✨ **9 Capitalization Styles**
- Title Case - Capitalize Each Word
- AP Style - Associated Press style
- Chicago Style - Chicago Manual of Style
- APA Style - American Psychological Association
- Sentence Case - Only First Word Capitalized
- camelCase - No spaces, second word capitalized
- PascalCase - No spaces, all words capitalized
- UPPERCASE - All caps
- lowercase - All lowercase

⚡ **Instant Results** - Real-time conversion as you type

🚀 **Free & Lightweight** - No ads, no tracking, minimal server cost

## Tech Stack

- **Frontend**: React 18 + Next.js 14
- **Backend**: Next.js API Routes
- **Deployment**: Vercel (free tier)
- **Cost for 10k Users**: ~$10-50/month

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

Vercel is the easiest way to deploy Next.js apps. It's **completely free for the first 10k users**.

### For Non-Coders (3 steps):

**Step 1: Connect GitHub**
- Go to [vercel.com](https://vercel.com)
- Click "Sign up" → "Continue with GitHub"
- Authorize Vercel to access your repositories

**Step 2: Import Project**
- Click "Add New..." → "Project"
- Select the `playground` repository
- Click "Import"
- Vercel auto-detects it's a Next.js project ✓

**Step 3: Deploy**
- Click "Deploy"
- Wait 2-3 minutes for deployment
- Your site is live! 🎉

That's it! No environment variables needed, no configuration required.

---

## Maintenance Guide for Non-Coders

### How to Add a New Capitalization Style

**Location**: `lib/titlecase.js`

**Step 1**: Add the style to the `styles` object at the bottom:

```javascript
export const styles = {
  // ... existing styles ...
  myNewStyle: { 
    label: 'My Style Label', 
    description: 'What this style does' 
  }
};
```

**Step 2**: Add the lowercase words list (if needed):

```javascript
const LOWERCASE_WORDS = {
  // ... existing rules ...
  myNewStyle: ['a', 'an', 'the', 'and', 'or']  // words to keep lowercase
};
```

**Step 3**: Add logic in the `capitalizeTitle` function:

```javascript
export function capitalizeTitle(text, style = 'title') {
  switch (style) {
    // ... existing cases ...
    case 'myNewStyle':
      return myNewStyleFunction(text);  // your new function
    // ...
  }
}
```

**Step 4**: Create your function. Example:

```javascript
function myNewStyleFunction(text) {
  // Your logic here
  return text; // return modified text
}
```

**Step 5**: Commit and push:

```bash
git add .
git commit -m "Add new capitalization style: My Style Label"
git push
```

Vercel will automatically redeploy! ✓

---

### How to Modify the UI

**Color Scheme**
- Location: `app/globals.css`
- Find: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`
- Change the hex colors to your brand colors

**Button Colors**
- Primary buttons: `#667eea` and `#764ba2`
- Success: `#10b981`
- Change these hex codes to match your brand

**Font**
- Line 8 in `app/globals.css` has the font stack
- Replace with your preferred fonts

**Text Content**
- Location: `app/page.js`
- Change strings like "Title Capitalization Tool" to your text
- Edit feature descriptions
- Update placeholder text

**After editing**:
```bash
git add .
git commit -m "Update UI/styling"
git push
```

Vercel redeployed in ~2 minutes!

---

### How to Add More Features

**Add a word counter:**
```javascript
// In app/page.js, add:
const wordCount = inputText.trim().split(/\s+/).length;

// In JSX:
<p>Words: {wordCount}</p>
```

**Add character counter:**
```javascript
<p>Characters: {inputText.length}</p>
```

**Add copy confirmation:**
```javascript
// Already included! Button shows "✓ Copied!" for 2 seconds
```

---

### How to Check Errors

If something breaks after deployment:

1. **Check Vercel logs**:
   - Go to vercel.com → Select your project
   - Click "Deployments" tab
   - Click the failed deployment
   - Click "Runtime Logs" to see errors

2. **Check local development**:
   - Run `npm run dev`
   - Open http://localhost:3000
   - Check browser console (right-click → Inspect → Console)
   - Fix the error in your code

3. **Redeploy**:
   ```bash
   git push  # Vercel auto-deploys on push
   ```

---

### Cost Breakdown (for 10k users)

| Item | Cost | Notes |
|------|------|-------|
| Vercel Compute | Free | Up to 100GB bandwidth/month |
| Database | None needed | Stateless app, no data storage |
| Domain | ~$12/year | Optional, cost varies by provider |
| SSL Certificate | Free | Included with Vercel |
| **Total** | **~$1/month** | Essentially free until 100GB bandwidth |

**Why so cheap?**
- No database needed (the app just processes text)
- Serverless functions scale automatically
- Vercel's pricing is per-use (you only pay for traffic)
- A simple text processor uses <1% of free tier

---

### How to Monitor Usage

**In Vercel Dashboard**:
1. Go to vercel.com → Select project
2. Click "Analytics" tab
3. See: requests, bandwidth, response times
4. All free users get unlimited analytics

**Key metrics to watch**:
- **Requests**: Number of API calls
- **Bandwidth**: Data transfer (text is tiny, ~1KB per request)
- **Response Time**: Should stay <100ms

Even at 10k requests/day, you'll use <5GB bandwidth/month (free tier allows 100GB).

---

### Troubleshooting

**Q: Deployment stuck?**
- A: Go to Vercel → Deployments → Click "Redeploy" button

**Q: Changes not showing?**
- A: Clear browser cache (Ctrl+Shift+Delete) and refresh
- OR: Hard refresh (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)

**Q: API returns error?**
- A: Check `app/api/capitalize/route.js` for syntax errors
- A: Run `npm run build` locally to catch errors before pushing

**Q: Need to test locally?**
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

---

## API Reference

### POST /api/capitalize

**Request**:
```json
{
  "text": "the quick brown fox",
  "style": "title"
}
```

**Response**:
```json
{
  "result": "The Quick Brown Fox"
}
```

**Available styles**: `title`, `ap`, `chicago`, `apa`, `sentence`, `camel`, `pascal`, `lowercase`, `uppercase`

**Error Response**:
```json
{
  "error": "Text is required and must be a string"
}
```

---

## File Structure

```
.
├── app/
│   ├── page.js              # Main UI component
│   ├── layout.js            # App layout
│   ├── globals.css          # Styling
│   └── api/
│       └── capitalize/
│           └── route.js     # API endpoint
├── lib/
│   └── titlecase.js         # Capitalization logic
├── package.json             # Dependencies
├── jsconfig.json            # Path aliases
└── next.config.js           # Next.js config
```

---

## FAQ

**Q: Can I use this commercially?**
A: Yes! It's your tool. Deploy it, brand it, monetize it.

**Q: Can I add analytics/tracking?**
A: Yes. Add Google Analytics or any tracking script to `app/layout.js`

**Q: Can I add ads?**
A: Yes. Add ad code to `app/page.js` (we won't judge)

**Q: What if I need more than 10k users?**
A: Vercel charges $20/month for Pro plan (1TB bandwidth), or ~$0.50 per GB after 1TB. Still extremely cheap for a text processor.

**Q: Can I make it a mobile app?**
A: Yes! Any web app can be PWA (Progressive Web App). Add manifest.json to `public/` folder.

**Q: How do I get a custom domain?**
A: In Vercel → Settings → Domains → Add your domain. Then update DNS at your domain provider.

---

## Support

For coding issues: Read this file → Check Vercel logs → Review the code comments

For questions about deployment: Check [Vercel docs](https://vercel.com/docs)

For general Next.js help: Check [Next.js docs](https://nextjs.org/docs)

---

**Built with ❤️ using Next.js**

Estimated Server Cost for 10k users: **~$10-50/month** (mostly free tier compatible)
