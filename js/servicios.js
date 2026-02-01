/* ===========================================
   SCRIPTS - Pagina Servicios (servicios.html)
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Animacion de entrada para la card de informacion
    const infoCard = document.querySelector('.card.alert-info');

    if (infoCard) {
        infoCard.style.opacity = '0';
        infoCard.style.transform = 'scale(0.95)';

        setTimeout(function() {
            infoCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            infoCard.style.opacity = '1';
            infoCard.style.transform = 'scale(1)';
        }, 100);
    }
});
