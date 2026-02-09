const loginDiv = document.getElementById("login");
const panel = document.getElementById("panel");

async function login(){
  const { error } = await db.auth.signInWithPassword({
    email: email.value,
    password: pass.value
  });

  if(!error){
    loginDiv.style.display="none";
    panel.style.display="block";
    cargarTodo();
  } else {
    alert(error.message);
  }
}

async function cargarTodo(){
  cargarTurnos();
  cargarServicios();
}

// ===== TURNOS =====
async function cargarTurnos(){
  const { data } = await db.from("turnos").select("*").order("fecha");

  turnos.innerHTML="";
  data.forEach(t=>{
    turnos.innerHTML+=`
      <div class="card">
        <b>${t.fecha} ${t.hora}</b><br>
        ${t.nombre} - ${t.servicio}<br>
        Estado: <b>${t.estado}</b><br><br>

        <button onclick="cambiarEstado('${t.id}','confirmado')">✅ Confirmar</button>
        <button onclick="cambiarEstado('${t.id}','cancelado')">❌ Cancelar</button>
      </div>`;
  });
}

async function cambiarEstado(id, estado){
  await db.from("turnos").update({estado}).eq("id", id);
  cargarTurnos();
}

// ===== SERVICIOS =====
async function cargarServicios(){
  const { data } = await db.from("servicios").select("*");

  servicios.innerHTML="";
  data.forEach(s=>{
    servicios.innerHTML+=`
      <div class="card">
        ${s.nombre} -
        $<input value="${s.precio}" id="p${s.id}" style="width:80px">
        <button onclick="guardarPrecio('${s.id}')">Guardar</button>
      </div>`;
  });
}

async function guardarPrecio(id){
  const nuevo = document.getElementById("p"+id).value;
  await db.from("servicios").update({precio:nuevo}).eq("id", id);
  alert("Precio actualizado");
}
