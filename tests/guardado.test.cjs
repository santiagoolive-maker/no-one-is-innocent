"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const H = require("../js/historia.js");
const G = require("../js/guardado.js");

test("Se recupera cada punto de las 729 rutas, incluidos los tres finales", () => {
    for (let numero = 0; numero < 729; numero++) {
        let estado = H.nuevaPartida();
        const opciones = [0, 0, 0, ...Array.from({length:6}, (_, i) => Math.floor(numero / 3 ** (5-i)) % 3)];
        assert.deepEqual(G.restaurar(G.serializar(estado)), estado);
        for (const indice of opciones) {
            estado = H.elegirOpcion(estado, indice);
            assert.deepEqual(G.restaurar(G.serializar(estado)), estado);
        }
    }
});

test("Un guardado corrupto o de otra versión se descarta sin crear progreso", () => {
    for (const entrada of ["{", "null", '{}', '{"version":2,"pasos":[]}', '{"version":1,"pasos":[1]}', '{"version":1,"pasos":[0,0,0,3]}', '{"version":1,"pasos":[0,"0"]}', '{"version":1,"pasos":[0,0,0,0,0,0,0,0,0,0]}']) {
        assert.equal(G.restaurar(entrada), null);
    }
});

test("Variables inyectadas no reemplazan las calculadas por las decisiones", () => {
    const estado = G.restaurar(JSON.stringify({version:1,pasos:[0,0,0,0],variables:{corrupcion:999},final:"complice"}));
    assert.equal(estado.final, null);
    assert.equal(estado.variables.corrupcion, 0);
    assert.equal(estado.variables.investigacion, 3);
});
