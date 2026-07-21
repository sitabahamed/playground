<?php
/**
 * Math and formatting utilities for net worth comparisons
 */

/**
 * Format a raw USD value to human-readable display.
 * Examples: 1800000000 -> "$1.8 Billion", 45000000 -> "$45 Million"
 */
function nw_format_currency($value) {
    $value = (int) $value;

    if ($value === 0) {
        return '$0';
    }

    $abs = abs($value);
    $sign = $value < 0 ? '-' : '';

    if ($abs >= 1_000_000_000) {
        $formatted = round($abs / 1_000_000_000, 2);
        return $sign . '$' . number_format($formatted, 2) . ' Billion';
    } elseif ($abs >= 1_000_000) {
        $formatted = round($abs / 1_000_000, 2);
        return $sign . '$' . number_format($formatted, 2) . ' Million';
    } elseif ($abs >= 1_000) {
        $formatted = round($abs / 1_000, 2);
        return $sign . '$' . number_format($formatted, 2) . ' Thousand';
    } else {
        return $sign . '$' . number_format($abs, 0);
    }
}

/**
 * Format currency without the decimal places for simpler display.
 * Examples: 1800000000 -> "$1.8B", 45000000 -> "$45M"
 */
function nw_format_currency_short($value) {
    $value = (int) $value;

    if ($value === 0) {
        return '$0';
    }

    $abs = abs($value);
    $sign = $value < 0 ? '-' : '';

    if ($abs >= 1_000_000_000) {
        $formatted = round($abs / 1_000_000_000, 1);
        return $sign . '$' . $formatted . 'B';
    } elseif ($abs >= 1_000_000) {
        $formatted = round($abs / 1_000_000, 1);
        return $sign . '$' . $formatted . 'M';
    } elseif ($abs >= 1_000) {
        $formatted = round($abs / 1_000, 1);
        return $sign . '$' . $formatted . 'K';
    } else {
        return $sign . '$' . number_format($abs, 0);
    }
}

/**
 * Parse a display formatted value back to raw (best effort).
 * Used for admin input, not critical for core logic.
 */
function nw_parse_currency($display) {
    $display = trim($display);
    $display = preg_replace('/[$,\s]/i', '', $display);

    if (preg_match('/^([0-9.]+)\s*b(?:illion)?$/i', $display, $m)) {
        return (int) ($m[1] * 1_000_000_000);
    } elseif (preg_match('/^([0-9.]+)\s*m(?:illion)?$/i', $display, $m)) {
        return (int) ($m[1] * 1_000_000);
    } elseif (preg_match('/^([0-9.]+)\s*k(?:thousand)?$/i', $display, $m)) {
        return (int) ($m[1] * 1_000);
    } else {
        return (int) $display;
    }
}
