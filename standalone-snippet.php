<?php
/**
 * Standalone Avro to Bijoy Converter PHP Snippet
 *
 * This snippet can be added directly to your WordPress site's functions.php
 * or used in any PHP file. It provides the conversion functionality without
 * requiring the full plugin.
 *
 * Usage:
 * $converter = new Standalone_Avro_Bijoy_Converter();
 * echo $converter->avro_to_bijoy("hello");
 * echo $converter->bijoy_to_avro("ৰেলো");
 */

class Standalone_Avro_Bijoy_Converter {

    private $avro_to_bijoy_map = [];

    public function __construct() {
        $this->init_maps();
    }

    private function init_maps() {
        $this->avro_to_bijoy_map = [
            // Vowels
            'a' => 'অ', 'aa' => 'আ', 'i' => 'ই', 'ii' => 'ঈ',
            'u' => 'উ', 'uu' => 'ঊ', 'ri' => 'ঋ', 'e' => 'এ',
            'oi' => 'ঐ', 'o' => 'ও', 'ou' => 'ঔ',

            // Consonants
            'k' => 'ক', 'kh' => 'খ', 'g' => 'গ', 'gh' => 'ঘ',
            'ng' => 'ঙ', 'ch' => 'চ', 'chh' => 'ছ', 'j' => 'জ',
            'jh' => 'ঝ', 'ny' => 'ঞ', 'tt' => 'ট', 'tth' => 'ঠ',
            'dd' => 'ড', 'ddh' => 'ঢ', 'nn' => 'ণ', 't' => 'ত',
            'th' => 'থ', 'd' => 'দ', 'dh' => 'ধ', 'n' => 'ন',
            'p' => 'প', 'ph' => 'ফ', 'b' => 'ব', 'bh' => 'ভ',
            'm' => 'ম', 'jj' => 'য', 'r' => 'র', 'l' => 'ল',
            'sh' => 'শ', 'ssh' => 'ষ', 's' => 'স', 'h' => 'হ',

            // Vowel signs
            'A' => 'া', 'I' => 'ি', 'II' => 'ী', 'U' => 'ু',
            'UU' => 'ূ', 'RI' => 'ৃ', 'E' => 'ে', 'OI' => 'ৈ',
            'O' => 'ো', 'OU' => 'ৌ',

            // Special marks
            '~' => 'ঁ', 'M' => 'ম', 'H' => 'ঃ', ':' => '়',

            // Numbers
            '0' => '০', '1' => '১', '2' => '२', '3' => '३',
            '4' => '४', '5' => '५', '6' => '६', '7' => '७',
            '8' => '८', '9' => '९',
        ];
    }

    public function avro_to_bijoy($text) {
        if (empty($text)) {
            return '';
        }

        $result = '';
        $i = 0;
        $length = strlen($text);

        while ($i < $length) {
            $found = false;
            for ($len = 3; $len >= 1; $len--) {
                if ($i + $len <= $length) {
                    $substr = substr($text, $i, $len);
                    if (isset($this->avro_to_bijoy_map[$substr])) {
                        $result .= $this->avro_to_bijoy_map[$substr];
                        $i += $len;
                        $found = true;
                        break;
                    }
                }
            }
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

        $bijoy_to_avro = array_flip($this->avro_to_bijoy_map);
        $result = '';
        $i = 0;
        $length = mb_strlen($text, 'UTF-8');

        while ($i < $length) {
            $char = mb_substr($text, $i, 1, 'UTF-8');
            if (isset($bijoy_to_avro[$char])) {
                $result .= $bijoy_to_avro[$char];
            } else {
                $result .= $char;
            }
            $i++;
        }

        return $result;
    }

    public function convert($text, $direction = 'avro_to_bijoy') {
        return ($direction === 'bijoy_to_avro')
            ? $this->bijoy_to_avro($text)
            : $this->avro_to_bijoy($text);
    }
}

// Initialize for WordPress
if (function_exists('add_action')) {
    function standalone_avro_bijoy_shortcode($atts) {
        $atts = shortcode_atts([
            'direction' => 'both',
        ], $atts);

        $converter = new Standalone_Avro_Bijoy_Converter();

        ob_start();
        ?>
        <div class="avro-bijoy-converter-standalone" style="margin: 20px 0;">
            <?php if ($atts['direction'] === 'avro_to_bijoy' || $atts['direction'] === 'both'): ?>
                <div style="margin-bottom: 20px;">
                    <h3>Avro to Bijoy</h3>
                    <textarea id="avro-input-standalone" placeholder="Enter Avro text..." style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></textarea>
                    <button onclick="convertAvroToBijoy()" style="padding: 10px 20px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">Convert</button>
                    <textarea id="bijoy-output-standalone" placeholder="Bijoy text..." style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-top: 10px; background: #f9f9f9;" readonly></textarea>
                </div>
            <?php endif; ?>

            <?php if ($atts['direction'] === 'bijoy_to_avro' || $atts['direction'] === 'both'): ?>
                <div>
                    <h3>Bijoy to Avro</h3>
                    <textarea id="bijoy-input-standalone" placeholder="Enter Bijoy text..." style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></textarea>
                    <button onclick="convertBijoyToAvro()" style="padding: 10px 20px; background: #0073aa; color: white; border: none; border-radius: 4px; cursor: pointer;">Convert</button>
                    <textarea id="avro-output-standalone" placeholder="Avro text..." style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-top: 10px; background: #f9f9f9;" readonly></textarea>
                </div>
            <?php endif; ?>
        </div>

        <script>
            function convertAvroToBijoy() {
                const input = document.getElementById('avro-input-standalone').value;
                const output = document.getElementById('bijoy-output-standalone');

                fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'action=standalone_avro_bijoy_convert&text=' + encodeURIComponent(input) + '&direction=avro_to_bijoy'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        output.value = data.converted;
                    }
                });
            }

            function convertBijoyToAvro() {
                const input = document.getElementById('bijoy-input-standalone').value;
                const output = document.getElementById('avro-output-standalone');

                fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'action=standalone_avro_bijoy_convert&text=' + encodeURIComponent(input) + '&direction=bijoy_to_avro'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        output.value = data.converted;
                    }
                });
            }
        </script>
        <?php
        return ob_get_clean();
    }

    add_shortcode('standalone_avro_bijoy', 'standalone_avro_bijoy_shortcode');

    add_action('wp_ajax_standalone_avro_bijoy_convert', function() {
        $converter = new Standalone_Avro_Bijoy_Converter();
        $text = isset($_POST['text']) ? sanitize_text_field($_POST['text']) : '';
        $direction = isset($_POST['direction']) ? sanitize_text_field($_POST['direction']) : 'avro_to_bijoy';

        $result = $converter->convert($text, $direction);

        wp_send_json([
            'success' => true,
            'converted' => $result,
        ]);
    });

    add_action('wp_ajax_nopriv_standalone_avro_bijoy_convert', function() {
        $converter = new Standalone_Avro_Bijoy_Converter();
        $text = isset($_POST['text']) ? sanitize_text_field($_POST['text']) : '';
        $direction = isset($_POST['direction']) ? sanitize_text_field($_POST['direction']) : 'avro_to_bijoy';

        $result = $converter->convert($text, $direction);

        wp_send_json([
            'success' => true,
            'converted' => $result,
        ]);
    });
}
