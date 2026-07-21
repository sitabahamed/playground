<?php
/**
 * Comparison class - handles net worth comparison logic
 */

class NW_Comparison {
    private $entity_a;
    private $entity_b;

    public function __construct($entity_a_id, $entity_b_id) {
        $this->entity_a = NW_Entity::get($entity_a_id);
        $this->entity_b = NW_Entity::get($entity_b_id);
    }

    /**
     * Check if both entities exist.
     */
    public function is_valid() {
        return $this->entity_a && $this->entity_a->exists() &&
               $this->entity_b && $this->entity_b->exists();
    }

    /**
     * Get entity A.
     */
    public function get_entity_a() {
        return $this->entity_a;
    }

    /**
     * Get entity B.
     */
    public function get_entity_b() {
        return $this->entity_b;
    }

    /**
     * Get difference in net worth (A - B).
     */
    public function get_difference() {
        if (!$this->is_valid()) {
            return null;
        }
        return $this->entity_a->get_nw_raw() - $this->entity_b->get_nw_raw();
    }

    /**
     * Get formatted difference.
     */
    public function get_difference_display() {
        $diff = $this->get_difference();
        if ($diff === null) {
            return '—';
        }
        return nw_format_currency(abs($diff));
    }

    /**
     * Who is richer? Returns 'a', 'b', or 'equal'.
     */
    public function who_is_richer() {
        if (!$this->is_valid()) {
            return null;
        }
        $diff = $this->get_difference();
        if ($diff > 0) {
            return 'a';
        } elseif ($diff < 0) {
            return 'b';
        }
        return 'equal';
    }

    /**
     * Get comparison headline.
     */
    public function get_headline() {
        if (!$this->is_valid()) {
            return 'Comparison not available';
        }

        $name_a = $this->entity_a->get_name();
        $name_b = $this->entity_b->get_name();

        // Handle same entity comparison.
        if ($this->entity_a->get_id() === $this->entity_b->get_id()) {
            return "{$name_a} has the same net worth as themselves";
        }

        $who = $this->who_is_richer();
        $diff_display = $this->get_difference_display();

        if ($who === 'equal') {
            return "{$name_a} and {$name_b} have equal net worth";
        } elseif ($who === 'a') {
            return "{$name_a} is {$diff_display} richer than {$name_b}";
        } else {
            return "{$name_b} is {$diff_display} richer than {$name_a}";
        }
    }

    /**
     * Find if this pair has a published Tier 2 comparison (whitelisted).
     * Returns post ID or null.
     */
    public function find_curated() {
        if (!$this->is_valid()) {
            return null;
        }

        $a_id = $this->entity_a->get_id();
        $b_id = $this->entity_b->get_id();

        // Query for nw_comparison post with matching entity IDs (either direction).
        $args = [
            'post_type' => 'nw_comparison',
            'post_status' => 'publish',
            'meta_query' => [
                'relation' => 'AND',
                [
                    'key' => 'entity_a_id',
                    'value' => $a_id,
                ],
                [
                    'key' => 'entity_b_id',
                    'value' => $b_id,
                ],
            ],
            'numberposts' => 1,
        ];

        $posts = get_posts($args);
        return !empty($posts) ? $posts[0]->ID : null;
    }
}
