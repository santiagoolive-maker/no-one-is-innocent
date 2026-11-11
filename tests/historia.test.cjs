"use strict";
const { test } = require('node:test');
const assert = require('node:assert/strict');
const H = require('../src/historia.js');
const fs = require('node:fs');
const path = require('node:path');

// Oráculo independiente: orden C / I / L / M. Los cambios de las opciones
// recibidas se transcriben del ZIP original, no se extraen del motor a probar.
const cambiosEsperados = [
    [[0,2,0,1], [0,0,1,0], [1,1,0,0]],
    [[0,0,1,0], [0,2,0,1], [0,1,1,0]],
    [[0,2,0,1], [1,0,1,0], [0,1,0,1]],
    [[0,2,0,1], [2,0,1,0], [0,1,1,0]],
    [[0,1,0,2], [2,0,2,0], [0,0,0,1]],
    [[0,1,0,1], [2,0,1,0], [0,0,0,1]]
];
const claves = ['corrupcion','investigacion','lealtad','moralidad'];
function inicioInvestigacion() {
    let e = H.nuevaPartida();
    for (const id of ['pasado','prologo','reunion']) {
        assert.equal(e.escena, id);
        e = H.elegirOpcion(e, 0);
    }
    return e;
}
function valoresEsperados(ruta) {
    const v = [0,1,0,0]; // Prólogo conservado.
    ruta.forEach((opcion, i) => cambiosEsperados[i][opcion].forEach((delta,j) => v[j] += delta));
    return Object.fromEntries(claves.map((id,i) => [id,v[i]]));
}
function finalEsperado(ruta, v) {
    if (ruta[5] === 0 && ruta[3] !== 1 && ruta[4] === 0 && v.investigacion >= 6 && v.moralidad >= 3 && v.corrupcion <= 2) return 'verdad';
    if (ruta[5] === 1 && v.corrupcion >= 4 && v.lealtad >= 3 && (ruta[3] === 1 || ruta[4] === 1)) return 'complice';
    return 'silencio';
}
const conteo = { verdad: 0, complice: 0, silencio: 0 };
const maximosObservados = Object.fromEntries(claves.map(id => [id, 0]));

// No había tests en el ZIP recibido. Esta batería añade las 3^6 rutas solicitadas.
for (let numero = 0; numero < 729; numero++) {
    const ruta = Array.from({length:6}, (_, i) => Math.floor(numero / 3 ** (5-i)) % 3);
    test(`Ruta ${String(numero+1).padStart(3,'0')}: ${ruta.map(i => i+1).join('-')}`, () => {
        let e = inicioInvestigacion();
        ruta.forEach((opcion, i) => {
            const id = H.ordenDecisiones[i];
            assert.equal(e.escena, id);
            assert.equal(H.escenas[id].opciones.length, 3);
            const antes = JSON.stringify(e);
            const previo = e;
            e = H.elegirOpcion(e, opcion, id);
            assert.equal(JSON.stringify(previo), antes, 'La elección no modifica el estado anterior');
            assert.equal(e.decisiones[id], opcion);
            assert.equal(e.registro.length, i+1);
            assert.deepEqual(e.variables, valoresEsperados(ruta.slice(0,i+1)));
            assert.ok(e.registro[i].resultado.length > 40, 'Debe haber una consecuencia narrativa reconocible');
            const escena = H.obtenerEscena(e);
            assert.ok(escena.titulo && escena.texto && escena.imagen);
            assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', 'img', 'laminas', escena.imagen + '.png')));
            // Escenas posteriores: las consecuencias tienen que cambiar el acceso,
            // la reacción, los documentos disponibles y la situación del testigo.
            if (i === 1 && ruta[0] === 2) assert.match(escena.contexto, /cómo me trataste/);
            if (i === 1 && opcion === 1) assert.match(escena.contexto, /terminal del mensaje/);
            if (i === 1 && opcion === 0) assert.match(escena.contexto, /obediencia/);
            if (i === 1 && opcion === 2) assert.match(escena.contexto, /salida de servicio/);
            if (i === 2) assert.match(escena.contexto, [/clave del empleado/, /guardia de Veyra/, /solo lectura/][opcion]);
            if (i === 3) assert.match(escena.contexto, [/originales/, /documentos que le entregaste/, /respaldo sigue oculto/][opcion]);
            if (i === 4) {
                assert.match(escena.contexto, [/dejó una declaración/, /no puede declarar/, /huyó sin dejar/][opcion]);
                assert.match(escena.contexto, ruta[3] === 1 ? /documentos bajo el control/ : /disponible|conservados/);
            }
        });
        const v = valoresEsperados(ruta);
        assert.equal(e.escena, 'final');
        assert.equal(e.final, finalEsperado(ruta, v));
        assert.equal(Object.keys(e.decisiones).length, 6);
        assert.ok(H.motivoFinal(e).length > 40);
        if (e.final === 'verdad') {
            assert.equal(H.hechos(e).testigo, 'protegido');
            assert.notEqual(H.hechos(e).documentos, 'negociados');
        }
        if (e.final === 'complice') assert.ok(H.hechos(e).documentos === 'negociados' || H.hechos(e).testigo === 'controlado');
        if (ruta[4] === 2) assert.ok(!H.pistas(e).includes('Declaración del testigo asegurada'));
        if (ruta[3] === 1) assert.ok(!H.pistas(e).includes('BLACK VEIL: originales conservados'));
        assert.equal(H.elegirOpcion(e, 0), e, 'No se puede volver a puntuar un final');
        conteo[e.final]++;
        claves.forEach(id => maximosObservados[id] = Math.max(maximosObservados[id], v[id]));
    });
}

