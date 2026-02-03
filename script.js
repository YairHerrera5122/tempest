function reservar() {
    const mensaje = "Hola! Quiero reservar un turno en Tempest Barbería 💈";
    const url = "https://wa.me/5492975440834?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}
function volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function () {
    const btn = document.getElementById("topBtn");
    if (document.documentElement.scrollTop > 300) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

ScrollReveal().reveal('.servicios, .galeria, .turno', {
    distance: '50px',
    duration: 800,
    easing: 'ease-in-out',
    origin: 'bottom',
    interval: 200
});
