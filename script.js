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
    ScrollReveal().reveal('.servicios, .galeria, #turnos', {
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
    document.getElementById("lightbox").style.display = "none";
}

// ===== SUPABASE FUNCIONES =====
async function turnoOcupado(fecha, hora) {
    const { data } = await supabase
        .from('turnos')
        .select('*')
        .eq('fecha', fecha)
        .eq('hora', hora);

    return data.length > 0;
}

async function guardarTurno(turno) {
    await supabase.from('turnos').insert([turno]);
}

async function mostrarTurnos() {
    const lista = document.getElementById("listaTurnos");
    lista.innerHTML = "";

    const { data } = await supabase
        .from('turnos')
        .select('*')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });

    data.forEach(t => {
        const li = document.createElement("li");
        li.textContent = `${t.fecha} ${t.hora} - ${t.nombre} (${t.servicio})`;
        lista.appendChild(li);
    });
}

// ===== FORM TURNOS =====
const form = document.getElementById("formTurno");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const calendarLink = document.getElementById("calendarLink");

document.addEventListener("DOMContentLoaded", () => {
    mostrarTurnos();

    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.min = hoy;

    horaInput.step = 3600;
    horaInput.min = "09:00";
    horaInput.max = "20:00";

    fechaInput.addEventListener("input", () => {
        const fechaSeleccionada = new Date(fechaInput.value);
        if (fechaSeleccionada.getDay() === 0) {
            alert("Los domingos Tempest está cerrado 💈");
            fechaInput.value = "";
        }
    });
});

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const servicio = document.getElementById("servicio").value;
    const fecha = fechaInput.value;
    const hora = horaInput.value;

    if (await turnoOcupado(fecha, hora)) {
        alert("Ese horario ya está reservado 💈");
        return;
    }

    const turno = { nombre, servicio, fecha, hora };
    await guardarTurno(turno);
    await mostrarTurnos();

    // Google Calendar
    const horaNumero = parseInt(hora.split(":")[0]);
    const inicio = `${fecha}T${hora}:00`;
    const finHora = String(horaNumero + 1).padStart(2, '0') + ":00";
    const fin = `${fecha}T${finHora}:00`;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE
&text=Turno Tempest - ${servicio}
&dates=${inicio.replace(/[-:]/g, '')}/${fin.replace(/[-:]/g, '')}
&details=Cliente: ${nombre}
&location=Tempest Barbería`.replace(/\n/g, '');

    calendarLink.innerHTML =
        `<a href="${calendarUrl}" target="_blank">📅 Agregar a Google Calendar</a>`;

    // WhatsApp
    const mensaje = `Hola Lucca! Quiero reservar un turno en Tempest 💈

Nombre: ${nombre}
Servicio: ${servicio}
Fecha: ${fecha}
Hora: ${hora}`;

    window.open(`https://wa.me/5492975440834?text=${encodeURIComponent(mensaje)}`, "_blank");

    form.reset();
});
