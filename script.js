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

// ===== SUPABASE =====
async function guardarTurno(turno) {
    await supabase.from('turnos').insert([turno]);
}

async function obtenerTurnosPorFecha(fecha) {
    const { data } = await supabase
        .from('turnos')
        .select('hora')
        .eq('fecha', fecha);

    return data.map(t => t.hora);
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

// ===== HORARIOS INTELIGENTES =====
async function cargarHorariosDisponibles(fecha) {
    const horaSelect = document.getElementById("hora");
    horaSelect.innerHTML = '<option value="">Cargando horarios...</option>';

    const ocupados = await obtenerTurnosPorFecha(fecha);

    horaSelect.innerHTML = '<option value="">Seleccioná un horario</option>';

    let hayLibres = false;

    for (let h = 9; h <= 20; h++) {
        const hora = `${String(h).padStart(2, '0')}:00`;

        if (!ocupados.includes(hora)) {
            const option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
            hayLibres = true;
        }
    }

    if (!hayLibres) {
        horaSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
    }
}

// ===== FORM TURNOS =====
const form = document.getElementById("formTurno");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");
const calendarLink = document.getElementById("calendarLink");

document.addEventListener("DOMContentLoaded", () => {
    mostrarTurnos();

    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.min = hoy;

    fechaInput.addEventListener("input", async () => {
        const fechaSeleccionada = new Date(fechaInput.value);

        if (fechaSeleccionada.getDay() === 0) {
            alert("Los domingos Tempest está cerrado 💈");
            fechaInput.value = "";
            horaSelect.innerHTML = '<option value="">Elegí un horario</option>';
            return;
        }

        await cargarHorariosDisponibles(fechaInput.value);
    });
});

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const servicio = document.getElementById("servicio").value;
    const fecha = fechaInput.value;
    const hora = horaSelect.value;

    if (!hora) {
        alert("Elegí un horario válido");
        return;
    }

    const turno = { nombre, servicio, fecha, hora };
    await guardarTurno(turno);
    await mostrarTurnos();
    await cargarHorariosDisponibles(fecha);

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
    horaSelect.innerHTML = '<option value="">Elegí un horario</option>';
});
