# Net Worth Comparison Tool

A two-tier WordPress net worth comparison system for celebrity entities.

**Tier 1 (Auto-generated):** Any two celebrities can be compared via a virtual tool page (noindex, follow).  
**Tier 2 (Curated & Indexable):** Hand-picked, content-rich comparison pages with analysis and schema.

## Features

✅ **Phase 1 Complete (Data + Tool)**
- `nw_value_raw` post meta for raw USD net worth values
- Currency formatter (`nw_format_currency()`) for display
- Rewrite rules for Tier 1 virtual URLs: `/compare-share/{slug-a}-{id-a}/{slug-b}-{id-b}/`
- Dynamic comparison rendering (headline, figures, difference math)
- `noindex, follow` robots tag on Tier 1 pages
- 301 redirect to Tier 2 when comparison is whitelisted
- Edge case handling (equal net worth, same entity both sides)
- Admin panel for testing with seed data

⏳ **Phase 2 (Share card)** — In progress
- OG image generation (1200×630)
- Twitter card tags
- Caching to disk

⏳ **Phase 3 (Tier 2 Curation)** — Planned
- `nw_comparison` CPT with clean permalinks
- Comparison table + analysis paragraph
- FAQPage schema
- Publish guardrail (min. 400 chars analysis)

## Installation

### As a WordPress Plugin

1. **Clone into `wp-content/plugins/`:**
   ```bash
   git clone https://github.com/sitabahamed/playground wp-content/plugins/nw-comparison
   ```

2. **Activate the plugin** via WordPress admin or WP-CLI:
   ```bash
   wp plugin activate nw-comparison
   ```

3. **Flush rewrite rules** (one-time):
   ```bash
   wp rewrite flush
   # or via admin: Settings → Permalinks
   ```

### As a Code Snippet (WPCode / Code Snippets)

If deploying via code-snippet plugin:
1. Copy the contents of `nw-comparison.php` + all files in `inc/`
2. Paste into WPCode with "Run Everywhere" setting
3. Flush permalinks after activation

## Quick Start

### 1. Seed Test Data

**Via Admin Panel:**
- Go to **Admin → NW Comparison → Seed Test Celebrities**
- Creates 8 sample celebrities (Taylor Swift, Elon Musk, Beyoncé, etc.) with net worth values

**Via WP-CLI:**
```bash
wp nw-comparison seed-data
```

### 2. Test Tool URLs

Visit any of these automatically-generated comparison pages:
- `/compare-share/taylor-swift-1/beyonce-knowles-2/`
- `/compare-share/elon-musk-3/jeff-bezos-4/`
- `/compare-share/oprah-winfrey-5/kim-kardashian-7/`

**Expected behavior:**
- Headline shows net worth difference ("X is $Y richer than Z")
- Two entity cards with headshots, names, and net worth
- Profile links point to each entity's page
- Page source includes: `<meta name="robots" content="noindex, follow">`

### 3. Verify Robots Tag

View page source (Ctrl+U or Cmd+U) and confirm:
```html
<meta name="robots" content="noindex, follow">
```

## Data Model

### Entity (Post)

Any WordPress post type can be an entity. Required fields:

| Field | Storage | Type | Example |
|-------|---------|------|---------|
| `post_title` | WP post | String | "Taylor Swift" |
| `post_name` | WP post slug | String | "taylor-swift" |
| `post_id` | WP post ID | Integer | 1021 |
| `nw_value_raw` | Post Meta | Integer (USD) | `740000000` |
| `nw_value_display` | Derived | String | "$740 Million" |
| `thumbnail` | Featured Image | URL | ... |
| `profession` | Post Meta | String (optional) | "Singer/Songwriter" |

**Why raw USD in meta:** Storing the numeric value normalized means math is trivial and always correct. Formatting happens once on render.

### Curated Comparison (Tier 2 — Phase 3)

```php
post_type: 'nw_comparison'
post_title: (auto-generated or custom)
post_slug: 'taylor-swift-vs-beyonce'
post_content: analysis paragraph (≥400 chars, required to publish)
post_meta:
  - entity_a_id: 1021
  - entity_b_id: 62
```

## URL Patterns

### Tier 1 (Virtual, Auto-generated, Noindex)
```
/compare-share/{slug-a}-{id-a}/{slug-b}-{id-b}/
/compare-share/taylor-swift-1/beyonce-knowles-2/
```

**Robots:** `noindex, follow`  
**Sitemap:** Never included  
**Redirect:** If a published `nw_comparison` exists for this pair, 301-redirect to Tier 2

### Tier 2 (Real CPT, Indexable, Curated)
```
/net-worth-comparison/{slug-a}-vs-{slug-b}/
/net-worth-comparison/taylor-swift-vs-beyonce/
```

**Robots:** `index, follow` (managed by SEO plugin)  
**Sitemap:** Auto-included  
**Requirements:** Must have ≥400 char analysis; publish blocks without it

## Code Organization

