"use strict";

// Pantalla del juego: funciones síncronas para menús, decisiones y guardado.
// HTML y SVG muestran las imágenes sin cargadores programados.
const CLAVE_PARTIDA = "no-one-is-innocent-partida-v1";
let estado = null;
let avisoGuardado = "";
try {
    const guardado = localStorage.getItem(CLAVE_PARTIDA);
    if (guardado) {
        estado = Guardado.restaurar(guardado);
        if (!estado) avisoGuardado = "La partida guardada no es compatible. Podés empezar una nueva.";
    }
} catch { avisoGuardado = "El progreso se conserva mientras esta pestaña siga abierta."; }
function guardarPartida() {
    try {
        localStorage.setItem(CLAVE_PARTIDA, Guardado.serializar(estado));
        avisoGuardado = "Progreso guardado en este navegador.";
    } catch { avisoGuardado = "El progreso se conserva mientras esta pestaña siga abierta."; }
    document.getElementById("estado-guardado").textContent = avisoGuardado;
}
let vistaActual = "inicio";
let animaciones = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let imagenActual = "inicio";
let reproduccionSecuencia = 0;
const dibujo = document.getElementById("imagen-escena");
const recursoImagen = document.getElementById("recurso-escena");
const pantalla = document.getElementById("pantalla");
const zonas = document.getElementById("zonas");
const narrativa = document.getElementById("narrativa");
const descripcion = document.getElementById("descripcion-escena");
const cabecera = document.getElementById("cabecera");
const recursos = {
    "inicio": {
        "archivo": "img/laminas/image.png",
        "ancho": 1536,
        "alto": 1024
    },
    "pasado": {
        "archivo": "img/laminas/pasado.png",
        "ancho": 1920,
        "alto": 1080
    },
    "reunion": {
        "archivo": "img/laminas/reunion.png",
        "ancho": 1920,
        "alto": 1080
    },
    "encargo": {
        "archivo": "img/laminas/encargo.png",
        "ancho": 1920,
        "alto": 1080
    },
    "ficha": {
        "archivo": "img/laminas/ficha.png",
        "ancho": 1920,
        "alto": 1080
    },
    "azotea": {
        "archivo": "img/escenarios/fondo1_azotea_noche.webp",
        "ancho": 1280,
        "alto": 720
    },
    "borde": {
        "archivo": "img/escenarios/fondo2_azotea_borde.webp",
        "ancho": 1280,
        "alto": 720
    },
    "oficina": {
        "archivo": "img/escenarios/fondo3_oficina_noche.webp",
        "ancho": 1280,
        "alto": 720
    },
    "amanecer": {
        "archivo": "img/escenarios/fondo4_oficina_amanecer.webp",
        "ancho": 1280,
        "alto": 720
    },
    "amenaza": {
        "archivo": "img/laminas/amenaza.png",
        "ancho": 1122,
        "alto": 1402,
        "encuadre": "xMidYMin slice"
    },
    "empleado": {
        "archivo": "img/laminas/empleado.png",
        "ancho": 1122,
        "alto": 1402,
        "encuadre": "xMidYMin slice"
    },
    "archivos": {
        "archivo": "img/laminas/archivos.png",
        "ancho": 1122,
        "alto": 1402,
        "encuadre": "xMidYMin slice"
    },
    "testigo": {
        "archivo": "img/laminas/testigo.png",
        "ancho": 1122,
        "alto": 1402,
        "encuadre": "xMidYMin slice"
    },
    "desenlace": {
        "archivo": "img/laminas/desenlace.png",
        "ancho": 1122,
        "alto": 1402,
        "encuadre": "xMidYMin slice"
    }
};
const recortes = {
    secuenciaVeyra: [300, 120, 750, 900],
    secuenciaKlark: [260, 140, 820, 820],
    pasado: [0, 0, 1090, 1080],
    reunion: [180, 120, 1070, 580],
    encargo: [0, 28, 1340, 1052],
    ficha: [0, 100, 1000, 650]
};

