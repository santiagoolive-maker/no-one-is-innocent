"use strict";


const Guardado = (() => {
    const motor = typeof module !== "undefined" && module.exports ? require("./historia.js") : Historia;
    const introduccion = ["pasado", "prologo", "reunion"];
    function serializar(estado) {
        const indice = introduccion.indexOf(estado.escena);
        const pasos = Array(indice >= 0 ? indice : 3).fill(0);
        pasos.push(...estado.registro.map(entrada => entrada.indice));
        return JSON.stringify({ version: 1, pasos });
    }
    function restaurar(texto) {
        try {
            const datos = JSON.parse(texto);
            if (datos?.version !== 1 || !Array.isArray(datos.pasos) || datos.pasos.length > 9) return null;
            let estado = motor.nuevaPartida();
            for (const indice of datos.pasos) {
                const siguiente = motor.elegirOpcion(estado, indice);
                if (siguiente === estado) return null;
                estado = siguiente;
            }
            return estado;
        } catch { return null; }
    }
    return { serializar, restaurar };
})();
if (typeof module !== "undefined" && module.exports) module.exports = Guardado;