```
nw-comparison.php          # Main plugin file, hooks, CPT registration
inc/
  ├── math-utils.php       # nw_format_currency(), nw_parse_currency()
  ├── class-entity.php     # NW_Entity - getter/setter for post entities
  ├── class-comparison.php # NW_Comparison - math, headline, curated lookup
  ├── rewrite-rules.php    # Rewrite rule + query vars for Tier 1 URLs
  ├── route-handler.php    # template_redirect - whitelisting check, robots
  ├── template-tier-1.php  # nw_render_tier_1_template() - full HTML page
  ├── seed-data.php        # nw_seed_test_data(), nw_clear_test_data()
  └── admin.php            # Admin page, WP-CLI commands
```

## Phase 1 Acceptance Criteria

- [x] `nw_value_raw` populated for target entities; display formatter works.
- [x] Rewrite rule + handler renders virtual comparison at tool URL.
- [x] Math correct incl. edge cases (equal values, same entity both sides).
- [x] Tier-1 pages output `noindex, follow`; confirmed absent from sitemap.
- [ ] Picker/search + "Do Another Comparison" CTA functional (Phase 2).

## Phase 2 (Share Card) — In Progress

- [ ] 1200×630 image generates, caches, and populates OG/Twitter tags
- [ ] Test in LinkedIn Post Inspector, X card validator
- [ ] GD or Imagick confirmed on host
- [ ] Cache invalidation strategy

## Phase 3 (Tier 2 Curation) — Planned

- [ ] `nw_comparison` CPT with clean permalink structure
- [ ] Rich template: table + analysis + FAQPage schema
- [ ] Publish blocked without `analysis_body` ≥ minimum length
- [ ] Whitelisted pair: Tier-2 URL is `index, follow` + in sitemap
- [ ] Matching Tier-1 URL 301s to Tier-2
- [ ] Demote returns pair to Tier-1 behavior cleanly

## API / Functions

### Core

```php
// Entity
$entity = NW_Entity::get($post_id);
$entity->get_name();
$entity->get_slug();
$entity->get_nw_raw();                  // Raw USD
$entity->get_nw_display();              // Formatted for display
$entity->get_headshot_url();
$entity->get_permalink();

// Comparison
$comparison = new NW_Comparison($a_id, $b_id);
$comparison->is_valid();
$comparison->get_headline();
$comparison->get_difference();          // A - B
$comparison->get_difference_display();
$comparison->who_is_richer();           // 'a', 'b', or 'equal'
$comparison->find_curated();            // Returns CPT post ID if whitelisted
```

### Utilities

```php
nw_format_currency(740000000);          // "$740 Million"
nw_format_currency_short(740000000);    // "$740M"
nw_parse_currency("$1.8B");             // 1800000000

nw_get_tier1_url($a_id, $b_id);         // Full URL: /compare-share/...
nw_render_tier_1_template($comparison); // Render HTML page
```

### Hooks

```php
// Actions
do_action('nw_compare_init_rewrite_rules');           // Register rules
do_action('nw_compare_before_render_tier_1', $comp);  // Before template
do_action('nw_compare_after_render_tier_1', $comp);   // After template

// Filters
apply_filters('wp_robots', $robots);                  // Robots tag
```

## SEO & Technical Notes

### Robots Tag (Tier 1)

Tier-1 pages are virtual (not posts), so SEO plugins (Yoast/RankMath) won't manage them. The `wp_robots` filter handles it:

```
<meta name="robots" content="noindex, follow">
```

The `follow` keeps internal links crawlable; Google will still crawl links to your money pages from Tier 1, but these pages won't appear in search results and won't accumulate PageRank long-term.

### Rewrite Rule Activation

After plugin activation, **flush permalinks once**:
- Admin: Settings → Permalinks → Save
- CLI: `wp rewrite flush`

This writes the rewrite rule to `.htaccess` (or NGINX config if using NGINX).

### Tier 2 Indexing

Published `nw_comparison` posts are handled by your SEO plugin (Yoast/RankMath). Ensure:
1. CPT is set to "Appear in sitemap"
2. Default to "Index, Follow"
3. No conflicting robots rules

## Testing Checklist

- [ ] Admin page loads and seed button works
- [ ] Test data creates 8 celebrities with proper net worth meta
- [ ] Tier 1 URLs render comparison pages correctly
- [ ] Math is accurate (checked vs manual calculation)
- [ ] Edge cases: equal net worth, same entity both sides
- [ ] `noindex, follow` present in page source
- [ ] Pages absent from XML sitemap
- [ ] 301 redirect works when CPT post exists (Phase 3)

## Troubleshooting

**Tier 1 URL returns 404:**
- Flush rewrite rules: `wp rewrite flush`
- Check `.htaccess` has rewrite rules
- Confirm post IDs in URL match existing posts

**Robots tag not appearing:**
- Confirm WordPress 5.7+ (required for `wp_robots` filter)
- Check SEO plugin isn't overriding with `index` tag
- View page source, not just inspector (some plugins inject differently)

**Math is wrong:**
- Verify `nw_value_raw` meta is stored as integer (not string)
- Check both posts exist and have valid IDs
- Test with: `wp post meta get <post_id> nw_value_raw`

## Contributing

This is an open-source project. Issues and PRs welcome.

## License

MIT License
