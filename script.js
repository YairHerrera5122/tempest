// ===== BOTÓN VOLVER ARRIBA =====
function volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener("scroll", () => {
    const btn = document.getElementById("topBtn");
    if (btn) {
        btn.style.display = document.documentElement.scrollTop > 300 ? "block" : "none";
    }
});

// ===== SCROLL REVEAL =====
if (typeof ScrollReveal !== "undefined") {
    ScrollReveal().reveal('.servicios, .galeria, #turno', {
        distance: '50px',
        duration: 800,
        easing: 'ease-in-out',
        origin: 'bottom',
        interval: 200
    });
}

// ===== LIGHTBOX =====
function abrirLightbox(elemento) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const text = document.getElementById("lightboxText");

    if (!lb || !img || !text) return;

    if (elemento.tagName === "IMG") {
        img.src = elemento.src;
        img.style.display = "block";
        text.style.display = "none";
    } else {
        img.style.display = "none";
        text.style.display = "block";
    }

    lb.style.display = "flex";
}

function cerrarLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.style.display = "none";
}

// ===== FORM TURNOS (VALIDADO + WHATSAPP + EMAIL + GOOGLE CALENDAR) =====
const form = document.getElementById("formTurno");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const calendarLink = document.getElementById("calendarLink");

if (form && fechaInput && horaInput && calendarLink) {

    // Fecha mínima = hoy
    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.min = hoy;

    // No permitir domingos
    fechaInput.addEventListener("input", () => {
        const fechaSeleccionada = new Date(fechaInput.value);
        if (fechaSeleccionada.getDay() === 0) {
            alert("Los domingos Tempest está cerrado 💈");
            fechaInput.value = "";
        }
    });

    // Horarios
    horaInput.step = 3600;
    horaInput.min = "09:00";
    horaInput.max = "20:00";

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const servicio = document.getElementById("servicio").value;
        const fecha = fechaInput.value;
        const hora = horaInput.value;

        if (!nombre || !servicio || !fecha || !hora) {
            alert("Por favor completá todos los campos.");
            return;
        }

        const ahora = new Date();
        const fechaTurno = new Date(`${fecha}T${hora}`);

        if (fechaTurno < ahora) {
            alert("No podés reservar un turno en el pasado.");
            return;
        }

        const horaNumero = parseInt(hora.split(":")[0]);
        if (horaNumero < 9 || horaNumero > 20) {
            alert("Los turnos son entre las 09:00 y las 20:00 hs.");
            return;
        }

        // ===== GOOGLE CALENDAR =====
        const inicio = `${fecha}T${hora}:00`;
        const finHora = String(horaNumero + 1).padStart(2, '0') + ":00";
        const fin = `${fecha}T${finHora}:00`;

        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE
&text=Turno Tempest - ${servicio}
&dates=${inicio.replace(/[-:]/g, '')}/${fin.replace(/[-:]/g, '')}
&details=Cliente: ${nombre}
&location=Tempest Barbería`.replace(/\n/g, '');

        // Mostrar link en la página
        calendarLink.innerHTML = `
            <strong>Agregar a Google Calendar:</strong>
            <a href="${calendarUrl}" target="_blank">Guardar evento</a>
        `;

        // ===== MENSAJE =====
        const mensaje = `Hola Lucca! Quiero reservar un turno en Tempest 💈

Nombre: ${nombre}
Servicio: ${servicio}
Fecha: ${fecha}
Hora: ${hora}

Agendar en Google Calendar:
${calendarUrl}`;

        // WhatsApp
        const wa = `https://wa.me/5492975440834?text=${encodeURIComponent(mensaje)}`;
        window.open(wa, "_blank");

        // Email
        const mail = `mailto:1.luccaherrera@gmail.com?subject=Nuevo turno Tempest&body=${encodeURIComponent(mensaje)}`;
        window.open(mail, "_blank");
    });
}
