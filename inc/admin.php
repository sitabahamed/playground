<?php
/**
 * Admin interface and setup for Net Worth Comparison Tool
 */

// Add admin menu.
add_action('admin_menu', function () {
    add_menu_page(
        'Net Worth Comparison',
        'NW Comparison',
        'manage_options',
        'nw-comparison',
        'nw_render_admin_page',
        'dashicons-chart-pie'
    );
});

/**
 * Render admin page.
 */
function nw_render_admin_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    // Handle seed data actions.
    if (isset($_POST['nw_action'])) {
        check_admin_referer('nw_admin_action');

        if ($_POST['nw_action'] === 'seed_data') {
            $result = nw_seed_test_data();
            echo '<div class="notice notice-success"><p>Seeded ' . count($result) . ' test celebrities!</p></div>';
        } elseif ($_POST['nw_action'] === 'clear_data') {
            nw_clear_test_data();
            echo '<div class="notice notice-info"><p>Test data cleared.</p></div>';
        }
    }

    ?>
    <div class="wrap">
        <h1>Net Worth Comparison Tool</h1>

        <h2>Setup & Testing</h2>
        <p>This admin page helps you test Phase 1 of the Net Worth Comparison Tool.</p>

        <h3>Step 1: Seed Test Data</h3>
        <p>Click the button below to create sample celebrity entities with net worth values.</p>
        <form method="post" style="display:inline;">
            <?php wp_nonce_field('nw_admin_action'); ?>
            <input type="hidden" name="nw_action" value="seed_data">
            <button type="submit" class="button button-primary">Seed Test Celebrities</button>
        </form>

        <h3>Step 2: Test Tool URLs</h3>
        <p>Once seeded, try these comparison URLs:</p>
        <ul>
            <li><a href="<?php echo esc_url(home_url('/compare-share/taylor-swift-1/beyonce-knowles-2/')); ?>" target="_blank">
                Taylor Swift vs Beyoncé
            </a></li>
            <li><a href="<?php echo esc_url(home_url('/compare-share/elon-musk-3/jeff-bezos-4/')); ?>" target="_blank">
                Elon Musk vs Jeff Bezos
            </a></li>
            <li><a href="<?php echo esc_url(home_url('/compare-share/oprah-winfrey-5/kim-kardashian-7/')); ?>" target="_blank">
                Oprah Winfrey vs Kim Kardashian
            </a></li>
        </ul>

        <h3>Step 3: Verify Robots & Indexing</h3>
        <p><strong>Tier 1 pages should output:</strong></p>
        <code>meta name="robots" content="noindex, follow"</code>
        <p>View the page source (Ctrl+U) and search for this meta tag to confirm.</p>

        <h3>Cleanup</h3>
        <p>Remove all test data:</p>
        <form method="post" style="display:inline;">
            <?php wp_nonce_field('nw_admin_action'); ?>
            <input type="hidden" name="nw_action" value="clear_data">
            <button type="submit" class="button" onclick="return confirm('This will delete all test celebrities. Proceed?');">
                Clear Test Data
            </button>
        </form>

        <h2>Phase 1 Checklist</h2>
        <ul style="list-style:disc; margin-left:20px;">
            <li>✓ <code>nw_value_raw</code> populated for test entities</li>
            <li>✓ Display formatter (<code>nw_format_currency()</code>) works</li>
            <li>✓ Rewrite rule + handler renders virtual comparison pages</li>
            <li>✓ Math correct (equal values, same entity edge cases)</li>
            <li>✓ Tier-1 pages output <code>noindex, follow</code></li>
            <li>Picker/search not yet implemented (Phase 2+)</li>
        </ul>

        <h2>Technical Notes</h2>
        <ul>
            <li><strong>Rewrite Rule Pattern:</strong> <code>^compare-share/([^/]+)-([0-9]+)/([^/]+)-([0-9]+)/?$</code></li>
            <li><strong>Query Vars:</strong> <code>nw_compare, nw_a, nw_b</code></li>
            <li><strong>Route Handler Hook:</strong> <code>template_redirect</code></li>
            <li><strong>Tier 1 Robots Filter:</strong> <code>wp_robots</code> (WP 5.7+)</li>
        </ul>
    </div>
    <?php
}

/**
 * Generate a CLI command for testing (if WP-CLI is available).
 * wp nw-comparison seed-data
 * wp nw-comparison clear-data
 */
if (defined('WP_CLI') && WP_CLI) {
    class NW_Comparison_CLI extends WP_CLI_Command {
        public function seed_data() {
            $result = nw_seed_test_data();
            WP_CLI::success(sprintf('Seeded %d test celebrities', count($result)));
            foreach ($result as $celeb) {
                WP_CLI::line(sprintf(
                    '  - %s (ID: %d, Post: %s, NW: %s)',
                    $celeb['name'],
                    $celeb['id'],
                    $celeb['slug'],
                    nw_format_currency($celeb['nw'])
                ));
            }
        }

        public function clear_data() {
            nw_clear_test_data();
            WP_CLI::success('Test data cleared');
        }
    }

    WP_CLI::add_command('nw-comparison', 'NW_Comparison_CLI');
}
