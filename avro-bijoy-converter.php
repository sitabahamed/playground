<?php
/**
 * Plugin Name: Avro to Bijoy Converter
 * Plugin URI: https://monsterclaw.com/avro-bijoy-converter
 * Description: Bidirectional converter between Avro and Bijoy Bangla keyboard layouts
 * Version: 1.0.0
 * Author: Claude Code
 * Author URI: https://anthropic.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: avro-bijoy-converter
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('AVRO_BIJOY_CONVERTER_VERSION', '1.0.0');
define('AVRO_BIJOY_CONVERTER_DIR', plugin_dir_path(__FILE__));
define('AVRO_BIJOY_CONVERTER_URL', plugin_dir_url(__FILE__));

require_once AVRO_BIJOY_CONVERTER_DIR . 'includes/class-converter.php';
require_once AVRO_BIJOY_CONVERTER_DIR . 'includes/class-wp-integration.php';

function avro_bijoy_converter_init() {
    $converter = new Avro_Bijoy_Converter();
    $wp_integration = new Avro_Bijoy_WP_Integration($converter);
    $wp_integration->init();
}

add_action('plugins_loaded', 'avro_bijoy_converter_init');

register_activation_hook(__FILE__, function() {
    add_option('avro_bijoy_converter_version', AVRO_BIJOY_CONVERTER_VERSION);
});

register_deactivation_hook(__FILE__, function() {
    delete_option('avro_bijoy_converter_version');
});
