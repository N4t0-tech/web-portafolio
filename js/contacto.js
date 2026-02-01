/* ===========================================
   SCRIPTS - Pagina Contacto (contacto.html)
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Animacion de entrada para cards de contacto
    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(function() {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 150 * index);
    });
});
