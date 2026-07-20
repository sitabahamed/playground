<?php
/**
 * Plugin Name: Net Worth Calculator
 * Plugin URI: https://yoursite.com/net-worth-calculator
 * Description: A professional net worth calculator with charts, export, and premium UI/UX
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yoursite.com
 * License: GPL2
 * Text Domain: net-worth-calculator
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit;
}

define('NWC_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('NWC_PLUGIN_URL', plugin_dir_url(__FILE__));
define('NWC_VERSION', '1.0.0');

// Enqueue styles and scripts
function nwc_enqueue_assets() {
    wp_enqueue_style(
        'nwc-bootstrap',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        array(),
        '5.3.0'
    );

    wp_enqueue_style(
        'nwc-charts',
        'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.css',
        array(),
        '4.4.0'
    );

    wp_enqueue_script(
        'nwc-charts-lib',
        'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
        array(),
        '4.4.0',
        true
    );

    wp_enqueue_script(
        'nwc-jspdf',
        'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
        array(),
        '2.5.1',
        true
    );

    wp_enqueue_script(
        'nwc-html2canvas',
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
        array(),
        '1.4.1',
        true
    );

    wp_enqueue_style(
        'nwc-main',
        NWC_PLUGIN_URL . 'assets/css/calculator.css',
        array('nwc-bootstrap'),
        NWC_VERSION
    );

    wp_enqueue_script(
        'nwc-main',
        NWC_PLUGIN_URL . 'assets/js/calculator.js',
        array('jquery', 'nwc-charts-lib'),
        NWC_VERSION,
        true
    );

    // Localize data for JavaScript
    wp_localize_script('nwc-main', 'nwcData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('nwc_nonce'),
        'i18n' => array(
            'netWorth' => __('Net Worth', 'net-worth-calculator'),
            'totalAssets' => __('Total Assets', 'net-worth-calculator'),
            'totalLiabilities' => __('Total Liabilities', 'net-worth-calculator'),
            'deleteItem' => __('Are you sure?', 'net-worth-calculator'),
        )
    ));
}
add_action('wp_enqueue_scripts', 'nwc_enqueue_assets');

// Shortcode
function nwc_calculator_shortcode() {
    ob_start();
    include NWC_PLUGIN_PATH . 'templates/calculator.php';
    return ob_get_clean();
}
add_shortcode('net-worth-calculator', 'nwc_calculator_shortcode');

// AJAX handler for export
add_action('wp_ajax_nwc_export_pdf', 'nwc_export_pdf');
add_action('wp_ajax_nopriv_nwc_export_pdf', 'nwc_export_pdf');

function nwc_export_pdf() {
    check_ajax_referer('nwc_nonce', 'nonce');

    if (!isset($_POST['data'])) {
        wp_send_json_error('Missing data');
    }

    wp_send_json_success(array(
        'message' => 'Export initiated'
    ));
}

// Activation hook
function nwc_activate() {
    // Create database table if needed
}
register_activation_hook(__FILE__, 'nwc_activate');

// Deactivation hook
function nwc_deactivate() {
    // Cleanup if needed
}
register_deactivation_hook(__FILE__, 'nwc_deactivate');
