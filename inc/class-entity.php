<?php
/**
 * Entity class - handles celebrity/entity data
 */

class NW_Entity {
    private $post_id;
    private $post;

    public function __construct($post_id) {
        $this->post_id = (int) $post_id;
        $this->post = get_post($this->post_id);
    }

    /**
     * Get entity by post ID.
     */
    public static function get($post_id) {
        $post = get_post((int) $post_id);
        if (!$post) {
            return null;
        }
        return new self($post_id);
    }

    /**
     * Check if entity exists.
     */
    public function exists() {
        return $this->post !== null;
    }

    /**
     * Get entity ID (post ID).
     */
    public function get_id() {
        return $this->post_id;
    }

    /**
     * Get entity slug (post slug).
     */
    public function get_slug() {
        return $this->post ? $this->post->post_name : '';
    }

    /**
     * Get entity name (post title).
     */
    public function get_name() {
        return $this->post ? $this->post->post_title : '';
    }

    /**
     * Get raw net worth value in USD (from post meta).
     */
    public function get_nw_raw() {
        $nw = (int) get_post_meta($this->post_id, 'nw_value_raw', true);
        return $nw;
    }

    /**
     * Set raw net worth value.
     */
    public function set_nw_raw($value) {
        update_post_meta($this->post_id, 'nw_value_raw', (int) $value);
    }

    /**
     * Get formatted net worth for display (derived).
     */
    public function get_nw_display() {
        $raw = $this->get_nw_raw();
        return nw_format_currency($raw);
    }

    /**
     * Get featured image URL (headshot).
     */
    public function get_headshot_url() {
        $image_id = get_post_thumbnail_id($this->post_id);
        if ($image_id) {
            return wp_get_attachment_url($image_id);
        }
        return NW_COMPARE_URL . 'assets/placeholder.png';
    }

    /**
     * Get entity profile URL.
     */
    public function get_permalink() {
        return get_permalink($this->post_id);
    }

    /**
     * Get category/profession if set.
     */
    public function get_profession() {
        return get_post_meta($this->post_id, 'profession', true);
    }
}
