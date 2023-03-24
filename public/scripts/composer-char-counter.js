$(document).ready(function () {
  const $textarea = $('.new-tweet textarea');
  const maxChars = 140;

  $textarea.on('input', function () {
    const $counter = $(this).closest('.new-tweet').find('.counter');
    const charsLeft = maxChars - $(this).val().length;
    if (charsLeft < 0) {
      $counter.css('color', 'red');
    } else {
      $counter.css('color', '');
    }

    $counter.text(charsLeft);
  });
});