// Escenarios exportados de los archivos de Illustrator del equipo.
recursos.archivoOficina = {
    archivo: "img/escenarios/oficina_nocturna.svg", ancho: 1200, alto: 750
};
recursos.retratoKlark = {
    archivo: "img/personajes/klark.svg", ancho: 300, alto: 285, encuadre: "xMidYMid meet"
};
recursos.retratoVeyra = {
    archivo: "img/personajes/adrian-veyra.svg", ancho: 145, alto: 210, encuadre: "xMidYMid meet"
};
recursos.secuenciaVeyra = {
    archivo: "img/animaciones/movimientos-cambiados.svg", estatico: "img/animaciones/movimientos-cambiados-estatico.svg",
    ancho: 1920, alto: 1080, encuadre: "xMidYMid meet"
};
recursos.secuenciaKlark = {
    archivo: "img/animaciones/cambios-klickr.svg", estatico: "img/animaciones/cambios-klickr-estatico.svg",
    ancho: 1920, alto: 1080, encuadre: "xMidYMid meet"
};
// Una única imagen fija para cada escena del recorrido.
const imagenesPorEscena = {
    pasado: "azotea", prologo: "borde", reunion: "oficina", encargo: "encargo",
    amenaza: "amenaza", empleado: "empleado", archivos: "archivoOficina",
    testigo: "testigo", desenlace: "amanecer"
};

function mostrarInterlocutor(nombre) {
    narrativa.append(elemento("p", "personaje", nombre));
}

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
    const recurso = recursos[clave];
    let recorte = vistaActual === "inicio"
        ? [0, 0, recurso.ancho, recurso.alto]
        : (recortes[clave] || [0, 0, recurso.ancho, recurso.alto]);
    const celular = window.matchMedia("(max-width: 760px)").matches;
    if (vistaActual === "inicio" && celular) recorte = [750, 0, 786, 1024];

    // Sólo cambia el encuadre y la ruta; el navegador muestra la imagen del SVG.
    dibujo.setAttribute("viewBox", recorte.join(" "));
    dibujo.setAttribute("preserveAspectRatio", recurso.encuadre || (vistaActual === "inicio" ? "xMidYMid slice" : "xMidYMin slice"));
    const archivo = recurso.estatico
        ? (animaciones ? `${recurso.archivo}?reproduccion=${reproduccionSecuencia}` : recurso.estatico)
        : recurso.archivo;
    recursoImagen.setAttribute("href", archivo);
    recursoImagen.setAttribute("width", recurso.ancho);
    recursoImagen.setAttribute("height", recurso.alto);
    document.getElementById("tapa-dialogo").style.display = clave === "encargo" ? "" : "none";
    document.getElementById("rotulo-continuar").style.display = vistaActual === "inicio" && estado && !celular ? "" : "none";
    dibujo.setAttribute("aria-label", {
        secuenciaVeyra: "Adrián Veyra reacciona durante la investigación de Klark",
        secuenciaKlark: "Klark reflexiona antes de tomar la última decisión",
        inicio: "Klark frente a la ciudad nocturna", pasado: "Klark recuerda su pasado frente a la ciudad",
        reunion: "Reunión en la oficina de Torre Veyra", encargo: "Klark recibe el encargo en la oficina",
        ficha: "Klark en el archivo de la empresa",
        archivoOficina: "Oficina interior de Torre Veyra",
        retratoKlark: "Retrato de Klark", retratoVeyra: "Retrato de Adrián Veyra",
        azotea: "Azotea frente a la ciudad nocturna",
        borde: "Borde de la azotea de Torre Veyra", oficina: "Oficina de Veyra de noche", amanecer: "Oficina de Veyra al amanecer",
        amenaza: "Klark descubre una advertencia en su teléfono, en la terraza nocturna",
        empleado: "Klark escucha a un empleado nervioso junto a los ascensores",
        archivos: "Klark examina documentos en el archivo restringido de BLACK VEIL",
        testigo: "Klark y el empleado esperan junto a una salida de emergencia",
        desenlace: "Klark y Veyra se enfrentan a la última decisión en la oficina al amanecer"
    }[clave]);
}

