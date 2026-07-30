jQuery(document).ready(function($) {
    // Frontend converter handler
    $(document).on('click', '.avro-bijoy-convert-btn', function() {
        const $btn = $(this);
        const direction = $btn.data('direction');
        const $input = $btn.closest('.avro-bijoy-converter-section').find('.avro-bijoy-shortcode-input[data-direction="' + direction + '"]');
        const $output = $btn.closest('.avro-bijoy-converter-section').find('.avro-bijoy-shortcode-output[data-direction="' + direction + '"]');
        const text = $input.val();

        if (!text) {
            alert('Please enter some text to convert');
            return;
        }

        $btn.prop('disabled', true).text('Converting...');

        $.ajax({
            url: avroConverterData.apiUrl,
            method: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', avroConverterData.nonce);
            },
            data: {
                text: text,
                direction: direction,
            },
            success: function(response) {
                if (response.success || response.converted) {
                    $output.val(response.converted);
                } else {
                    alert('Conversion failed');
                }
            },
            error: function() {
                alert('Error occurred during conversion');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Convert');
            }
        });
    });

    // Copy button handler
    $(document).on('click', '.avro-bijoy-copy-btn', function() {
        const $btn = $(this);
        const direction = $btn.data('direction');
        const $output = $btn.closest('.avro-bijoy-converter-section').find('.avro-bijoy-shortcode-output[data-direction="' + direction + '"]');
        const text = $output.val();

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
    });

    // Enter key support
    $(document).on('keydown', '.avro-bijoy-shortcode-input', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            $(this).closest('.avro-bijoy-converter-section').find('.avro-bijoy-convert-btn').click();
        }
    });
});
