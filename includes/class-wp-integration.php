<?php
/**
 * WordPress Integration Class
 * Adds admin pages, shortcodes, and REST API endpoints
 */

if (!defined('ABSPATH')) {
    exit;
}

class Avro_Bijoy_WP_Integration {

    private $converter;

    public function __construct($converter) {
        $this->converter = $converter;
    }

    public function init() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_shortcode('avro_bijoy_converter', [$this, 'render_shortcode']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_scripts']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }

    public function add_admin_menu() {
        add_menu_page(
            'Avro Bijoy Converter',
            'Avro Bijoy',
            'manage_options',
            'avro-bijoy-converter',
            [$this, 'render_admin_page'],
            'dashicons-editor-paragraph',
            25
        );
    }

    public function enqueue_admin_scripts($hook) {
        if ($hook !== 'toplevel_page_avro-bijoy-converter') {
            return;
        }

        wp_enqueue_style(
            'avro-bijoy-admin-style',
            AVRO_BIJOY_CONVERTER_URL . 'assets/admin-style.css',
            [],
            AVRO_BIJOY_CONVERTER_VERSION
        );

        wp_enqueue_script(
            'avro-bijoy-admin-script',
            AVRO_BIJOY_CONVERTER_URL . 'assets/admin-script.js',
            ['jquery'],
            AVRO_BIJOY_CONVERTER_VERSION,
            true
        );

        wp_localize_script('avro-bijoy-admin-script', 'avroConverterData', [
            'nonce' => wp_create_nonce('avro_bijoy_convert'),
            'ajaxUrl' => admin_url('admin-ajax.php'),
        ]);
    }

    public function enqueue_frontend_scripts() {
        wp_enqueue_style(
            'avro-bijoy-frontend-style',
            AVRO_BIJOY_CONVERTER_URL . 'assets/frontend-style.css',
            [],
            AVRO_BIJOY_CONVERTER_VERSION
        );

        wp_enqueue_script(
            'avro-bijoy-frontend-script',
            AVRO_BIJOY_CONVERTER_URL . 'assets/frontend-script.js',
            ['jquery'],
            AVRO_BIJOY_CONVERTER_VERSION,
            true
        );

        wp_localize_script('avro-bijoy-frontend-script', 'avroConverterData', [
            'nonce' => wp_create_nonce('avro_bijoy_convert'),
            'apiUrl' => rest_url('avro-bijoy/v1/convert'),
        ]);
    }

    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized access');
        }

        ?>
        <div class="wrap avro-bijoy-admin">
            <h1>Avro Bijoy Converter</h1>
            <p>Convert text between Avro and Bijoy Bangla keyboard layouts.</p>

            <div class="avro-bijoy-container">
                <div class="converter-box">
                    <h2>Avro to Bijoy</h2>
                    <textarea id="avro-input" placeholder="Enter Avro text..." class="avro-bijoy-textarea"></textarea>
                    <button id="convert-avro-bijoy" class="button button-primary">Convert to Bijoy</button>
                    <textarea id="bijoy-output" placeholder="Bijoy text will appear here..." class="avro-bijoy-textarea" readonly></textarea>
                    <button id="copy-bijoy-output" class="button">Copy</button>
                </div>

                <div class="converter-box">
                    <h2>Bijoy to Avro</h2>
                    <textarea id="bijoy-input" placeholder="Enter Bijoy text..." class="avro-bijoy-textarea"></textarea>
                    <button id="convert-bijoy-avro" class="button button-primary">Convert to Avro</button>
                    <textarea id="avro-output" placeholder="Avro text will appear here..." class="avro-bijoy-textarea" readonly></textarea>
                    <button id="copy-avro-output" class="button">Copy</button>
                </div>
            </div>

            <div class="avro-bijoy-info">
                <h3>Shortcode Usage</h3>
                <p>Use <code>[avro_bijoy_converter]</code> on any page or post to display the converter.</p>
                <p>Attributes:</p>
                <ul>
                    <li><code>direction="avro_to_bijoy"</code> - Show Avro to Bijoy conversion (default)</li>
                    <li><code>direction="bijoy_to_avro"</code> - Show Bijoy to Avro conversion</li>
                    <li><code>direction="both"</code> - Show both converters</li>
                </ul>
            </div>
        </div>
        <?php
    }

    public function render_shortcode($atts) {
        $atts = shortcode_atts([
            'direction' => 'both',
        ], $atts, 'avro_bijoy_converter');

        ob_start();
        ?>
        <div class="avro-bijoy-shortcode-wrapper">
            <?php if ($atts['direction'] === 'avro_to_bijoy' || $atts['direction'] === 'both'): ?>
                <div class="avro-bijoy-converter-section">
                    <h3>Avro to Bijoy</h3>
                    <textarea class="avro-bijoy-shortcode-input" data-direction="avro_to_bijoy" placeholder="Enter Avro text..."></textarea>
                    <button class="avro-bijoy-convert-btn" data-direction="avro_to_bijoy">Convert</button>
                    <textarea class="avro-bijoy-shortcode-output" data-direction="avro_to_bijoy" placeholder="Bijoy text..." readonly></textarea>
                    <button class="avro-bijoy-copy-btn" data-direction="avro_to_bijoy">Copy</button>
                </div>
            <?php endif; ?>

            <?php if ($atts['direction'] === 'bijoy_to_avro' || $atts['direction'] === 'both'): ?>
                <div class="avro-bijoy-converter-section">
                    <h3>Bijoy to Avro</h3>
                    <textarea class="avro-bijoy-shortcode-input" data-direction="bijoy_to_avro" placeholder="Enter Bijoy text..."></textarea>
                    <button class="avro-bijoy-convert-btn" data-direction="bijoy_to_avro">Convert</button>
                    <textarea class="avro-bijoy-shortcode-output" data-direction="bijoy_to_avro" placeholder="Avro text..." readonly></textarea>
                    <button class="avro-bijoy-copy-btn" data-direction="bijoy_to_avro">Copy</button>
                </div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }

    public function register_rest_routes() {
        register_rest_route('avro-bijoy/v1', '/convert', [
            'methods' => 'POST',
            'callback' => [$this, 'rest_convert'],
            'permission_callback' => '__return_true',
            'args' => [
                'text' => [
                    'type' => 'string',
                    'required' => true,
                ],
                'direction' => [
                    'type' => 'string',
                    'enum' => ['avro_to_bijoy', 'bijoy_to_avro'],
                    'default' => 'avro_to_bijoy',
                ],
            ],
        ]);
    }

    public function rest_convert($request) {
        $text = $request->get_param('text');
        $direction = $request->get_param('direction');

        $result = $this->converter->convert($text, $direction);

        return new WP_REST_Response([
            'success' => true,
            'original' => $text,
            'converted' => $result,
            'direction' => $direction,
        ], 200);
    }
}
