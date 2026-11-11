const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const contexto = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, "../src/historia.js"), "utf8"), contexto);
const { escenas, resultado, desenlace } = vm.runInContext("({ escenas, resultado, desenlace })", contexto);
const finales = new Set();
let recorridos = 0;

function comprobar(decisiones, eleccionesApertura = []) {
  const { variables, pruebas } = resultado(decisiones, eleccionesApertura);
  assert.ok(Object.values(variables).every((valor) => valor >= 0 && valor <= 10));

  const escena = escenas[decisiones.length];
  if (escena) {
    assert.ok(escena.texto(decisiones));
    for (const indice of escena.opciones.keys()) comprobar([...decisiones, indice], eleccionesApertura);
    return;
  }

  const final = desenlace(decisiones, variables);
  recorridos += 1;
  const esperado = variables.corrupcion <= 3 ? "La Verdad" : variables.corrupcion <= 7 ? "ZENITH" : "El Heredero";
  assert.equal(final.titulo, esperado);
  finales.add(final.titulo);
  assert.equal(pruebas.includes("Documentos originales de BLACK VEIL"), decisiones[1] === 1);
  assert.equal(pruebas.includes("Registros completos de ZENITH"), decisiones[3] === 2 && decisiones[4] === 1);
  assert.equal(pruebas.includes("Registros parciales de ZENITH"), decisiones[3] !== 2 && decisiones[4] === 1);
}

comprobar([]);
assert.equal(finales.size, 3);
assert.equal(resultado([], [0, 0, 0, 0, 1]).variables.investigacion, 10);
assert.equal(resultado([], [0, 0, 0, 1, 0]).variables.lealtad, 7);
assert.equal(resultado([], [0, 0, 0, 2, 0]).variables.corrupcion, 1);
for (const encargo of [0, 1, 2]) {
  for (const amenaza of [0, 1]) comprobar([], [0, 0, 0, encargo, amenaza]);
}
assert.equal(recorridos, 5103);
console.log("729 recorridos anteriores y 4374 recorridos de Sprint 4 verificados.");
