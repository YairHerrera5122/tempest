const SUPABASE_URL = "https://avdlzmovgnzrksvtcpqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_HkQGFvP940_WnGA5ddf9gA_4prU4Qvd";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const lista = document.getElementById("listaTurnos");
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const preciosBox = document.getElementById("preciosBox");

// ===== AUTH =====
async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    iniciarAdmin();
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}

// ===== INICIAR ADMIN =====
async function iniciarAdmin() {
  loginBox.style.display = "none";
  adminPanel.style.display = "block";
  await cargarTurnos();
  await cargarPrecios();
}

// ===== CARGAR TURNOS (sin solapamientos) =====
async function cargarTurnos() {
  lista.innerHTML = "";

  const { data } = await supabaseClient
    .from("turnos")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  data.forEach((turno) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="cardTurno">
        <b>${turno.fecha} ${turno.hora}</b> - ${turno.nombre} (${turno.servicio})
        <br>Estado: <b>${turno.estado}</b><br><br>

        <button onclick="cambiarEstado('${turno.id}','confirmado')">✅ Confirmar</button>
        <button onclick="cambiarEstado('${turno.id}','cancelado')">❌ Cancelar</button>
        <button onclick="borrarTurno('${turno.id}')">🗑 Borrar</button>
      </div>
      <hr>
    `;

    lista.appendChild(li);
  });
}

// ===== CAMBIAR ESTADO =====
async function cambiarEstado(id, estado) {
  await supabaseClient.from("turnos").update({ estado }).eq("id", id);
  await cargarTurnos();
}

// ===== BORRAR =====
async function borrarTurno(id) {
  await supabaseClient.from("turnos").delete().eq("id", id);
  await cargarTurnos();
}

// ================= PRECIOS =================

// Tabla: precios (id, servicio, precio)

async function cargarPrecios() {
  preciosBox.innerHTML = "<h2>💲 Precios</h2>";

  const { data } = await supabaseClient.from("precios").select("*");

  data.forEach((p) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${p.servicio}</label>
      <input type="number" id="precio-${p.id}" value="${p.precio}">
      <button onclick="guardarPrecio('${p.id}')">Guardar</button>
      <br><br>
    `;
    preciosBox.appendChild(div);
  });
}

async function guardarPrecio(id) {
  const nuevoPrecio = document.getElementById(`precio-${id}`).value;

  await supabaseClient
    .from("precios")
    .update({ precio: nuevoPrecio })
    .eq("id", id);

  alert("Precio actualizado");
}

// ===== SESIÓN ACTIVA =====
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) iniciarAdmin();
});
