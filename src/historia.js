"use strict";

// Datos y reglas independientes de la pantalla. Funciona también con Node para las pruebas.
const Historia = (() => {
    const ordenDecisiones = ["encargo", "amenaza", "empleado", "archivos", "testigo", "desenlace"];
    const nombresVariables = {
        corrupcion: "Corrupción", investigacion: "Investigación", lealtad: "Lealtad", moralidad: "Moralidad"
    };
    const maximos = { corrupcion: 8, investigacion: 11, lealtad: 7, moralidad: 7 };
    // Se mantienen los cuatro nodos de decisión recibidos y sus cambios originales.
    // Testigo y Desenlace completan el tramo que faltaba después de BLACK VEIL.
    const escenas = {
        pasado: {
            titulo: "El pasado de Klark", imagen: "pasado", lugar: "ANTES DE LA MISIÓN", personaje: "KLARK",
            texto: "Klark creció en una familia marcada por la disciplina y el silencio. Desde joven aprendió que la información puede ser un arma tan poderosa como la fuerza. Se formó como agente de seguridad privada, especializándose en protección y operaciones de alto riesgo. Su capacidad para mantener la calma y analizar cada situación lo convirtieron en un profesional altamente solicitado. Hoy trabaja para la empresa, donde su lealtad y experiencia son fundamentales… aunque no todo es lo que parece.",
            opciones: [{ texto: "Continuar", cambios: {}, siguiente: "prologo" }]
        },
        prologo: {
            titulo: "Una nueva misión", imagen: "pasado", lugar: "PRÓLOGO · TORRE VEYRA", personaje: "KLARK",
            texto: "Klark, exmilitar y guardaespaldas, acepta un trabajo para proteger al empresario Adrián Veyra. Sin embargo, una amenaza contra su cliente despierta recuerdos de una antigua operación: BLACK VEIL. Klark sospecha que su nuevo trabajo esconde algo peligroso.",
            opciones: [{ texto: "Comenzar la investigación", cambios: { investigacion: 1 }, siguiente: "reunion" }]
        },
        reunion: {
            titulo: "La reunión con Veyra", imagen: "reunion", lugar: "TORRE VEYRA · OFICINA PRINCIPAL · 21:47", personaje: "ADRIÁN VEYRA",
            texto: "—Bien, Klark. Quiero un informe completo sobre el incidente de esta mañana. Necesito saber qué pasó, quién estuvo involucrado y qué riesgos seguimos teniendo.",
            opciones: [{ texto: "Continuar", cambios: {}, siguiente: "encargo" }]
        },
        encargo: {
            titulo: "Un pedido del CEO", imagen: "encargo", lugar: "TORRE VEYRA · OFICINA PRINCIPAL · 22:15", personaje: "ADRIÁN VEYRA",
            texto: "Adrián Veyra te pide que revises un informe interno sobre un empleado que podría estar filtrando información. El asunto es delicado y quiere resultados discretos. Necesita que decidas cómo proceder.",
            opciones: [
                { texto: "Revisar el informe personalmente", detalle: "Analizar la información antes de actuar.", cambios: { investigacion: 2, moralidad: 1 }, siguiente: "amenaza" },
                { texto: "Delegar la investigación a tu equipo", detalle: "Confiar en tus compañeros y esperar su informe.", cambios: { lealtad: 1 }, siguiente: "amenaza" },
                { texto: "Confrontar directamente al empleado", detalle: "Buscar una respuesta rápida, asumiendo el riesgo.", cambios: { corrupcion: 1, investigacion: 1 }, siguiente: "amenaza" }
            ]
        },
        amenaza: {
            titulo: "La amenaza", imagen: "reunion", lugar: "TORRE VEYRA · PRIMERA NOCHE", personaje: "KLARK",
            texto: "Durante la primera noche, Klark encuentra un mensaje que advierte sobre un posible atentado. Veyra le ordena que no investigue y que se limite a cumplir su trabajo.",
            opciones: [
                { texto: "Obedecer a Veyra y protegerlo", cambios: { lealtad: 1 }, siguiente: "empleado" },
                { texto: "Investigar el origen del mensaje", cambios: { investigacion: 2, moralidad: 1 }, siguiente: "empleado" },
                { texto: "Pedir al equipo una vigilancia discreta", cambios: { investigacion: 1, lealtad: 1 }, siguiente: "empleado" }
            ]
        },
        empleado: {
            titulo: "El empleado", imagen: "encargo", lugar: "TORRE VEYRA · UNA FUENTE EN PELIGRO", personaje: "EL EMPLEADO",
            texto: "Un empleado de la empresa se acerca a Klark. Dice tener información sobre movimientos sospechosos dentro de la organización. Advierte que Veyra podría estar involucrado.",
            opciones: [
                { texto: "Escuchar al empleado y buscar pruebas", cambios: { investigacion: 2, moralidad: 1 }, siguiente: "archivos" },
                { texto: "Informar a Veyra y seguir sus órdenes", cambios: { lealtad: 1, corrupcion: 1 }, siguiente: "archivos" },
                { texto: "Verificar su información sin revelar su identidad", cambios: { investigacion: 1, moralidad: 1 }, siguiente: "archivos" }
            ]
        },
        archivos: {
            titulo: "BLACK VEIL", imagen: "ficha", lugar: "ARCHIVO INTERNO · ACCESO RESTRINGIDO", personaje: "KLARK",
            texto: "Klark encuentra documentos relacionados con BLACK VEIL, una operación de su pasado militar. Entre los archivos aparece una referencia a ZENITH, una red clandestina de poder.",
            opciones: [
                { texto: "Conservar los documentos como pruebas", cambios: { investigacion: 2, moralidad: 1 }, siguiente: "testigo" },
                { texto: "Ocultar los documentos y negociar con Veyra", cambios: { corrupcion: 2, lealtad: 1 }, siguiente: "testigo" },
                { texto: "Crear un respaldo cifrado y devolver los originales", cambios: { investigacion: 1, lealtad: 1 }, siguiente: "testigo" }
            ]
        },
        testigo: {
            titulo: "El precio de una voz", imagen: "encargo", lugar: "TORRE VEYRA · ANTES DEL AMANECER", personaje: "KLARK",
            texto: "Veyra ordena localizar al empleado antes de que salga de la torre. Klark debe decidir qué hacer con la única persona que puede explicar el vínculo entre la empresa y BLACK VEIL.",
            opciones: [
                { texto: "Proteger al empleado y asegurar su testimonio", cambios: { investigacion: 1, moralidad: 2 }, siguiente: "desenlace" },
                { texto: "Poner al empleado bajo el control de Veyra", cambios: { corrupcion: 2, lealtad: 2 }, siguiente: "desenlace" },
                { texto: "Facilitar su huida sin tomar declaración", cambios: { moralidad: 1 }, siguiente: "desenlace" }
            ]
        },
        desenlace: {
            titulo: "Nadie es inocente", imagen: "reunion", lugar: "TORRE VEYRA · EL ÚLTIMO INFORME", personaje: "ADRIÁN VEYRA",
            texto: "—No podés borrar tu pasado, Klark —dice Veyra—. Pero todavía podés elegir quién contará esta historia. Afuera empieza a amanecer. Es hora de decidir qué hacer con lo que descubriste.",
            opciones: [
                { texto: "Denunciar a Veyra y entregar las pruebas", detalle: "La denuncia necesita documentos, un testigo protegido y una investigación sólida.", cambios: { investigacion: 1, moralidad: 1 }, siguiente: "final" },
                { texto: "Aceptar el pacto de Veyra", detalle: "Veyra exige lealtad y una concesión: los documentos negociados o el control del testigo.", cambios: { corrupcion: 2, lealtad: 1 }, siguiente: "final" },
                { texto: "Romper el contrato y desaparecer", detalle: "Sobrevivir significa dejar el caso sin resolver.", cambios: { moralidad: 1 }, siguiente: "final" }
            ]
        }
    };
    const finales = {
        verdad: { titulo: "La verdad sale a la luz", imagen: "pasado", texto: "El expediente BLACK VEIL llega a una fiscalía junto con una declaración protegida. Los documentos permiten vincular a Veyra con ZENITH. La investigación se abre y Klark declara sobre su propio pasado. No sale inocente, pero deja de ser cómplice del silencio." },
        complice: { titulo: "El nuevo cómplice", imagen: "reunion", texto: "Veyra cumple su parte del pacto: Klark obtiene un puesto en su círculo de confianza. BLACK VEIL desaparece de los informes oficiales y ZENITH conserva su poder. La recompensa tiene un precio: a partir de ahora, Klark también es responsable del encubrimiento." },
        silencio: { titulo: "El peso del silencio", imagen: "pasado", texto: "Klark abandona la torre sin un acuerdo que cierre el caso. BLACK VEIL sigue sin resolverse y ZENITH continúa operando. Sobrevive con lo que sabe, pero la ciudad no llega a conocer toda la verdad." }
    };

    function nuevaPartida() {
        return { escena: "pasado", variables: { corrupcion: 0, investigacion: 0, lealtad: 0, moralidad: 0 }, decisiones: {}, registro: [], final: null };
    }

    // Los hechos se derivan de elecciones concretas: acumular puntos no crea pruebas ni testigos.
    function hechos(estado) {
        const d = estado.decisiones;
        return {
            informeRevisado: d.encargo === 0,
            equipoInformado: d.encargo === 1 || d.amenaza === 2,
            empleadoConfrontado: d.encargo === 2,
            mensajeRastreado: d.amenaza === 1,
            empleadoEscuchado: d.empleado === 0,
            identidadReservada: d.empleado === 2,
            empleadoDenunciado: d.empleado === 1,
            documentos: d.archivos === 0 ? "originales" : d.archivos === 1 ? "negociados" : d.archivos === 2 ? "respaldo" : "ninguno",
            testigo: d.testigo === 0 ? "protegido" : d.testigo === 1 ? "controlado" : d.testigo === 2 ? "fugado" : "pendiente"
        };
    }

    function condicionesFinal(estado) {
        const h = hechos(estado), v = estado.variables;
        return {
            denuncia: ["originales", "respaldo"].includes(h.documentos) && h.testigo === "protegido" && v.investigacion >= 6 && v.moralidad >= 3 && v.corrupcion <= 2,
            pacto: v.corrupcion >= 4 && v.lealtad >= 3 && (h.documentos === "negociados" || h.testigo === "controlado")
        };
    }

    function resolverFinal(estado) {
        const condiciones = condicionesFinal(estado);
        if (estado.decisiones.desenlace === 0 && condiciones.denuncia) return "verdad";
        if (estado.decisiones.desenlace === 1 && condiciones.pacto) return "complice";
        return "silencio";
    }

    function resultadoDecision(id, indice, estado) {
        const h = hechos(estado);
        const resultados = {
            encargo: [
                "Al revisar el informe, detectás una hora que no coincide con el registro de seguridad. Conservás esa pista sin acusar al empleado.",
                "Tu equipo confirma que faltan registros y queda involucrado en el caso. Veyra valora que respetes la cadena de mando.",
                "El empleado se pone a la defensiva después de tu confrontación. Te advierte que no confíes en nadie; recuperar su confianza va a costarte."
            ],
            amenaza: [
                "Veyra agradece tu obediencia y refuerza su custodia. El origen del mensaje queda sin investigar; el empleado tendrá que encontrarte lejos de él.",
                "Rastreás el mensaje hasta una terminal interna. Guardás una copia: la amenaza nació dentro de la empresa, y Veyra nota que desobedeciste.",
                "El equipo registra una salida de servicio sin vigilancia. Esa ruta permitirá acercarse al empleado sin pasar por la oficina de Veyra."
            ],
            empleado: [
                h.empleadoConfrontado ? "El empleado recuerda tu acusación, pero escuchar sin presionarlo repara parte de la confianza. Te entrega una clave de acceso a BLACK VEIL." : "El empleado confía en vos y te entrega una clave de acceso a BLACK VEIL. Acepta explicar lo que sabe si podés protegerlo.",
                "Veyra retira la credencial del empleado y lo deja vigilado. Te autoriza a revisar BLACK VEIL bajo supervisión; tu fuente ya no puede salir por su cuenta.",
                "Comprobás un código del informe sin revelar la identidad de tu fuente. Obtenés acceso de solo lectura a BLACK VEIL; el empleado mantiene la distancia."
            ],
            archivos: [
                "Sacás los originales de BLACK VEIL de la torre. Veyra detecta la falta: ahora necesitás poner a salvo al testigo que puede autenticar esos documentos.",
                "Ponés los documentos bajo el control de Veyra a cambio de negociar. Se convierten en moneda de cambio y dejan de estar disponibles para una denuncia.",
                "Guardás un respaldo cifrado y devolvés los originales. Veyra no advierte la copia; todavía necesitás a alguien que autentique su contenido."
            ],
            testigo: [
                h.empleadoDenunciado ? "Tu equipo retira al empleado de la vigilancia que vos mismo provocaste. Reconocés lo ocurrido y él acepta declarar bajo protección. El testimonio queda asegurado." : "Llevás al empleado a un lugar seguro. Su declaración queda registrada bajo protección y permite autenticar los documentos que hayas conservado.",
                h.empleadoDenunciado ? "Confirmás la vigilancia del empleado y entregás su canal de contacto. Veyra obtiene control de la fuente; no habrá una declaración protegida para tu denuncia." : "Entregás la ubicación del empleado a Veyra. Seguridad lo retiene y bloquea su canal de contacto. Ya no contás con una declaración protegida.",
                h.empleadoDenunciado ? "Desviás la vigilancia y facilitás la salida del empleado. Logra huir, pero no deja una declaración: no podrás presentarlo como testigo protegido." : "El empleado escapa de la ciudad gracias a tu ayuda. Está a salvo, pero no deja una declaración: no podrás presentarlo como testigo protegido."
            ],
            desenlace: [
                "Entregás el material disponible a una fiscalía. El alcance de la denuncia depende de las pruebas conservadas, del testigo y de tu conducta durante la investigación.",
                "Ofrecés cerrar el caso a cambio de entrar en el círculo de Veyra. Él evalúa tu lealtad y las concesiones que ya le hiciste.",
                "Renunciás al contrato y abandonás la torre. Elegís sobrevivir, aunque BLACK VEIL quede sin resolver."
            ]
        };
        return resultados[id][indice];
    }

    function elegirOpcion(estado, indice, escenaEsperada = estado.escena) {
        const escena = escenas[estado.escena];
        if (estado.final || escenaEsperada !== estado.escena || !Number.isInteger(indice) || !escena?.opciones[indice]) return estado;
        const opcion = escena.opciones[indice];
        const siguiente = { ...estado, variables: { ...estado.variables }, decisiones: { ...estado.decisiones }, registro: [...estado.registro], escena: opcion.siguiente };
        for (const [variable, cambio] of Object.entries(opcion.cambios)) siguiente.variables[variable] += cambio;
        if (ordenDecisiones.includes(estado.escena)) {
            siguiente.decisiones[estado.escena] = indice;
            siguiente.registro.push({ escena: estado.escena, indice, eleccion: opcion.texto, resultado: resultadoDecision(estado.escena, indice, estado) });
        }
        if (siguiente.escena === "final") siguiente.final = resolverFinal(siguiente);
        return siguiente;
    }

    function motivoFinal(estado) {
        if (estado.final === "verdad") return "Conservaste pruebas utilizables, protegiste una declaración y reuniste suficiente investigación y moralidad con poca corrupción. La denuncia tiene respaldo.";
        if (estado.final === "complice") return "Tu corrupción y lealtad, junto con el control entregado sobre los documentos o el testigo, hacen que Veyra acepte el pacto.";
        if (estado.decisiones.desenlace === 2) return "Elegiste abandonar el caso. Aunque conserves pistas, nadie las presenta con un testigo protegido para cerrar esta investigación.";
        if (estado.decisiones.desenlace === 1) return "Veyra rechaza el pacto: no reuniste la combinación de lealtad, corrupción y concesiones que exige. Te marchás sin acuerdo.";
        const h = hechos(estado), v = estado.variables, faltantes = [];
        if (!["originales", "respaldo"].includes(h.documentos)) faltantes.push("los documentos quedaron bajo el control de Veyra");
        if (h.testigo !== "protegido") faltantes.push("no hay una declaración protegida");
        if (v.investigacion < 6) faltantes.push("la investigación no alcanza para sostener el expediente");
        if (v.moralidad < 3) faltantes.push("tu conducta no sostiene la credibilidad de la denuncia");
        if (v.corrupcion > 2) faltantes.push("tu participación en el encubrimiento compromete la denuncia");
        return `La denuncia no consigue abrir el caso: ${faltantes.join("; ")}.`;
    }

    function obtenerEscena(estado) {
        if (estado.final) return { ...finales[estado.final], lugar: "EPÍLOGO · FINAL " + ({ verdad: "1", complice: "2", silencio: "3" })[estado.final] + " DE 3", personaje: "KLARK", opciones: [], texto: finales[estado.final].texto, contexto: motivoFinal(estado) };
        const escena = escenas[estado.escena], h = hechos(estado);
        let contexto = "";
        if (estado.escena === "empleado") {
            contexto = h.empleadoConfrontado ? "—Después de cómo me trataste, necesito saber si vas a escucharme de verdad —dice el empleado." : h.equipoInformado ? "Un compañero facilita el encuentro con el empleado. Él acepta hablar sin la presencia de Veyra." : "El empleado te espera junto al ascensor y baja la voz al verte.";
            if (h.mensajeRastreado) contexto += " Cuando mencionás la terminal del mensaje, confirma que pertenece al archivo interno.";
            else if (estado.decisiones.amenaza === 0) contexto += " Espera a que Veyra se aleje: tu obediencia lo obliga a ser más cauteloso.";
            else contexto += " Usa la salida de servicio que vigila tu equipo para no ser visto.";
        }
        if (estado.escena === "archivos") contexto = h.empleadoDenunciado ? "Sin tu fuente libre, un guardia de Veyra supervisa el acceso al archivo. Podés consultar los documentos, pero el empleado ya no puede ayudarte." : h.empleadoEscuchado ? "La clave del empleado abre el expediente completo. Su relato coincide con los nombres que encontrás en BLACK VEIL." : "El código verificado abre una consulta de solo lectura. Tendrás que copiar o retirar el material antes de que se cierre la sesión.";
        if (estado.escena === "testigo") contexto = h.documentos === "negociados" ? "Veyra guarda los documentos que le entregaste para negociar. Proteger al empleado podría salvar su vida, pero no recupera esas pruebas." : h.documentos === "originales" ? "Llevás los originales: seguridad busca el expediente que falta. Cada minuto que el empleado siga en la torre lo expone." : "El respaldo sigue oculto. Podés salir sin alertar a Veyra, pero una copia sin declaración no basta para cerrar el caso.";
        if (estado.escena === "desenlace") contexto = `Tu expediente: ${h.documentos === "originales" ? "originales de BLACK VEIL conservados" : h.documentos === "respaldo" ? "respaldo cifrado disponible" : "documentos bajo el control de Veyra"}. La fuente ${h.testigo === "protegido" ? "está protegida y dejó una declaración" : h.testigo === "controlado" ? "está bajo el control de Veyra y no puede declarar" : "huyó sin dejar una declaración"}. Veyra ${estado.variables.lealtad >= 3 ? "reconoce los servicios que le prestaste" : "desconfía de tu compromiso con él"}.`;
        return { ...escena, contexto };
    }

    function pistas(estado) {
        const h = hechos(estado), lista = [];
        if (h.informeRevisado) lista.push("Hora irregular en el informe interno");
        if (h.equipoInformado) lista.push("Equipo involucrado en la investigación");
        if (h.mensajeRastreado) lista.push("Mensaje rastreado a una terminal interna");
        if (h.empleadoEscuchado) lista.push("Clave de acceso entregada por el empleado");
        if (h.identidadReservada) lista.push("Código del informe verificado sin exponer la fuente");
        if (h.documentos !== "ninguno") lista.push({ originales: "BLACK VEIL: originales conservados", respaldo: "BLACK VEIL: respaldo cifrado", negociados: "BLACK VEIL: bajo el control de Veyra" }[h.documentos]);
        if (h.testigo !== "pendiente") lista.push({ protegido: "Declaración del testigo asegurada", controlado: "Fuente bajo el control de Veyra; sin declaración protegida", fugado: "Fuente a salvo fuera de la ciudad; sin declaración" }[h.testigo]);
        return lista;
    }

    return { escenas, finales, ordenDecisiones, nombresVariables, maximos, nuevaPartida, elegirOpcion, hechos, condicionesFinal, resolverFinal, obtenerEscena, motivoFinal, pistas };
})();
if (typeof module !== "undefined" && module.exports) module.exports = Historia;
