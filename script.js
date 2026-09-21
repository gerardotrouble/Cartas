$(document).ready(function () {
  const $allCovers = $('.valentines-day');
  const $boxCart = $('.box-cart');

  // Cada sobre (.valentines-day) se vincula con su propia carta mediante
  // el atributo data-card, así cada uno abre únicamente su texto.
  $allCovers.each(function () {
    const $cover = $(this);
    const $envelope = $cover.find('.envelope');
    const $coverElements = $cover.find('.heart, .text, .front');

    const cardId = $cover.data('card');
    const $card = $('#' + cardId);
    const $backButton = $card.find('.back-button');

    // Abre la carta manteniendo la animación original.
    $cover.on('click', function () {
      // Evita abrir varias cartas a la vez si ya hay una en proceso.
      if ($boxCart.hasClass('is-open')) {
        return;
      }
      $boxCart.addClass('is-open');

      $envelope.css({
        animation: 'fall 3s linear 1',
        '-webkit-animation': 'fall 3s linear 1'
      });

      $envelope.fadeOut(800, function () {
        $coverElements.hide();
        // Oculta también el resto de los sobres para que no se vean
        // detrás de la carta abierta.
        $allCovers.not($cover).fadeOut(200);

        const isResponsive = window.matchMedia('(max-width: 900px)').matches;
        const initialTransform = isResponsive
          ? 'translate(-50%, -50%) scale(0.1)'
          : 'scale(0.1)';
        const scaleTransform = isResponsive
          ? 'translate(-50%, -50%) scale('
          : 'scale(';

        $card.css({
          visibility: 'visible',
          opacity: 0,
          transform: initialTransform
        });

        $card.stop(true, true).animate({ opacity: 1 }, {
          duration: 1000,
          step: function (now) {
            const scale = 1 + Math.sin(now * Math.PI) * 0.1;
            $(this).css('transform', scaleTransform + scale + ')');
          }
        });
      });
    });

    // Regresa al sobre correspondiente sin recargar la página.
    $backButton.on('click', function (event) {
      event.stopPropagation();

      $card.stop(true, true).animate({ opacity: 0 }, 450, function () {
        $card.css({
          visibility: 'hidden',
          opacity: 0,
          transform: ''
        });

        // Restablece la portada para poder abrir la carta nuevamente.
        $coverElements.show();
        $envelope
          .stop(true, true)
          .css({
            display: 'block',
            opacity: 1,
            animation: 'none',
            '-webkit-animation': 'none'
          });

        // Permite que la animación de entrada vuelva a ejecutarse en la siguiente apertura.
        void $envelope[0].offsetWidth;

        // Vuelve a mostrar todos los sobres.
        $allCovers.not($cover).fadeIn(200);
        $boxCart.removeClass('is-open');
      });
    });
  });
});
