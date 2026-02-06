// ===== PROTECCIÓN CON CONTRASEÑA =====
const password = prompt("Contraseña de administrador:");
if (password !== "tempest2026") {
  document.body.innerHTML = "<h1>Acceso denegado</h1>";
  throw new Error("No autorizado");
}

// ===== SUPABASE =====
const SUPABASE_URL = "https://avdlzmovgnzrksvtcpqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_HkQGFvP940_WnGA5ddf9gA_4prU4Qvd";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== CARGAR TURNOS =====
async function cargarTurnos() {
  const { data, error } = await supabaseClient
    .from("turnos")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const tabla = document.getElementById("tablaTurnos");
  tabla.innerHTML = "";

  data.forEach(turno => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${turno.fecha}</td>
      <td>${turno.hora}</td>
      <td>${turno.nombre}</td>
      <td>${turno.servicio}</td>
      <td><button onclick="eliminarTurno('${turno.id}')">🗑</button></td>
    `;

    tabla.appendChild(fila);
  });
}

// ===== ELIMINAR TURNO =====
async function eliminarTurno(id) {
  const confirmar = confirm("¿Eliminar este turno?");
  if (!confirmar) return;

  await supabaseClient
    .from("turnos")
    .delete()
    .eq("id", id);

  cargarTurnos();
}

// ===== INICIAR =====
cargarTurnos();
