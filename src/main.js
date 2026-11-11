"use strict";

// La pantalla usa las imágenes originales; texto y botones HTML se adaptan al tamaño.
// Las reglas de partida están en historia.js y se prueban sin depender del navegador.
let estado = null;
let vistaActual = "inicio";
let animaciones = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let imagenActual = "inicio";
const canvas = document.getElementById("imagen-escena");
const ctx = canvas.getContext("2d");
const pantalla = document.getElementById("pantalla");
const zonas = document.getElementById("zonas");
const narrativa = document.getElementById("narrativa");
const descripcion = document.getElementById("descripcion-escena");
const cabecera = document.getElementById("cabecera");
const pie = document.getElementById("pie-ilustracion");
const imagenes = {};
const recortes = {
    pasado: [0, 0, 1090, 1080],
    reunion: [180, 120, 1070, 580],
    encargo: [0, 28, 1340, 1052],
    ficha: [0, 100, 1000, 650]
};

function elemento(etiqueta, clase, contenido) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (contenido !== undefined) nodo.textContent = contenido;
    return nodo;
}

function accion(etiqueta, callback, clase = "accion") {
    const boton = elemento("button", clase, etiqueta);
    boton.type = "button";
    boton.addEventListener("click", evento => {
        if (evento.detail > 1) return;
        callback();
    });
    // Mantener Enter apretado no debe saltarse decisiones recién dibujadas.
    boton.addEventListener("keydown", evento => {
        if (evento.repeat && (evento.key === "Enter" || evento.key === " ")) evento.preventDefault();
    });
    return boton;
}

function dibujarImagen(clave) {
    imagenActual = clave;
    const imagen = imagenes[clave];
    let recorte = vistaActual === "inicio" ? [0, 0, imagen.naturalWidth, imagen.naturalHeight] : recortes[clave];
    if (vistaActual === "inicio" && window.matchMedia("(max-width: 760px)").matches) recorte = [750, 0, 786, 1024];
    canvas.width = recorte[2];
    canvas.height = recorte[3];
    ctx.drawImage(imagen, ...recorte, 0, 0, canvas.width, canvas.height);
    if (clave === "encargo") {
        // Dejamos visible el rostro completo del CEO. La lámina trae texto
        // incrustado a su derecha; lo cubrimos para no duplicar el diálogo HTML.
        ctx.fillStyle = "#0b151e";
        const inicioPanel = 296 - recorte[1];
        ctx.fillRect(1090, inicioPanel, canvas.width - 1090, canvas.height - inicioPanel);
    }
    canvas.setAttribute("aria-label", { inicio: "Klark frente a la ciudad nocturna", pasado: "Klark recuerda su pasado frente a la ciudad", reunion: "Reunión en la oficina de Torre Veyra", encargo: "Klark recibe el encargo en la oficina", ficha: "Klark en el archivo de la empresa" }[clave]);
    if (vistaActual === "inicio" && estado && !window.matchMedia("(max-width: 760px)").matches) {
        ctx.fillStyle = "#101c26";
        ctx.fillRect(117, 458, 452, 83);
        ctx.strokeStyle = "#53616b";
        ctx.strokeRect(117, 458, 452, 83);
        ctx.fillStyle = "#e4e9ed";
        ctx.font = "34px Arial";
        ctx.fillText("CONTINUAR", 179, 512);
    }
}

function prepararVista(clave, titulo, portada = false) {
    pantalla.className = portada ? "portada" : "historia";
    document.body.classList.toggle("sin-animacion", !animaciones);
    zonas.replaceChildren();
    narrativa.replaceChildren();
    narrativa.hidden = portada;
    cabecera.hidden = portada;
    pie.hidden = portada;
    document.getElementById("ayuda").hidden = portada;
    document.getElementById("variables").hidden = !estado || vistaActual === "ficha";
    document.getElementById("movimiento").textContent = `Animación: ${animaciones ? "sí" : "no"}`;
    document.getElementById("movimiento").setAttribute("aria-pressed", String(animaciones));
    dibujarImagen(clave);
    descripcion.textContent = titulo;
    pantalla.setAttribute("aria-label", titulo);
    // Un único ciclo CSS, sin temporizadores ni bucles de canvas acumulados.
    void pantalla.offsetWidth;
    pantalla.classList.add("entrada");
}

function enfocarNarrativa() {
    narrativa.focus({ preventScroll: true });
    window.scrollTo(0, 0);
}

function tituloEscena(titulo, lugar, progreso) {
    narrativa.append(elemento("p", "lugar", lugar));
    if (progreso) narrativa.append(elemento("p", "progreso", progreso));
    const h = elemento("h1", "", titulo);
    h.id = "titulo-escena";
    narrativa.append(h);
}

function mostrarResumen() {
    const resumen = elemento("div", "stats-resumen");
    for (const [id, nombre] of Object.entries(Historia.nombresVariables)) {
        const dato = elemento("span", "", nombre);
        dato.append(elemento("b", "", String(estado.variables[id])));
        resumen.append(dato);
    }
    narrativa.append(resumen);
}

