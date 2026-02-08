function volverArriba(){
    window.scrollTo({top:0,behavior:"smooth"});
}

const listaServicios = document.getElementById("listaServicios");
const selectServicio = document.getElementById("servicio");
const fechaInput = document.getElementById("fecha");
const horaSelect = document.getElementById("hora");

// SERVICIOS
async function cargarServicios(){
    const {data} = await supabase.from("servicios").select("*");

    listaServicios.innerHTML="";
    selectServicio.innerHTML='<option value="">Elegí un servicio</option>';

    data.forEach(s=>{
        listaServicios.innerHTML += `<li>${s.nombre} - $${s.precio}</li>`;
        selectServicio.innerHTML += `<option>${s.nombre}</option>`;
    });
}

// HORARIOS
async function cargarHorarios(fecha){
    const {data} = await supabase
        .from("turnos")
        .select("hora")
        .eq("fecha",fecha);

    const ocupados = data.map(t=>t.hora);

    horaSelect.innerHTML='<option value="">Elegí horario</option>';

    for(let h=9;h<=20;h++){
        const hora=`${String(h).padStart(2,'0')}:00`;
        if(!ocupados.includes(hora)){
            horaSelect.innerHTML+=`<option>${hora}</option>`;
        }
    }
}

fechaInput.addEventListener("change",e=>{
    cargarHorarios(e.target.value);
});

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
