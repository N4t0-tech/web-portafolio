/* ===========================================
   SCRIPTS COMUNES - Funcionalidad compartida
   =========================================== */

// Marcar enlace activo en navbar segun pagina actual
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(function(link) {
        link.classList.remove('active');
        link.parentElement.classList.remove('active');

        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            link.parentElement.classList.add('active');
        }
    });
});

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