function nuevaPartida() {
    estado = Historia.nuevaPartida();
    mostrarEscena();
}

function mostrarEscena() {
    if (!estado) return;
    vistaActual = "historia";
    const escena = Historia.obtenerEscena(estado);
    prepararVista(escena.imagen, `${escena.titulo}. ${escena.texto}`);
    pie.textContent = escena.personaje + " / " + (estado.final ? "DESPUÉS DE BLACK VEIL" : "NO ONE IS INNOCENT");
    const indiceDecision = Historia.ordenDecisiones.indexOf(estado.escena);
    tituloEscena(escena.titulo, escena.lugar, estado.final ? "EXPEDIENTE CERRADO · 6 / 6 DECISIONES" : indiceDecision >= 0 ? `DECISIÓN ${indiceDecision + 1} / 6` : "ANTES DE LA INVESTIGACIÓN");
    const anterior = estado.registro.at(-1);
    if (anterior && !estado.final) {
        const resultado = elemento("aside", "consecuencia");
        resultado.append(elemento("strong", "", "HUELLA DE TU ELECCIÓN"), document.createTextNode(anterior.resultado));
        narrativa.append(resultado);
    }
    narrativa.append(elemento("p", "personaje", escena.personaje), elemento("p", "relato", escena.texto));
    if (escena.contexto) narrativa.append(elemento("p", "contexto", escena.contexto));
    if (estado.final) {
        const detalle = elemento("details");
        detalle.append(elemento("summary", "", "Ver las seis decisiones y sus consecuencias"), registroDecisiones());
        narrativa.append(detalle);
        const controles = elemento("div", "acciones");
        controles.append(accion("Nueva partida", nuevaPartida, "accion principal"), accion("Ver variables y pruebas", mostrarFicha), accion("Volver al menú", volverAlInicio));
        narrativa.append(controles);
    } else {
        const opciones = elemento("div", "opciones");
        opciones.setAttribute("role", "group");
        opciones.setAttribute("aria-label", "Opciones de la escena");
        const escenaEsperada = estado.escena;
        escena.opciones.forEach((opcion, indice) => {
            const boton = accion(opcion.texto, () => elegirOpcion(indice, escenaEsperada), "opcion");
            if (opcion.detalle) boton.append(elemento("small", "", opcion.detalle));
            opciones.append(boton);
        });
        narrativa.append(opciones);
    }
    mostrarResumen();
    descripcion.textContent = [escena.titulo, anterior?.resultado, escena.texto, escena.contexto].filter(Boolean).join(". ");
    enfocarNarrativa();
}

function elegirOpcion(indice, escenaEsperada) {
    if (vistaActual !== "historia" || !estado) return;
    const nuevoEstado = Historia.elegirOpcion(estado, indice, escenaEsperada);
    if (nuevoEstado === estado) return;
    estado = nuevoEstado;
    mostrarEscena();
}

function registroDecisiones() {
    const lista = elemento("ol", "registro");
    for (const entrada of estado.registro) {
        const item = elemento("li");
        item.append(elemento("strong", "", `${Historia.escenas[entrada.escena].titulo}: ${entrada.eleccion}`), elemento("p", "", entrada.resultado));
        lista.append(item);
    }
    return lista;
}

function mostrarFicha() {
    if (!estado) return;
    vistaActual = "ficha";
    prepararVista("ficha", "Información del jugador y registro de decisiones");
    pie.textContent = "KLARK / AGENTE DE SEGURIDAD PRIVADA";
    tituloEscena("Información del jugador", "EXPEDIENTE PERSONAL", `${estado.registro.length} / 6 DECISIONES REGISTRADAS`);
    for (const [id, nombre] of Object.entries(Historia.nombresVariables)) {
        const fila = elemento("div", "estadistica");
        const etiqueta = elemento("label", "", nombre);
        etiqueta.htmlFor = `valor-${id}`;
        etiqueta.append(elemento("b", "", `${estado.variables[id]} / ${Historia.maximos[id]}`));
        const barra = elemento("meter");
        barra.id = `valor-${id}`;
        barra.min = 0;
        barra.max = Historia.maximos[id];
        barra.value = estado.variables[id];
        barra.textContent = String(estado.variables[id]);
        fila.append(etiqueta, barra);
        narrativa.append(fila);
    }
    narrativa.append(elemento("h2", "", "PISTAS Y DOCUMENTOS"));
    const pistas = Historia.pistas(estado);
    if (pistas.length) {
        const lista = elemento("ul", "pistas");
        pistas.forEach(pista => lista.append(elemento("li", "", pista)));
        narrativa.append(lista);
    } else narrativa.append(elemento("p", "contexto", "Todavía no reuniste pistas."));
    narrativa.append(elemento("h2", "", "REGISTRO DE DECISIONES"));
    if (estado.registro.length) narrativa.append(registroDecisiones());
    else narrativa.append(elemento("p", "contexto", "Todavía no tomaste decisiones en la investigación."));
    narrativa.append(accion(estado.final ? "Volver al final" : "Volver a la escena", mostrarEscena, "accion principal"));
    descripcion.textContent = Object.entries(Historia.nombresVariables).map(([id, nombre]) => `${nombre}: ${estado.variables[id]}`).join(". ");
    enfocarNarrativa();
}

