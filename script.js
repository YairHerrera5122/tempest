function volverArriba(){
    window.scrollTo({top:0,behavior:"smooth"});
}

const listaServicios = document.getElementById("listaServicios");
const selectServicio = document.getElementById("servicio");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");

// ===== CARGAR SERVICIOS COMO TARJETAS =====
async function cargarServicios() {
    const { data } = await supabase.from('servicios').select('*');

    const lista = document.getElementById("listaServicios");
    const select = document.getElementById("servicio");

    lista.innerHTML = "";
    select.innerHTML = '<option value="">Elegí un servicio</option>';

    data.forEach(s => {
        // TARJETA VISUAL
        const li = document.createElement("li");
        li.className = "servicio-card";
        li.innerHTML = `
            <h3>${s.nombre}</h3>
            <p class="precio">$${s.precio}</p>
        `;
        lista.appendChild(li);

        // SELECT DEL FORM
        const option = document.createElement("option");
        option.value = s.nombre;
        option.textContent = `${s.nombre} - $${s.precio}`;
        select.appendChild(option);
    });
}

async function cargarHorariosDisponibles(fecha) {
    const horaSelect = document.getElementById("hora");
    horaSelect.innerHTML = '<option value="">Cargando...</option>';

    const { data } = await supabase
        .from('turnos')
        .select('hora')
        .eq('fecha', fecha);

    const ocupados = data.map(t => t.hora);

    horaSelect.innerHTML = '<option value="">Elegí un horario</option>';

    for (let h = 9; h <= 20; h++) {
        const hora = String(h).padStart(2, '0') + ":00";

        if (!ocupados.includes(hora)) {
            const option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
        }
    }
}


// RESERVA
document.getElementById("formTurno").addEventListener("submit",async e=>{
    e.preventDefault();

    const nombre=nombre.value;
    const servicio=selectServicio.value;
    const fecha=fechaInput.value;
    const hora=horaSelect.value;

    await supabase.from("turnos").insert([{nombre,servicio,fecha,hora,estado:"pendiente"}]);

    window.open(`https://wa.me/5492975440834?text=Turno Tempest
${nombre}
${servicio}
${fecha} ${hora}`,"_blank");

    alert("Turno enviado!");
});

cargarServicios();
