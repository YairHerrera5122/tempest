const serviciosDiv = document.getElementById("listaServicios");
const servicioSelect = document.getElementById("servicio");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");
const form = document.getElementById("formTurno");
const msg = document.getElementById("msg");

// Cargar servicios
async function cargarServicios() {
  const { data } = await db.from("servicios").select("*");

  serviciosDiv.innerHTML = "";
  servicioSelect.innerHTML = '<option value="">Elegí un servicio</option>';

  data.forEach(s => {
    serviciosDiv.innerHTML += `
      <div class="card">
        <h3>${s.nombre}</h3>
        <p>$${s.precio}</p>
      </div>`;

    servicioSelect.innerHTML += `
      <option value="${s.nombre}">${s.nombre}</option>`;
  });
}

// Horarios libres
async function cargarHorarios(fecha) {
  const { data } = await db
    .from("turnos")
    .select("hora")
    .eq("fecha", fecha);

  const ocupados = data.map(t => t.hora);
  horaSelect.innerHTML = '<option value="">Elegí un horario</option>';

  for (let h = 9; h <= 20; h++) {
    const hora = `${String(h).padStart(2,'0')}:00`;
    if (!ocupados.includes(hora)) {
      horaSelect.innerHTML += `<option>${hora}</option>`;
    }
  }
}

fechaInput.addEventListener("change", () => {
  cargarHorarios(fechaInput.value);
});

// Guardar turno
form.addEventListener("submit", async e => {
  e.preventDefault();

  const turno = {
    nombre: nombre.value,
    servicio: servicio.value,
    fecha: fecha.value,
    hora: hora.value
  };

  await db.from("turnos").insert([turno]);

  msg.innerHTML = "✅ Turno reservado";

  const inicio = `${turno.fecha}T${turno.hora}:00`;
  const finHora = String(parseInt(turno.hora)+1).padStart(2,'0')+":00";
  const fin = `${turno.fecha}T${finHora}:00`;

  const calendar = `https://www.google.com/calendar/render?action=TEMPLATE
  &text=Turno Tempest - ${turno.servicio}
  &dates=${inicio.replace(/[-:]/g,'')}/${fin.replace(/[-:]/g,'')}
  &details=Cliente: ${turno.nombre}`.replace(/\n/g,'');

  window.open(calendar);

   // WhatsApp
  const texto = `Hola Lucca! Reservé un turno:
Nombre: ${turno.nombre}
Servicio: ${turno.servicio}
Fecha: ${turno.fecha}
Hora: ${turno.hora}`;

  window.open(`https://wa.me/5492975440834?text=${encodeURIComponent(texto)}`);
});

cargarServicios();
