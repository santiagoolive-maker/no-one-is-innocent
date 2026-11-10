const variablesIniciales = {
  confianza: 5, moralidad: 5, investigacion: 5, lealtad: 5, dinero: 5, corrupcion: 0
};

const etiquetas = {
  confianza: "Confianza", moralidad: "Moralidad", investigacion: "Investigación",
  lealtad: "Lealtad", dinero: "Dinero", corrupcion: "Corrupción"
};

const escenas = [
  {
    titulo: "El empleado roba información",
    texto: () => "Veyra le pide a Klark que recupere un informe confidencial. El empleado que lo robó asegura que sabe algo sobre BLACK VEIL y le pide que lo escuche.",
    opciones: [
      { texto: "Entregarlo a Veyra", cambios: { lealtad: 2, corrupcion: 1 }, consecuencia: "Veyra recupera el informe. El empleado desaparece antes de que Klark pueda preguntarle por BLACK VEIL." },
      { texto: "Dejarlo escapar", cambios: { moralidad: 2, corrupcion: -1 }, consecuencia: "Antes de esconderse, el empleado deja una pista cifrada sobre ZENITH.", prueba: "Pista cifrada del empleado" },
      { texto: "Interrogarlo", cambios: { investigacion: 2, moralidad: -1, corrupcion: 1 }, consecuencia: "Klark consigue un nombre vinculado con ZENITH. El empleado se niega a volver a hablar con él.", prueba: "Nombre vinculado con ZENITH" }
    ]
  },
  {
    titulo: "Documentos de BLACK VEIL",
    texto: () => "En el archivo de la empresa, Klark encuentra los informes originales de la operación en la que murieron sus compañeros.",
    opciones: [
      { texto: "Entregárselos a Veyra", cambios: { confianza: 2, lealtad: 1, corrupcion: 1 }, consecuencia: "Veyra le enseña una versión recortada de los hechos y se queda con los documentos originales." },
      { texto: "Guardarlos para investigar", cambios: { investigacion: 2, confianza: -1 }, consecuencia: "Klark conserva los originales y encuentra una referencia a ZENITH.", prueba: "Documentos originales de BLACK VEIL" },
      { texto: "Destruirlos", cambios: { lealtad: 2, investigacion: -1, corrupcion: 2 }, consecuencia: "Klark destruye los documentos y pierde los anexos que podían comprometer a Veyra." }
    ]
  },
  {
    titulo: "La relación de Veyra con ZENITH",
    texto: (decisiones) => {
      if (decisiones[1] === 1) return "Los documentos de BLACK VEIL sitúan a Veyra en una reunión de ZENITH.";
      if (decisiones[0] !== 0) return "La pista del empleado lleva a Klark a una reunión en la que participaron Veyra y representantes de ZENITH.";
      return "Una agenda de seguridad relaciona a Veyra con una reunión sospechosa. Klark apenas tiene indicios de quién asistió.";
    },
    opciones: [
      { texto: "Confrontar a Veyra", cambios: { investigacion: 1, moralidad: 1, confianza: -1, corrupcion: -1 }, consecuencia: "Veyra admite que conoce a ZENITH. Después de la discusión, Klark pierde el acceso a sus reuniones privadas." },
      { texto: "Seguir investigando en secreto", cambios: { investigacion: 2, confianza: -1 }, consecuencia: "Al revisar el registro de visitas, Klark encuentra un patrón de reuniones clandestinas.", prueba: "Registro de reuniones clandestinas" },
      { texto: "Ignorar la información y proteger a Veyra", cambios: { lealtad: 2, confianza: 1, corrupcion: 2 }, consecuencia: "Veyra lo incorpora a su círculo de seguridad. Las reuniones quedan fuera de la investigación." }
    ]
  },
  {
    titulo: "El infiltrado",
    texto: (decisiones) => {
      if (decisiones[0] === 1) return "La pista cifrada coincide con los accesos de una persona del equipo de Veyra. Alguien está enviando información a ZENITH.";
      if (decisiones[0] === 2 || decisiones[2] === 1) return "Los indicios que reunió Klark lo llevan a un infiltrado que envía información a ZENITH.";
      return "Un informe de seguridad detecta que alguien del entorno de Veyra está filtrando información a ZENITH.";
    },
    opciones: [
      { texto: "Entregar la información a Veyra", cambios: { lealtad: 2, confianza: 1, corrupcion: 1 }, consecuencia: "Veyra detiene al infiltrado. Klark ya no puede obtener información directamente de él." },
      { texto: "Investigar al infiltrado en secreto", cambios: { investigacion: 2, confianza: -1 }, consecuencia: "Klark sigue al infiltrado y descubre dónde guarda un dispositivo de ZENITH." },
      { texto: "Ocultar la información y protegerlo", cambios: { moralidad: 2, lealtad: -1, corrupcion: -2 }, consecuencia: "Klark ayuda al infiltrado a escapar de ZENITH. Antes de ocultarse, le deja una clave de acceso.", prueba: "Clave del infiltrado" }
    ]
  },
  {
    titulo: "El dispositivo de ZENITH",
    texto: (decisiones) => [
      "Un informe de seguridad lleva a Klark al dispositivo confiscado. Parte de sus archivos está cifrada.",
      "Klark vuelve al lugar que descubrió al seguir al infiltrado y recupera el dispositivo.",
      "La clave que recibió Klark también identifica el punto de entrega del dispositivo."
    ][decisiones[3]],
    opciones: [
      { texto: "Entregárselo a Veyra", cambios: { confianza: 2, lealtad: 1, corrupcion: 2 }, consecuencia: "Veyra se queda con el dispositivo. Klark no conserva una copia." },
      { texto: "Analizarlo por su cuenta", cambios: { investigacion: 2, confianza: -1 }, consecuencia: "Klark recupera registros parciales y encuentra indicios sobre un colaborador cercano a Veyra.", prueba: "Registros parciales de ZENITH" },
      { texto: "Destruirlo para evitar que sea utilizado", cambios: { moralidad: 1, investigacion: -1 }, consecuencia: "Nadie podrá utilizar el dispositivo. Klark tendrá que apoyarse en otras pruebas." }
    ]
  },
  {
    titulo: "El colaborador de ZENITH",
    texto: (decisiones) => {
      if (decisiones[4] === 1) return "Los registros del dispositivo apuntan a un colaborador cercano a Veyra.";
      if (decisiones[0] !== 0 || decisiones[2] === 1) return "Klark cruza los indicios que conservó e identifica a un posible colaborador de ZENITH.";
      return "Una comunicación interceptada por seguridad señala a alguien cercano a Veyra. Klark solo tiene sospechas.";
    },
    opciones: [
      { texto: "Advertirle a Veyra", cambios: { lealtad: 2, confianza: 1, corrupcion: 2 }, consecuencia: "Veyra manda detener al colaborador. El sospechoso ya no podrá declarar." },
      { texto: "Seguir al sospechoso", cambios: { investigacion: 2, lealtad: -1 }, consecuencia: "Klark documenta una reunión de ZENITH. Veyra se entera de que actuó por su cuenta.", prueba: "Pruebas de una reunión de ZENITH" },
      { texto: "Enfrentarlo directamente", cambios: { moralidad: 2, lealtad: -1, corrupcion: -1 }, consecuencia: "El colaborador declara antes de quedar bajo custodia. Klark pierde la oportunidad de seguir sus contactos.", prueba: "Testimonio del colaborador" }
    ]
  }
];

