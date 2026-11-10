const claveGuardado = "no-one-is-innocent:sprint-3";
const elementos = Object.fromEntries(
  [...document.querySelectorAll("[id]")].map((elemento) => [elemento.id, elemento])
);
let partida = cargarPartida();

function avisarGuardado() {
  elementos.mensaje.hidden = false;
  elementos.mensaje.textContent = "El navegador bloqueó el guardado. Podés jugar mientras esta pestaña siga abierta.";
}

function cargarPartida() {
  try {
    const guardado = localStorage.getItem(claveGuardado);
    if (!guardado) return null;
    let datos;
    try {
      datos = JSON.parse(guardado);
    } catch {
      return null;
    }
    if (datos?.version !== 1 || !Array.isArray(datos.decisiones) ||
        datos.decisiones.length > escenas.length ||
        !datos.decisiones.every((opcion, indice) => Number.isInteger(opcion) &&
          Object.hasOwn(escenas[indice].opciones, opcion)) ||
        typeof datos.introduccion !== "boolean" || typeof datos.consecuencia !== "boolean" ||
        (datos.introduccion && datos.decisiones.length > 0) ||
        (datos.consecuencia && datos.decisiones.length === 0)) {
      return null;
    }
    return datos;
  } catch {
    avisarGuardado();
    return null;
  }
}

function guardarPartida() {
  try {
    localStorage.setItem(claveGuardado, JSON.stringify(partida));
  } catch {
    avisarGuardado();
  }
}

function mostrarMenu() {
  elementos.historia.hidden = true;
  elementos.inicio.hidden = false;
  elementos.continuar.disabled = !partida;
  elementos["titulo-inicio"].focus();
}

function agregarOpcion(texto, accion, principal = false) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.textContent = texto;
  if (principal) boton.className = "principal";
  boton.addEventListener("click", accion);
  elementos.opciones.append(boton);
}

function renderizarEstado(variables, pruebas) {
  elementos.variables.replaceChildren();
  for (const [variable, nombre] of Object.entries(etiquetas)) {
    const etiqueta = document.createElement("dt");
    etiqueta.textContent = nombre;
    const valor = document.createElement("dd");
    valor.textContent = variables[variable] + " / 10";
    elementos.variables.append(etiqueta, valor);
  }
  elementos.pruebas.replaceChildren();
  elementos["sin-pruebas"].hidden = pruebas.length > 0;
  for (const prueba of pruebas) {
    const item = document.createElement("li");
    item.textContent = prueba;
    elementos.pruebas.append(item);
  }
}

function mostrarPartida() {
  const { decisiones, introduccion, consecuencia } = partida;
  const { variables, pruebas } = resultado(decisiones);
  const indice = decisiones.length;
  elementos.inicio.hidden = true;
  elementos.historia.hidden = false;
  elementos.retrato.hidden = !introduccion;
  elementos.opciones.replaceChildren();
  renderizarEstado(variables, pruebas);

  let titulo;
  let texto;
  let paso;
  if (introduccion) {
    paso = "Prólogo";
    titulo = "El pasado de Klark";
    texto = "Klark dejó el ejército tras perder a sus compañeros en la operación BLACK VEIL. Ahora trabaja como guardaespaldas privado. El empresario Adrián Veyra lo contrata después de recibir una amenaza. El primer encargo de Klark lo obliga a volver sobre su pasado.";
    agregarOpcion("Comenzar la investigación", () => {
      partida.introduccion = false;
      guardarPartida();
      mostrarPartida();
    }, true);
  } else if (consecuencia) {
    const escena = escenas[indice - 1];
    const opcion = escena.opciones[decisiones.at(-1)];
    paso = "Consecuencia " + indice + " de " + escenas.length;
    titulo = opcion.texto;
    texto = indice === 5 && decisiones[4] === 1 && decisiones[3] === 2
      ? "La clave del infiltrado abre los archivos cifrados. Klark recupera los registros completos de ZENITH y descubre indicios sobre un colaborador cercano a Veyra."
      : opcion.consecuencia;
    agregarOpcion(indice === escenas.length ? "Ver desenlace" : "Continuar", () => {
      partida.consecuencia = false;
      guardarPartida();
      mostrarPartida();
    }, true);
  } else if (indice === escenas.length) {
    paso = "Desenlace";
    ({ titulo, texto } = desenlace(decisiones, variables));
    agregarOpcion("Volver al menú", mostrarMenu, true);
  } else {
    const escena = escenas[indice];
    paso = "Decisión " + (indice + 1) + " de " + escenas.length;
    titulo = escena.titulo;
    texto = escena.texto(decisiones);
    escena.opciones.forEach((opcion, eleccion) => {
      agregarOpcion(opcion.texto, () => {
        partida.decisiones.push(eleccion);
        partida.consecuencia = true;
        guardarPartida();
        mostrarPartida();
      });
    });
  }

  elementos["numero-escena"].textContent = paso;
  elementos["titulo-escena"].textContent = titulo;
  elementos["texto-escena"].textContent = texto;
  elementos.escena.classList.remove("aparecer");
  void elementos.escena.offsetWidth;
  elementos.escena.classList.add("aparecer");
  elementos["titulo-escena"].focus();
}

elementos.iniciar.addEventListener("click", () => {
  if (partida && !window.confirm("¿Empezar de nuevo y reemplazar la partida guardada?")) return;
  partida = { version: 1, decisiones: [], introduccion: true, consecuencia: false };
  guardarPartida();
  mostrarPartida();
});
elementos.continuar.addEventListener("click", mostrarPartida);
elementos.menu.addEventListener("click", mostrarMenu);
elementos.creditos.addEventListener("click", () => {
  elementos.equipo.hidden = !elementos.equipo.hidden;
  elementos.creditos.setAttribute("aria-expanded", String(!elementos.equipo.hidden));
});
elementos.continuar.disabled = !partida;