function zona(etiqueta, rect, callback, deshabilitada = false) {
    const boton = accion(etiqueta, callback, "zona");
    boton.textContent = "";
    boton.setAttribute("aria-label", etiqueta);
    [boton.style.left, boton.style.top, boton.style.width, boton.style.height] = rect.map((valor, i) => `${valor / (i % 2 === 0 ? 1536 : 1024) * 100}%`);
    boton.disabled = deshabilitada;
    zonas.append(boton);
}

function volverAlInicio() {
    vistaActual = "inicio";
    prepararVista("inicio", "No One Is Innocent. Menú principal.", true);
    zona("Nueva partida", [117, 358, 452, 84], nuevaPartida);
    zona("Continuar partida", [117, 458, 452, 83], mostrarEscena, !estado);
    zona("Créditos", [117, 558, 452, 83], mostrarCreditos);
    zonas.querySelector("button").focus({ preventScroll: true });
    window.scrollTo(0, 0);
}

function mostrarCreditos() {
    vistaActual = "creditos";
    prepararVista("pasado", "Créditos. No One Is Innocent.");
    pie.textContent = "NO ONE IS INNOCENT";
    tituloEscena("Créditos", "PROYECTO DE PRODUCCIÓN MULTIMEDIA");
    narrativa.append(elemento("p", "relato", "No One Is Innocent. Desarrollado por nuestro equipo."));
    narrativa.append(elemento("p", "contexto", "Ilustraciones y personajes del proyecto original. Historia de Klark, Adrián Veyra, BLACK VEIL y ZENITH."));
    narrativa.append(elemento("p", "contexto", "Elegí con el mouse, el tacto o Tab y Enter. V abre la ficha; Escape vuelve a la escena desde la ficha o al menú. La partida se conserva mientras esta página siga abierta. Nueva partida borra el recorrido anterior."));
    narrativa.append(accion("Volver al menú", volverAlInicio, "accion principal"));
    enfocarNarrativa();
}

document.getElementById("menu").addEventListener("click", volverAlInicio);
// El enlace conserva una alternativa accesible sin modificar el historial de navegación.
document.getElementById("marca").addEventListener("click", evento => { evento.preventDefault(); volverAlInicio(); });
document.getElementById("variables").addEventListener("click", mostrarFicha);
document.getElementById("movimiento").addEventListener("click", () => {
    animaciones = !animaciones;
    document.body.classList.toggle("sin-animacion", !animaciones);
    document.getElementById("movimiento").textContent = `Animación: ${animaciones ? "sí" : "no"}`;
    document.getElementById("movimiento").setAttribute("aria-pressed", String(animaciones));
});
document.addEventListener("keydown", evento => {
    if (evento.repeat || evento.ctrlKey || evento.altKey || evento.metaKey) return;
    if (evento.key === "Escape" && vistaActual !== "inicio") {
        evento.preventDefault();
        if (vistaActual === "ficha") mostrarEscena();
        else volverAlInicio();
    } else if (evento.key.toLowerCase() === "v") {
        if (vistaActual === "historia") mostrarFicha();
        else if (vistaActual === "ficha") mostrarEscena();
    }
});
window.addEventListener("resize", () => { if (imagenes[imagenActual]) dibujarImagen(imagenActual); });

async function iniciar() {
    const archivos = { inicio: "image.png", pasado: "pasado.png", reunion: "reunion.png", encargo: "encargo.png", ficha: "ficha.png" };
    const carga = document.getElementById("carga");
    try {
        if (!ctx) throw new Error("Este navegador no admite canvas");
        await Promise.all(Object.entries(archivos).map(([clave, archivo]) => new Promise((resolve, reject) => {
            const imagen = new Image();
            const limite = setTimeout(() => reject(new Error(`Tiempo de carga agotado: ${archivo}`)), 15000);
            imagen.onload = () => { clearTimeout(limite); imagenes[clave] = imagen; resolve(); };
            imagen.onerror = () => { clearTimeout(limite); reject(new Error(`No se pudo cargar ../public/img/laminas/${archivo}`)); };
            imagen.src = `../public/img/laminas/${archivo}`;
        })));
        volverAlInicio();
        carga.hidden = true;
    } catch (error) {
        carga.replaceChildren(elemento("p", "", `${error.message}. Conservá juntas las carpetas src y public.`), accion("Reintentar carga", () => window.location.reload()));
    }
}
iniciar();