function prepararVista(clave, titulo, portada = false) {
    pantalla.className = portada ? "portada" : "historia";
    document.body.classList.toggle("sin-animacion", !animaciones);
    narrativa.querySelectorAll("video").forEach(video => video.pause());
    zonas.replaceChildren();
    narrativa.replaceChildren();
    narrativa.hidden = portada;
    cabecera.hidden = portada;
    document.getElementById("ayuda").hidden = portada;
    document.getElementById("variables").hidden = !estado || vistaActual === "ficha" || vistaActual === "secuencia";
    document.getElementById("movimiento").textContent = `Animación: ${animaciones ? "sí" : "no"}`;
    document.getElementById("movimiento").setAttribute("aria-pressed", String(animaciones));
    dibujarImagen(clave);
    document.getElementById("estado-guardado").textContent = avisoGuardado;
    descripcion.textContent = titulo;
    pantalla.setAttribute("aria-label", titulo);
    // Un único ciclo CSS, sin temporizadores ni bucles de dibujo acumulados.
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
    guardarPartida();
    mostrarEscena();
}

function mostrarSecuencia(personaje) {
    const secuencia = {
        veyra: {
            recurso: "secuenciaVeyra", titulo: "La mirada de Veyra", lugar: "TORRE VEYRA · ANTES DE BLACK VEIL",
            texto: "Veyra te observa en silencio. Su expresión deja claro que cada paso de tu investigación tiene un precio.",
            boton: "Continuar la investigación"
        },
        klark: {
            recurso: "secuenciaKlark", titulo: "El peso de una decisión", lugar: "TORRE VEYRA · ANTES DEL ÚLTIMO INFORME",
            texto: "El destino del empleado ya está decidido. Klark repasa lo que hizo durante la noche: las pruebas, las órdenes de Veyra y las huellas de su propio pasado. Ahora debe decidir cómo terminar esta historia.",
            boton: "Tomar la última decisión"
        }
    }[personaje];
    vistaActual = "secuencia";
    reproduccionSecuencia += 1;
    prepararVista(secuencia.recurso, `${secuencia.titulo}. ${secuencia.texto}`);
    pantalla.classList.add("secuencia");
    tituloEscena(secuencia.titulo, secuencia.lugar, `${estado.registro.length} / 6 DECISIONES REGISTRADAS`);
    narrativa.append(elemento("p", "relato", secuencia.texto));
    const controles = elemento("div", "acciones");
    controles.append(accion(secuencia.boton, mostrarEscena, "accion principal"), accion("Volver al menú", volverAlInicio));
    narrativa.append(controles);
    enfocarNarrativa();
}

