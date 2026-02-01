/* ===========================================
   SCRIPTS - Pagina Acerca de (acercade.html)
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Animacion de fade-in para el contenido
    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card, index) {
        card.style.opacity = '0';

        setTimeout(function() {
            card.style.transition = 'opacity 0.6s ease';
            card.style.opacity = '1';
        }, 200 * index);
    });
});
