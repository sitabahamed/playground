<?php
/**
 * Seed data for testing - creates sample celebrity entities with net worth values
 */

function nw_seed_test_data() {
    // Sample celebrities with net worth (in USD).
    $celebrities = [
        [
            'name' => 'Taylor Swift',
            'nw' => 740_000_000,
            'profession' => 'Singer/Songwriter',
        ],
        [
            'name' => 'Beyoncé Knowles',
            'nw' => 500_000_000,
            'profession' => 'Singer/Entrepreneur',
        ],
        [
            'name' => 'Elon Musk',
            'nw' => 240_000_000_000,
            'profession' => 'Entrepreneur/CEO',
        ],
        [
            'name' => 'Jeff Bezos',
            'nw' => 171_000_000_000,
            'profession' => 'Entrepreneur/CEO',
        ],
        [
            'name' => 'Oprah Winfrey',
            'nw' => 2_600_000_000,
            'profession' => 'Media Mogul/Producer',
        ],
        [
            'name' => 'Warren Buffett',
            'nw' => 115_000_000_000,
            'profession' => 'Investor/Businessman',
        ],
        [
            'name' => 'Kim Kardashian',
            'nw' => 1_700_000_000,
            'profession' => 'Reality TV Star/Entrepreneur',
        ],
        [
            'name' => 'Rihanna',
            'nw' => 1_400_000_000,
            'profession' => 'Singer/Entrepreneur',
        ],
    ];

    $created_posts = [];

    foreach ($celebrities as $celeb) {
        // Check if already exists (by name/slug).
        $slug = sanitize_title($celeb['name']);
        $existing = get_page_by_path($slug, OBJECT, 'post');

        if ($existing) {
            $post_id = $existing->ID;
        } else {
            // Create new post.
            $post_id = wp_insert_post([
                'post_type' => 'post',
                'post_title' => $celeb['name'],
                'post_name' => $slug,
                'post_status' => 'publish',
                'post_content' => sprintf(
                    'Net worth: %s. %s.',
                    nw_format_currency($celeb['nw']),
                    $celeb['profession']
                ),
            ]);
        }

        if (is_wp_error($post_id)) {
            continue;
        }

        // Set/update net worth meta.
        update_post_meta($post_id, 'nw_value_raw', $celeb['nw']);
        update_post_meta($post_id, 'profession', $celeb['profession']);

        $created_posts[] = [
            'id' => $post_id,
            'name' => $celeb['name'],
            'slug' => $slug,
            'nw' => $celeb['nw'],
        ];
    }

    return $created_posts;
}

/**
 * Clear all seed data (testing only).
 */
function nw_clear_test_data() {
    $celebrities = [
        'taylor-swift',
        'beyonce-knowles',
        'elon-musk',
        'jeff-bezos',
        'oprah-winfrey',
        'warren-buffett',
        'kim-kardashian',
        'rihanna',
    ];

    foreach ($celebrities as $slug) {
        $post = get_page_by_path($slug, OBJECT, 'post');
        if ($post) {
            wp_delete_post($post->ID, true);
        }
    }
}
