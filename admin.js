const SUPABASE_URL = "https://avdlzmovgnzrksvtcpqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_HkQGFvP940_WnGA5ddf9gA_4prU4Qvd";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const lista = document.getElementById("listaTurnos");
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

// ===== LOGIN =====
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  iniciarAdmin();
}

// ===== LOGOUT =====
async function logout() {
  await supabaseClient.auth.signOut();
  location.reload();
}

// ===== INICIAR ADMIN =====
async function iniciarAdmin() {
  loginBox.style.display = "none";
  adminPanel.style.display = "block";
  cargarTurnos();
}

// ===== CARGAR TURNOS =====
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
      <b>${turno.fecha} ${turno.hora}</b> - ${turno.nombre} (${turno.servicio})
      <br>Estado: <b>${turno.estado}</b><br>

      <button onclick="cambiarEstado('${turno.id}','confirmado')">✅ Confirmar</button>
      <button onclick="cambiarEstado('${turno.id}','cancelado')">❌ Cancelar</button>
      <button onclick="borrarTurno('${turno.id}')">🗑 Borrar</button>
      <hr>
    `;

    lista.appendChild(li);
  });
}

// ===== ESTADO =====
async function cambiarEstado(id, estado) {
  await supabaseClient.from("turnos").update({ estado }).eq("id", id);
  cargarTurnos();
}

// ===== BORRAR =====
async function borrarTurno(id) {
  await supabaseClient.from("turnos").delete().eq("id", id);
  cargarTurnos();
}

// ===== SESIÓN ACTIVA =====
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) iniciarAdmin();
});
