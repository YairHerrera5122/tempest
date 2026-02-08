const SUPABASE_URL = "https://avdlzmovgnzrksvtcpqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_HkQGFvP940_WnGA5ddf9gA_4prU4Qvd";
const lista = document.getElementById("listaTurnos");
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

// ===== AUTH =====
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Error de login");
  } else {
    iniciarAdmin();
  }
}

async function logout() {
  await supabase.auth.signOut();
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

  const { data } = await supabase
    .from("turnos")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  data.forEach(turno => {
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

// ===== CAMBIAR ESTADO =====
async function cambiarEstado(id, estado) {
  await supabase
    .from("turnos")
    .update({ estado })
    .eq("id", id);

  cargarTurnos();
}

// ===== BORRAR =====
async function borrarTurno(id) {
  await supabase
    .from("turnos")
    .delete()
    .eq("id", id);

  cargarTurnos();
}

// ===== SESIÓN ACTIVA =====
supabase.auth.getSession().then(({ data }) => {
  if (data.session) iniciarAdmin();
});
