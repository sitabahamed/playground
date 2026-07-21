<?php
/**
 * Tier 1 template rendering - auto-generated comparison page
 */

function nw_render_tier_1_template($comparison) {
    $entity_a = $comparison->get_entity_a();
    $entity_b = $comparison->get_entity_b();

    ?>
    <!DOCTYPE html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?php echo esc_html($comparison->get_headline()); ?> - <?php bloginfo('name'); ?></title>
        <meta name="robots" content="noindex, follow">
        <meta name="description" content="Compare the net worth of <?php echo esc_attr($entity_a->get_name()); ?> and <?php echo esc_attr($entity_b->get_name()); ?>.">
        <meta property="og:title" content="<?php echo esc_attr($comparison->get_headline()); ?>">
        <meta property="og:description" content="Compare the net worth of <?php echo esc_attr($entity_a->get_name()); ?> and <?php echo esc_attr($entity_b->get_name()); ?>.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="<?php echo esc_url(nw_get_tier1_url($entity_a->get_id(), $entity_b->get_id())); ?>">
        <?php wp_head(); ?>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                background: #f5f5f5;
                color: #333;
            }
            .nw-compare-container {
                max-width: 1000px;
                margin: 40px auto;
                padding: 20px;
            }
            .nw-compare-headline {
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 40px;
                color: #222;
            }
            .nw-compare-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 40px;
                margin-bottom: 60px;
            }
            .nw-entity {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                text-align: center;
            }
            .nw-entity-headshot {
                width: 150px;
                height: 150px;
                border-radius: 8px;
                margin: 0 auto 20px;
                overflow: hidden;
                object-fit: cover;
            }
            .nw-entity-name {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .nw-entity-value {
                font-size: 24px;
                font-weight: bold;
                color: #0066cc;
                margin-bottom: 15px;
            }
            .nw-entity-link {
                display: inline-block;
                padding: 10px 20px;
                background: #0066cc;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
                transition: background 0.3s;
            }
            .nw-entity-link:hover {
                background: #0052a3;
            }
            .nw-compare-vs {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                color: #666;
                margin: 20px 0;
            }
            .nw-share-button {
                display: inline-block;
                padding: 12px 30px;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                text-align: center;
                cursor: pointer;
                border: none;
                font-size: 16px;
                transition: background 0.3s;
            }
            .nw-share-button:hover {
                background: #218838;
            }
            .nw-action-buttons {
                text-align: center;
                margin: 40px 0;
            }
            .nw-action-buttons a,
            .nw-action-buttons button {
                margin: 0 10px;
            }
            .nw-another-comparison {
                display: inline-block;
                padding: 12px 30px;
                background: #6c757d;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                transition: background 0.3s;
            }
            .nw-another-comparison:hover {
                background: #5a6268;
            }
            @media (max-width: 768px) {
                .nw-compare-grid {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                .nw-compare-headline {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="nw-compare-container">
            <h1 class="nw-compare-headline"><?php echo esc_html($comparison->get_headline()); ?></h1>

            <div class="nw-compare-grid">
                <div class="nw-entity">
                    <img src="<?php echo esc_url($entity_a->get_headshot_url()); ?>"
                         alt="<?php echo esc_attr($entity_a->get_name()); ?>"
                         class="nw-entity-headshot">
                    <div class="nw-entity-name"><?php echo esc_html($entity_a->get_name()); ?></div>
                    <div class="nw-entity-value"><?php echo esc_html($entity_a->get_nw_display()); ?></div>
                    <a href="<?php echo esc_url($entity_a->get_permalink()); ?>" class="nw-entity-link">
                        View Profile
                    </a>
                </div>

                <div class="nw-entity">
                    <img src="<?php echo esc_url($entity_b->get_headshot_url()); ?>"
                         alt="<?php echo esc_attr($entity_b->get_name()); ?>"
                         class="nw-entity-headshot">
                    <div class="nw-entity-name"><?php echo esc_html($entity_b->get_name()); ?></div>
                    <div class="nw-entity-value"><?php echo esc_html($entity_b->get_nw_display()); ?></div>
                    <a href="<?php echo esc_url($entity_b->get_permalink()); ?>" class="nw-entity-link">
                        View Profile
                    </a>
                </div>
            </div>

            <div class="nw-action-buttons">
                <button class="nw-share-button" onclick="nw_share_result()">
                    📤 Share Result
                </button>
                <a href="<?php echo esc_url(home_url('/compare-share/')); ?>" class="nw-another-comparison">
                    ➕ Do Another Comparison
                </a>
            </div>
        </div>

        <?php wp_footer(); ?>

        <script>
            function nw_share_result() {
                if (navigator.share) {
                    navigator.share({
                        title: '<?php echo esc_js($comparison->get_headline()); ?>',
                        text: 'Compare net worth on <?php echo esc_js(get_bloginfo('name')); ?>',
                        url: window.location.href
                    }).catch(err => console.log('Share cancelled:', err));
                } else {
                    // Fallback: copy to clipboard
                    const text = '<?php echo esc_js($comparison->get_headline()); ?> - ' + window.location.href;
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Link copied to clipboard!');
                    });
                }
            }
        </script>
    </body>
    </html>
    <?php
}

/**
 * Generate a Tier 1 comparison URL from entity IDs and slugs.
 */
function nw_get_tier1_url($entity_a_id, $entity_b_id) {
    $entity_a = NW_Entity::get($entity_a_id);
    $entity_b = NW_Entity::get($entity_b_id);

    if (!$entity_a || !$entity_a->exists() || !$entity_b || !$entity_b->exists()) {
        return '';
    }

    $slug_a = $entity_a->get_slug();
    $slug_b = $entity_b->get_slug();

    return home_url("/compare-share/{$slug_a}-{$entity_a_id}/{$slug_b}-{$entity_b_id}/");
}
