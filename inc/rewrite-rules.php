<?php
/**
 * Rewrite rules for Tier 1 comparison tool URLs
 * Pattern: /compare-share/{slug-a}-{id-a}/{slug-b}-{id-b}/
 */

add_action('nw_compare_init_rewrite_rules', function () {
    add_rewrite_rule(
        '^compare-share/([^/]+)-([0-9]+)/([^/]+)-([0-9]+)/?$',
        'index.php?nw_compare=1&nw_a=$matches[2]&nw_b=$matches[4]',
        'top'
    );
});

add_filter('query_vars', function ($query_vars) {
    $query_vars[] = 'nw_compare';
    $query_vars[] = 'nw_a';
    $query_vars[] = 'nw_b';
    return $query_vars;
});
