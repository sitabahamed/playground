<?php
/**
 * Avro to Bijoy Converter Class
 * Handles bidirectional conversion between Avro and Bijoy Bangla text
 */

if (!defined('ABSPATH')) {
    exit;
}

class Avro_Bijoy_Converter {

    private $avro_to_bijoy_map = [];
    private $bijoy_to_avro_map = [];

    public function __construct() {
        $this->initialize_conversion_maps();
    }

    private function initialize_conversion_maps() {
        $this->avro_to_bijoy_map = [
            // Vowels
            'a' => 'অ',
            'aa' => 'আ',
            'i' => 'ই',
            'ii' => 'ঈ',
            'u' => 'উ',
            'uu' => 'ঊ',
            'ri' => 'ঋ',
            'e' => 'এ',
            'oi' => 'ঐ',
            'o' => 'ও',
            'ou' => 'ঔ',

            // Consonants
            'k' => 'ক',
            'kh' => 'খ',
            'g' => 'গ',
            'gh' => 'ঘ',
            'ng' => 'ঙ',
            'ch' => 'চ',
            'chh' => 'ছ',
            'j' => 'জ',
            'jh' => 'ঝ',
            'ny' => 'ঞ',
            'tt' => 'ট',
            'tth' => 'ঠ',
            'dd' => 'ড',
            'ddh' => 'ঢ',
            'nn' => 'ণ',
            't' => 'ত',
            'th' => 'থ',
            'd' => 'দ',
            'dh' => 'ধ',
            'n' => 'ন',
            'p' => 'প',
            'ph' => 'ফ',
            'b' => 'ব',
            'bh' => 'ভ',
            'm' => 'ম',
            'jj' => 'য',
            'r' => 'র',
            'l' => 'ল',
            'sh' => 'শ',
            'ssh' => 'ষ',
            's' => 'স',
            'h' => 'হ',
            'ড়' => 'ড়',
            'ঢ়' => 'ঢ়',
            'য়' => 'য়',

            // Vowel signs
            'A' => 'া',
            'I' => 'ি',
            'II' => 'ী',
            'U' => 'ু',
            'UU' => 'ূ',
            'RI' => 'ৃ',
            'E' => 'ে',
            'OI' => 'ৈ',
            'O' => 'ো',
            'OU' => 'ৌ',

            // Nukta and other marks
            '~' => 'ঁ',
            'M' => 'ম',
            'H' => 'ঃ',
            ':' => '়',

            // Numbers
            '0' => '০',
            '1' => '১',
            '2' => '২',
            '3' => '৩',
            '4' => '৪',
            '5' => '৫',
            '6' => '৬',
            '7' => '৭',
            '8' => '৮',
            '9' => '৯',
        ];

        $this->bijoy_to_avro_map = array_flip($this->avro_to_bijoy_map);
    }

    public function avro_to_bijoy($text) {
        if (empty($text)) {
            return '';
        }

        $result = '';
        $i = 0;
        $text_length = strlen($text);

        while ($i < $text_length) {
            $found = false;

            // Try multi-character matches first (longest first)
            for ($len = 3; $len >= 1; $len--) {
                if ($i + $len <= $text_length) {
                    $substring = substr($text, $i, $len);
                    if (isset($this->avro_to_bijoy_map[$substring])) {
                        $result .= $this->avro_to_bijoy_map[$substring];
                        $i += $len;
                        $found = true;
                        break;
                    }
                }
            }

            // If no match found, keep original character
            if (!$found) {
                $result .= substr($text, $i, 1);
                $i++;
            }
        }

        return $result;
    }

    public function bijoy_to_avro($text) {
        if (empty($text)) {
            return '';
        }

        $result = '';
        $i = 0;
        $text_length = mb_strlen($text, 'UTF-8');

        while ($i < $text_length) {
            $char = mb_substr($text, $i, 1, 'UTF-8');

            if (isset($this->bijoy_to_avro_map[$char])) {
                $result .= $this->bijoy_to_avro_map[$char];
            } else {
                $result .= $char;
            }

            $i++;
        }

        return $result;
    }

    public function convert($text, $direction = 'avro_to_bijoy') {
        if ($direction === 'bijoy_to_avro') {
            return $this->bijoy_to_avro($text);
        }
        return $this->avro_to_bijoy($text);
    }
}
