# Sprint 4

La entrega usa la versión de **NO ONE IS INNOCENT3.zip**. Para jugar, descargá el repositorio y abrí [src/index.html](../src/index.html) en Chrome.

## Avances

- Las [láminas del ZIP](../public/img/laminas/) se muestran en el recorrido junto a diálogos y opciones en HTML. La interfaz acomoda la ilustración y el texto en una columna en celular. [Captura del encargo](evidencias/sprint-4/encargo.png)
- Las seis decisiones afectan los diálogos, el acceso al archivo de BLACK VEIL, las pruebas y la situación del testigo. El desenlace depende tanto de la última elección como de lo que Klark consiguió antes. [Motor narrativo](../src/historia.js)
- La ficha muestra variables, pistas y consecuencias. Se abre con **V** o con el botón **Variables**. **Escape** vuelve a la escena o al menú. El botón **Animación** permite apagar las transiciones. [Captura de la ficha](evidencias/sprint-4/ficha.png)
- **Continuar partida** vuelve al último punto mientras la pestaña siga abierta. La versión de este ZIP empieza de nuevo al recargar.

Los cuatro [escenarios editables de Illustrator](../assets/escenarios/editables/) y sus [exportaciones WebP](../public/img/escenarios/) están guardados en GitHub. La versión jugable de esta entrega usa las ilustraciones del ZIP.

## Evidencias de los recorridos

Las opciones de la tabla se cuentan de arriba hacia abajo, después de las tres pantallas de introducción.

| Opciones | Final observado en Chrome | Captura |
| --- | --- | --- |
| 1, 2, 1, 1, 1, 1 | La verdad sale a la luz | [Escritorio](evidencias/sprint-4/final-verdad.png) |
| 2, 1, 2, 2, 2, 2 | El nuevo cómplice | [Escritorio](evidencias/sprint-4/final-complice.png) |
| 3, 3, 3, 3, 3, 1 | El peso del silencio | [Celular](evidencias/sprint-4/final-silencio-movil.png) |

Pasaron **735 pruebas automáticas**. La batería cubre las 729 combinaciones de decisiones y seis comprobaciones adicionales. Para reproducirla, ejecutá `node --test tests/historia.test.cjs` desde la raíz del repositorio.
