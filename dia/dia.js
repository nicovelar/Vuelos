//Selección de los elementos del html
const d = document
$tableDia = d.querySelector(".crud-table-dia")
$formDia = d.querySelector(".crud-form-dia")
$templateDia = d.getElementById("crud-template-dia").content
$fragment = d.createDocumentFragment()
$title = d.querySelector(".crud-title")

  const getDia = async () => {
    try {
      let res = await fetch("http://localhost:3000/Dia")
        json = await res.json()
  
      if (!res.ok) throw { status: res.status, statusText: res.statusText }
  
        $templateDia.querySelector(".dia").textContent = json.Dia
        let dia = new Date(json.Dia.substr(0,4),json.Dia.substr(5,2)-1,json.Dia.substr(8,2))
        $templateDia.querySelector(".diaCompleto").textContent = dia.toLocaleDateString("es-MX",{ weekday:'long', day:'numeric', month:'long', year:'numeric' }).toLocaleUpperCase();
       
        let $clone = d.importNode($templateDia, true)
        $fragment.appendChild($clone)
 
  
      $tableDia.querySelector("tbody").appendChild($fragment)
    } catch (err) {
      let message = err || "Ocurrió un error al mostrar"
      $tableDia.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
    }
  }
d.addEventListener("DOMContentLoaded", getDia)

//A través del método POST creamos un nuevo funcionario
d.addEventListener("submit", async e => {

  if (e.target === $formDia) {
  
    e.preventDefault()
     try {
        let options = {
        method: "POST",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            Dia: e.target.dia.value,
        })}
        
        res = await fetch("http://localhost:3000/Dia", options)
        
        json = await res.json()
       
  
        if (!res.ok) throw { status: res.status, statusText: res.statusText }

        cambiarDisponibilidad()
      
  
        } catch (err) {
          let message = err || "Ocurrió un error al publicar"
          $formDia.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }
  }


     
  })

d.addEventListener("click", async e => {
  //Si el evento click coincide con editar, se editar
if (e.target.matches(".edit")) {
    $title.textContent = "Editar Día" 
    $formDia.idDia.value = e.target.dataset.id
    $formDia.dia.value = e.target.dataset.dia
    }
})

const cambiarDisponibilidad = async () => {
  try {
    let resp = await fetch("http://localhost:3000/Funcionarios")
      jsonn = await resp.json()

      let respuesta = await fetch("http://localhost:3000/Dia")
      jason = await respuesta.json()

    if (!resp.ok) throw { status: resp.status, statusText: resp.statusText } 
 
   let diaDeHoy = new Date(jason.Dia.substr(0,4),jason.Dia.substr(5,2)-1,jason.Dia.substr(8,2)).getDay()
   let disponible 
    jsonn.forEach(async(funcionario) => {
      let disponibilidad = "DESC"
        funcionario.DiaSemana.forEach((dia) => {
          if(diaDeHoy == dia) {
            disponibilidad = "SI"
          } 
        })
      
      if(funcionario.Disponibilidad == "BPS") {
        disponibilidad = "BPS"
      }
      disponible = disponibilidad


      try {
        let options = {
        method: "PUT",
        headers: { "Content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          Codigo: funcionario.Codigo,
          Apellido: funcionario.Apellido,
          HorarioEntrada: funcionario.HorarioEntrada,
          HorarioSalida: funcionario.HorarioSalida,
          Cargo: funcionario.Cargo,
          Telefono: funcionario.Telefono,
          Disponibilidad: disponible,
          DiaSemana: funcionario.DiaSemana
        })}
  
        response = await fetch(`http://localhost:3000/Funcionarios/${funcionario.id}`, options)
        jeison = await response.json()
  
        if (!response.ok) throw { status: response.status, statusText: response.statusText }
  
        } catch (err) {
            let message = err || "Ocurrió un error al mostrarlaDisponibilidad"
            $formDia.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }
      })

      

  }
  catch (err) {
    let message = err || "Ocurrió un error al mostrarlaDisponibilidad"
    $tableDia.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
  }
  

}

