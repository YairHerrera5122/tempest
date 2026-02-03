function reservar() {
    const mensaje = "Hola! Quiero reservar un turno en Tempest Barbería 💈";
    const url = "https://wa.me/5492975440834?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}
