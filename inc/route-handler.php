<?php
/**
 * Route handler for Tier 1 comparison tool
 * - Checks if pair is whitelisted (published nw_comparison exists)
 * - If yes: 301 redirect to Tier 2 clean URL
 * - If no: render Tier 1 template with noindex, follow
 */

add_action('template_redirect', function () {
    if (!get_query_var('nw_compare')) {
        return;
    }

    $entity_a_id = (int) get_query_var('nw_a');
    $entity_b_id = (int) get_query_var('nw_b');

    // Validate both IDs exist.
    if (!$entity_a_id || !$entity_b_id) {
        wp_die('Invalid comparison parameters', 'Error', ['response' => 404]);
    }

    // Create comparison object.
    $comparison = new NW_Comparison($entity_a_id, $entity_b_id);

    // Validate entities exist.
    if (!$comparison->is_valid()) {
        wp_die('One or more entities not found', 'Error', ['response' => 404]);
    }

    // Check if this pair is whitelisted (published nw_comparison exists).
    $curated_post_id = $comparison->find_curated();
    if ($curated_post_id) {
        // Redirect to the clean Tier 2 URL (301).
        wp_safe_redirect(get_permalink($curated_post_id), 301);
        exit;
    }

    // Tier 1: Force noindex, follow via wp_robots filter.
    add_filter('wp_robots', function ($robots) {
        $robots['noindex'] = true;
        $robots['follow'] = true;
        return $robots;
    });

    // Set nocrawl to prevent deep crawling of tool URLs (optional but recommended).
    add_filter('wp_robots', function ($robots) {
        $robots['follow'] = true;
        return $robots;
    });

    // Render Tier 1 template.
    do_action('nw_compare_before_render_tier_1', $comparison);
    nw_render_tier_1_template($comparison);
    do_action('nw_compare_after_render_tier_1', $comparison);
    exit;
});
