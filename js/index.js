/* ===========================================
   SCRIPTS - Pagina Inicio (index.html)
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Animacion de entrada para cards de proyectos
    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(function() {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});
