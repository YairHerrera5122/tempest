const SUPABASE_URL = "https://avdlzmovgnzrksvtcpqs.supabase.co";
const SUPABASE_KEY = "TU_PUBLIC_KEY";

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== LOGIN =====
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await sb.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert("Datos incorrectos");
    } else {
        iniciarPanel();
    }
}

async function logout() {
    await sb.auth.signOut();
    location.reload();
}

// ===== PROTEGER PANEL =====
async function iniciarPanel() {
    const { data } = await sb.auth.getSession();

    if (!data.session) return;

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("panel").style.display = "block";

    cargarTurnos();
}

iniciarPanel();

// ===== TURNOS =====
async function cargarTurnos() {
    const { data } = await sb
        .from("turnos")
        .select("*")
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

    const tabla = document.getElementById("tablaTurnos");
    tabla.innerHTML = "";

    data.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.fecha}</td>
            <td>${t.hora}</td>
            <td>${t.nombre}</td>
            <td>${t.servicio}</td>
            <td><button onclick="eliminar('${t.id}')">❌</button></td>
        `;
        tabla.appendChild(tr);
    });
}

async function eliminar(id) {
    await sb.from("turnos").delete().eq("id", id);
    cargarTurnos();
}
