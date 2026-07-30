jQuery(document).ready(function($) {
    // Avro to Bijoy conversion
    $('#convert-avro-bijoy').on('click', function() {
        const text = $('#avro-input').val();
        if (!text) {
            alert('Please enter some Avro text');
            return;
        }

        convertText(text, 'avro_to_bijoy', function(result) {
            $('#bijoy-output').val(result);
        });
    });

    // Bijoy to Avro conversion
    $('#convert-bijoy-avro').on('click', function() {
        const text = $('#bijoy-input').val();
        if (!text) {
            alert('Please enter some Bijoy text');
            return;
        }

        convertText(text, 'bijoy_to_avro', function(result) {
            $('#avro-output').val(result);
        });
    });

    // Copy functions
    $('#copy-bijoy-output').on('click', function() {
        copyToClipboard('#bijoy-output', $(this));
    });

    $('#copy-avro-output').on('click', function() {
        copyToClipboard('#avro-output', $(this));
    });

    // Real-time conversion on input
    $('#avro-input').on('keyup', function() {
        const text = $(this).val();
        if (text) {
            convertText(text, 'avro_to_bijoy', function(result) {
                $('#bijoy-output').val(result);
            });
        }
    });

    $('#bijoy-input').on('keyup', function() {
        const text = $(this).val();
        if (text) {
            convertText(text, 'bijoy_to_avro', function(result) {
                $('#avro-output').val(result);
            });
        }
    });

    function convertText(text, direction, callback) {
        $.ajax({
            url: avroConverterData.ajaxUrl,
            method: 'POST',
            data: {
                action: 'avro_bijoy_ajax_convert',
                nonce: avroConverterData.nonce,
                text: text,
                direction: direction,
            },
            success: function(response) {
                if (response.success) {
                    callback(response.data.converted);
                }
            }
        });
    }

    function copyToClipboard(selector, $btn) {
        const $element = $(selector);
        const text = $element.val();

        if (!text) {
            alert('Nothing to copy');
            return;
        }

        const $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(text).select();
        document.execCommand('copy');
        $temp.remove();

        const originalText = $btn.text();
        $btn.text('Copied!');
        setTimeout(function() {
            $btn.text(originalText);
        }, 2000);
    }
});