function resultado(decisiones) {
  const variables = { ...variablesIniciales };
  const pruebas = [];

  decisiones.forEach((eleccion, indice) => {
    const opcion = escenas[indice].opciones[eleccion];
    for (const [variable, cambio] of Object.entries(opcion.cambios)) {
      variables[variable] = Math.max(0, Math.min(10, variables[variable] + cambio));
    }
    if (indice === 4 && eleccion === 1 && decisiones[3] === 2) {
      pruebas.push("Registros completos de ZENITH");
    } else if (opcion.prueba) {
      pruebas.push(opcion.prueba);
    }
  });

  return { variables, pruebas };
}

function desenlace(decisiones, variables) {
  if (variables.corrupcion >= 8) {
    const conservaEvidencia = decisiones[1] === 1 || decisiones[4] === 1 || decisiones[5] !== 0;
    return {
      titulo: "El Heredero",
      texto: conservaEvidencia
        ? "Klark utiliza la información que conservó y sus contactos para desplazar a Veyra. El despacho ahora le pertenece."
        : "Klark se apoya en sus contactos y en la influencia que ganó durante el caso para desplazar a Veyra. El despacho ahora le pertenece."
    };
  }
  if (variables.corrupcion >= 4) {
    return {
      titulo: "ZENITH",
      texto: variables.confianza >= 6
        ? "Veyra recibe a Klark como aliado dentro de ZENITH. Allí descubre cómo la organización intervino en BLACK VEIL."
        : "Otros representantes de ZENITH incorporan a Klark a la organización. Allí descubre cómo intervino en BLACK VEIL."
    };
  }
  const evidenciaSolida = variables.investigacion >= 7 &&
    [decisiones[1] === 1, decisiones[4] === 1, decisiones[5] !== 0].filter(Boolean).length >= 2;
  return {
    titulo: "La Verdad",
    texto: evidenciaSolida
      ? "Klark denuncia a ZENITH. La evidencia permite detener a Veyra y exponer a parte de la red."
      : "Klark denuncia a ZENITH con su testimonio y lo que logró conservar. La investigación sobre Veyra sigue abierta."
  };
}
