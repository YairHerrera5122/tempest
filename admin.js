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
  }
}

async function cargarTodo(){
  cargarTurnos();
  cargarServicios();
}

async function cargarTurnos(){
  const { data } = await db.from("turnos").select("*");

  turnos.innerHTML="";
  data.forEach(t=>{
    turnos.innerHTML+=`
      <div class="card">
        ${t.fecha} ${t.hora} - ${t.nombre} (${t.servicio})
      </div>`;
  });
}

async function cargarServicios(){
  const { data } = await db.from("servicios").select("*");

  servicios.innerHTML="";
  data.forEach(s=>{
    servicios.innerHTML+=`
      <div class="card">
        ${s.nombre} - $${s.precio}
      </div>`;
  });
}