function mostrarEscena() {
    if (!estado) return;
    vistaActual = "historia";
    const escena = Historia.obtenerEscena(estado);
    const imagen = estado.final ? { verdad: "amanecer", complice: "oficina", silencio: "borde" }[estado.final] : imagenesPorEscena[estado.escena];
    prepararVista(imagen || escena.imagen, `${escena.titulo}. ${escena.texto}`);
    const indiceDecision = Historia.ordenDecisiones.indexOf(estado.escena);
    tituloEscena(escena.titulo, escena.lugar, estado.final ? "EXPEDIENTE CERRADO · 6 / 6 DECISIONES" : indiceDecision >= 0 ? `DECISIÓN ${indiceDecision + 1} / 6` : "ANTES DE LA INVESTIGACIÓN");
    const anterior = estado.registro.at(-1);
    if (anterior && !estado.final) {
        const resultado = elemento("aside", "consecuencia");
        resultado.append(elemento("strong", "", "HUELLA DE TU ELECCIÓN"), document.createTextNode(anterior.resultado));
        narrativa.append(resultado);
    }
    mostrarInterlocutor(escena.personaje);
    narrativa.append(elemento("p", "relato", escena.texto));
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
    guardarPartida();
    // Las secuencias acompañan el avance sin modificar las decisiones guardadas.
    if (escenaEsperada === "empleado" && estado.escena === "archivos") mostrarSecuencia("veyra");
    else if (escenaEsperada === "testigo" && estado.escena === "desenlace") mostrarSecuencia("klark");
    else mostrarEscena();
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
    prepararVista("retratoKlark", "Información del jugador y registro de decisiones");
    tituloEscena("Información del jugador", "EXPEDIENTE PERSONAL", `${estado.registro.length} / 6 DECISIONES REGISTRADAS`);
    mostrarInterlocutor("KLARK");
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
    pantalla.querySelector(".aviso-guardado")?.remove();
    vistaActual = "inicio";
    prepararVista("inicio", "No One Is Innocent. Menú principal.", true);
    zona("Nueva partida", [117, 358, 452, 84], nuevaPartida);
    zona("Continuar partida", [117, 458, 452, 83], mostrarEscena, !estado);
    zona("Créditos", [117, 558, 452, 83], mostrarCreditos);
    if (avisoGuardado && !estado) {
        const aviso = elemento("p", "aviso-guardado", avisoGuardado);
        pantalla.append(aviso);
    } else pantalla.querySelector(".aviso-guardado")?.remove();
    zonas.querySelector("button").focus({ preventScroll: true });
    window.scrollTo(0, 0);
}

function mostrarCreditos() {
    vistaActual = "creditos";
    prepararVista("azotea", "Créditos. No One Is Innocent.");
    tituloEscena("Créditos", "PROYECTO DE PRODUCCIÓN MULTIMEDIA");
    narrativa.append(elemento("p", "relato", "No One Is Innocent. Thiago Maya, Santiago Olive y Facundo Felipe."));
    narrativa.append(elemento("p", "contexto", "Código y decisiones: Thiago Maya. Animaciones y diseños: Santiago Olive. Organización de archivos y GitHub: Facundo Felipe. Ilustraciones y personajes del proyecto original."));
    narrativa.append(elemento("p", "contexto", "Elegí con el mouse, el tacto o Tab y Enter. V abre la ficha; Escape vuelve a la escena desde la ficha o al menú. El progreso se guarda automáticamente en este navegador. Nueva partida reemplaza el recorrido anterior."));
    narrativa.append(elemento("h2", "", "TRÁILER · BLACK VEIL"));
    const video = elemento("video", "trailer");
    video.controls = true;
    video.preload = "metadata";
    video.poster = "multimedia/Portada_trailer.jpg";
    video.src = "multimedia/NO_ONE_IS_INNOCENT_Trailer_Sprint5.mp4";
    video.setAttribute("aria-label", "Tráiler de No One Is Innocent, 35 segundos");
    const subtitulos = elemento("track");
    subtitulos.default = true;
    subtitulos.kind = "subtitles"; subtitulos.srclang = "es"; subtitulos.label = "Español";
    subtitulos.src = "multimedia/Trailer_Sprint5.vtt";
    video.append(subtitulos);
    narrativa.append(video, elemento("p", "contexto", "Klark carga con su pasado. Veyra le ofrece un nuevo comienzo. BLACK VEIL conecta sus vidas. Seis decisiones dejan una huella. ¿Qué precio tiene la verdad? Nadie es inocente."));
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
    if (vistaActual === "secuencia") {
        if (animaciones) reproduccionSecuencia += 1;
        dibujarImagen(imagenActual);
    }
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
window.addEventListener("resize", () => dibujarImagen(imagenActual));

// Los scripts están al final del HTML: la página ya existe cuando se ejecuta.
volverAlInicio();