test('Las 729 rutas alcanzan los tres finales y coinciden con las escalas de la ficha', () => {
    assert.equal(Object.values(conteo).reduce((a,b) => a+b), 729);
    assert.ok(Object.values(conteo).every(n => n > 0));
    assert.deepEqual(maximosObservados, H.maximos);
    console.log('Distribución de las 729 rutas:', JSON.stringify(conteo));
});

test('Se conservan las 24 combinaciones y puntuaciones de las cuatro decisiones recibidas', () => {
    for (const a of [0,1,2]) for (const b of [0,1]) for (const c of [0,1]) for (const d of [0,1]) {
        let e = inicioInvestigacion();
        [a,b,c,d].forEach(i => e = H.elegirOpcion(e, i));
        assert.equal(e.escena, 'testigo');
        assert.deepEqual(e.variables, valoresEsperados([a,b,c,d]));
    }
});

test('No se aceptan índices inválidos ni eventos de una escena anterior', () => {
    const e = inicioInvestigacion();
    for (const indice of [-1, 3, 99, 1.5, '0', null, NaN]) assert.equal(H.elegirOpcion(e, indice), e);
    const siguiente = H.elegirOpcion(e, 0, 'encargo');
    assert.equal(H.elegirOpcion(siguiente, 0, 'encargo'), siguiente);
    assert.equal(siguiente.registro.length, 1);
});

test('Nueva partida reinicia escena, variables, decisiones, hechos y registro sin compartir objetos', () => {
    let anterior = inicioInvestigacion();
    [0,1,0,0,0,0].forEach(i => anterior = H.elegirOpcion(anterior,i));
    const nueva = H.nuevaPartida();
    assert.equal(nueva.escena, 'pasado');
    assert.equal(nueva.final, null);
    assert.deepEqual(nueva.variables, {corrupcion:0,investigacion:0,lealtad:0,moralidad:0});
    assert.deepEqual(nueva.decisiones, {});
    assert.deepEqual(nueva.registro, []);
    assert.deepEqual(H.pistas(nueva), []);
    assert.notEqual(nueva.variables, anterior.variables);
});

test('Cada alternativa de las seis decisiones tiene una consecuencia inmediata distinta', () => {
    let e = inicioInvestigacion();
    for (const id of H.ordenDecisiones) {
        const resultados = [0,1,2].map(i => H.elegirOpcion(e, i).registro.at(-1).resultado);
        assert.equal(new Set(resultados).size, 3, id);
        e = H.elegirOpcion(e, 0);
    }
});

test('Protección tras la denuncia del empleado requiere liberarlo; huir no equivale a testificar', () => {
    let e = inicioInvestigacion();
    [2,0,1,0].forEach(i => e = H.elegirOpcion(e,i));
    const protegido = H.elegirOpcion(e,0);
    assert.match(protegido.registro.at(-1).resultado, /retira al empleado de la vigilancia/);
    const fugado = H.elegirOpcion(e,2);
    assert.match(fugado.registro.at(-1).resultado, /Desviás la vigilancia/);
    assert.equal(H.hechos(fugado).testigo, 'fugado');
    assert.equal(H.condicionesFinal(fugado).denuncia, false);
});
