const SUPABASE_URL = "https://avdlzmovgnzrksvtcpqs.supabase.co";
const SUPABASE_KEY = "sb_publishable_HkQGFvP940_WnGA5ddf9gA_4prU4Qvd";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login(){
    const email=email.value;
    const password=password.value;

    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error) return alert(error.message);

    cargarTurnos();
}

async function cargarTurnos(){
    const {data}=await supabase.from("turnos").select("*");

    const lista=document.getElementById("listaTurnos");
    lista.innerHTML="";

    data.forEach(t=>{
        lista.innerHTML+=`
        <li>
        ${t.fecha} ${t.hora} - ${t.nombre}
        <button onclick="confirmar('${t.id}')">Confirmar</button>
        </li>`;
    });
}

async function confirmar(id){
    await supabase.from("turnos").update({estado:"confirmado"}).eq("id",id);
    cargarTurnos();
}
