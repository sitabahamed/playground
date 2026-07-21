<?php
/**
 * Plugin Name: Net Worth Comparison Tool
 * Plugin URI: https://github.com/sitabahamed/playground
 * Description: Two-tier net worth comparison system (auto-generated + curated indexable)
 * Version: 1.0.0
 * Author: Sitab Ahamed
 * License: MIT
 * Requires at least: 5.7
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NW_COMPARE_VERSION', '1.0.0');
define('NW_COMPARE_DIR', plugin_dir_path(__FILE__));
define('NW_COMPARE_URL', plugin_dir_url(__FILE__));

// Include core files.
require_once NW_COMPARE_DIR . 'inc/math-utils.php';
require_once NW_COMPARE_DIR . 'inc/class-entity.php';
require_once NW_COMPARE_DIR . 'inc/class-comparison.php';
require_once NW_COMPARE_DIR . 'inc/rewrite-rules.php';
require_once NW_COMPARE_DIR . 'inc/route-handler.php';
require_once NW_COMPARE_DIR . 'inc/template-tier-1.php';
require_once NW_COMPARE_DIR . 'inc/seed-data.php';
require_once NW_COMPARE_DIR . 'inc/admin.php';

// Activation hook: flush rewrite rules.
register_activation_hook(__FILE__, function () {
    do_action('nw_compare_init_rewrite_rules');
    flush_rewrite_rules();
});

// Deactivation hook: clean up rewrite rules.
register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});

// Initialize plugin on WordPress init.
add_action('init', function () {
    do_action('nw_compare_init_rewrite_rules');
}, 10);

// Register custom post type for Tier 2 curated comparisons.
add_action('init', function () {
    register_post_type('nw_comparison', [
        'labels' => [
            'name' => 'Net Worth Comparisons',
            'singular_name' => 'Net Worth Comparison',
        ],
        'public' => true,
        'has_archive' => false,
        'rewrite' => ['slug' => 'net-worth-comparison'],
        'supports' => ['title', 'editor', 'thumbnail'],
        'show_in_rest' => true,
    ]);
}, 9);
